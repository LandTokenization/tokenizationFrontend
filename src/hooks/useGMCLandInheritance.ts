import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import GMCLandABI from "../abi/GMCLandCompensation.json";

export type PlotRow = {
    plotId: string;
    ownerName: string;
    ownerCid: string;
    dzongkhag: string;
    gewog: string;
    thram: string;
    ownType: string;
    majorCategory: string;
    landType: string;
    plotClass: string;
    areaAc: string;
    landValue: string;
    allocatedTokens: string;
    wallet: string;
    exists: boolean;
};

export type InheritancePlan = {
    nominee: string;
    status: number; // 0 NONE, 1 ACTIVE, 2 DECEASED, 3 CLAIMED
    activatedAt: bigint;
    deceasedAt: bigint;
    claimedAt: bigint;
};

export type UiStatus =
    | { type: "idle" }
    | { type: "loading"; message: string }
    | { type: "success"; message: string }
    | { type: "error"; message: string };

type LandPlotViewRaw = {
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
    areaAc: bigint;
    landValue: bigint;
    allocatedTokens: bigint;
    myTokensFromThisPlot: bigint;
    wallet: string;
    exists: boolean;
};

type InheritancePlanRaw = {
    nominee: string;
    status: bigint;
    activatedAt: bigint;
    deceasedAt: bigint;
    claimedAt: bigint;
};

function parseEthersError(err: any) {
    return (
        err?.shortMessage ||
        err?.reason ||
        err?.info?.error?.message ||
        err?.message ||
        "Transaction failed."
    );
}

async function getProvider() {
    if (!(window as any).ethereum) {
        throw new Error("No wallet found. Install MetaMask / Rainbow / WalletConnect.");
    }
    return new ethers.BrowserProvider((window as any).ethereum);
}

