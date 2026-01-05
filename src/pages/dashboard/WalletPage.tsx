import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { ethers } from "ethers";

import type { LandPlotView, PurchaseRow } from "../../services/MarketplaceService";
import {
    fetchMyInfo,
    fetchMyPlots,
    fetchMyPurchases,
    tokensToNumber,
    ethPerToken,
} from "../../services/MarketplaceService";

function shortAddr(a: string) {
    return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "-";
}

function fmtAreaAc(areaAcTimes1e4: bigint) {
    const n = Number(areaAcTimes1e4);
    return `${(n / 1e4).toFixed(4)} ac`;
}

function fmtDate(ms: number) {
    const d = new Date(ms);
    return d.toISOString().slice(0, 16).replace("T", " ");
}

export default function WalletPage() {
    const [account, setAccount] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [plotsLoading, setPlotsLoading] = useState(false);
    const [purchasesLoading, setPurchasesLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const [plots, setPlots] = useState<LandPlotView[]>([]);
    const [purchases, setPurchases] = useState<PurchaseRow[]>([]);

    async function load() {
        setLoading(true);
        setErr(null);

        try {
            const info = await fetchMyInfo();
            setAccount(info.account);

            if (info.account) {
                // plots
                setPlotsLoading(true);
                try {
                    const p = await fetchMyPlots();
                    setPlots(p);
                } finally {
                    setPlotsLoading(false);
                }

                // purchases (event-based history)
                setPurchasesLoading(true);
                try {
                    const rows = await fetchMyPurchases({
                        lookbackBlocks: 120_000,
                        maxRows: 100,
                        includeTimestamps: true,
                    });
                    setPurchases(rows);
                } finally {
                    setPurchasesLoading(false);
                }
            } else {
                setPlots([]);
                setPurchases([]);
            }
        } catch (e: any) {
            setErr(e?.message ?? "Failed to load wallet.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();

        const eth = (window as any)?.ethereum;
        const onAccountsChanged = () => load();
        const onChainChanged = () => load();

        eth?.on?.("accountsChanged", onAccountsChanged);
        eth?.on?.("chainChanged", onChainChanged);

        return () => {
            eth?.removeListener?.("accountsChanged", onAccountsChanged);
            eth?.removeListener?.("chainChanged", onChainChanged);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const plotsWithTokens = useMemo(
        () => plots.filter((p) => p.myTokensFromThisPlot > 0n),
        [plots]
    );

    const showPurchasesSection = useMemo(() => Boolean(account), [account]);

    // Best-effort totals from events (depends on lookbackBlocks)
    const totalBoughtFromEvents = useMemo(() => {
        return purchases.reduce((acc, r) => acc + r.amount, 0n);
    }, [purchases]);

    const totalBoughtFromEventsHuman = useMemo(() => {
        return tokensToNumber(totalBoughtFromEvents);
    }, [totalBoughtFromEvents]);

    // Aggregate tokens bought per seller (from events)
    const boughtBySeller = useMemo(() => {
        const m = new Map<string, bigint>();

        for (const r of purchases) {
            const key = (r.seller || "").toLowerCase();
            if (!key) continue;
            m.set(key, (m.get(key) ?? 0n) + r.amount);
        }

        return Array.from(m.entries())
            .map(([seller, amount]) => ({
                seller,
                amount,
                amountHuman: tokensToNumber(amount),
            }))
            .sort((a, b) => b.amountHuman - a.amountHuman);
    }, [purchases]);

    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Token Wallet</h1>
                    <p className="text-sm text-muted-foreground">
                        Connected wallet, plots under that wallet, and marketplace activity.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {account ? `Wallet: ${account}` : "Wallet: Not connected"}
                        {loading ? " • Loading…" : ""}
                        {plotsLoading ? " • Loading plots…" : ""}
                        {purchasesLoading ? " • Loading purchases…" : ""}
                    </p>
                    {err && <p className="text-xs text-red-400 mt-1">{err}</p>}
                </div>

                <button
                    onClick={load}
                    className="text-primary hover:text-primary/80 font-medium transition-all hover:scale-[1.02] cursor-pointer bg-primary/10 px-4 py-2 rounded-md"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* WALLET SUMMARY */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-6">
                {/* Address */}
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Wallet Address</p>
                        <p className="mt-1 text-sm font-mono text-foreground bg-background/40 px-3 py-2 rounded-md border border-border/40 inline-block">
                            {account ? account : "—"}
                        </p>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        <span className="px-2 py-1 rounded-full bg-secondary/20 text-foreground border border-border/40">
                            {account ? shortAddr(account) : "Not connected"}
                        </span>
                    </div>
                </div>

                {!account && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs">
                            <p className="text-blue-300 font-medium">Wallet not connected</p>
                            <p className="text-blue-200 mt-1">
                                Your app uses silent detection (eth_accounts). Open MetaMask and connect this site.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* PLOTS */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-foreground">Plots under this wallet</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-foreground border border-border/40">
                        {plotsLoading ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Loading
                            </span>
                        ) : (
                            `${plots.length} plots`
                        )}
                    </span>
                </div>

                {!account ? (
                    <p className="text-sm text-muted-foreground">Connect your wallet to see plots.</p>
                ) : plots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No plots found for this wallet. Either plots were registered to another address, or you are on the wrong chain / contract address.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-muted-foreground border-b border-border/40">
                                <tr>
                                    <th className="text-left py-2">Plot ID</th>
                                    <th className="text-left py-2">Dzongkhag / Gewog</th>
                                    <th className="text-left py-2">Thram</th>
                                    <th className="text-left py-2">Type</th>
                                    <th className="text-left py-2">Class</th>
                                    <th className="text-right py-2">Area</th>
                                    <th className="text-right py-2">Your Tokens</th>
                                </tr>
                            </thead>
                            <tbody className="text-foreground">
                                {plots.map((p) => (
                                    <tr key={p.plotId} className="border-b border-border/20">
                                        <td className="py-2 font-medium">
                                            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                                                {p.plotId}
                                            </span>
                                        </td>
                                        <td className="py-2 text-muted-foreground">
                                            {p.dzongkhag}, {p.gewog}
                                        </td>
                                        <td className="py-2 text-muted-foreground">{p.thram}</td>
                                        <td className="py-2 text-muted-foreground">{p.landType}</td>
                                        <td className="py-2 text-muted-foreground">{p.plotClass}</td>
                                        <td className="py-2 text-right text-muted-foreground">{fmtAreaAc(p.areaAc)}</td>
                                        <td className="py-2 text-right font-semibold">
                                            {tokensToNumber(p.myTokensFromThisPlot).toLocaleString()} GMCLT
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {account && plots.length > 0 && (
                    <div className="mt-4 text-xs text-muted-foreground">
                        Plots with tokens:{" "}
                        <span className="text-foreground/90 font-semibold">{plotsWithTokens.length}</span>
                    </div>
                )}
            </div>

            {/* PURCHASES */}
            {showPurchasesSection && (
                <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-foreground">Marketplace purchases</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-foreground border border-border/40">
                            {purchasesLoading ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Loading
                                </span>
                            ) : (
                                `${purchases.length} orders`
                            )}
                        </span>
                    </div>

                    {/* BOUGHT BY SELLER (Aggregated from events) */}
                    <div className="rounded-lg border border-border/30 bg-background/30 p-5 mb-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-foreground">Bought From</p>
                            <span className="text-xs text-muted-foreground">{boughtBySeller.length} sellers</span>
                        </div>

                        {purchasesLoading ? (
                            <div className="text-xs text-muted-foreground inline-flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Calculating…
                            </div>
                        ) : boughtBySeller.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No purchases.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-xs text-muted-foreground border-b border-border/40">
                                        <tr>
                                            <th className="text-left py-2">Seller</th>
                                            <th className="text-right py-2">Tokens bought</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-foreground">
                                        {boughtBySeller.map((row) => (
                                            <tr key={row.seller} className="border-b border-border/20">
                                                <td className="py-2 text-muted-foreground">{shortAddr(row.seller)}</td>
                                                <td className="py-2 text-right font-semibold">
                                                    {row.amountHuman.toLocaleString()} GMCLT
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t border-border/40">
                                            <td className="py-2 text-xs text-muted-foreground">Total</td>
                                            <td className="py-2 text-right font-bold">
                                                {totalBoughtFromEventsHuman.toLocaleString()} GMCLT
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>


                    {!purchasesLoading && purchases.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No purchase history found
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-xs text-muted-foreground border-b border-border/40">
                                    <tr>
                                        <th className="text-left py-2">When</th>
                                        <th className="text-left py-2">Order</th>
                                        <th className="text-left py-2">Plot</th>
                                        <th className="text-left py-2">Seller</th>
                                        <th className="text-right py-2">Amount</th>
                                        <th className="text-right py-2">Price</th>
                                        <th className="text-right py-2">Paid</th>
                                    </tr>
                                </thead>

                                <tbody className="text-foreground">
                                    {purchases.map((r) => {
                                        const amount = tokensToNumber(r.amount);
                                        const price = ethPerToken(r.pricePerTokenWei);
                                        const paid = Number(ethers.formatEther(r.totalPaidWei));
                                        return (
                                            <tr key={`${r.txHash}-${r.orderId.toString()}`} className="border-b border-border/20">
                                                <td className="py-2 text-muted-foreground">
                                                    {r.timestamp ? fmtDate(r.timestamp) : `#${r.blockNumber}`}
                                                </td>
                                                <td className="py-2 font-medium">#{r.orderId.toString()}</td>
                                                <td className="py-2">
                                                    {r.hasPlot && r.plotId ? (
                                                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                                                            {r.plotId}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">—</span>
                                                    )}
                                                </td>
                                                <td className="py-2 text-muted-foreground">{shortAddr(r.seller)}</td>
                                                <td className="py-2 text-right font-semibold">{amount.toLocaleString()} GMCLT</td>
                                                <td className="py-2 text-right text-muted-foreground">{price.toFixed(6)} TER</td>
                                                <td className="py-2 text-right text-foreground">{paid.toFixed(6)} TER</td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
