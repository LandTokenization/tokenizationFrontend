import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

import GMCLandABI from "../abi/GMCLandCompensation.json";
export type LandPlotRow = {
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
    areaAcTimes1e4: string;
    landValue: string;
    allocatedTokens: string;
    wallet: string;
    exists: boolean;
};

export type RegisterPlotInput = {
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
    areaAcTimes1e4: string; // string from form
    landValue: string;      // string from form
    wallet: string;
};

type Status =
    | { type: "idle" }
    | { type: "loading"; message: string }
    | { type: "success"; message: string }
    | { type: "error"; message: string };

function safeBigInt(value: string) {
    if (!value || value.trim() === "") return 0n;
    return BigInt(value);
}

function normalizePlot(p: any): LandPlotRow {
    return {
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
        areaAcTimes1e4: (p.areaAc as bigint).toString(),
        landValue: (p.landValue as bigint).toString(),
        allocatedTokens: (p.allocatedTokens as bigint).toString(),
        wallet: p.wallet,
        exists: p.exists,
    };
}

// Centralized error parser (so your UI doesn’t deal with ethers error shapes)
function parseEthersError(err: any) {
    return (
        err?.shortMessage ||
        err?.reason ||
        err?.info?.error?.message ||
        err?.message ||
        "Transaction failed."
    );
}

export function useGMCLandContract(contractAddress: string) {
    const [records, setRecords] = useState<LandPlotRow[]>([]);
    const [tokensPerUnit, setTokensPerUnit] = useState<bigint>(0n);
    const [status, setStatus] = useState<Status>({ type: "idle" });

    const hasWallet = useMemo(() => Boolean((window as any)?.ethereum), []);

    const getProvider = useCallback(() => {
        if (!(window as any).ethereum) {
            throw new Error("No wallet found. Install MetaMask/Rainbow or connect via WalletConnect.");
        }
        return new ethers.BrowserProvider((window as any).ethereum);
    }, []);

    const getContract = useCallback(
        async (readOnly: boolean) => {
            const provider = getProvider();
            if (readOnly) return new ethers.Contract(contractAddress, GMCLandABI.abi, provider);
            const signer = await provider.getSigner();
            return new ethers.Contract(contractAddress, GMCLandABI.abi, signer);
        },
        [contractAddress, getProvider]
    );

    const loadTokensPerUnit = useCallback(async (): Promise<void> => {
        try {
            const c = await getContract(true);
            const rate: bigint = await c.tokensPerUnit();
            setTokensPerUnit(rate);
        } catch {
            setTokensPerUnit(0n);
        }
    }, [getContract]);


    const fetchPlot = useCallback(
        async (plotId: string) => {
            const c = await getContract(true);
            const p = await c.plots(plotId);
            return normalizePlot(p);
        },
        [getContract]
    );

    const getAllPlots = useCallback(async () => {
        const c = await getContract(true);
        const plots = await c.getAllPlotsForAdmin();
        // if contract returns structs array, normalize them
        const normalized: LandPlotRow[] = (plots || []).map((p: any) => normalizePlot(p));
        setRecords(normalized);
        return normalized;
    }, [getContract]);

    const registerPlot = useCallback(
        async (input: RegisterPlotInput) => {
            setStatus({ type: "loading", message: "Sending transaction..." });

            try {
                const c = await getContract(false);

                const tx = await c.registerLandPlot(
                    input.plotId.trim(),
                    input.dzongkhag.trim(),
                    input.gewog.trim(),
                    input.thram.trim(),
                    input.ownerName.trim(),
                    input.ownerCid.trim(),
                    input.ownType.trim(),
                    input.majorCategory.trim(),
                    input.landType.trim(),
                    input.plotClass.trim(),
                    safeBigInt(input.areaAcTimes1e4),
                    safeBigInt(input.landValue),
                    input.wallet.trim()
                );

                setStatus({ type: "loading", message: "Waiting for confirmation..." });
                await tx.wait();

                const row = await fetchPlot(input.plotId.trim());
                if (!row.exists) throw new Error("Transaction succeeded but plot exists=false (unexpected).");

                setRecords((prev) => {
                    const idx = prev.findIndex((r) => r.plotId === row.plotId);
                    if (idx >= 0) {
                        const copy = [...prev];
                        copy[idx] = row;
                        return copy;
                    }
                    return [row, ...prev];
                });

                setStatus({ type: "success", message: "Plot registered on-chain and table updated." });
                return row;
            } catch (err: any) {
                const msg = parseEthersError(err);
                setStatus({ type: "error", message: msg });
                throw err;
            }
        },
        [fetchPlot, getContract]
    );

    const removeLocal = useCallback((plotId: string) => {
        setRecords((prev) => prev.filter((r) => r.plotId !== plotId));
    }, []);

    // convenience: reset status
    const resetStatus = useCallback(() => setStatus({ type: "idle" }), []);

    // initial load
    useEffect(() => {
        (async () => {
            try {
                await Promise.all([getAllPlots(), loadTokensPerUnit()]);
            } catch (e) {
                // keep UI clean; status is set by calls if needed
            }
        })();
    }, [getAllPlots, loadTokensPerUnit]);

    return {
        hasWallet,
        records,
        tokensPerUnit,
        status,
        resetStatus,
        loadTokensPerUnit,
        getAllPlots,
        fetchPlot,
        registerPlot,
        removeLocal,
    };
}
