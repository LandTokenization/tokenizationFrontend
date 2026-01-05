import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { ethers } from "ethers";

import type { LandPlotView, LandMode } from "../../services/LandHoldingService";
import { fetchMyLandPlots, subscribeMyLandPlots } from "../../services/LandHoldingService";

function fmtAcres(areaAcTimes1e4: bigint) {
    // contract stores: acres * 1e4
    const acres = Number(areaAcTimes1e4) / 1e4;
    return acres.toFixed(4);
}

function fmtTokens(v: bigint) {
    return Number(ethers.formatUnits(v, 18)).toLocaleString();
}

export default function LandPage() {
    const [mode] = useState<LandMode>("registered"); // "registered" | "token" | "both"

    const [account, setAccount] = useState<string | null>(null);
    const [plots, setPlots] = useState<LandPlotView[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const [selectedThram, setSelectedThram] = useState<string | null>(null);

    useEffect(() => {
        let off: (() => void) | null = null;

        (async () => {
            setLoading(true);
            setErr(null);

            try {
                const res = await fetchMyLandPlots(mode);
                setAccount(res.account);
                setPlots(res.plots);

                off = await subscribeMyLandPlots((next) => {
                    setAccount(next.account);
                    setPlots(next.plots);
                }, mode);
            } catch (e: any) {
                setErr(e?.message ?? "Failed to load land plots from blockchain.");
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            off?.();
        };
    }, [mode]);

    const myCurrentPlots = useMemo(() => {
        if (!account) return [];
        return plots.filter(
            (p) => p.wallet?.toLowerCase() === account.toLowerCase()
        );
    }, [plots, account]);

    const plotsByThram = useMemo(() => {
        const map = new Map<string, LandPlotView[]>();
        for (const p of myCurrentPlots) {
            const key = p.thram || "0";
            map.set(key, [...(map.get(key) ?? []), p]);
        }
        return map;
    }, [myCurrentPlots]);


    const thramRows = useMemo(() => {
        const rows = [...plotsByThram.entries()].map(([thram, list], idx) => {
            const first = list[0];

            const totalAcres = list.reduce((s, x) => s + Number(x.areaAc) / 1e4, 0);
            const totalLandValue = list.reduce((s, x) => s + Number(x.landValue), 0);

            const totalAllocatedTokens = list.reduce(
                (s, x) => s + Number(ethers.formatUnits(x.allocatedTokens, 18)),
                0
            );

            const totalMyTokens = list.reduce(
                (s, x) => s + Number(ethers.formatUnits(x.myTokensFromThisPlot, 18)),
                0
            );

            return {
                id: idx + 1,
                thram,
                dzongkhag: first?.dzongkhag ?? "-",
                gewog: first?.gewog ?? "-",
                ownerName: first?.ownerName ?? "-",
                ownerCid: first?.ownerCid ?? "-",
                ownType: first?.ownType ?? "-",
                count: list.length,
                totalAcres,
                totalLandValue,
                totalAllocatedTokens,
                totalMyTokens,
            };
        });

        // sort thram numeric if possible
        rows.sort((a, b) => Number(a.thram) - Number(b.thram));
        return rows;
    }, [plotsByThram]);

    const grandTotals = useMemo(() => {
        const totalAcres = myCurrentPlots.reduce((s, p) => s + Number(p.areaAc) / 1e4, 0);
        const totalLandValue = myCurrentPlots.reduce((s, p) => s + Number(p.landValue), 0);

        const totalAllocatedTokens = myCurrentPlots.reduce(
            (s, p) => s + Number(ethers.formatUnits(p.allocatedTokens, 18)),
            0
        );

        const totalMyTokens = myCurrentPlots.reduce(
            (s, p) => s + Number(ethers.formatUnits(p.myTokensFromThisPlot, 18)),
            0
        );

        return { totalAcres, totalLandValue, totalAllocatedTokens, totalMyTokens };
    }, [myCurrentPlots]);


    const selectedPlots = useMemo(() => {
        if (!selectedThram) return [];
        return plotsByThram.get(selectedThram) ?? [];
    }, [plotsByThram, selectedThram]);

    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">GMC LAND HOLDING (ON-CHAIN)</h1>
                    <p className="text-sm text-muted-foreground">
                        {account ? `Wallet: ${account}` : "Wallet: Not connected"}
                    </p>
                    {loading && <p className="text-xs text-muted-foreground mt-1">Loading from blockchain…</p>}
                    {err && <p className="text-xs text-red-400 mt-1">{err}</p>}
                </div>

                <button
                    onClick={async () => {
                        setLoading(true);
                        setErr(null);
                        try {
                            const res = await fetchMyLandPlots(mode);
                            setAccount(res.account);
                            setPlots(res.plots);
                        } catch (e: any) {
                            setErr(e?.message ?? "Refresh failed.");
                        } finally {
                            setLoading(false);
                        }
                    }}
                    className="text-primary hover:text-primary/80 font-medium transition-all hover:scale-[1.02] cursor-pointer bg-primary/10 px-4 py-2 rounded-md"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* SUMMARY */}
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Total Area</p>
                        <p className="text-2xl font-bold text-foreground mt-2">{grandTotals.totalAcres.toFixed(4)} acres</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Total Land Value</p>
                        <p className="text-2xl font-bold text-foreground mt-2">{grandTotals.totalLandValue.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Total Allocated Tokens</p>
                        <p className="text-2xl font-bold text-foreground mt-2">{grandTotals.totalAllocatedTokens.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">My Tokens (From Plots)</p>
                        <p className="text-2xl font-bold text-foreground mt-2">{grandTotals.totalMyTokens.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* THRAM TABLE */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-foreground">LAND HOLDING STATUS (BY THRAM)</h2>

                <div className="overflow-x-auto rounded-lg border border-border/60 bg-background/40">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-primary/15 border-b-2 border-primary/30">
                                <th className="text-left py-3 px-4 font-bold text-foreground">Sl No</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Dzongkhag</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Gewog</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Thram</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Owner</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Ownership Type</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">#Plots</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Total Area (ac)</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Total Land Value</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">My Tokens</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {thramRows.length === 0 && (
                                <tr className="border-b border-border/30">
                                    <td colSpan={11} className="py-6 px-4 text-center text-muted-foreground">
                                        {loading ? "Loading…" : "No plots found for this wallet."}
                                    </td>
                                </tr>
                            )}

                            {thramRows.map((r, idx) => (
                                <tr
                                    key={`${r.thram}-${idx}`}
                                    className={`border-b border-border/30 transition-colors ${idx % 2 === 0 ? "bg-background/20" : "bg-background/10"
                                        } hover:bg-primary/10 hover:border-primary/40`}
                                >
                                    <td className="py-3 px-4 text-foreground font-medium">{r.id}</td>
                                    <td className="py-3 px-4 text-foreground font-medium">{r.dzongkhag}</td>
                                    <td className="py-3 px-4 text-foreground font-medium">{r.gewog}</td>
                                    <td className="py-3 px-4 text-foreground font-bold text-primary">{r.thram}</td>
                                    <td className="py-3 px-4 text-foreground text-xs whitespace-pre-line">
                                        {r.ownerName} | {r.ownerCid}
                                    </td>
                                    <td className="py-3 px-4 text-foreground text-xs font-medium">{r.ownType}</td>
                                    <td className="py-3 px-4 text-foreground font-bold">{r.count}</td>
                                    <td className="py-3 px-4 text-foreground font-bold">{r.totalAcres.toFixed(4)}</td>
                                    <td className="py-3 px-4 text-foreground font-bold">{r.totalLandValue.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-foreground font-bold">{r.totalMyTokens.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-foreground">
                                        <button
                                            onClick={() => setSelectedThram(r.thram)}
                                            className="text-primary hover:text-primary/80 font-medium transition-all hover:scale-105 cursor-pointer bg-primary/10 px-3 py-1 rounded-md"
                                        >
                                            👀 View Plots
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            <tr className="bg-primary/20 font-bold border-t-2 border-primary/30">
                                <td colSpan={7} className="py-3 px-4 text-foreground text-right">TOTAL</td>
                                <td className="py-3 px-4 text-foreground text-lg">{grandTotals.totalAcres.toFixed(4)}</td>
                                <td className="py-3 px-4 text-foreground text-lg">{grandTotals.totalLandValue.toLocaleString()}</td>
                                <td className="py-3 px-4 text-foreground text-lg">{grandTotals.totalMyTokens.toLocaleString()}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: Plot Details */}
            {selectedThram && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl border border-primary/40 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="sticky top-0 bg-primary/20 border-b-2 border-primary/40 p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-foreground">Thram No: {selectedThram}</h2>
                                <p className="text-sm text-muted-foreground mt-1">PLOT DETAILS (ON-CHAIN)</p>
                            </div>
                            <button
                                onClick={() => setSelectedThram(null)}
                                className="text-foreground hover:text-primary transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="overflow-x-auto rounded-lg border-2 border-primary/40 bg-background/60">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-primary/30 border-b-3 border-primary/50">
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Sl No</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Plot ID</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Dzongkhag</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Gewog</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Owner</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Major Category</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Land Type</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Plot Class</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Area (ac)</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Land Value</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Allocated Tokens</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">My Tokens</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Registered Wallet</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPlots.map((p, i) => (
                                            <tr
                                                key={`${p.plotId}-${i}`}
                                                className={`border-b border-primary/20 transition-colors ${i % 2 === 0 ? "bg-background/40" : "bg-background/60"
                                                    } hover:bg-primary/20 hover:border-primary/50`}
                                            >
                                                <td className="py-3 px-4 text-foreground font-medium">{i + 1}</td>
                                                <td className="py-3 px-4 text-foreground font-bold text-primary">{p.plotId}</td>
                                                <td className="py-3 px-4 text-foreground">{p.dzongkhag}</td>
                                                <td className="py-3 px-4 text-foreground">{p.gewog}</td>
                                                <td className="py-3 px-4 text-foreground text-xs whitespace-pre-line">
                                                    {p.ownerName} | {p.ownerCid}
                                                </td>
                                                <td className="py-3 px-4 text-foreground text-xs">{p.majorCategory}</td>
                                                <td className="py-3 px-4 text-foreground text-xs font-medium">{p.landType}</td>
                                                <td className="py-3 px-4 text-foreground text-xs">{p.plotClass}</td>
                                                <td className="py-3 px-4 text-foreground font-bold">{fmtAcres(p.areaAc)}</td>
                                                <td className="py-3 px-4 text-foreground font-bold">{p.landValue.toString()}</td>
                                                <td className="py-3 px-4 text-foreground font-bold">{fmtTokens(p.allocatedTokens)}</td>
                                                <td className="py-3 px-4 text-foreground font-bold">{fmtTokens(p.myTokensFromThisPlot)}</td>
                                                <td className="py-3 px-4 text-foreground text-xs">{p.wallet}</td>
                                            </tr>
                                        ))}

                                        {selectedPlots.length === 0 && (
                                            <tr className="border-b border-primary/20">
                                                <td colSpan={13} className="py-6 px-4 text-center text-muted-foreground">
                                                    No plots under this thram.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer note */}
                            <p className="text-xs text-muted-foreground">
                                Note: Mortgage/structures/acquisition are not stored in the smart contract, so they are not shown here.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
