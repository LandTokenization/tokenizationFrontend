import { ethers } from "ethers";
import artifact from "../abi/GMCLandCompensation.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_GMC_LAND_CONTRACT_ADDRESS as string;
const ABI = (artifact as any).abi as ethers.InterfaceAbi;

export const DECIMALS = 18;

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
    areaAc: bigint; // areaAcTimes1e4 in contract
    landValue: bigint;
    allocatedTokens: bigint;
    myTokensFromThisPlot: bigint; // hydrated from tokensFromPlot(account, plotId)
    wallet: string;
    exists: boolean;
};

export type SellOrder = {
    id: bigint;
    seller: string;
    amountTotal: bigint;
    amountRemaining: bigint;
    pricePerTokenWei: bigint;
    active: boolean;

    // ✅ added for your updated contract
    plotId?: string; // if orderHasPlot=true
    hasPlot?: boolean;

    // optional UI helper
    createdAt?: number; // block timestamp
};

export type MarketSnapshot = {
    account: string;
    chainId: number;
    asks: SellOrder[];
};

type FetchMarketArgs = {
    lookbackBlocks?: number;
    maxOrders?: number;
};

function getEthereum(): any {
    const w = window as any;
    return w?.ethereum;
}

function assertEthereum() {
    const eth = getEthereum();
    if (!eth) throw new Error("WALLET_NOT_FOUND");
    return eth;
}

async function getProvider(): Promise<ethers.BrowserProvider> {
    const eth = assertEthereum();
    return new ethers.BrowserProvider(eth);
}

async function getReadContract(): Promise<ethers.Contract> {
    if (!CONTRACT_ADDRESS) throw new Error("MISSING_CONTRACT_ADDRESS");
    const provider = await getProvider();
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
}

async function getWriteContract(): Promise<ethers.Contract> {
    if (!CONTRACT_ADDRESS) throw new Error("MISSING_CONTRACT_ADDRESS");
    const provider = await getProvider();
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}

/**
 * Silent account check (no popup).
 */
export async function getAccountSilent(): Promise<string> {
    const eth = getEthereum();
    if (!eth) return "";
    try {
        const provider = await getProvider();
        const accounts = await provider.send("eth_accounts", []);
        return accounts?.[0] ?? "";
    } catch {
        return "";
    }
}

/**
 * Explicit connect (will popup).
 */
export async function connect(): Promise<string> {
    const provider = await getProvider();
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts?.[0] ?? "";
}

export function tokensToNumber(x: bigint): number {
    return Number(ethers.formatUnits(x, DECIMALS));
}

export function ethPerToken(pricePerTokenWei: bigint): number {
    return Number(ethers.formatEther(pricePerTokenWei));
}

/**
 * totalCostWei = amountToBuy * pricePerTokenWei / 1e18
 */
export function computeTotalCostWei(amountTokensWei: bigint, pricePerTokenWei: bigint): bigint {
    return (amountTokensWei * pricePerTokenWei) / 10n ** 18n;
}

function toBigInt(v: any): bigint {
    try {
        return BigInt(v);
    } catch {
        return 0n;
    }
}

function parseLandPlotFromMapping(raw: any): Omit<LandPlotView, "myTokensFromThisPlot"> {
    // mapping(string=>LandPlot) returns a struct-shaped object
    // (ethers may return both indexed + named fields)
    return {
        plotId: raw.plotId ?? raw[0],
        dzongkhag: raw.dzongkhag ?? raw[1],
        gewog: raw.gewog ?? raw[2],
        thram: raw.thram ?? raw[3],
        ownerName: raw.ownerName ?? raw[4],
        ownerCid: raw.ownerCid ?? raw[5],
        ownType: raw.ownType ?? raw[6],
        majorCategory: raw.majorCategory ?? raw[7],
        landType: raw.landType ?? raw[8],
        plotClass: raw.plotClass ?? raw[9],
        areaAc: toBigInt(raw.areaAc ?? raw[10]),
        landValue: toBigInt(raw.landValue ?? raw[11]),
        allocatedTokens: toBigInt(raw.allocatedTokens ?? raw[12]),
        wallet: raw.wallet ?? raw[13],
        exists: Boolean(raw.exists ?? raw[14]),
    };
}

/**
 * ✅ Original: getMyInfo() (still useful for totals)
 * BUT note: it filters plots by tokensFromPlot > 0.
 */
