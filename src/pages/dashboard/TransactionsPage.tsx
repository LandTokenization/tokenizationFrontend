import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ethers } from "ethers";
import { Search, Filter, TrendingUp, RefreshCcw, Wallet, ArrowDownLeft, ArrowUpRight, PlusCircle, XCircle } from "lucide-react";

import { fetchMyContractActivity, type TxRow } from "../../services/TxActivityService";


const MONTHLY_PEGS = [
  { month: "January", peg: 5182 },
  { month: "February", peg: 5563 },
  { month: "March", peg: 6357 },
  { month: "April", peg: 6878 },
  { month: "May", peg: 7720 },
  { month: "June", peg: 7543 },
  { month: "July", peg: 7959 },
  { month: "August", peg: 8493 },
  { month: "September", peg: 9574 },
  { month: "October", peg: 11353 },
  { month: "November", peg: 13803 },
  { month: "December", peg: 17727 },
];

const YEARS_DATA: { [key: string]: typeof MONTHLY_PEGS } = {
  "2024": [
    { month: "January", peg: 4200 },
    { month: "February", peg: 4450 },
    { month: "March", peg: 4800 },
    { month: "April", peg: 5100 },
    { month: "May", peg: 5300 },
    { month: "June", peg: 5200 },
    { month: "July", peg: 5600 },
    { month: "August", peg: 5900 },
    { month: "September", peg: 6400 },
    { month: "October", peg: 7100 },
    { month: "November", peg: 8200 },
    { month: "December", peg: 9500 },
  ],
  "2025": MONTHLY_PEGS,
};

type TxTypeUI = TxRow["type"] | "ALL";

const typeLabel: Record<string, string> = {
  BUY: "BUY",
  SELL: "SELL",
  SELL_CREATED: "SELL CREATED",
  CANCEL: "CANCELLED",
  ALL: "ALL",
};

const typeBadge = (type: string) => {
  switch (type) {
    case "BUY":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "SELL":
      return "bg-red-500/15 text-red-300 border-red-500/30";
    case "SELL_CREATED":
      return "bg-orange-500/15 text-orange-300 border-orange-500/30";
    case "CANCEL":
      return "bg-slate-500/15 text-slate-300 border-slate-500/30";
    default:
      return "bg-primary/15 text-primary border-primary/30";
  }
};

function shortAddr(a?: string | null) {
  if (!a) return "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function fmtDate(ms?: number) {
  if (!ms) return "—";
  const d = new Date(ms);
  return d.toISOString().slice(0, 10);
}

function fmtTime(ms?: number) {
  if (!ms) return "—";
  const d = new Date(ms);
  return d.toISOString().slice(11, 16);
}

function fmtEth(wei?: bigint) {
  if (wei == null) return "—";
  return Number(ethers.formatEther(wei)).toFixed(6);
}

function fmtEthPerToken(wei?: bigint) {
  if (wei == null) return "—";
  // your pricePerTokenWei is wei-per-token (18 decimals), so formatEther is fine
  return Number(ethers.formatEther(wei)).toFixed(6);
}

function fmtTokens(amount?: bigint) {
  if (amount == null) return "0";
  return Number(ethers.formatUnits(amount, 18)).toLocaleString();
}

function sumBigint(rows: TxRow[], pick: (r: TxRow) => bigint | undefined) {
  return rows.reduce((acc, r) => acc + (pick(r) ?? 0n), 0n);
}

