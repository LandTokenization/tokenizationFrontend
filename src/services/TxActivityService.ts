import { ethers } from "ethers";
import artifact from "../../../web3/artifacts/contracts/GMCLandCompensation.sol/GMCLandCompensation.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_GMC_LAND_CONTRACT_ADDRESS as string;
const ABI = (artifact as any).abi as ethers.InterfaceAbi;

export type TxType = "BUY" | "SELL" | "SELL_CREATED" | "SELL_CREATED_PLOT" | "CANCEL";

export type TxRow = {
    id: string;
    type: TxType;
    tokens: bigint;
    pricePerTokenWei?: bigint;
    totalPaidWei?: bigint;
    blockNumber: number;
    timestampMs?: number;
    txHash: string;
    orderId?: bigint;
    counterparty?: string;
    plotId?: string;
};

function assertWalletProvider() {
    const w = window as any;
    if (!w?.ethereum) throw new Error("No wallet provider found (MetaMask).");
    return w.ethereum;
}

async function getReadProviderAndAccount() {
    const eth = assertWalletProvider();
    await eth.request({ method: "eth_requestAccounts" });

    const provider = new ethers.BrowserProvider(eth);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();

    // provider-connected contract is best for logs
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    return { provider, contract, account };
}

async function attachTimestamps(provider: ethers.BrowserProvider, rows: TxRow[]) {
    const uniqBlocks = Array.from(new Set(rows.map((r) => r.blockNumber)));
    const map = new Map<number, number>();

    await Promise.all(
        uniqBlocks.map(async (bn) => {
            try {
                const b = await provider.getBlock(bn);
                if (b?.timestamp) map.set(bn, Number(b.timestamp) * 1000);
            } catch { }
        })
    );

    for (const r of rows) r.timestampMs = map.get(r.blockNumber);
}

// ✅ MAIN EXPORT (use this in UI)
export async function fetchMyContractActivity(opts?: { lookbackBlocks?: number; maxRows?: number }) {
    const lookbackBlocks = opts?.lookbackBlocks ?? 2_000_000;
    const maxRows = opts?.maxRows ?? 500;

    const { provider, contract, account } = await getReadProviderAndAccount();

    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (!code || code === "0x") {
        throw new Error(`No contract found at ${CONTRACT_ADDRESS} on this network.`);
    }

    const latest = await provider.getBlockNumber();
    const fromBlock = Math.max(0, latest - lookbackBlocks);

    // indexed params only
    const fCreated = contract.filters.SellOrderCreated(null, account);
    const fCancelled = contract.filters.SellOrderCancelled(null, account);
    const fBought = contract.filters.SellOrderFilled(null, account);
    const fCreatedPlot = contract.filters.SellOrderCreatedWithPlot(null, account, null);

    const [createdLogs, createdPlotLogs, cancelledLogs, boughtLogs] = await Promise.all([
        contract.queryFilter(fCreated, fromBlock, latest),
        contract.queryFilter(fCreatedPlot, fromBlock, latest),
        contract.queryFilter(fCancelled, fromBlock, latest),
        contract.queryFilter(fBought, fromBlock, latest),
    ]);

    // SELL fills as seller: need all fills then check order.seller
    const allFilledLogs = await contract.queryFilter(contract.filters.SellOrderFilled(), fromBlock, latest);
    const allFilledCapped = allFilledLogs.slice(-maxRows);

    const sellFillLogs: any[] = [];
    await Promise.all(
        allFilledCapped.map(async (log: any) => {
            const orderId = log.args?.orderId as bigint;
            if (orderId == null) return;
            try {
                const order = await contract.sellOrders(orderId);
                const seller = (order?.seller as string) ?? "";
                if (seller && seller.toLowerCase() === account.toLowerCase()) sellFillLogs.push(log);
            } catch { }
        })
    );

    const rows: TxRow[] = [];

    for (const log of createdLogs) {
        const e = log as ethers.EventLog;
        rows.push({
            id: `${e.transactionHash}-created-${e.index}`,
            type: "SELL_CREATED",
            tokens: (e.args?.amount as bigint) ?? 0n,
            pricePerTokenWei: (e.args?.pricePerTokenWei as bigint) ?? 0n,
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
            orderId: (e.args?.orderId as bigint) ?? undefined,
        });
    }

    for (const log of createdPlotLogs) {
        const e = log as ethers.EventLog;
        rows.push({
            id: `${e.transactionHash}-createdPlot-${e.index}`,
            type: "SELL_CREATED_PLOT",
            tokens: (e.args?.amount as bigint) ?? 0n,
            pricePerTokenWei: (e.args?.pricePerTokenWei as bigint) ?? 0n,
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
            orderId: (e.args?.orderId as bigint) ?? undefined,
            plotId: (e.args?.plotId as string) ?? undefined,
        });
    }

    for (const log of boughtLogs) {
        const e = log as ethers.EventLog;
        const amount = (e.args?.amount as bigint) ?? 0n;
        const totalPaid = (e.args?.totalPaidWei as bigint) ?? 0n;

        rows.push({
            id: `${e.transactionHash}-buy-${e.index}`,
            type: "BUY",
            tokens: amount,
            totalPaidWei: totalPaid,
            pricePerTokenWei: amount > 0n ? (totalPaid * 10n ** 18n) / amount : 0n,
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
            orderId: (e.args?.orderId as bigint) ?? undefined,
        });
    }

    for (const log of sellFillLogs) {
        const e = log as ethers.EventLog;
        const amount = (e.args?.amount as bigint) ?? 0n;
        const totalPaid = (e.args?.totalPaidWei as bigint) ?? 0n;

        rows.push({
            id: `${e.transactionHash}-sell-${e.index}`,
            type: "SELL",
            tokens: amount,
            totalPaidWei: totalPaid,
            pricePerTokenWei: amount > 0n ? (totalPaid * 10n ** 18n) / amount : 0n,
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
            orderId: (e.args?.orderId as bigint) ?? undefined,
            counterparty: (e.args?.buyer as string) ?? undefined,
        });
    }

    for (const log of cancelledLogs) {
        const e = log as ethers.EventLog;
        rows.push({
            id: `${e.transactionHash}-cancel-${e.index}`,
            type: "CANCEL",
            tokens: (e.args?.amountReturned as bigint) ?? 0n,
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
            orderId: (e.args?.orderId as bigint) ?? undefined,
        });
    }

    await attachTimestamps(provider, rows);

    rows.sort(
        (a, b) => (b.timestampMs ?? 0) - (a.timestampMs ?? 0) || b.blockNumber - a.blockNumber
    );

    const balance: bigint = await contract.balanceOf(account);

    return { account, balance, rows: rows.slice(0, maxRows) };
}

// ✅ BACKWARD-COMPAT ALIAS (so old UI imports won’t break)
export const fetchMyOnchainActivity = fetchMyContractActivity;