export async function fetchMyInfo(): Promise<{
    account: string;
    tokenBalance: bigint;
    totalEarned: bigint;
    totalTokensBought: bigint;
    totalTokensSold: bigint;
    plotIds: string[];
    plots: LandPlotView[];
}> {
    const account = await getAccountSilent();
    if (!account) {
        return {
            account: "",
            tokenBalance: 0n,
            totalEarned: 0n,
            totalTokensBought: 0n,
            totalTokensSold: 0n,
            plotIds: [],
            plots: [],
        };
    }

    const c = await getReadContract();
    const res = await c.getMyInfo();

    const tokenBalance = toBigInt(res[0]);
    const totalEarned = toBigInt(res[1]);
    const totalTokensBought = toBigInt(res[2]);
    const totalTokensSold = toBigInt(res[3]);
    const plotIds: string[] = (res[4] as string[]) ?? [];
    const plotsRaw: any[] = (res[5] as any[]) ?? [];

    // normalize the tuple to LandPlotView
    const plots: LandPlotView[] = plotsRaw.map((raw) => {
        return {
            plotId: raw.plotId,
            dzongkhag: raw.dzongkhag,
            gewog: raw.gewog,
            thram: raw.thram,
            ownerName: raw.ownerName,
            ownerCid: raw.ownerCid,
            ownType: raw.ownType,
            majorCategory: raw.majorCategory,
            landType: raw.landType,
            plotClass: raw.plotClass,
            areaAc: toBigInt(raw.areaAc),
            landValue: toBigInt(raw.landValue),
            allocatedTokens: toBigInt(raw.allocatedTokens),
            myTokensFromThisPlot: toBigInt(raw.myTokensFromThisPlot),
            wallet: raw.wallet,
            exists: Boolean(raw.exists),
        };
    });

    return { account, tokenBalance, totalEarned, totalTokensBought, totalTokensSold, plotIds, plots };
}

/**
 * ✅ FIXED: Fetch plots WITHOUT relying on getMyInfo() filtering.
 * This uses:
 * - getWalletPlots(account) -> plotIds registered under this wallet
 * - plots(plotId) -> plot metadata
 * - tokensFromPlot(account, plotId) -> how many plot-tagged tokens user holds
 */
export async function fetchMyPlots(): Promise<LandPlotView[]> {
    const account = await getAccountSilent();
    if (!account) return [];

    const c = await getReadContract();

    // 1) plots registered under this wallet
    const ids: string[] = await c.getWalletPlots(account);

    if (!ids || ids.length === 0) return [];

    // 2) hydrate in parallel (faster)
    const results = await Promise.all(
        ids.map(async (plotId) => {
            const rawPlot = await c.plots(plotId);
            const base = parseLandPlotFromMapping(rawPlot);

            // tokensFromPlot(address,string)
            let myFromPlot = 0n;
            try {
                myFromPlot = toBigInt(await c.tokensFromPlot(account, plotId));
            } catch {
                myFromPlot = 0n;
            }

            const full: LandPlotView = {
                ...base,
                myTokensFromThisPlot: myFromPlot,
            };

            return full;
        })
    );

    // Optional: keep only existing plots
    const filtered = results.filter((p) => p.exists);

    // Optional: stable ordering
    filtered.sort((a, b) => a.plotId.localeCompare(b.plotId));

    return filtered;
}

async function getChainId(): Promise<number> {
    const eth = getEthereum();
    if (!eth) return 0;
    try {
        const provider = await getProvider();
        const net = await provider.getNetwork();
        return Number(net.chainId);
    } catch {
        return 0;
    }
}

/**
 * ✅ Scan events to build sell orders list.
 */
