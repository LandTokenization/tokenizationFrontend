import React, { useMemo, useState } from "react";
import { ethers } from "ethers";
import SetTokensPerUnit from "../../components/admin/SetTokensPerUnit";
import { useGMCLandContract } from "../../hooks/useGMCLandContract";

const CONTRACT_ADDRESS =
    import.meta.env.VITE_GMC_LAND_CONTRACT_ADDRESS || "0xYourContractAddressHere";

type FormState = {
    plotId: string;
    dzongkhag: string;
    gewog: string;
    thram: string;
    ownerName: string;
    ownerCid: string;

    ownType: string; // Ownership Type
    majorCategory: string; // Urban/Rural
    landType: string; // Urban: Precincts/LAPs, Rural: Dry/Wet/Orchard
    plotClass: string; // Urban: LAP list OR Precinct list, Rural: Class A1..D

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

    const {
        records,
        tokensPerUnit,
        status,
        resetStatus,
        loadTokensPerUnit,
        registerPlot,
        removeLocal,
    } = useGMCLandContract(CONTRACT_ADDRESS);

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

    // IMPORTANT: reset dependent selects
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => {
            if (name === "majorCategory") {
                return { ...prev, majorCategory: value, landType: "", plotClass: "" };
            }
            if (name === "landType") {
                return { ...prev, landType: value, plotClass: "" };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        resetStatus();

        if (!canRegister) return;

        try {
            await registerPlot(form);
            setForm(emptyForm);
            // If your hook returns Promise<bigint>, this still works;
            // If TypeScript complains with SetTokensPerUnit, wrap in a void-return
            await loadTokensPerUnit();
            setTimeout(() => resetStatus(), 2500);
        } catch {
            // error already handled in hook status
        }
    };

    // Options
    const ownershipOptions = [
        "Individual Ownership",
        "Joint Ownership",
        "Family Land",
    ];

    const lapOptions = [
        "CORE LAP",
        "LAP 1",
        "LAP 2",
        "LAP 3",
        "LAP 4",
        "LAP 5",
        "LAP 6",
        "Extended LAP",
        "Sechamthang LAP",
        "Sarpang LAP",
    ];

    // You didn’t provide urban precinct list — placeholders only
    const precinctOptions = ["Precinct A", "Precinct B", "Precinct C"];

    const ruralLandTypes = ["Dry Land", "Wet Land", "Orchard"];

    const ruralClasses = ["Class A1", "Class A", "Class B", "Class C", "Class D"];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-100">
                    Land Plot Registry (On-chain)
                </h1>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Registry Status */}
                    <div className="rounded-lg border border-slate-700/60 bg-slate-900/50 px-4 py-3 backdrop-blur">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">
                            Registry Status
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-200">
                            {tokensPerUnit > 0n ? "Active" : "Inactive"}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                            {tokensPerUnit > 0n
                                ? "Token rate configured"
                                : "Token rate not set"}
                        </div>
                    </div>

                    {/* Token Rate */}
                    <div className="rounded-lg border border-slate-700/60 bg-slate-900/50 px-4 py-3 backdrop-blur">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">
                            Token Rate
                        </div>
                        {tokensPerUnit > 0n ? (
                            <>
                                <div className="mt-1 text-sm font-semibold text-amber-400">
                                    {ethers.formatUnits(tokensPerUnit, 18)}
                                    <span className="ml-1 text-xs text-slate-400">GMCLT / unit</span>
                                </div>
                                <div className="mt-0.5 text-[11px] text-slate-500">
                                    Minted per land-value unit
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mt-1 text-sm font-semibold text-red-400">
                                    0 GMCLT / unit
                                </div>
                                <div className="mt-0.5 text-[11px] text-red-500">
                                    ⚠ Token rate not configured
                                </div>
                            </>
                        )}
                    </div>

                    {/* Token Preview */}
                    <div className="rounded-lg border border-slate-700/60 bg-slate-900/50 px-4 py-3 backdrop-blur">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">
                            Tokens (Preview)
                        </div>
                        {tokensPerUnit > 0n ? (
                            <>
                                <div className="mt-1 text-sm font-semibold text-emerald-400">
                                    {ethers.formatUnits(derivedTokensPreview, 18)}
                                    <span className="ml-1 text-xs text-slate-400">GMCLT</span>
                                </div>
                                <div className="mt-0.5 text-[11px] text-slate-500">
                                    Based on entered land value
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mt-1 text-sm font-semibold text-slate-400">
                                    0 GMCLT
                                </div>
                                <div className="mt-0.5 text-[11px] text-slate-500">
                                    Set token rate to enable minting
                                </div>
                            </>
                        )}
                    </div>

                    {/* On-chain Records */}
                    <div className="rounded-lg border border-slate-700/60 bg-slate-900/50 px-4 py-3 backdrop-blur">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">
                            Registered Plots
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-200">
                            {records.length}
                            <span className="ml-1 text-xs text-slate-400">plots</span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                            Stored on blockchain
                        </div>
                    </div>
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
                        {"message" in status ? status.message : null}
                    </div>
                )}
            </div>

            {/* Token rate card */}
            <SetTokensPerUnit
                contractAddress={CONTRACT_ADDRESS}
                onUpdated={async () => {
                    // ensures Promise<void> type
                    await loadTokensPerUnit();
                }}
            />

            {/* FORM */}
            <form
                onSubmit={handleRegister}
                className="rounded-xl bg-slate-900/60 border border-slate-700/60 p-6 shadow-lg backdrop-blur space-y-6"
            >
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-100">
                        Register Land Plot
                    </h2>
                    <span className="text-xs text-slate-400">
                        Requires owner wallet +{" "}
                        <span className="font-mono">tokensPerUnit &gt; 0</span>
                    </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {/* Plot ID */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Plot ID *
                        </label>
                        <input
                            name="plotId"
                            value={form.plotId}
                            onChange={handleChange}
                            placeholder='e.g. "GT1-4845"'
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                            required
                        />
                    </div>

                    {/* Dzongkhag */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Dzongkhag *
                        </label>
                        <input
                            name="dzongkhag"
                            value={form.dzongkhag}
                            onChange={handleChange}
                            placeholder='e.g. "Gelephu"'
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                            required
                        />
                    </div>

                    {/* Gewog */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Gewog *
                        </label>
                        <input
                            name="gewog"
                            value={form.gewog}
                            onChange={handleChange}
                            placeholder='e.g. "Gelephu Throm"'
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                            required
                        />
                    </div>

                    {/* Thram */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Thram *
                        </label>
                        <input
                            name="thram"
                            value={form.thram}
                            onChange={handleChange}
                            placeholder='e.g. "2583"'
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                            required
                        />
                    </div>

                    {/* Owner Name */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Owner Name *
                        </label>
                        <input
                            name="ownerName"
                            value={form.ownerName}
                            onChange={handleChange}
                            placeholder='e.g. "Sonia Ghalay"'
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                            required
                        />
                    </div>

                    {/* Owner CID */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Owner CID *
                        </label>
                        <input
                            name="ownerCid"
                            value={form.ownerCid}
                            onChange={handleChange}
                            placeholder='e.g. "12008000663"'
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                            required
                        />
                    </div>

                    {/* Ownership Type */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Ownership Type *
                        </label>
                        <select
                            name="ownType"
                            value={form.ownType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none"
                            required
                        >
                            <option value="" className="bg-slate-900">
                                Select ownership
                            </option>
                            {ownershipOptions.map((o) => (
                                <option key={o} value={o} className="bg-slate-900">
                                    {o}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Major Category */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Major Category *
                        </label>
                        <select
                            name="majorCategory"
                            value={form.majorCategory}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none"
                            required
                        >
                            <option value="" className="bg-slate-900">
                                Select category
                            </option>
                            <option value="Urban" className="bg-slate-900">
                                Urban
                            </option>
                            <option value="Rural" className="bg-slate-900">
                                Rural
                            </option>
                        </select>
                    </div>

                    {/* Land Type */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Land Type *
                        </label>
                        <select
                            name="landType"
                            value={form.landType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none"
                            required
                            disabled={!form.majorCategory}
                        >
                            <option value="" className="bg-slate-900">
                                {form.majorCategory
                                    ? "Select land type"
                                    : "Select Major Category first"}
                            </option>

                            {form.majorCategory === "Urban" && (
                                <>
                                    <option value="Precincts" className="bg-slate-900">
                                        Precincts (Land use classification)
                                    </option>
                                    <option value="LAPs" className="bg-slate-900">
                                        LAPs (Local Area Plan)
                                    </option>
                                </>
                            )}

                            {form.majorCategory === "Rural" &&
                                ruralLandTypes.map((t) => (
                                    <option key={t} value={t} className="bg-slate-900">
                                        {t}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Plot Class */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Plot Class *
                        </label>
                        <select
                            name="plotClass"
                            value={form.plotClass}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none"
                            required
                            disabled={!form.majorCategory || !form.landType}
                        >
                            <option value="" className="bg-slate-900">
                                {form.majorCategory && form.landType
                                    ? "Select class"
                                    : "Select category & land type first"}
                            </option>

                            {/* Urban -> LAPs */}
                            {form.majorCategory === "Urban" &&
                                form.landType === "LAPs" &&
                                lapOptions.map((lap) => (
                                    <option key={lap} value={lap} className="bg-slate-900">
                                        {lap}
                                    </option>
                                ))}

                            {/* Urban -> Precincts (placeholder list) */}
                            {form.majorCategory === "Urban" &&
                                form.landType === "Precincts" &&
                                precinctOptions.map((p) => (
                                    <option key={p} value={p} className="bg-slate-900">
                                        {p}
                                    </option>
                                ))}

                            {/* Rural -> Classes */}
                            {form.majorCategory === "Rural" &&
                                ruralClasses.map((c) => (
                                    <option key={c} value={c} className="bg-slate-900">
                                        {c}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Area */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">
                            Area (ac × 1e4) *
                        </label>
                        <input
                            type="number"
                            name="areaAcTimes1e4"
                            value={form.areaAcTimes1e4}
                            onChange={handleChange}
                            placeholder="e.g. 510 (means 0.051 ac)"
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                            required
                            min={0}
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
                            name="landValue"
                            value={form.landValue}
                            onChange={handleChange}
                            placeholder="e.g. 2500000"
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500"
                            required
                            min={0}
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
                            name="wallet"
                            value={form.wallet}
                            onChange={handleChange}
                            placeholder="0x..."
                            className="w-full px-3 py-2 rounded-md border border-slate-700/70 bg-slate-950/40 text-slate-100 text-sm shadow-sm focus:ring-2 focus:ring-amber-400/40 focus:outline-none placeholder:text-slate-500 font-mono"
                            required
                        />
                        {form.wallet ? (
                            <p className="text-[11px] text-slate-500">
                                {isHexAddressMaybe(form.wallet) ? "Looks valid." : "Invalid address."}
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
                    If you get <span className="font-mono">"Token rate not set"</span>, call{" "}
                    <span className="font-mono">setTokensPerUnit()</span> from the owner wallet first.
                </p>
            </form>

            {/* TABLE */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-700/60 p-6 shadow-lg backdrop-blur">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <h2 className="text-lg font-semibold text-slate-100">Registered Plots</h2>
                    <span className="text-xs text-slate-500">
                        Rows: <span className="font-mono">{records.length}</span>
                    </span>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-4" />

                <div className="max-h-[480px] overflow-auto rounded-lg border border-slate-800/60">
                    <table className="min-w-full text-sm">
                        {/* Sticky header */}
                        <thead className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Plot ID</th>
                                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Owner</th>
                                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Location</th>
                                <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Area</th>
                                <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Land Value</th>
                                <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Tokens</th>
                                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Wallet</th>
                                <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/70">
                            {records.map((r, idx) => (
                                <tr
                                    key={r.plotId}
                                    className={[
                                        "transition",
                                        idx % 2 === 0 ? "bg-slate-900/30" : "bg-slate-900/10",
                                        "hover:bg-slate-800/40",
                                    ].join(" ")}
                                >
                                    {/* Plot ID */}
                                    <td className="px-4 py-3 align-top">
                                        <div className="font-mono text-slate-200">{r.plotId}</div>
                                        <div className="mt-1 text-[11px] text-slate-500">
                                            {r.majorCategory} • {r.landType} • {r.plotClass}
                                        </div>
                                    </td>

                                    {/* Owner */}
                                    <td className="px-4 py-3 align-top">
                                        <div className="text-slate-200">{r.ownerName}</div>
                                        <div className="mt-1 text-[11px] text-slate-500 font-mono">{r.ownerCid}</div>
                                        <div className="mt-1 text-[11px] text-slate-500">{r.ownType}</div>
                                    </td>

                                    {/* Location */}
                                    <td className="px-4 py-3 align-top">
                                        <div className="text-slate-200">{r.dzongkhag}</div>
                                        <div className="mt-1 text-[11px] text-slate-500">
                                            {r.gewog} • Thram {r.thram}
                                        </div>
                                    </td>

                                    {/* Area */}
                                    <td className="px-4 py-3 text-right align-top font-mono text-slate-300 whitespace-nowrap">
                                        {r.areaAcTimes1e4}
                                    </td>

                                    {/* Land Value */}
                                    <td className="px-4 py-3 text-right align-top font-mono text-slate-300 whitespace-nowrap">
                                        {r.landValue}
                                    </td>

                                    {/* Tokens */}
                                    <td className="px-4 py-3 text-right align-top font-mono text-amber-400 whitespace-nowrap">
                                        {formatTokenHuman(r.allocatedTokens)}
                                    </td>

                                    {/* Wallet */}
                                    <td className="px-4 py-3 align-top">
                                        {r.wallet ? (
                                            <div
                                                className="max-w-[160px] font-mono text-xs text-slate-300 truncate"
                                                title={r.wallet}
                                            >
                                                {r.wallet}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-600 italic">—</span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3 text-right align-top">
                                        <button
                                            onClick={() => removeLocal(r.plotId)}
                                            type="button"
                                            className="inline-flex items-center justify-center rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 transition"
                                            title="No delete function exists on-chain; this only removes from the table."
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {!records.length && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500 italic">
                                        No plots registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
