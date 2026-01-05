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
    areaAc: bigint; // areaAcTimes1e4 (acres * 1e4)
    landValue: bigint;
    allocatedTokens: bigint;
    myTokensFromThisPlot: bigint;
    wallet: string;
    exists: boolean;
};

export type PlotRow = {
    plotId: string;
    netArea: number; // UI number (acres for rural, sqft for urban)
    location: string; // "Dzongkhag | Gewog"
    thram: number;

    // rural uses landType/plotClass, urban uses precinct/lap (we map)
    landType?: string;
    plotClass?: string;
    precinct?: string;
    lap?: string;

    mortgage: "Yes" | "No";
    structure: "Yes" | "No";
    acquired: "Yes" | "No";
    remarks?: string;

    action?: string; // "View PLR" if you want
    isRural?: boolean;
};

export type LandSummaryRow = {
    id: number;
    location: string;
    thram: number;
    owners: string;
    ownershipType: string;
    netArea: number;
};

export type ThramDetails = {
    location: string;
    ownerType: string;
    owner: string;
    plots: PlotRow[];
    totalArea: number;
    isRural?: boolean;
};

export type StructureDetails = Record<
    string,
    {
        plotId: string;
        landShare: string;
        structures: Array<{
            buildingNo: number;
            flatNo: string;
            plr: number;
            ownerType: string;
            ownerDetail: string;
            flatType: string;
            mortgage: "Yes" | "No";
            active: boolean;
        }>;
    }
>;

export type LandHoldings = {
    account: string;
    urbanLands: LandSummaryRow[];
    ruralLands: LandSummaryRow[];
    tramDetails: Record<number, ThramDetails>;
    structureDetails: StructureDetails;

    totals: {
        urbanTotalSqft: number;
        ruralTotalAcres: number;
        totalAcres: number;
    };
};

function acresTimes1e4ToAcres(areaAc: bigint): number {
    // areaAc is stored as (acres * 1e4)
    // ex: 0.051 ac * 1e4 = 510
    return Number(areaAc) / 1e4;
}

// For demo: classify "urban" vs "rural" based on landType/majorCategory/plotClass.
// You can refine this logic as you standardize data.
function isUrbanPlot(p: LandPlotView): boolean {
    const lt = (p.landType || "").toLowerCase();
    const pc = (p.plotClass || "").toLowerCase();

    // common urban keywords
    const urbanHints = ["urban", "throm", "core", "lap", "precinct", "commercial", "residential"];
    return urbanHints.some((k) => lt.includes(k) || pc.includes(k));
}

function toLocation(p: LandPlotView): string {
    return `${p.dzongkhag} | ${p.gewog}`;
}

function toThramNum(thram: string): number {
    const n = Number(thram);
    return Number.isFinite(n) ? n : 0;
}

function plotViewToPlotRow(p: LandPlotView): PlotRow {
    const thramNum = toThramNum(p.thram);
    const location = toLocation(p);

    const urban = isUrbanPlot(p);

    // Your UI expects:
    // - Urban netArea in sq.ft
    // - Rural netArea in acres
    //
    // BUT contract only stores acres (areaAc).
    // So for urban, we approximate sqft = acres * 43560.
    // If you want exact sqft, store it separately on-chain later.
    const acres = acresTimes1e4ToAcres(p.areaAc);
    const netArea = urban ? Math.round(acres * 43560) : Number(acres.toFixed(2));

    return {
        plotId: p.plotId,
        thram: thramNum,
        location,
        netArea,

        landType: urban ? undefined : p.landType,
        plotClass: urban ? undefined : p.plotClass,
        precinct: urban ? p.landType : undefined, // use landType as precinct label
        lap: urban ? p.plotClass : undefined, // use plotClass as LAP label

        mortgage: "No", // not in contract yet
        structure: "No", // not in contract yet
        acquired: "Yes", // default demo
        remarks: `Land Value: ${p.landValue.toString()} | Tokens allocated: ${ethers.formatUnits(
            p.allocatedTokens,
            18
        )}`,
        action: undefined,
        isRural: !urban,
    };
}