export function useGMCLandInheritance(contractAddress: string) {
    const [status, setStatus] = useState<UiStatus>({ type: "idle" });
    const [plots, setPlots] = useState<PlotRow[]>([]);
    const [plans, setPlans] = useState<Record<string, InheritancePlan>>({});
    const [connectedAddress, setConnectedAddress] = useState<string>("");

    const canUse = useMemo(
        () => Boolean(contractAddress) && contractAddress !== "0xYourContractAddressHere",
        [contractAddress]
    );

    const getContract = useCallback(
        async (readOnly: boolean) => {
            const provider = await getProvider();
            if (readOnly) return new ethers.Contract(contractAddress, GMCLandABI.abi, provider);
            const signer = await provider.getSigner();
            return new ethers.Contract(contractAddress, GMCLandABI.abi, signer);
        },
        [contractAddress]
    );

    const loadConnected = useCallback(async () => {
        try {
            const provider = await getProvider();
            const signer = await provider.getSigner();
            setConnectedAddress(await signer.getAddress());
        } catch {
            setConnectedAddress("");
        }
    }, []);

    const loadAllPlots = useCallback(async () => {
        const c = await getContract(true);
        const res = (await c.getAllPlotsForAdmin()) as LandPlotViewRaw[];

        const normalized: PlotRow[] = (res ?? []).map((p) => ({
            plotId: p.plotId,
            ownerName: p.ownerName,
            ownerCid: p.ownerCid,
            dzongkhag: p.dzongkhag,
            gewog: p.gewog,
            thram: p.thram,
            ownType: p.ownType,
            majorCategory: p.majorCategory,
            landType: p.landType,
            plotClass: p.plotClass,
            areaAc: p.areaAc.toString(),
            landValue: p.landValue.toString(),
            allocatedTokens: p.allocatedTokens.toString(),
            wallet: p.wallet,
            exists: p.exists,
        }));

        setPlots(normalized);
        return normalized.map((x) => x.plotId);
    }, [getContract]);

    const loadPlans = useCallback(
        async (plotIds: string[]) => {
            const c = await getContract(true);

            const next: Record<string, InheritancePlan> = {};
            for (const pid of plotIds) {
                const raw = (await c.inheritancePlans(pid)) as InheritancePlanRaw;
                next[pid] = {
                    nominee: raw.nominee,
                    status: Number(raw.status),
                    activatedAt: raw.activatedAt,
                    deceasedAt: raw.deceasedAt,
                    claimedAt: raw.claimedAt,
                };
            }

            setPlans(next);
        },
        [getContract]
    );

    const refreshAll = useCallback(async () => {
        if (!canUse) {
            setStatus({ type: "error", message: "Contract address missing/invalid." });
            return;
        }

        try {
            setStatus({ type: "loading", message: "Loading inheritance data..." });
            await loadConnected();
            const ids = await loadAllPlots();
            await loadPlans(ids);
            setStatus({ type: "idle" });
        } catch (e: any) {
            setStatus({ type: "error", message: parseEthersError(e) });
        }
    }, [canUse, loadConnected, loadAllPlots, loadPlans]);

    const refreshOne = useCallback(
        async (plotId: string) => {
            const c = await getContract(true);

            // plan
            const raw = (await c.inheritancePlans(plotId)) as InheritancePlanRaw;
            setPlans((prev) => ({
                ...prev,
                [plotId]: {
                    nominee: raw.nominee,
                    status: Number(raw.status),
                    activatedAt: raw.activatedAt,
                    deceasedAt: raw.deceasedAt,
                    claimedAt: raw.claimedAt,
                },
            }));

            // plot wallet might change after claim
            const p = await c.plots(plotId);
            setPlots((prev) => prev.map((row) => (row.plotId === plotId ? { ...row, wallet: p.wallet } : row)));
        },
        [getContract]
    );

    const setNominee = useCallback(
        async (plotId: string, nominee: string) => {
            try {
                setStatus({ type: "loading", message: "Setting nominee..." });
                const c = await getContract(false);
                const tx = await c.setNomineeForPlot(plotId, nominee);
                await tx.wait();
                setStatus({ type: "success", message: "Nominee set." });
                await refreshOne(plotId);
                setTimeout(() => setStatus({ type: "idle" }), 1500);
            } catch (e: any) {
                setStatus({ type: "error", message: parseEthersError(e) });
            }
        },
        [getContract, refreshOne]
    );

    const clearNominee = useCallback(
        async (plotId: string) => {
            try {
                setStatus({ type: "loading", message: "Clearing nominee..." });
                const c = await getContract(false);
                const tx = await c.clearNomineeForPlot(plotId);
                await tx.wait();
                setStatus({ type: "success", message: "Nominee cleared." });
                await refreshOne(plotId);
                setTimeout(() => setStatus({ type: "idle" }), 1500);
            } catch (e: any) {
                setStatus({ type: "error", message: parseEthersError(e) });
            }
        },
        [getContract, refreshOne]
    );

    const declareDeceased = useCallback(
        async (plotId: string) => {
            try {
                setStatus({ type: "loading", message: "Declaring deceased (admin only)..." });
                const c = await getContract(false);
                const tx = await c.declarePlotOwnerDeceased(plotId);
                await tx.wait();
                setStatus({ type: "success", message: "Declared deceased. Nominee can claim." });
                await refreshOne(plotId);
                setTimeout(() => setStatus({ type: "idle" }), 1500);
            } catch (e: any) {
                setStatus({ type: "error", message: parseEthersError(e) });
            }
        },
        [getContract, refreshOne]
    );

    // Behavior B
    const claimWithTokens = useCallback(
        async (plotId: string, newWallet: string) => {
            try {
                setStatus({ type: "loading", message: "Claiming plot + transferring tokens..." });
                const c = await getContract(false);
                const tx = await c.claimPlotAsNomineeWithTokens(plotId, newWallet);
                await tx.wait();
                setStatus({ type: "success", message: "Claimed. Wallet updated and tokens transferred." });
                await refreshOne(plotId);
                setTimeout(() => setStatus({ type: "idle" }), 1500);
            } catch (e: any) {
                setStatus({ type: "error", message: parseEthersError(e) });
            }
        },
        [getContract, refreshOne]
    );

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    return {
        status,
        plots,
        plans,
        connectedAddress,
        refreshAll,
        refreshOne,
        setNominee,
        clearNominee,
        declareDeceased,
        claimWithTokens,
    };

}