export async function fetchMarketSnapshot(args: FetchMarketArgs = {}): Promise<MarketSnapshot> {
    const account = await getAccountSilent();
    const chainId = await getChainId();

    const c = await getReadContract();
    const provider = await getProvider();

    const lookbackBlocks = args.lookbackBlocks ?? 80_000;
    const maxOrders = args.maxOrders ?? 300;

    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - lookbackBlocks);

    const fNew = c.filters.SellOrderCreatedWithPlot?.();
    const fOld = c.filters.SellOrderCreated?.();

    const logsNew = fNew ? await c.queryFilter(fNew, fromBlock, currentBlock) : [];
    const logsOld = fOld ? await c.queryFilter(fOld, fromBlock, currentBlock) : [];

    const orderIdsSet = new Set<string>();

    for (const ev of logsNew) {
        if ("args" in ev && ev.args) {
            const orderId = (ev.args.orderId ?? ev.args[0]) as bigint;
            orderIdsSet.add(orderId.toString());
        }
    }
    for (const ev of logsOld) {
        if ("args" in ev && ev.args) {
            const orderId = (ev.args.orderId ?? ev.args[0]) as bigint;
            orderIdsSet.add(orderId.toString());
        }
    }

    const orderIds = Array.from(orderIdsSet)
        .map((s) => BigInt(s))
        .sort((a, b) => Number(b - a))
        .slice(0, maxOrders);

    const asks: SellOrder[] = [];

    for (const id of orderIds) {
        const o = await c.sellOrders(id);

        let hasPlot = false;
        let plotId: string | undefined = undefined;

        try {
            hasPlot = Boolean(await c.orderHasPlot(id));
            if (hasPlot) plotId = await c.orderPlotId(id);
        } catch {
            hasPlot = false;
            plotId = undefined;
        }

        asks.push({
            id: toBigInt(o.id),
            seller: o.seller,
            amountTotal: toBigInt(o.amountTotal),
            amountRemaining: toBigInt(o.amountRemaining),
            pricePerTokenWei: toBigInt(o.pricePerTokenWei),
            active: Boolean(o.active),
            hasPlot,
            plotId,
        });
    }

    asks.sort((a, b) => Number(a.id - b.id));

    return { account, chainId, asks };
}

/**
 * Subscribe for updates (account/chain + contract events)
 */
export async function subscribeMarketSnapshot(
    cb: (snap: MarketSnapshot) => void,
    args: FetchMarketArgs = {}
): Promise<() => void> {
    let stopped = false;

    const emit = async () => {
        if (stopped) return;
        try {
            const s = await fetchMarketSnapshot(args);
            cb(s);
        } catch {
            // keep last known
        }
    };

    await emit();

    const eth = getEthereum();
    const c = await getReadContract();

    const onAccountsChanged = () => emit();
    const onChainChanged = () => emit();

    eth?.on?.("accountsChanged", onAccountsChanged);
    eth?.on?.("chainChanged", onChainChanged);

    const onCreate = () => emit();
    const onFill = () => emit();
    const onCancel = () => emit();

    c.on?.("SellOrderCreated", onCreate);
    c.on?.("SellOrderCreatedWithPlot", onCreate);
    c.on?.("SellOrderFilled", onFill);
    c.on?.("SellOrderCancelled", onCancel);

    return () => {
        stopped = true;
        eth?.removeListener?.("accountsChanged", onAccountsChanged);
        eth?.removeListener?.("chainChanged", onChainChanged);

        try {
            c.off?.("SellOrderCreated", onCreate);
            c.off?.("SellOrderCreatedWithPlot", onCreate);
            c.off?.("SellOrderFilled", onFill);
            c.off?.("SellOrderCancelled", onCancel);
        } catch {
            // ignore
        }
    };
}

/**
 * ✅ Create sell order linked to a plot
 */
export async function createAskForPlot(input: {
    plotId: string;
    amountTokens: string; // human (18 decimals)
    priceEthPerToken: string; // human ETH
}): Promise<string> {
    const { plotId, amountTokens, priceEthPerToken } = input;
    const c = await getWriteContract();

    const amountWei = ethers.parseUnits(amountTokens, 18);
    const priceWei = ethers.parseEther(priceEthPerToken);

    const tx = await c.createSellOrderForPlot(plotId, amountWei, priceWei);
    const rcpt = await tx.wait();
    return rcpt?.hash ?? tx.hash;
}

/**
 * Old sell order (not plot linked)
 */
export async function createAsk(input: { amountTokens: string; priceEthPerToken: string }): Promise<string> {
    const c = await getWriteContract();

    const amountWei = ethers.parseUnits(input.amountTokens, 18);
    const priceWei = ethers.parseEther(input.priceEthPerToken);

    const tx = await c.createSellOrder(amountWei, priceWei);
    const rcpt = await tx.wait();
    return rcpt?.hash ?? tx.hash;
}

/**
 * Cancel order
 */
export async function cancelAsk(input: { orderId: bigint }): Promise<string> {
    const c = await getWriteContract();
    const tx = await c.cancelSellOrder(input.orderId);
    const rcpt = await tx.wait();
    return rcpt?.hash ?? tx.hash;
}

/**
 * Buy from order
 */
