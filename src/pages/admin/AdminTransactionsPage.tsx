import { useEffect, useMemo, useState } from "react";

import {
    fetchOnchainTransactions,
    subscribeOnchainTransactions,
} from "../../services/onchainTransactions";

import {
    fetchInheritanceTransactions,
    subscribeInheritanceTransactions,
} from "../../services/onchainInheritanceTransactions";

import type { TxRow } from "../../types/tx";
import { shortAddr } from "../../types/tx";

function sortTx(a: TxRow, b: TxRow) {
    const bn = (b.blockNumber ?? 0) - (a.blockNumber ?? 0);
    if (bn !== 0) return bn;
    // tie-breaker inside same block
    return (b.logIndex ?? 0) - (a.logIndex ?? 0);
}
function typeBadgeClass(type: TxRow["type"]) {
  // Marketplace
  if (
    type === "SELL_ORDER_CREATED" ||
    type === "SELL_ORDER_FILLED" ||
    type === "SELL_ORDER_CANCELLED"
  ) {
    return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }

  // Plot registry / allocation / rate
  if (
    type === "PLOT_REGISTERED" ||
    type === "PLOT_UPDATED" ||
    type === "TOKENS_ALLOCATED" ||
    type === "TOKENS_PER_UNIT_UPDATED"
  ) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  // Transfers
  if (type === "TRANSFER") {
    return "border-sky-500/30 bg-sky-500/10 text-sky-300";
  }

  // Inheritance
  if (type === "NOMINEE_SET" || type === "NOMINEE_CLEARED") {
    return "border-purple-500/30 bg-purple-500/10 text-purple-300";
  }

  if (type === "DECLARED_DECEASED") {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  if (type === "PLOT_CLAIMED") {
    return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
  }

  return "border-slate-500/30 bg-slate-500/10 text-slate-300";
}

function renderTo(tx: TxRow) {
    // If your TxRow has meta.plotId for inheritance, show it nicely
    const plotId = (tx.meta as any)?.plotId as string | undefined;
    if (!plotId) return shortAddr(tx.to);

    return (
        <div className="space-y-0.5">
            <div className="font-mono text-xs text-slate-300 truncate" title={tx.to}>
                {shortAddr(tx.to)}
            </div>
            <div className="text-[11px] text-slate-500">
                Plot: <span className="font-mono text-slate-400">{plotId}</span>
            </div>
        </div>
    );
}

export default function AdminTransactionsPage() {
    const [txs, setTxs] = useState<TxRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        let un1: null | (() => void) = null;
        let un2: null | (() => void) = null;
        let mounted = true;

        (async () => {
            try {
                setErr("");
                setLoading(true);

                const [tradeTx, inhTx] = await Promise.all([
                    fetchOnchainTransactions({ lookbackBlocks: 50_000 }),
                    fetchInheritanceTransactions({ lookbackBlocks: 50_000 }),
                ]);

                if (!mounted) return;

                setTxs([...tradeTx, ...inhTx].sort(sortTx));

                un1 = await subscribeOnchainTransactions((t) => {
                    setTxs((prev) => {
                        if (prev.some((p) => p.id === t.id)) return prev;
                        return [t, ...prev].sort(sortTx);
                    });
                });

                un2 = await subscribeInheritanceTransactions((t) => {
                    setTxs((prev) => {
                        if (prev.some((p) => p.id === t.id)) return prev;
                        return [t, ...prev].sort(sortTx);
                    });
                });
            } catch (e) {
                if (!mounted) return;
                setErr(e instanceof Error ? e.message : "Failed to load transactions");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
            un1?.();
            un2?.();
        };
    }, []);

    const rows = useMemo(() => txs, [txs]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-100">Transaction Log (On-chain)</h1>
                <p className="text-sm text-slate-500">
                    Verified blockchain events recorded by the smart contract.
                </p>

                {err && (
                    <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {err}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-700/60 p-6 shadow-lg backdrop-blur">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <h2 className="text-lg font-semibold text-slate-100">On-chain Transactions</h2>

                    <div className="flex items-center gap-3">
                        {loading ? (
                            <span className="text-xs text-slate-500">Syncing…</span>
                        ) : (
                            <span className="text-xs text-slate-500">
                                Rows: <span className="font-mono">{rows.length}</span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-4" />

                <div className="max-h-[520px] overflow-auto rounded-lg border border-slate-800/60">
                    <table className="min-w-full text-sm">
                        <thead className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Date / Time</th>
                                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Type</th>
                                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">From</th>
                                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">To</th>
                                <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Amount</th>
                                <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Price / Peg</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/70">
                            {rows.map((tx, idx) => (
                                <tr
                                    key={tx.id}
                                    className={[
                                        "transition",
                                        idx % 2 === 0 ? "bg-slate-900/30" : "bg-slate-900/10",
                                        "hover:bg-slate-800/40",
                                    ].join(" ")}
                                >
                                    <td className="px-4 py-3 align-top text-slate-200 whitespace-nowrap">
                                        {tx.date}
                                    </td>

                                    <td className="px-4 py-3 align-top">
                                        <span
                                            className={[
                                                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                                                typeBadgeClass(tx.type),
                                            ].join(" ")}
                                        >
                                            {tx.type}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 align-top">
                                        <div
                                            className="max-w-[220px] font-mono text-xs text-slate-300 truncate"
                                            title={tx.from}
                                        >
                                            {shortAddr(tx.from)}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 align-top">
                                        {renderTo(tx)}
                                    </td>

                                    <td className="px-4 py-3 text-right align-top font-mono text-emerald-300 whitespace-nowrap">
                                        {tx.amount}
                                    </td>

                                    <td className="px-4 py-3 text-right align-top font-mono text-slate-300 whitespace-nowrap">
                                        {tx.price}
                                    </td>
                                </tr>
                            ))}

                            {!loading && !rows.length && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500 italic">
                                        No on-chain transactions found.
                                    </td>
                                </tr>
                            )}

                            {loading && !rows.length && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500 italic">
                                        Loading blockchain logs…
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                    This table is sourced directly from smart-contract events (immutable).
                </p>
            </div>
        </div>
    );
}
