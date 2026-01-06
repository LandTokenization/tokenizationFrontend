import { ethers } from "ethers";
import artifact from "../abi/GMCLandCompensation.json";

import type { TxRow, TxType } from "../types/tx";
import { shortAddr } from "../types/tx";

const CONTRACT_ADDRESS =
    (import.meta.env.VITE_GMC_LAND_CONTRACT_ADDRESS as string) || "0xYourContractAddressHere";

const ABI = (artifact as any).abi as ethers.InterfaceAbi;

type ProviderAndContract = {
    provider: ethers.BrowserProvider;
    contract: ethers.Contract;
    iface: ethers.Interface;
};

function fmtDate(ms: number) {
    return new Date(ms).toISOString().slice(0, 16).replace("T", " ");
}

function assertWalletProvider() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (!w.ethereum) throw new Error("No wallet found (window.ethereum).");
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

function tryParseLog(iface: ethers.Interface, log: ethers.Log) {
    try {
        return iface.parseLog(log);
    } catch {
        return null;
    }
}

function mapType(t: string): TxType {
    // These MUST exist in src/types/tx.ts union.
    return t as TxType;
}

export async function fetchInheritanceTransactions(opts?: {
    lookbackBlocks?: number;
}): Promise<TxRow[]> {
    const lookbackBlocks = opts?.lookbackBlocks ?? 50_000;

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

        // Only keep inheritance events
        if (
            parsed.name !== "NomineeSet" &&
            parsed.name !== "OwnerDeclaredDeceased" &&
            parsed.name !== "PlotClaimedByNominee"
            // NOTE: You do NOT have a NomineeCleared event in Solidity right now.
        ) {
            continue;
        }

        const ms = await getBlockTimeMs(log.blockNumber);

        const base = {
            id: `${log.transactionHash}:${log.index}`,
            date: fmtDate(ms),
            txHash: log.transactionHash,
            blockNumber: log.blockNumber,
            logIndex: log.index,
        };

        switch (parsed.name) {
            case "NomineeSet": {
                const plotId = String(parsed.args.plotId);
                const currentPlotWallet = String(parsed.args.currentPlotWallet);
                const nominee = String(parsed.args.nominee);

                rows.push({
                    ...base,
                    type: mapType("NOMINEE_SET"),
                    from: currentPlotWallet,
                    to: nominee,
                    amount: "—",
                    price: "—",
                    meta: { plotId },
                });
                break;
            }

            case "OwnerDeclaredDeceased": {
                const plotId = String(parsed.args.plotId);
                const admin = String(parsed.args.admin);
                const nominee = String(parsed.args.nominee);

                rows.push({
                    ...base,
                    type: mapType("DECLARED_DECEASED"),
                    from: admin,
                    to: nominee,
                    amount: "—",
                    price: "—",
                    meta: { plotId },
                });
                break;
            }

            case "PlotClaimedByNominee": {
                const plotId = String(parsed.args.plotId);
                const nominee = String(parsed.args.nominee);
                const oldWallet = String(parsed.args.oldWallet);
                const newWallet = String(parsed.args.newWallet);

                rows.push({
                    ...base,
                    type: mapType("PLOT_CLAIMED"),
                    from: oldWallet,
                    to: newWallet,
                    amount: "—",
                    price: `Nominee: ${shortAddr(nominee)}`,
                    meta: { plotId, nominee },
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

export async function subscribeInheritanceTransactions(
    onTx: (tx: TxRow) => void
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

    const address = (await contract.getAddress()).toLowerCase();

    const listener = async (log: ethers.Log) => {
        if (log.address.toLowerCase() !== address) return;

        const parsed = tryParseLog(iface, log);
        if (!parsed) return;

        if (
            parsed.name !== "NomineeSet" &&
            parsed.name !== "OwnerDeclaredDeceased" &&
            parsed.name !== "PlotClaimedByNominee"
        ) {
            return;
        }

        const ms = await getBlockTimeMs(log.blockNumber);

        const base = {
            id: `${log.transactionHash}:${log.index}`,
            date: fmtDate(ms),
            txHash: log.transactionHash,
            blockNumber: log.blockNumber,
            logIndex: log.index,
        };

        const emit = (row: Omit<TxRow, "id" | "date" | "txHash" | "blockNumber" | "logIndex">) =>
            onTx({ ...base, ...row });

        switch (parsed.name) {
            case "NomineeSet": {
                const plotId = String(parsed.args.plotId);
                emit({
                    type: mapType("NOMINEE_SET"),
                    from: String(parsed.args.currentPlotWallet),
                    to: String(parsed.args.nominee),
                    amount: "—",
                    price: "—",
                    meta: { plotId },
                });
                break;
            }

            case "OwnerDeclaredDeceased": {
                const plotId = String(parsed.args.plotId);
                emit({
                    type: mapType("DECLARED_DECEASED"),
                    from: String(parsed.args.admin),
                    to: String(parsed.args.nominee),
                    amount: "—",
                    price: "—",
                    meta: { plotId },
                });
                break;
            }

            case "PlotClaimedByNominee": {
                const plotId = String(parsed.args.plotId);
                const nominee = String(parsed.args.nominee);
                emit({
                    type: mapType("PLOT_CLAIMED"),
                    from: String(parsed.args.oldWallet),
                    to: String(parsed.args.newWallet),
                    amount: "—",
                    price: `Nominee: ${shortAddr(nominee)}`,
                    meta: { plotId, nominee },
                });
                break;
            }

            default:
                break;
        }
    };

    provider.on({ address: await contract.getAddress() }, listener);

    return async () => {
        provider.off({ address: await contract.getAddress() }, listener);
    };
}
