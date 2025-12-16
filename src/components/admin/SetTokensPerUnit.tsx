import React, { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

// ✅ Use the SAME ABI source as AdminLandPage
import GMCLandABI from "../../../../web3/artifacts/contracts/GMCLandCompensation.sol/GMCLandCompensation.json";

type Props = {
    contractAddress: string;
    onUpdated?: () => Promise<void> | void;
};

export default function SetTokensPerUnit({
    contractAddress,
    onUpdated,
}: Props) {
    const [humanRate, setHumanRate] = useState<string>("");
    const [currentRateRaw, setCurrentRateRaw] = useState<bigint>(0n);

    const [status, setStatus] = useState<
        { type: "idle" | "loading" | "success" | "error"; message?: string }
    >({ type: "idle" });

    const canSubmit = useMemo(() => {
        return Number(humanRate) > 0;
    }, [humanRate]);

    // -------------------------
    // Helpers
    // -------------------------

    async function getContract(readOnly = false) {
        if (!(window as any).ethereum) {
            throw new Error("No wallet found. Install MetaMask / Rainbow / WalletConnect.");
        }

        const provider = new ethers.BrowserProvider((window as any).ethereum);

        if (readOnly) {
            return new ethers.Contract(
                contractAddress,
                GMCLandABI.abi,
                provider
            );
        }

        const signer = await provider.getSigner();
        return new ethers.Contract(
            contractAddress,
            GMCLandABI.abi,
            signer
        );
    }

    // -------------------------
    // Load current rate
    // -------------------------

    async function loadCurrentRate() {
        try {
            const c = await getContract(true);
            const rate: bigint = await c.tokensPerUnit();
            setCurrentRateRaw(rate);
        } catch {
            setCurrentRateRaw(0n);
        }
    }

    useEffect(() => {
        loadCurrentRate();
    }, []);

    const currentRateHuman = useMemo(() => {
        try {
            return ethers.formatUnits(currentRateRaw, 18);
        } catch {
            return "0";
        }
    }, [currentRateRaw]);

    // -------------------------
    // Set rate (owner-only)
    // -------------------------

    const handleSetRate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!canSubmit) {
                throw new Error("Rate must be greater than zero.");
            }

            setStatus({ type: "loading", message: "Sending transaction..." });

            // 🔁 Human → 18 decimals
            const rateWei = ethers.parseUnits(humanRate, 18);

            const c = await getContract(false);
            const tx = await c.setTokensPerUnit(rateWei);

            setStatus({ type: "loading", message: "Waiting for confirmation..." });
            await tx.wait();

            setStatus({
                type: "success",
                message: `Token rate set to ${humanRate} GMCLT per land unit.`,
            });

            setHumanRate("");
            await loadCurrentRate();
            if (onUpdated) await onUpdated();

            setTimeout(() => setStatus({ type: "idle" }), 2500);
        } catch (err: any) {
            const msg =
                err?.shortMessage || err?.reason || err?.message || "Transaction failed.";
            setStatus({ type: "error", message: msg });
        }
    };

    // -------------------------
    // UI
    // -------------------------

    return (
        <div className="rounded-xl bg-slate-900/60 border border-slate-700/60 p-6 shadow-lg backdrop-blur space-y-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold text-slate-100">
                        Token Rate Settings
                    </h3>
                    <p className="text-xs text-slate-400">
                        Defines how many <span className="font-mono">GMCLT</span> tokens
                        are minted per <strong>1 unit</strong> of land value.
                    </p>
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                    owner-only
                </span>
            </div>

            {/* Current Rate */}
            <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Current rate:</span>
                <span className="font-mono text-amber-400">
                    {currentRateHuman}
                </span>
                <span className="text-slate-500">GMCLT / unit</span>
            </div>

            {status.type !== "idle" && (
                <div
                    className={[
                        "rounded-lg border px-4 py-3 text-sm",
                        status.type === "loading" &&
                        "border-slate-700/60 bg-slate-900/50 text-slate-200",
                        status.type === "success" &&
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                        status.type === "error" &&
                        "border-red-500/30 bg-red-500/10 text-red-300",
                    ].join(" ")}
                >
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSetRate} className="flex flex-col md:flex-row gap-3">
                <input
                    type="number"
                    min={0}
                    step="any"
                    className="flex-1 px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                    placeholder="e.g. 1, 10, 250"
                    value={humanRate}
                    onChange={(e) => setHumanRate(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={!canSubmit || status.type === "loading"}
                    className={[
                        "px-5 py-2 rounded-md text-sm font-medium shadow-sm transition whitespace-nowrap",
                        !canSubmit || status.type === "loading"
                            ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                            : "bg-amber-400/90 hover:bg-amber-400 text-slate-900",
                    ].join(" ")}
                >
                    Set Token Rate
                </button>
            </form>

            <p className="text-[11px] text-slate-500">
                Example: entering <span className="font-mono">1</span> means
                <strong> 1 GMCLT</strong> is minted per land-value unit.
                Internally this is stored as <span className="font-mono">1e18</span>.
            </p>
        </div>
    );
}
