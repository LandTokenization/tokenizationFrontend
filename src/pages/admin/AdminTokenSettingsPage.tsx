import  { useMemo, useState } from "react";
import { ethers } from "ethers";
import { useGMCLandInheritance } from "../../hooks/useGMCLandInheritance";
import type { PlotRow } from "../../hooks/useGMCLandInheritance";

const CONTRACT_ADDRESS =
    import.meta.env.VITE_GMC_LAND_CONTRACT_ADDRESS || "0xYourContractAddressHere";

function isAddr(a: string) {
    try {
        return ethers.isAddress(a);
    } catch {
        return false;
    }
}

function statusLabel(s: number) {
    if (s === 0) return { text: "None", tone: "text-slate-400" };
    if (s === 1) return { text: "Active", tone: "text-amber-300" };
    if (s === 2) return { text: "Deceased", tone: "text-red-300" };
    if (s === 3) return { text: "Claimed", tone: "text-emerald-300" };
    return { text: `Unknown(${s})`, tone: "text-slate-300" };
}

function matchesSearch(p: PlotRow, q: string) {
    const s = q.trim().toLowerCase();
    if (!s) return true;

    const hay = [
        p.plotId,
        p.ownerName,
        p.ownerCid,
        p.dzongkhag,
        p.gewog,
        p.thram,
        p.wallet,
        p.ownType,
        p.majorCategory,
        p.landType,
        p.plotClass,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return hay.includes(s);
}

export default function AdminInheritancePage() {
    const {
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
    } = useGMCLandInheritance(CONTRACT_ADDRESS);

    const [nomineeInput, setNomineeInput] = useState<Record<string, string>>({});
    const [newWalletInput, setNewWalletInput] = useState<Record<string, string>>({});
    const [query, setQuery] = useState<string>("");
    const [appliedQuery, setAppliedQuery] = useState<string>("");

    // Apply search only when user clicks Search (faster for big data)
    const filteredPlots = useMemo(() => {
        return plots.filter((p) => matchesSearch(p, appliedQuery));
    }, [plots, appliedQuery]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Land Inheritance</h1>
                    <p className="text-sm text-slate-400">
                        Behavior B: nominee claim will also transfer plot-tagged GMCLT tokens to the new wallet.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Connected: <span className="font-mono">{connectedAddress || "Not connected"}</span>
                    </p>
                </div>

                {/* Search Row */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                        <input
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                            placeholder="Search plots by Plot ID, Owner, CID, Thram, Dzongkhag, Gewog, Wallet..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="mt-1 text-[11px] text-slate-500">
                            Showing <span className="text-slate-300">{filteredPlots.length}</span> of{" "}
                            <span className="text-slate-300">{plots.length}</span> plots
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setAppliedQuery(query)}
                            className="px-4 py-2 rounded-md text-sm font-medium bg-amber-400/90 hover:bg-amber-400 text-slate-900 transition"
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setAppliedQuery("");
                            }}
                            className="px-4 py-2 rounded-md text-sm font-medium border border-slate-700/60 text-slate-200 hover:bg-slate-800/60 transition"
                            disabled={!query && !appliedQuery}
                        >
                            Clear Search
                        </button>

                        <button
                            type="button"
                            onClick={refreshAll}
                            className="px-4 py-2 rounded-md text-sm font-medium border border-slate-700/60 text-slate-200 hover:bg-slate-800/60 transition"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Status */}
                {status.type !== "idle" && (
                    <div
                        className={[
                            "rounded-lg border px-4 py-3 text-sm",
                            status.type === "loading" &&
                            "border-slate-700/60 bg-slate-900/50 text-slate-200 backdrop-blur",
                            status.type === "success" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                            status.type === "error" && "border-red-500/30 bg-red-500/10 text-red-300",
                        ].join(" ")}
                    >
                        {"message" in status ? status.message : null}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-700/60 shadow-lg backdrop-blur">
                <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-100">Inheritance Registry</h2>
                    <span className="text-xs text-slate-500">Switch wallets depending on action</span>
                </div>

                <div className="max-h-[640px] overflow-auto">
                    <table className="min-w-full text-sm">
                        <thead className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="px-5 py-3 text-left font-medium">Plot</th>
                                <th className="px-5 py-3 text-left font-medium">Current Wallet</th>
                                <th className="px-5 py-3 text-left font-medium">Nominee</th>
                                <th className="px-5 py-3 text-left font-medium">Status</th>
                                <th className="px-5 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/70">
                            {filteredPlots.map((p: PlotRow, idx: number) => {
                                const plan = plans[p.plotId];
                                const s = plan?.status ?? 0;
                                const label = statusLabel(s);

                                const nominee = plan?.nominee || "";
                                const nomineeSet = nominee && nominee !== ethers.ZeroAddress;

                                const canDeclare = s === 1; // ACTIVE
                                const canClaim = s === 2; // DECEASED

                                return (
                                    <tr
                                        key={p.plotId}
                                        className={[
                                            "transition",
                                            idx % 2 === 0 ? "bg-slate-900/30" : "bg-slate-900/10",
                                            "hover:bg-slate-800/40",
                                        ].join(" ")}
                                    >
                                        <td className="px-5 py-4 align-top">
                                            <div className="font-mono text-slate-200">{p.plotId}</div>
                                            <div className="mt-1 text-[11px] text-slate-500">
                                                {p.ownerName} • CID {p.ownerCid}
                                            </div>
                                            <div className="mt-1 text-[11px] text-slate-500">
                                                {p.dzongkhag} • {p.gewog} • Thram {p.thram}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 align-top">
                                            <div className="font-mono text-xs text-slate-200 truncate max-w-[260px]" title={p.wallet}>
                                                {p.wallet}
                                            </div>
                                            <div className="mt-1 text-[11px] text-slate-500">Registered plot wallet</div>
                                        </td>

                                        <td className="px-5 py-4 align-top">
                                            <div
                                                className="font-mono text-xs text-slate-200 truncate max-w-[260px]"
                                                title={nomineeSet ? nominee : "Not set"}
                                            >
                                                {nomineeSet ? nominee : "Not set"}
                                            </div>

                                            <div className="mt-3 flex flex-col gap-2">
                                                <input
                                                    className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-xs focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500 font-mono"
                                                    placeholder="Nominee address 0x..."
                                                    value={nomineeInput[p.plotId] ?? ""}
                                                    onChange={(e) =>
                                                        setNomineeInput((prev) => ({ ...prev, [p.plotId]: e.target.value }))
                                                    }
                                                />

                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const v = (nomineeInput[p.plotId] || "").trim();
                                                            if (!isAddr(v)) return;
                                                            setNominee(p.plotId, v);
                                                        }}
                                                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-amber-400/90 hover:bg-amber-400 text-slate-900 transition"
                                                        title="Requires: connect as current plot wallet"
                                                    >
                                                        Set nominee
                                                    </button>

                                                    {/* ✅ Disabled if nominee not set */}
                                                    <button
                                                        type="button"
                                                        disabled={!nomineeSet}
                                                        onClick={() => clearNominee(p.plotId)}
                                                        className={[
                                                            "px-3 py-1.5 rounded-md text-xs font-medium transition",
                                                            nomineeSet
                                                                ? "border border-slate-700/60 text-slate-200 hover:bg-slate-800/60"
                                                                : "border border-slate-800 text-slate-600 cursor-not-allowed",
                                                        ].join(" ")}
                                                        title={
                                                            nomineeSet
                                                                ? "Requires: connect as current plot wallet"
                                                                : "No nominee set yet"
                                                        }
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 align-top">
                                            <div className={`text-sm font-semibold ${label.tone}`}>{label.text}</div>
                                            <div className="mt-1 text-[11px] text-slate-500">
                                                {label.text === "Active" && "Nominee configured"}
                                                {label.text === "Deceased" && "Nominee can claim now"}
                                                {label.text === "Claimed" && "Wallet updated + tokens transferred"}
                                                {label.text === "None" && "No nominee plan"}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-right align-top">
                                            <div className="flex flex-col gap-2 items-end">
                                                <button
                                                    type="button"
                                                    disabled={!canDeclare}
                                                    onClick={() => declareDeceased(p.plotId)}
                                                    className={[
                                                        "px-3 py-1.5 rounded-md text-xs font-medium transition",
                                                        canDeclare
                                                            ? "border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                                                            : "border border-slate-800 text-slate-600 cursor-not-allowed",
                                                    ].join(" ")}
                                                    title="Admin only (owner). Requires ACTIVE nominee."
                                                >
                                                    Declare deceased
                                                </button>

                                                <div className="w-full max-w-[280px]">
                                                    <input
                                                        className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-xs focus:ring-2 focus:ring-emerald-400/30 focus:outline-none placeholder:text-slate-500 font-mono"
                                                        placeholder="New wallet 0x..."
                                                        value={newWalletInput[p.plotId] ?? ""}
                                                        onChange={(e) =>
                                                            setNewWalletInput((prev) => ({ ...prev, [p.plotId]: e.target.value }))
                                                        }
                                                        disabled={!canClaim}
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={!canClaim}
                                                    onClick={() => {
                                                        const v = (newWalletInput[p.plotId] || "").trim();
                                                        if (!isAddr(v)) return;
                                                        claimWithTokens(p.plotId, v);
                                                    }}
                                                    className={[
                                                        "px-3 py-1.5 rounded-md text-xs font-medium transition",
                                                        canClaim
                                                            ? "bg-emerald-500/90 hover:bg-emerald-500 text-slate-900"
                                                            : "bg-slate-800 text-slate-600 cursor-not-allowed",
                                                    ].join(" ")}
                                                    title="Nominee only. Requires DECEASED status."
                                                >
                                                    Claim + transfer tokens
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => refreshOne(p.plotId)}
                                                    className="px-3 py-1.5 rounded-md text-xs font-medium border border-slate-700/60 text-slate-200 hover:bg-slate-800/60 transition"
                                                >
                                                    Refresh
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {!filteredPlots.length && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-slate-500 italic">
                                        {plots.length ? "No matches for your search." : "No plots found on-chain."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-slate-800/60">
                    <p className="text-xs text-slate-500">
                        If a button is disabled, your current wallet doesn’t satisfy the contract requirement for that action.
                    </p>
                </div>
            </div>
        </div>
    );
}
