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

async function getConnectedAccount(provider: ethers.BrowserProvider): Promise<string | null> {
    const accounts = await provider.send("eth_accounts", []);
    return accounts?.[0] ?? null;
}

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
    myTokensFromThisPlot: bigint;
    wallet: string;
    exists: boolean;
};

export type MyLandPlotsResponse = {
    account: string;
    plots: LandPlotView[];
};

export type LandMode = "registered" | "token" | "both";

/**
 * FINAL:
 * - registered: plots registered to wallet via getWalletPlots + plots(plotId)
 * - token: plots where user holds tokens originating from plot via getMyInfo()
 * - both: union
 *
 * Returns ONLY on-chain LandPlotView[].
 */
export async function fetchMyLandPlots(mode: LandMode = "registered"): Promise<MyLandPlotsResponse> {
    const { provider, contract } = await getProviderAndContract();

    const account = await getConnectedAccount(provider);
    if (!account) throw new Error("Connect MetaMask first.");

    const plotMap = new Map<string, LandPlotView>();

    // A) registered plots (walletPlots)
    if (mode === "registered" || mode === "both") {
        const ids: string[] = await contract.getWalletPlots(account);

        const views = await Promise.all(
            ids.map(async (pid) => {
                const p = await contract.plots(pid);

                const view: LandPlotView = {
                    plotId: p.plotId,
                    dzongkhag: p.dzongkhag,
                    gewog: p.gewog,
                    thram: p.thram,
                    ownerName: p.ownerName,
                    ownerCid: p.ownerCid,
                    ownType: p.ownType,
                    majorCategory: p.majorCategory,
                    landType: p.landType,
                    plotClass: p.plotClass,
                    areaAc: BigInt(p.areaAc),
                    landValue: BigInt(p.landValue),
                    allocatedTokens: BigInt(p.allocatedTokens),
                    myTokensFromThisPlot: 0n, // not provided by plots() getter
                    wallet: p.wallet,
                    exists: Boolean(p.exists),
                };

                return view;
            })
        );

        for (const v of views) {
            if (v.exists) plotMap.set(v.plotId, v);
        }
    }

    // B) token-origin plots (getMyInfo)
    if (mode === "token" || mode === "both") {
        const res = await contract.getMyInfo();
        const fullPlotDetails = res[5] as any[];

        for (const p of fullPlotDetails) {
            const view: LandPlotView = {
                plotId: p.plotId,
                dzongkhag: p.dzongkhag,
                gewog: p.gewog,
                thram: p.thram,
                ownerName: p.ownerName,
                ownerCid: p.ownerCid,
                ownType: p.ownType,
                majorCategory: p.majorCategory,
                landType: p.landType,
                plotClass: p.plotClass,
                areaAc: BigInt(p.areaAc),
                landValue: BigInt(p.landValue),
                allocatedTokens: BigInt(p.allocatedTokens),
                myTokensFromThisPlot: BigInt(p.myTokensFromThisPlot),
                wallet: p.wallet,
                exists: Boolean(p.exists),
            };

            const existing = plotMap.get(view.plotId);
            if (existing) {
                // merge token info into existing registered record
                plotMap.set(view.plotId, { ...existing, myTokensFromThisPlot: view.myTokensFromThisPlot });
            } else {
                if (view.exists) plotMap.set(view.plotId, view);
            }
        }
    }

    return { account, plots: [...plotMap.values()] };
}

/**
 * Realtime refresh on new blocks.
 */
export async function subscribeMyLandPlots(
    onUpdate: (data: MyLandPlotsResponse) => void,
    mode: LandMode = "registered"
): Promise<() => void> {
    const { provider } = await getProviderAndContract();
    let alive = true;

    const handler = async () => {
        if (!alive) return;
        try {
            const next = await fetchMyLandPlots(mode);
            if (alive) onUpdate(next);
        } catch {
            // ignore noise
        }
    };

    void handler();
    provider.on("block", handler);

    return () => {
        alive = false;
        provider.off("block", handler);
    };
}