function buildUiShapes(params: {
    account: string;
    ownerLabel: string;
    plotViews: LandPlotView[];
    structureDetails: StructureDetails;
}): LandHoldings {
    const { account, ownerLabel, plotViews, structureDetails } = params;

    const rows = plotViews.map(plotViewToPlotRow);

    // group by thram
    const byThram = new Map<number, PlotRow[]>();
    for (const r of rows) {
        byThram.set(r.thram, [...(byThram.get(r.thram) ?? []), r]);
    }

    const tramDetails: Record<number, ThramDetails> = {};
    const urbanLands: LandSummaryRow[] = [];
    const ruralLands: LandSummaryRow[] = [];

    let uIdx = 1;
    let rIdx = 1;

    for (const [thram, ps] of [...byThram.entries()].sort((a, b) => a[0] - b[0])) {
        const isRural = Boolean(ps[0]?.isRural);
        const totalArea = ps.reduce((s, p) => s + (p.netArea || 0), 0);

        tramDetails[thram] = {
            location: ps[0].location,
            ownerType: "OWNER",
            owner: ownerLabel,
            plots: ps,
            totalArea,
            isRural,
        };

        const row: LandSummaryRow = {
            id: isRural ? rIdx++ : uIdx++,
            location: ps[0].location,
            thram,
            owners: ownerLabel,
            ownershipType: "On-chain",
            netArea: totalArea,
        };

        if (isRural) ruralLands.push(row);
        else urbanLands.push(row);
    }

    // totals:
    const urbanTotalSqft = urbanLands.reduce((s, r) => s + r.netArea, 0);
    const ruralTotalAcres = ruralLands.reduce((s, r) => s + r.netArea, 0);

    const urbanAsAcres = urbanTotalSqft / 43560;
    const totalAcres = Number((urbanAsAcres + ruralTotalAcres).toFixed(2));

    return {
        account,
        urbanLands,
        ruralLands,
        tramDetails,
        structureDetails,
        totals: { urbanTotalSqft, ruralTotalAcres, totalAcres },
    };
}

// ---------- PUBLIC API ----------

/**
 * Get land holdings for the CURRENT MetaMask account.
 *
 * mode:
 *  - "registered" (default): plots registered to wallet via getWalletPlots + plots(plotId)
 *  - "token" : plots where user holds tokens from plot via getMyInfo()
 *  - "both"  : union of both sets
 */
export async function fetchLandHoldings(opts?: {
    mode?: "registered" | "token" | "both";
    ownerLabel?: string; // UI label
}): Promise<LandHoldings> {
    const mode = opts?.mode ?? "registered";

    const { provider, contract } = await getProviderAndContract();
    const account = await getConnectedAccount(provider);
    if (!account) throw new Error("Connect MetaMask first.");

    const ownerLabel = opts?.ownerLabel ?? account;

    const plotMap = new Map<string, LandPlotView>();

    // A) registered plots
    if (mode === "registered" || mode === "both") {
        const ids: string[] = await contract.getWalletPlots(account);
        const views = await Promise.all(
            ids.map(async (pid) => {
                // public mapping getter: plots(pid)
                const p = await contract.plots(pid);

                // ethers returns tuple-like object; map fields explicitly
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
                    myTokensFromThisPlot: 0n,
                    wallet: p.wallet,
                    exists: Boolean(p.exists),
                };

                return view;
            })
        );

        for (const v of views) plotMap.set(v.plotId, v);
    }

    // B) token-origin holdings
    if (mode === "token" || mode === "both") {
        const res = await contract.getMyInfo();
        // getMyInfo returns: (..., string[] myPlots, LandPlotView[] fullPlotDetails)
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

            // merge: if already exists from registered, just add token info
            const existing = plotMap.get(view.plotId);
            if (existing) {
                plotMap.set(view.plotId, { ...existing, myTokensFromThisPlot: view.myTokensFromThisPlot });
            } else {
                plotMap.set(view.plotId, view);
            }
        }
    }

    // Structures: still off-chain in your UI; keep as-is (until you store PLR/structures on-chain)
    const structureDetails: StructureDetails = {
        "SP1-631": {
            plotId: "SP1-631",
            landShare: "1982 sq.ft",
            structures: [
                {
                    buildingNo: 18669,
                    flatNo: "1-01",
                    plr: 991,
                    ownerType: "Individual",
                    ownerDetail: ownerLabel,
                    flatType: "Commercial",
                    mortgage: "No",
                    active: true,
                },
                {
                    buildingNo: 18669,
                    flatNo: "1-02",
                    plr: 991,
                    ownerType: "Individual",
                    ownerDetail: ownerLabel,
                    flatType: "Residential",
                    mortgage: "Yes",
                    active: false,
                },
            ],
        },
    };

    return buildUiShapes({
        account,
        ownerLabel,
        plotViews: [...plotMap.values()].filter((p) => p.exists),
        structureDetails,
    });
}

/**
 * Realtime refresh on each new block (same pattern as your dashboard service)
 */
export async function subscribeLandHoldings(
    onUpdate: (data: LandHoldings) => void,
    opts?: { mode?: "registered" | "token" | "both"; ownerLabel?: string }
): Promise<() => void> {
    const { provider } = await getProviderAndContract();
    let alive = true;

    const handler = async () => {
        if (!alive) return;
        try {
            const data = await fetchLandHoldings(opts);
            if (alive) onUpdate(data);
        } catch {
            // ignore noisy errors
        }
    };

    void handler();
    provider.on("block", handler);

    return () => {
        alive = false;
        provider.off("block", handler);
    };
}