export async function buyFromOrder(input: { orderId: bigint; amountTokens: string }): Promise<string> {
    const c = await getWriteContract();

    const amountWei = ethers.parseUnits(input.amountTokens, 18);

    const r = await getReadContract();
    const o = await r.sellOrders(input.orderId);
    const priceWei = toBigInt(o.pricePerTokenWei);

    const totalCostWei = computeTotalCostWei(toBigInt(amountWei), priceWei);

    const tx = await c.buyFromOrder(input.orderId, amountWei, {
        value: totalCostWei,
    });

    const rcpt = await tx.wait();
    return rcpt?.hash ?? tx.hash;
}

/**
 * UI Helper: hide garbage messages
 */
export function toSilentUiError(e: any): string {
    const msg = e?.message ?? String(e);

    if (msg.includes("WALLET_NOT_FOUND")) return "Please install a wallet extension.";
    if (msg.includes("MISSING_CONTRACT_ADDRESS")) return "Missing contract address (.env).";
    if (msg.includes("user rejected") || msg.includes("User rejected")) return "Transaction cancelled.";
    if (msg.includes("insufficient funds")) return "Not enough ETH for gas/payment.";
    if (msg.includes("execution reverted")) return "Transaction failed (reverted).";

    return "Action failed.";
}


// ==============================
// PURCHASE HISTORY (Event Scan)
// ==============================

export type PurchaseRow = {
    orderId: bigint;
    buyer: string;
    seller: string;
    amount: bigint;
    totalPaidWei: bigint;
    pricePerTokenWei: bigint;
    hasPlot: boolean;
    plotId?: string;
    blockNumber: number;
    txHash: string;
    timestamp?: number; // optional (if fetched)
};

type FetchPurchaseArgs = {
    lookbackBlocks?: number;
    maxRows?: number;
    includeTimestamps?: boolean;
};

/**
 * Fetch purchases for the connected wallet by scanning SellOrderFilled events.
 * This is the ONLY reliable way to show "orders bought" because the contract
 * stores tokensBought as a total, not a list of order IDs.
 */
export async function fetchMyPurchases(args: FetchPurchaseArgs = {}): Promise<PurchaseRow[]> {
    const account = await getAccountSilent();
    if (!account) return [];

    const c = await getReadContract();
    const provider = await getProvider();

    const lookbackBlocks = args.lookbackBlocks ?? 80_000;
    const maxRows = args.maxRows ?? 200;
    const includeTimestamps = args.includeTimestamps ?? false;

    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - lookbackBlocks);

    const fFill = c.filters.SellOrderFilled?.();
    const logs = fFill ? await c.queryFilter(fFill, fromBlock, currentBlock) : [];

    const me = account.toLowerCase();

    // Filter to only events where buyer is me
    const myLogs = logs.filter((ev: any) => {
        const buyer = (ev?.args?.buyer ?? ev?.args?.[1] ?? "") as string;
        return buyer?.toLowerCase?.() === me;
    });

    // newest first
    const sorted = [...myLogs].sort((a: any, b: any) => (b.blockNumber ?? 0) - (a.blockNumber ?? 0)).slice(0, maxRows);

    const out: PurchaseRow[] = [];

    for (const ev of sorted as any[]) {
        const orderId = (ev?.args?.orderId ?? ev?.args?.[0]) as bigint;
        const buyer = (ev?.args?.buyer ?? ev?.args?.[1]) as string;
        const amount = (ev?.args?.amount ?? ev?.args?.[2]) as bigint;
        const totalPaidWei = (ev?.args?.totalPaidWei ?? ev?.args?.[3]) as bigint;

        // read the sell order struct to get seller + price
        const o = await c.sellOrders(orderId);

        let hasPlot = false;
        let plotId: string | undefined = undefined;
        try {
            hasPlot = Boolean(await c.orderHasPlot(orderId));
            if (hasPlot) plotId = await c.orderPlotId(orderId);
        } catch {
            hasPlot = false;
        }

        let timestamp: number | undefined = undefined;
        if (includeTimestamps) {
            try {
                const b = await provider.getBlock(ev.blockNumber);
                timestamp = b?.timestamp ? Number(b.timestamp) * 1000 : undefined;
            } catch {
                timestamp = undefined;
            }
        }

        out.push({
            orderId: BigInt(orderId),
            buyer,
            seller: o.seller,
            amount: BigInt(amount),
            totalPaidWei: BigInt(totalPaidWei),
            pricePerTokenWei: BigInt(o.pricePerTokenWei),
            hasPlot,
            plotId,
            blockNumber: Number(ev.blockNumber ?? 0),
            txHash: String(ev.transactionHash ?? ""),
            timestamp,
        });
    }

    return out;
}
