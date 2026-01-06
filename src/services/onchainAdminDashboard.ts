import { ethers } from "ethers";
import artifact from "../abi/GMCLandCompensation.json";

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

async function getProviderAndContract(): Promise<ProviderAndContract> {
    assertWalletProvider();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const provider = new ethers.BrowserProvider(w.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    return { provider, contract };
}

export type DashboardStats = {
    plotCount: number;
    tokensPerUnit: bigint;
    totalSupply: bigint;

    // Real-time “activity” based on contract logs
    activityCount: number; // # of logs in last N blocks

    // last 7 tokensPerUnit updates for a real on-chain “price-ish” graph
    last7RatePoints: number[]; // numeric for graphing
};

export async function fetchDashboardStats(opts?: {
    lookbackBlocks?: number;
    ratePoints?: number; // last N TokensPerUnitUpdated events
}): Promise<DashboardStats> {
    const lookbackBlocks = opts?.lookbackBlocks ?? 10_000;
    const ratePoints = opts?.ratePoints ?? 7;

    const { provider, contract } = await getProviderAndContract();

    const [latest, plotCountBN, tokensPerUnit, totalSupply] = await Promise.all([
        provider.getBlockNumber(),
        contract.getPlotCount() as Promise<bigint>,
        contract.tokensPerUnit() as Promise<bigint>,
        contract.totalSupply() as Promise<bigint>,
    ]);

    const fromBlock = Math.max(0, latest - lookbackBlocks);
    const address = await contract.getAddress();

    // Activity = number of logs for this contract in the lookback range
    const logs = await provider.getLogs({ address, fromBlock, toBlock: latest });

    // Last N TokensPerUnitUpdated events (on-chain rate history)
    // We’ll scan logs and parse only that event using Interface
    const iface = new ethers.Interface(ABI);
    const rateLogs = logs
        .map((l) => {
            try {
                const parsed = iface.parseLog(l);
                if (parsed?.name !== "TokensPerUnitUpdated") return null;
                return parsed;
            } catch {
                return null;
            }
        })
        .filter(Boolean) as Array<ReturnType<typeof iface.parseLog>>;

    // Take last N by block order
    // logs already in ascending order from getLogs, so slice from the end
    const last = rateLogs.slice(-ratePoints);

    const last7RatePoints = last.map((p) => {
        // newRate is uint256, might be big. Convert to a safe-ish number for graph.
        // If your rate is 1e18 scaled, show human format.
        // If it’s not scaled, still ok.
        const newRate = BigInt(p!.args.newRate);
        // graph as “human” if it looks like 18 decimals
        // (you can adjust this depending on how you store tokensPerUnit)
        const human = Number(ethers.formatUnits(newRate, 18));
        return Number.isFinite(human) && human > 0 ? human : Number(newRate);
    });

    return {
        plotCount: Number(plotCountBN),
        tokensPerUnit: BigInt(tokensPerUnit),
        totalSupply: BigInt(totalSupply),
        activityCount: logs.length,
        last7RatePoints,
    };
}

/**
 * Lightweight “realtime”: refresh whenever a new block arrives.
 * Returns an unsubscribe function.
 */
export async function subscribeDashboardStats(
    onUpdate: (stats: DashboardStats) => void,
    opts?: { lookbackBlocks?: number; ratePoints?: number }
): Promise<() => void> {
    const { provider } = await getProviderAndContract();

    let alive = true;

    const handler = async () => {
        if (!alive) return;
        try {
            const stats = await fetchDashboardStats(opts);
            if (alive) onUpdate(stats);
        } catch {
            // ignore noisy errors here; UI can show last good state
        }
    };

    // initial
    void handler();

    provider.on("block", handler);

    return () => {
        alive = false;
        provider.off("block", handler);
    };
}
