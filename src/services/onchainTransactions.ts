import { ethers } from "ethers";
import artifact from "../../../web3/artifacts/contracts/GMCLandCompensation.sol/GMCLandCompensation.json";

import type { TxRow, TxType } from "../types/tx";
import { shortAddr } from "../types/tx";

const CONTRACT_ADDRESS = import.meta.env.VITE_GMC_LAND_CONTRACT_ADDRESS as string;
const ABI = (artifact as any).abi as ethers.InterfaceAbi;

export const DECIMALS = 18;

type ProviderAndContract = {
    provider: ethers.BrowserProvider;
    contract: ethers.Contract;
    iface: ethers.Interface;
};

function fmtDate(ms: number) {
    return new Date(ms).toISOString().slice(0, 16).replace("T", " ");
}
function fmtToken(value: bigint) {
    return `${ethers.formatUnits(value, DECIMALS)} GMCLT`;
}
function fmtEth(value: bigint) {
    return `${ethers.formatEther(value)} ETH`;
}

function assertWalletProvider() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (!w.ethereum) throw new Error("No wallet provider found (window.ethereum)");
}

async function getProviderAndContract(): Promise<ProviderAndContract> {
    assertWalletProvider();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;

    const provider = new ethers.BrowserProvider(w.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const iface = new ethers.Interface(ABI);

    return { provider, contract, iface };
}

// Decode a log safely
function tryParseLog(iface: ethers.Interface, log: ethers.Log) {
    try {
        return iface.parseLog(log);
    } catch {
        return null;
    }
}

// If you want nicer labels, keep them in UI, not in TxType.
// TxType should represent event categories consistently.
function mapType(t: string): TxType {
    // IMPORTANT: these MUST exist in your shared TxType union in src/types/tx.ts
    // If they don't, either add them there or change these to the union names you use.
    return t as TxType;
}

/**
 * Fetch past on-chain transactions from logs (TS-safe).
 */
export async function fetchOnchainTransactions(args?: {
    lookbackBlocks?: number;
}): Promise<TxRow[]> {
    const lookbackBlocks = args?.lookbackBlocks ?? 50_000;

    const { provider, contract, iface } = await getProviderAndContract();

    const latest = await provider.getBlockNumber();
    const fromBlock = Math.max(latest - lookbackBlocks, 0);

    const logs = await provider.getLogs({
        address: await contract.getAddress(),
        fromBlock,
        toBlock: latest,
    });

    const blockCache = new Map<number, number>();
    async function getBlockTimeMs(blockNumber: number) {
        const cached = blockCache.get(blockNumber);
        if (cached) return cached;
        const b = await provider.getBlock(blockNumber);
        const ms = Number(b?.timestamp ?? 0) * 1000;
        blockCache.set(blockNumber, ms);
        return ms;
    }

    const rows: TxRow[] = [];

    for (const log of logs) {
        const parsed = tryParseLog(iface, log);
        if (!parsed) continue;

        const ms = await getBlockTimeMs(log.blockNumber);

        const base = {
            id: `${log.transactionHash}:${log.index}`,
            date: fmtDate(ms),
            txHash: log.transactionHash,
            blockNumber: log.blockNumber,
            logIndex: log.index,
        };

        switch (parsed.name) {
            case "LandPlotRegistered": {
                const wallet = String(parsed.args.wallet);
                const tokenAmount = BigInt(parsed.args.tokenAmount);

                rows.push({
                    ...base,
                    type: mapType("PLOT_REGISTERED"),
                    from: "ADMIN",
                    to: wallet,
                    amount: fmtToken(tokenAmount),
                    price: "-",
                    meta: { plotId: String(parsed.args.plotId), landValue: String(parsed.args.landValue) },
                });
                break;
            }

            case "TokensAllocatedFromPlot": {
                const to = String(parsed.args.to);
                const amount = BigInt(parsed.args.amount);

                rows.push({
                    ...base,
                    type: mapType("TOKENS_ALLOCATED"),
                    from: "ADMIN",
                    to,
                    amount: fmtToken(amount),
                    price: "-",
                    meta: { plotId: String(parsed.args.plotId) },
                });
                break;
            }

            case "SellOrderCreated": {
                const seller = String(parsed.args.seller);
                const amount = BigInt(parsed.args.amount);
                const pricePerTokenWei = BigInt(parsed.args.pricePerTokenWei);

                rows.push({
                    ...base,
                    type: mapType("SELL_ORDER_CREATED"),
                    from: seller,
                    to: "MARKET (ESCROW)",
                    amount: fmtToken(amount),
                    price: `${fmtEth(pricePerTokenWei)} / token`,
                });
                break;
            }

            case "SellOrderFilled": {
                const buyer = String(parsed.args.buyer);
                const amount = BigInt(parsed.args.amount);
                const totalPaidWei = BigInt(parsed.args.totalPaidWei);

                rows.push({
                    ...base,
                    type: mapType("SELL_ORDER_FILLED"),
                    from: "MARKET",
                    to: buyer,
                    amount: fmtToken(amount),
                    price: `${fmtEth(totalPaidWei)} total`,
                });
                break;
            }

            case "SellOrderCancelled": {
                const seller = String(parsed.args.seller);
                const amountReturned = BigInt(parsed.args.amountReturned);

                rows.push({
                    ...base,
                    type: mapType("SELL_ORDER_CANCELLED"),
                    from: "MARKET",
                    to: seller,
                    amount: fmtToken(amountReturned),
                    price: "-",
                });
                break;
            }

            case "Transfer": {
                const from = String(parsed.args.from);
                const to = String(parsed.args.to);
                const value = BigInt(parsed.args.value);

                // ignore mint/burn if you want
                if (from === ethers.ZeroAddress) break;
                if (to === ethers.ZeroAddress) break;

                rows.push({
                    ...base,
                    type: mapType("TRANSFER"),
                    from,
                    to,
                    amount: fmtToken(value),
                    price: "-",
                });
                break;
            }

            default:
                break;
        }
    }

    rows.sort((a, b) => b.blockNumber - a.blockNumber || b.logIndex - a.logIndex);
    return rows;
}

/**
 * Live subscription (TS-safe): listens for logs, decodes, emits TxRow
 */
export async function subscribeOnchainTransactions(
    onNewTx: (row: TxRow) => void
): Promise<() => void> {
    const { provider, contract, iface } = await getProviderAndContract();

    const blockCache = new Map<number, number>();
    async function getBlockTimeMs(blockNumber: number) {
        const cached = blockCache.get(blockNumber);
        if (cached) return cached;
        const b = await provider.getBlock(blockNumber);
        const ms = Number(b?.timestamp ?? 0) * 1000;
        blockCache.set(blockNumber, ms);
        return ms;
    }

    const address = await contract.getAddress();

    const listener = async (log: ethers.Log) => {
        if (log.address.toLowerCase() !== address.toLowerCase()) return;

        const parsed = tryParseLog(iface, log);
        if (!parsed) return;

        const ms = await getBlockTimeMs(log.blockNumber);

        const base = {
            id: `${log.transactionHash}:${log.index}`,
            date: fmtDate(ms),
            txHash: log.transactionHash,
            blockNumber: log.blockNumber,
            logIndex: log.index,
        };

        const emit = (row: Omit<TxRow, "id" | "date" | "txHash" | "blockNumber" | "logIndex">) =>
            onNewTx({ ...base, ...row });

        switch (parsed.name) {
            case "LandPlotRegistered":
                emit({
                    type: mapType("PLOT_REGISTERED"),
                    from: "ADMIN",
                    to: String(parsed.args.wallet),
                    amount: fmtToken(BigInt(parsed.args.tokenAmount)),
                    price: "-",
                    meta: { plotId: String(parsed.args.plotId) },
                });
                break;

            case "TokensAllocatedFromPlot":
                emit({
                    type: mapType("TOKENS_ALLOCATED"),
                    from: "ADMIN",
                    to: String(parsed.args.to),
                    amount: fmtToken(BigInt(parsed.args.amount)),
                    price: "-",
                    meta: { plotId: String(parsed.args.plotId) },
                });
                break;

            case "SellOrderCreated":
                emit({
                    type: mapType("SELL_ORDER_CREATED"),
                    from: String(parsed.args.seller),
                    to: "MARKET (ESCROW)",
                    amount: fmtToken(BigInt(parsed.args.amount)),
                    price: `${fmtEth(BigInt(parsed.args.pricePerTokenWei))} / token`,
                });
                break;

            case "SellOrderFilled":
                emit({
                    type: mapType("SELL_ORDER_FILLED"),
                    from: "MARKET",
                    to: String(parsed.args.buyer),
                    amount: fmtToken(BigInt(parsed.args.amount)),
                    price: `${fmtEth(BigInt(parsed.args.totalPaidWei))} total`,
                });
                break;

            case "SellOrderCancelled":
                emit({
                    type: mapType("SELL_ORDER_CANCELLED"),
                    from: "MARKET",
                    to: String(parsed.args.seller),
                    amount: fmtToken(BigInt(parsed.args.amountReturned)),
                    price: "-",
                });
                break;

            case "Transfer": {
                const from = String(parsed.args.from);
                const to = String(parsed.args.to);
                const value = BigInt(parsed.args.value);
                if (from === ethers.ZeroAddress) return;
                if (to === ethers.ZeroAddress) return;

                emit({
                    type: mapType("TRANSFER"),
                    from,
                    to,
                    amount: fmtToken(value),
                    price: "-",
                });
                break;
            }

            default:
                break;
        }
    };

    provider.on({ address }, listener);

    return () => {
        provider.off({ address }, listener);
    };
}

// re-export helper if your pages import it from this service
export { shortAddr };
