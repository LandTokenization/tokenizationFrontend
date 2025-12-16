import React, { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import SetTokensPerUnit from "../../components/admin/SetTokensPerUnit";

import GMCLandABI from "../../../../web3/artifacts/contracts/GMCLandCompensation.sol/GMCLandCompensation.json";


const CONTRACT_ADDRESS =
    import.meta.env.VITE_GMC_LAND_CONTRACT_ADDRESS || "0xYourContractAddressHere";

type LandPlotRow = {
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

type FormState = {
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
    wallet: string;
};

const emptyForm: FormState = {
    plotId: "",
    dzongkhag: "",
    gewog: "",
    thram: "",
    ownerName: "",
    ownerCid: "",
    ownType: "",
    majorCategory: "",
    landType: "",
    plotClass: "",
    areaAcTimes1e4: "",
    landValue: "",
    wallet: "",
};

function isHexAddressMaybe(addr: string) {
    try {
        return ethers.isAddress(addr);
    } catch {
        return false;
    }
}

function safeBigInt(value: string) {
    if (!value || value.trim() === "") return 0n;
    return BigInt(value);
}

function formatTokenHuman(value: string) {
    try {
        return ethers.formatUnits(value, 18);
    } catch {
        return "0";
    }
}



export default function AdminLandPage() {
    const [form, setForm] = useState<FormState>(emptyForm);
    const [records, setRecords] = useState<LandPlotRow[]>([]);
    const [tokensPerUnit, setTokensPerUnit] = useState<bigint>(0n);

    const [status, setStatus] = useState<
        { type: "idle" | "loading" | "success" | "error"; message?: string }
    >({ type: "idle" });

    const canRegister = useMemo(() => {
        return (
            form.plotId.trim() &&
            form.dzongkhag.trim() &&
            form.gewog.trim() &&
            form.thram.trim() &&
            form.ownerName.trim() &&
            form.ownerCid.trim() &&
            form.ownType.trim() &&
            form.majorCategory.trim() &&
            form.landType.trim() &&
            form.plotClass.trim() &&
            safeBigInt(form.areaAcTimes1e4) > 0n &&
            safeBigInt(form.landValue) > 0n &&
            isHexAddressMaybe(form.wallet)
        );
    }, [form]);

    const derivedTokensPreview = useMemo(() => {
        try {
            const lv = safeBigInt(form.landValue);
            if (lv <= 0n || tokensPerUnit <= 0n) return 0n;
            return lv * tokensPerUnit;
        } catch {
            return 0n;
        }
    }, [form.landValue, tokensPerUnit]);

    async function getContract(readOnly = false) {
        if (!(window as any).ethereum) {
            throw new Error(
                "No wallet found. Install MetaMask / Rainbow or connect via WalletConnect."
            );
        }

        const provider = new ethers.BrowserProvider((window as any).ethereum);

        if (readOnly) {
            return new ethers.Contract(
                CONTRACT_ADDRESS,
                GMCLandABI.abi,
                provider
            );
        }

        const signer = await provider.getSigner();
        return new ethers.Contract(
            CONTRACT_ADDRESS,
            GMCLandABI.abi,
            signer
        );
    }


    async function loadTokensPerUnit() {
        try {
            const c = await getContract(true);
            const rate: bigint = await c.tokensPerUnit();
            setTokensPerUnit(rate);
        } catch {
            setTokensPerUnit(0n);
        }
    }


    async function fetchPlot(plotId: string) {
        const c = await getContract(true);
        const p = await c.plots(plotId);

        const row: LandPlotRow = {
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

        return row;
    }

    async function getAllPlot() {
        const c = await getContract(true);
        const plots = await c.getAllPlotsForAdmin();
        setRecords(plots);
    }

    useEffect(() => {
        getAllPlot();
        loadTokensPerUnit();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        setStatus({ type: "loading", message: "Sending transaction..." });

        try {
            if (!canRegister) {
                throw new Error(
                    "Fill all required fields correctly (and wallet must be a valid address)."
                );
            }

            const c = await getContract(false);

            const tx = await c.registerLandPlot(
                form.plotId.trim(),
                form.dzongkhag.trim(),
                form.gewog.trim(),
                form.thram.trim(),
                form.ownerName.trim(),
                form.ownerCid.trim(),
                form.ownType.trim(),
                form.majorCategory.trim(),
                form.landType.trim(),
                form.plotClass.trim(),
                safeBigInt(form.areaAcTimes1e4),
                safeBigInt(form.landValue),
                form.wallet.trim()
            );

            setStatus({ type: "loading", message: "Waiting for confirmation..." });
            await tx.wait();

            const row = await fetchPlot(form.plotId.trim());

            if (!row.exists) {
                throw new Error(
                    "Transaction succeeded but plot read returned exists=false (unexpected)."
                );
            }

            setRecords((prev) => {
                const idx = prev.findIndex((r) => r.plotId === row.plotId);
                if (idx >= 0) {
                    const copy = [...prev];
                    copy[idx] = row;
                    return copy;
                }
                return [row, ...prev];
            });

            setForm(emptyForm);
            await loadTokensPerUnit();

            setStatus({
                type: "success",
                message: "Plot registered on-chain and table updated.",
            });
            setTimeout(() => setStatus({ type: "idle" }), 2500);
        } catch (err: any) {
            const msg =
                err?.shortMessage || err?.reason || err?.message || "Transaction failed.";
            setStatus({ type: "error", message: msg });
        }
    };



    const handleRemoveLocal = (plotId: string) => {
        // ⚠️ Contract has no delete. This only removes from UI.
        setRecords((prev) => prev.filter((r) => r.plotId !== plotId));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-100">
                    Land Plot Registry (On-chain)
                </h1>
                <p className="text-sm text-slate-400">
                    Registers land plots via{" "}
                    <span className="font-mono">registerLandPlot</span> (owner-only).
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/50 px-3 py-1 text-xs text-slate-300 backdrop-blur">
                        Contract: <span className="font-mono">{CONTRACT_ADDRESS}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/50 px-3 py-1 text-xs text-slate-300 backdrop-blur">
                        tokensPerUnit:{" "}
                        <span className="font-mono">{tokensPerUnit.toString()}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/50 px-3 py-1 text-xs text-slate-300 backdrop-blur">
                        Derived tokens preview:{" "}
                        <span className="font-mono">{derivedTokensPreview.toString()}</span>
                    </span>
                </div>

                {status.type !== "idle" && (
                    <div
                        className={[
                            "mt-4 rounded-lg border px-4 py-3 text-sm",
                            status.type === "loading" &&
                            "border-slate-700/60 bg-slate-900/50 text-slate-200 backdrop-blur",
                            status.type === "success" &&
                            "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                            status.type === "error" &&
                            "border-red-500/30 bg-red-500/10 text-red-300",
                        ].join(" ")}
                    >
                        {status.message}
                    </div>
                )}
            </div>
            {/* ✅ NEW: token rate card */}
            <SetTokensPerUnit
                contractAddress={CONTRACT_ADDRESS}
                onUpdated={loadTokensPerUnit}
            />
            {/* FORM CARD */}
            <form
                onSubmit={handleRegister}
                className="rounded-xl bg-slate-900/60 border border-slate-700/60 p-6 shadow-lg backdrop-blur space-y-6"
            >
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-100">
                        Register Land Plot
                    </h2>
                    <span className="text-xs text-slate-400">
                        Requires:{" "}
                        <span className="font-mono">tokensPerUnit &gt; 0</span> and owner
                        wallet connected
                    </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { label: "Plot ID *", name: "plotId", ph: `e.g. "GT1-4845"` },
                        { label: "Dzongkhag *", name: "dzongkhag", ph: `e.g. "Gelephu"` },
                        { label: "Gewog *", name: "gewog", ph: `e.g. "Gelephu Throm"` },
                        { label: "Thram *", name: "thram", ph: `e.g. "2583"` },
                        { label: "Owner Name *", name: "ownerName", ph: `e.g. "Sonia Ghalay"` },
                        { label: "Owner CID *", name: "ownerCid", ph: `e.g. "12008000663"` },
                        { label: "Ownership Type *", name: "ownType", ph: `e.g. "Family Ownership"` },
                        { label: "Major Category *", name: "majorCategory", ph: `e.g. "Private"` },
                        { label: "Land Type *", name: "landType", ph: `e.g. "Urban Core"` },
                        { label: "Plot Class *", name: "plotClass", ph: `e.g. "CLASS B"` },
                    ].map((f) => (
                        <div key={f.name} className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">
                                {f.label}
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                                placeholder={f.ph}
                                name={f.name}
                                value={(form as any)[f.name]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    {/* Area */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Area (ac × 1e4) *
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                            placeholder="e.g. 510 (means 0.051 ac)"
                            name="areaAcTimes1e4"
                            value={form.areaAcTimes1e4}
                            onChange={handleChange}
                        />
                        <p className="text-[11px] text-slate-500">
                            Contract expects integer:{" "}
                            <span className="font-mono">areaAcTimes1e4</span>
                        </p>
                    </div>

                    {/* Land Value */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Land Value (demo units) *
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                            placeholder="e.g. 2500000"
                            name="landValue"
                            value={form.landValue}
                            onChange={handleChange}
                        />
                        <p className="text-[11px] text-slate-500">
                            Minted tokens ={" "}
                            <span className="font-mono">landValue * tokensPerUnit</span>
                        </p>
                    </div>

                    {/* Wallet */}
                    <div className="space-y-1 md:col-span-3">
                        <label className="text-sm font-medium text-slate-300">
                            Wallet Address *
                        </label>
                        <input
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500 font-mono"
                            placeholder="0x..."
                            name="wallet"
                            value={form.wallet}
                            onChange={handleChange}
                        />
                        {form.wallet ? (
                            <p className="text-[11px] text-slate-500">
                                {isHexAddressMaybe(form.wallet)
                                    ? "Looks valid."
                                    : "Invalid address."}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!canRegister || status.type === "loading"}
                        className={[
                            "px-5 py-2 rounded-md text-sm font-medium shadow-sm transition",
                            !canRegister || status.type === "loading"
                                ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                                : "bg-amber-400/90 hover:bg-amber-400 text-slate-900",
                        ].join(" ")}
                    >
                        Register Plot On-chain
                    </button>
                </div>

                <p className="text-xs text-slate-500">
                    If you get <span className="font-mono">"Token rate not set"</span>,
                    call <span className="font-mono">setTokensPerUnit()</span> from the
                    owner wallet first.
                </p>
            </form>

            {/* TABLE CARD (dark, blended) */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-700/60 p-6 shadow-lg backdrop-blur">
                <h2 className="text-lg font-semibold text-slate-100 mb-2">
                    Registered Plots
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mb-4" />

                <div className="max-h-[420px] overflow-y-auto pr-1">
                    <table className="w-full text-sm text-slate-300">
                        <thead>
                            <tr className="border-b border-slate-700 text-slate-400">
                                <th className="py-3 font-medium">Plot ID</th>
                                <th className="py-3 font-medium">Owner</th>
                                <th className="py-3 font-medium">Location</th>
                                <th className="py-3 text-right font-medium">Area</th>
                                <th className="py-3 text-right font-medium">Land Value</th>
                                <th className="py-3 text-right font-medium">Tokens</th>
                                <th className="py-3 font-medium">Wallet</th>
                                <th className="py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {records.map((r) => (
                                <tr
                                    key={r.plotId}
                                    className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                                >
                                    <td className="py-3 font-mono text-slate-200">{r.plotId}</td>

                                    <td className="py-3">
                                        <div className="text-slate-200">{r.ownerName}</div>
                                        <div className="text-xs text-slate-500 font-mono">
                                            {r.ownerCid}
                                        </div>
                                    </td>

                                    <td className="py-3">
                                        <div className="text-slate-200">{r.dzongkhag}</div>
                                        <div className="text-xs text-slate-500">
                                            {r.gewog} • Thram {r.thram}
                                        </div>
                                    </td>

                                    <td className="py-3 text-right font-mono text-slate-300">
                                        {r.areaAcTimes1e4}
                                    </td>

                                    <td className="py-3 text-right font-mono text-slate-300">
                                        {r.landValue}
                                    </td>

                                    <td className="py-3 text-right font-mono text-amber-400">
                                        {formatTokenHuman(r.allocatedTokens)}
                                    </td>


                                    <td className="py-3 font-mono text-xs text-slate-400">
                                        {r.wallet ? `${r.wallet.slice(0, 6)}…${r.wallet.slice(-4)}` : ""}
                                    </td>

                                    <td className="py-3 text-right">
                                        <button
                                            onClick={() => handleRemoveLocal(r.plotId)}
                                            className="px-3 py-1 text-xs rounded-md border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition"
                                            title="No delete function exists on-chain; this only removes from the table."
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {!records.length && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-8 text-center text-slate-500 italic"
                                    >
                                        No plots registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                    This table isn’t a full on-chain index. To list *all* plots you need an
                    array of plotIds in the contract or an event indexer (subgraph/log
                    scan).
                </p>
            </div>
        </div>
    );
}
