import { ethers } from "ethers";
import artifact from "../../../web3/artifacts/contracts/GMCLandCompensation.sol/GMCLandCompensation.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_GMC_LAND_CONTRACT_ADDRESS as string;
const ABI = (artifact as any).abi as ethers.InterfaceAbi;

type ProviderAndContract = {
    provider: ethers.BrowserProvider;
    contract: ethers.Contract;
};

function assertWalletProvider() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (!w.ethereum) throw new Error("No wallet provider found (window.ethereum)");
}

async function getProviderAndContract(withSigner = false): Promise<ProviderAndContract & { signer?: ethers.Signer }> {
    assertWalletProvider();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const provider = new ethers.BrowserProvider(w.ethereum);
    if (!withSigner) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        return { provider, contract };
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    return { provider, contract, signer };
}

async function getConnectedAccount(provider: ethers.BrowserProvider): Promise<string | null> {
    const accounts = await provider.send("eth_accounts", []);
    return accounts?.[0] ?? null;
}

// ---------- Types from contract ----------

export type LandPlotView = {
    plotId: string;
    dzongkhag: string;
    gewog: string;
    thram: string;
    ownerName: string;
    ownerCid: string;
    ownType: string;
    majorCategory: string;
    landType: string;
    plotClass: string;
    areaAc: bigint; // acres * 1e4
    landValue: bigint;
    allocatedTokens: bigint;
    myTokensFromThisPlot: bigint; // optional for UI, we can compute via tokensFromPlot(account, plotId)
    wallet: string;
    exists: boolean;
};

export type OnchainSellOrder = {
    id: bigint;
    seller: string;
    amountTotal: bigint;
    amountRemaining: bigint;
    pricePerTokenWei: bigint;
    active: boolean;
    createdAt?: number; // derived from logs if you want (optional)
};

// what frontend wants now:
export type MarketOrderWithPlot = OnchainSellOrder & {
    plotId: string | null;
    hasPlot: boolean;
    plot?: LandPlotView; // filled if hasPlot
};

// ---------- Helpers ----------

export function tokensToNumber(v: bigint): number {
    return Number(ethers.formatUnits(v, 18));
}

export function ethPerToken(pricePerTokenWei: bigint): number {
    // pricePerTokenWei is wei-per-token * 1e18? No — you store raw wei-per-token (scaled by 1e18 in contract math).
    // In your contract: totalCost = amountToBuy * pricePerTokenWei / 1e18
    // So pricePerTokenWei is wei scaled by 1e18 per token unit.
    // For UI "ETH per token", just formatEther(pricePerTokenWei) is WRONG.
    // Correct: pricePerTokenWei / 1e18 gives wei per 1 token? Actually:
    // amountToBuy (18 decimals) * pricePerTokenWei / 1e18 => wei
    // Therefore pricePerTokenWei is "wei per token (18 decimals)".
    // UI ETH per token = pricePerTokenWei / 1e18 in wei terms => formatEther(pricePerTokenWei) works.
    return Number(ethers.formatEther(pricePerTokenWei));
}

export function computeTotalCostWei(amountTokensWei: bigint, pricePerTokenWei: bigint): bigint {
    // totalCost = amountToBuy * pricePerTokenWei / 1e18
    return (amountTokensWei * pricePerTokenWei) / 10n ** 18n;
}

function acresTimes1e4ToAcres(areaAc: bigint): number {
    return Number(areaAc) / 1e4;
}

export function formatArea(plot: LandPlotView): string {
    const acres = acresTimes1e4ToAcres(plot.areaAc);
    return `${acres.toFixed(4)} ac`;
}

// ---------- Core fetch ----------

async function getOrderCountGuess(contract: ethers.Contract, maxOrders: number): Promise<number> {
    // Try to get exact count from contract (add public getter if not available)
    try {
        // If contract has public nextOrderId, use it:
        const nextId = await contract.nextOrderId?.();
        if (nextId) return Math.min(Number(nextId) - 1, maxOrders);
    } catch {
        // fallback: scan a smaller range or use binary search
    }
    
    // Fallback: Smart binary search to find the actual highest order ID
    let low = 1;
    let high = maxOrders;
    let lastValid = 0;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        try {
            const order = await contract.sellOrders(mid);
            if (order.seller && order.seller !== ethers.ZeroAddress) {
                lastValid = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        } catch {
            high = mid - 1;
        }
    }

    return Math.max(1, lastValid);
}

async function readOrder(contract: ethers.Contract, id: number): Promise<OnchainSellOrder | null> {
    try {
        const o = await contract.sellOrders(id);
        // o is tuple with: id,seller,amountTotal,amountRemaining,pricePerTokenWei,active
        const active = Boolean(o.active);
        const amountRemaining = BigInt(o.amountRemaining);
        const seller = String(o.seller);

        // filter out empty default structs if not set (seller=0x0 or id=0)
        if (!seller || seller === ethers.ZeroAddress) return null;
        const oid = BigInt(o.id);
        if (oid === 0n) return null;

        return {
            id: oid,
            seller,
            amountTotal: BigInt(o.amountTotal),
            amountRemaining,
            pricePerTokenWei: BigInt(o.pricePerTokenWei),
            active,
        };
    } catch {
        return null;
    }
}