export default function TransactionsPage() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const chartData = YEARS_DATA[selectedYear];

  const [account, setAccount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [balance, setBalance] = useState<bigint>(0n);
  const [rows, setRows] = useState<TxRow[]>([]);

  // UI controls
  const [typeFilter, setTypeFilter] = useState<TxTypeUI>("ALL");
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      // bigger lookback; empty usually means your RPC/log range is too small
      const res = await fetchMyContractActivity({ lookbackBlocks: 1_000_000, maxRows: 500 });
      
      setAccount(res.account);
      setBalance(res.balance);
      setRows(res.rows);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load on-chain activity.");
    } finally {
      setLoading(false);
    }
  };

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

  const currentBalanceHuman = useMemo(() => Number(ethers.formatUnits(balance, 18)), [balance]);

  const rowsThisYear = useMemo(() => {
    const y = Number(selectedYear);
    return rows.filter((r) => {
      if (!r.timestampMs) return true;
      return new Date(r.timestampMs).getFullYear() === y;
    });
  }, [rows, selectedYear]);

  const filteredTx = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rowsThisYear.filter((r) => {
      const matchesType = typeFilter === "ALL" || r.type === typeFilter;

      const hay = [
        r.type,
        r.txHash,
        r.orderId?.toString?.(),
        r.counterparty,
        r.blockNumber?.toString?.(),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !query || hay.includes(query);

      return matchesType && matchesQuery;
    });
  }, [rowsThisYear, typeFilter, q]);

  const stats = useMemo(() => {
    const buys = rowsThisYear.filter((r) => r.type === "BUY");
    const sells = rowsThisYear.filter((r) => r.type === "SELL");
    const created = rowsThisYear.filter((r) => r.type === "SELL_CREATED");
    const cancels = rowsThisYear.filter((r) => r.type === "CANCEL");

    const tokensBought = sumBigint(buys, (r) => r.tokens);
    const tokensSold = sumBigint(sells, (r) => r.tokens);

    const ethPaid = sumBigint(buys, (r) => r.totalPaidWei);
    const ethEarned = sumBigint(sells, (r) => r.totalPaidWei);

    return {
      buysCount: buys.length,
      sellsCount: sells.length,
      createdCount: created.length,
      cancelsCount: cancels.length,
      tokensBought,
      tokensSold,
      ethPaid,
      ethEarned,
    };
  }, [rowsThisYear]);

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real on-chain activity reconstructed from your GMCLT contract events.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-md border border-border/40 bg-background/30 px-3 py-1.5">
              <Wallet className="h-4 w-4" />
              {account ? shortAddr(account) : "Not connected"}
            </span>

            {loading && (
              <span className="inline-flex items-center gap-2 rounded-md border border-border/40 bg-background/30 px-3 py-1.5">
                <TrendingUp className="h-4 w-4 animate-pulse" />
                Loading…
              </span>
            )}

            {err && (
              <span className="inline-flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-300">
                {err}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={load}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 transition"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* TOP STATS */}
      <div className="rounded-xl border border-border/40 bg-background/20 backdrop-blur p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border/30 bg-background/30 p-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase">Current Balance</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{currentBalanceHuman.toLocaleString()} GMCLT</p>
            <p className="mt-1 text-xs text-muted-foreground">balanceOf(wallet)</p>
          </div>

          <div className="rounded-lg border border-border/30 bg-background/30 p-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase">Year Summary</p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <ArrowDownLeft className="h-4 w-4 text-emerald-300" />
                  Buys
                </span>
                <span className="font-semibold text-foreground">{stats.buysCount}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <ArrowUpRight className="h-4 w-4 text-red-300" />
                  Sells
                </span>
                <span className="font-semibold text-foreground">{stats.sellsCount}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <PlusCircle className="h-4 w-4 text-orange-300" />
                  Created
                </span>
                <span className="font-semibold text-foreground">{stats.createdCount}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <XCircle className="h-4 w-4 text-slate-300" />
                  Cancelled
                </span>
                <span className="font-semibold text-foreground">{stats.cancelsCount}</span>
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/30 bg-background/30 p-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase">Tokens Volume ({selectedYear})</p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Bought</span>
                <span className="font-semibold text-foreground">{fmtTokens(stats.tokensBought)} GMCLT</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Sold</span>
                <span className="font-semibold text-foreground">{fmtTokens(stats.tokensSold)} GMCLT</span>
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/30 bg-background/30 p-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase">ETH Volume ({selectedYear})</p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Paid</span>
                <span className="font-semibold text-foreground">{fmtEth(stats.ethPaid)} ETH</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Earned</span>
                <span className="font-semibold text-foreground">{fmtEth(stats.ethEarned)} ETH</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-xl border border-border/40 bg-background/20 backdrop-blur p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TxTypeUI)}
                className="rounded-lg border border-border/40 bg-background/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
              >
                <option value="ALL">All types</option>
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
                <option value="SELL_CREATED">Sell Created</option>
                <option value="CANCEL">Cancel</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search tx hash, orderId, counterparty…"
                className="w-full md:w-[340px] rounded-lg border border-border/40 bg-background/30 pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {Object.keys(YEARS_DATA).map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${selectedYear === year
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/40 border border-border/40 text-foreground hover:bg-background/60"
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY TABLE */}
      <div className="rounded-xl border border-border/40 bg-background/20 backdrop-blur p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">On-chain Transaction History</h2>
            <p className="text-xs text-muted-foreground mt-1">
              From contract events. If this shows empty, you’re likely on the wrong chain/contract or your RPC can’t return logs.
            </p>
          </div>

          <span className="text-xs rounded-full border border-border/40 bg-background/30 px-3 py-1.5 text-muted-foreground">
            {filteredTx.length} rows
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border/40 bg-background/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary/20 border-b border-border/40">
                <th className="px-4 py-3 text-left text-foreground font-semibold">#</th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">Type</th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">Order</th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">Counterparty</th>
                <th className="px-4 py-3 text-right text-foreground font-semibold">Tokens</th>
                <th className="px-4 py-3 text-right text-foreground font-semibold">Price / token</th>
                <th className="px-4 py-3 text-right text-foreground font-semibold">Total Paid</th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">Tx</th>
              </tr>
            </thead>

            <tbody>
              {filteredTx.length === 0 && (
                <tr className="border-b border-border/20">
                  <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                    {loading ? "Loading…" : "No activity found for this filter/year (or lookback window)."}
                  </td>
                </tr>
              )}

              {filteredTx.map((tx, idx) => (
                <tr key={tx.id} className="border-b border-border/20 hover:bg-primary/10 transition">
                  <td className="px-4 py-3 text-foreground font-medium">{idx + 1}</td>

                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded border px-3 py-1.5 text-xs font-semibold ${typeBadge(tx.type)}`}>
                      {typeLabel[tx.type] ?? tx.type}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-foreground">
                    {tx.orderId != null ? (
                      <span className="rounded-md border border-border/40 bg-background/40 px-2 py-1 text-xs font-semibold">
                        #{tx.orderId.toString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {tx.counterparty ? shortAddr(tx.counterparty) : "—"}
                  </td>

                  <td className="px-4 py-3 text-right text-foreground font-semibold">
                    {fmtTokens(tx.tokens)}
                  </td>

                  <td className="px-4 py-3 text-right text-foreground">
                    {fmtEthPerToken(tx.pricePerTokenWei)}
                  </td>

                  <td className="px-4 py-3 text-right text-foreground">
                    {fmtEth(tx.totalPaidWei)}
                  </td>

                  <td className="px-4 py-3 text-foreground">
                    <div className="flex flex-col">
                      <span className="text-sm">{fmtDate(tx.timestampMs)}</span>
                      <span className="text-xs text-muted-foreground">{fmtTime(tx.timestampMs)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-foreground">
                    {tx.txHash ? `${tx.txHash.slice(0, 8)}…${tx.txHash.slice(-6)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Balance footer */}
        <div className="pt-4 border-t border-border/20">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Current Balance (On-chain)</p>
              <p className="text-2xl font-bold text-primary mt-1">{currentBalanceHuman.toLocaleString()} GMCLT</p>
            </div>

            <div className="text-xs text-muted-foreground">
              Tip: if empty, increase <span className="font-semibold">lookbackBlocks</span> or use a dedicated RPC for logs.
            </div>
          </div>
        </div>
      </div>

      {/* MONTHLY PRICING TABLE (STATIC FOR DEMO) */}
      <div className="rounded-xl border border-border/40 bg-background/20 backdrop-blur p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Monthly Price Peg (15th of every month)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MONTHLY_PEGS.map((item) => (
            <div key={item.month} className="bg-background/40 border border-border/20 rounded-lg p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase">{item.month}</p>
              <p className="text-xl font-bold text-foreground mt-2">{item.peg.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">BTN</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border/40 bg-background/20 backdrop-blur p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Price Peg - {selectedYear}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 20, 30, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.8)" }}
              />
              <Bar dataKey="peg" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border/40 bg-background/20 backdrop-blur p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Price Trend - {selectedYear}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 20, 30, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.8)" }}
              />
              <Legend />
              <Line type="monotone" dataKey="peg" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