async function attachPlot(
    contract: ethers.Contract,
    account: string,
    order: OnchainSellOrder
): Promise<MarketOrderWithPlot> {
    let hasPlot = false;
    let plotId: string | null = null;

    try {
        // public mapping getter should exist after your patch:
        // orderHasPlot(orderId) -> bool
        hasPlot = Boolean(await contract.orderHasPlot(order.id));
    } catch {
        hasPlot = false;
    }

    if (hasPlot) {
        try {
            plotId = String(await contract.orderPlotId(order.id));
        } catch {
            plotId = null;
        }
    }

    if (!hasPlot || !plotId) return { ...order, hasPlot: false, plotId: null };

    // load plot
    const p = await contract.plots(plotId);

    // optional: fetch per-plot token balance for current account
    let myTokensFromThisPlot = 0n;
    try {
        myTokensFromThisPlot = BigInt(await contract.tokensFromPlot(account, plotId));
    } catch {
        myTokensFromThisPlot = 0n;
    }

    const plot: LandPlotView = {
        plotId: String(p.plotId),
        dzongkhag: String(p.dzongkhag),
        gewog: String(p.gewog),
        thram: String(p.thram),
        ownerName: String(p.ownerName),
        ownerCid: String(p.ownerCid),
        ownType: String(p.ownType),
        majorCategory: String(p.majorCategory),
        landType: String(p.landType),
        plotClass: String(p.plotClass),
        areaAc: BigInt(p.areaAc),
        landValue: BigInt(p.landValue),
        allocatedTokens: BigInt(p.allocatedTokens),
        myTokensFromThisPlot,
        wallet: String(p.wallet),
        exists: Boolean(p.exists),
    };

    return { ...order, hasPlot: true, plotId, plot };
}

export async function fetchActiveSellOrders(opts?: {
    lookbackBlocks?: number; // kept for your existing API shape (unused in bounded scan)
    maxOrders?: number;
    includeInactive?: boolean;
    onlyMine?: boolean; // show only current wallet listings
    limit?: number; // pagination: max results to return
    offset?: number; // pagination: skip first N
}): Promise<{ account: string; orders: MarketOrderWithPlot[]; total: number }> {
    const { provider, contract } = await getProviderAndContract(false);
    const account = (await getConnectedAccount(provider)) ?? "";
    if (!account) throw new Error("Connect MetaMask first.");

    const maxOrders = opts?.maxOrders ?? 150; // Reduced from 300 to 150
    const includeInactive = Boolean(opts?.includeInactive);
    const onlyMine = Boolean(opts?.onlyMine);
    const limit = opts?.limit ?? 50; // Show 50 at a time max
    const offset = opts?.offset ?? 0;

    const countGuess = await getOrderCountGuess(contract, maxOrders);

    const raw: OnchainSellOrder[] = [];
    for (let id = 1; id <= countGuess; id++) {
        const o = await readOrder(contract, id);
        if (!o) continue;
        if (!includeInactive && !o.active) continue;
        if (onlyMine && o.seller.toLowerCase() !== account.toLowerCase()) continue;
        // hide dead empty orders
        if (o.amountRemaining === 0n && !includeInactive) continue;
        raw.push(o);
    }

    // most recent first by id
    raw.sort((a, b) => Number(b.id - a.id));
    
    const total = raw.length;
    const paginated = raw.slice(offset, offset + limit);

    // attach plot metadata in parallel (batch smarter)
    const orders = await Promise.all(paginated.map((o) => attachPlot(contract, account, o)));

    return { account, orders, total };
}

export async function subscribeActiveSellOrders(
    onUpdate: (data: { account: string; orders: MarketOrderWithPlot[] }) => void,
    opts?: { maxOrders?: number; includeInactive?: boolean; onlyMine?: boolean; limit?: number }
): Promise<() => void> {
    const { provider } = await getProviderAndContract(false);

    let alive = true;
    let lastUpdate = 0;
    const DEBOUNCE_MS = 1500; // Reduced from 2500

    const handler = async () => {
        if (!alive) return;
        const now = Date.now();
        if (now - lastUpdate < DEBOUNCE_MS) return;
        lastUpdate = now;

        try {
            const next = await fetchActiveSellOrders({
                ...opts,
                limit: opts?.limit ?? 50, // Only fetch first 50
                offset: 0,
            });
            if (alive) onUpdate({ account: next.account, orders: next.orders });
        } catch {
            // ignore noisy errors
        }
    };

    void handler();
    const blockHandler = () => void handler();
    provider.on("block", blockHandler);

    return () => {
        alive = false;
        provider.off("block", blockHandler);
    };
}

export async function buyFromOrder(params: { orderId: bigint; amountTokens: string }): Promise<string> {
    const { contract } = await getProviderAndContract(true);

    const amountWei = ethers.parseUnits(params.amountTokens, 18);
    // load order to compute total cost
    const o = await contract.sellOrders(params.orderId);
    const pricePerTokenWei = BigInt(o.pricePerTokenWei);

    const totalCostWei = computeTotalCostWei(BigInt(amountWei), pricePerTokenWei);

    const tx = await contract.buyFromOrder(params.orderId, amountWei, { value: totalCostWei });
    const rec = await tx.wait();
    return rec?.hash ?? tx.hash;
}
