import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import type { MarketSnapshot, SellOrder, LandPlotView } from "../../services/MarketplaceService";
import {
  fetchMarketSnapshot,
  subscribeMarketSnapshot,
  fetchMyPlots,
  createAskForPlot,
  cancelAsk,
  ethPerToken,
  tokensToNumber,
} from "../../services/MarketplaceService";

function shortAddr(a: string) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "-";
}

function fmtAreaAc(areaAcTimes1e4: bigint) {
  const n = Number(areaAcTimes1e4);
  return `${(n / 1e4).toFixed(4)} ac`;
}

export default function MarketPage() {
  const [snap, setSnap] = useState<MarketSnapshot | null>(null);
  const [myPlots, setMyPlots] = useState<LandPlotView[]>([]);
  const [loading, setLoading] = useState(false);
  const [plotsLoading, setPlotsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // modal
  const [askOpen, setAskOpen] = useState(false);

  // form
  const [selectedPlotId, setSelectedPlotId] = useState("");
  const [askAmount, setAskAmount] = useState("");
  const [askPriceEth, setAskPriceEth] = useState("");

  useEffect(() => {
    let off: (() => void) | null = null;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        // Fetch snapshot (includes account)
        const s = await fetchMarketSnapshot();
        setSnap(s);

        // Fetch plots if account exists
        if (s?.account) {
          setPlotsLoading(true);
          try {
            const plots = await fetchMyPlots();
            setMyPlots(plots);
            if (!selectedPlotId && plots.length) setSelectedPlotId(plots[0].plotId);
          } finally {
            setPlotsLoading(false);
          }
        }

        // Subscribe for updates
        off = await subscribeMarketSnapshot((next) => {
          setSnap(next);
        });
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load market.");
      } finally {
        setLoading(false);
      }
    })();

    return () => off?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myActiveAsks = useMemo(() => {
    if (!snap?.account) return [];
    const me = snap.account.toLowerCase();
    return (snap.asks ?? [])
      .filter((o) => o.active && o.amountRemaining > 0n)
      .filter((o) => o.seller.toLowerCase() === me)
      .sort((a, b) => Number(a.id) - Number(b.id));
  }, [snap]);

  const myStats = useMemo(() => {
    const totalOrders = myActiveAsks.length;
    const totalRemaining = myActiveAsks.reduce((s, o) => s + tokensToNumber(o.amountRemaining), 0);
    return { totalOrders, totalRemaining };
  }, [myActiveAsks]);

  async function onRefresh() {
    setLoading(true);
    setErr(null);
    try {
      const s = await fetchMarketSnapshot();
      setSnap(s);

      if (s?.account) {
        setPlotsLoading(true);
        try {
          const plots = await fetchMyPlots();
          setMyPlots(plots);
          if (!selectedPlotId && plots.length) setSelectedPlotId(plots[0].plotId);
        } finally {
          setPlotsLoading(false);
        }
      } else {
        setMyPlots([]);
        setSelectedPlotId("");
      }
    } catch (e: any) {
      setErr(e?.message ?? "Refresh failed.");
    } finally {
      setLoading(false);
    }
  }

  async function onCreateAsk() {
    setErr(null);
    try {
      if (!snap?.account) throw new Error("Connect MetaMask first.");

      if (!selectedPlotId) throw new Error("Select a plot.");
      if (!askAmount || Number(askAmount) <= 0) throw new Error("Enter amount > 0");
      if (!askPriceEth || Number(askPriceEth) <= 0) throw new Error("Enter price > 0");

      const p = myPlots.find((x) => x.plotId === selectedPlotId);
      if (!p) throw new Error("Selected plot not found.");
      if (p.myTokensFromThisPlot <= 0n) throw new Error("You hold 0 tokens from this plot.");

      // Optional strict check: don’t allow listing more than plot-tagged balance
      const requested = Number(askAmount);
      const available = tokensToNumber(p.myTokensFromThisPlot);
      if (requested > available) {
        throw new Error(`Amount exceeds your tokens from ${p.plotId}. Available: ${available.toLocaleString()} GMCLT`);
      }

      await createAskForPlot({
        plotId: selectedPlotId,
        amountTokens: askAmount,
        priceEthPerToken: askPriceEth,
      });

      setAskOpen(false);
      setAskAmount("");
      setAskPriceEth("");
      await onRefresh();
    } catch (e: any) {
      setErr(e?.message ?? "Sell order failed.");
    }
  }

  async function onCancel(order: SellOrder) {
    setErr(null);
    try {
      await cancelAsk({ orderId: order.id });
      await onRefresh();
    } catch (e: any) {
      setErr(e?.message ?? "Cancel failed.");
    }
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
          <p className="text-sm text-muted-foreground">
            Sell orders created by your wallet. New orders can be linked to a specific plot.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {snap?.account ? `Wallet: ${snap.account}` : "Wallet: Not connected"}
            {loading ? " • Loading…" : ""}
            {plotsLoading ? " • Loading plots…" : ""}
          </p>
          {err && <p className="text-xs text-red-400 mt-1">{err}</p>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="text-primary hover:text-primary/80 font-medium transition-all hover:scale-[1.02] cursor-pointer bg-primary/10 px-4 py-2 rounded-md"
          >
            🔄 Refresh
          </button>

          <button
            onClick={() => {
              setAskAmount("");
              setAskPriceEth("");
              if (!selectedPlotId && myPlots.length) setSelectedPlotId(myPlots[0].plotId);
              setAskOpen(true);
            }}
            className="text-foreground hover:text-foreground/80 font-medium transition-all hover:scale-[1.02] cursor-pointer bg-background/40 border border-border/50 px-4 py-2 rounded-md"
          >
            ➕ Create ASK
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-border/40 bg-background/20 backdrop-blur p-6 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Active Orders</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{myStats.totalOrders}</p>
          <p className="text-xs text-muted-foreground mt-1">Active sell orders</p>
        </div>

        <div className="rounded-xl border border-border/40 bg-background/20 backdrop-blur p-6 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Remaining Tokens Listed</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {myStats.totalRemaining.toLocaleString()} GMCLT
          </p>
          <p className="text-xs text-muted-foreground mt-1">Across your orders</p>
        </div>

        <div className="rounded-xl border border-border/40 bg-background/20 backdrop-blur p-6 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Plots (with tokens)</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{myPlots.length}</p>
          <p className="text-xs text-muted-foreground mt-1">From getMyInfo()</p>
        </div>
      </div>

      {/* MY ORDERS */}
      <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">Your Active ASK Orders</p>
          <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-foreground border border-border/40">
            On-chain
          </span>
        </div>

        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border/40">
            <tr>
              <th className="text-left py-2">Order</th>
              <th className="text-left py-2">Plot</th>
              <th className="text-left py-2">Seller</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Remaining</th>
              <th className="text-right py-2">Action</th>
            </tr>
          </thead>

          <tbody className="text-foreground">
            {!snap?.account ? (
              <tr>
                <td className="py-4 text-muted-foreground" colSpan={6}>
                  Connect MetaMask to see your listings.
                </td>
              </tr>
            ) : myActiveAsks.length === 0 ? (
              <tr>
                <td className="py-4 text-muted-foreground" colSpan={6}>
                  You have no active sell orders.
                </td>
              </tr>
            ) : (
              myActiveAsks.map((o) => {
                const price = ethPerToken(o.pricePerTokenWei);
                const remaining = tokensToNumber(o.amountRemaining);
                return (
                  <tr key={o.id.toString()} className="border-b border-border/20">
                    <td className="py-2 font-medium">#{o.id.toString()}</td>
                    <td className="py-2">
                      {o.plotId ? (
                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                          {o.plotId}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-2 text-muted-foreground">{shortAddr(o.seller)}</td>
                    <td className="py-2 text-right text-red-400 font-semibold">{price.toFixed(6)} TER</td>
                    <td className="py-2 text-right">{remaining.toLocaleString()} GMCLT</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => onCancel(o)}
                        className="text-red-300 hover:text-red-200 font-medium transition-all hover:scale-105 cursor-pointer bg-red-500/10 px-3 py-1 rounded-md"
                      >
                        ✖ Cancel
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE ASK MODAL */}
      {askOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl border border-primary/40 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-primary/20 border-b-2 border-primary/40 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-foreground">Create Sell Order (ASK)</h2>
                <p className="text-sm text-muted-foreground mt-1">This will link your order to a plotId</p>
              </div>
              <button onClick={() => setAskOpen(false)} className="text-foreground hover:text-primary transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Plot select */}
              <div>
                <label className="text-sm font-semibold text-foreground">Select Plot</label>
                <select
                  value={selectedPlotId}
                  onChange={(e) => setSelectedPlotId(e.target.value)}
                  disabled={!snap?.account || plotsLoading}
                  className="mt-2 w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm outline-none focus:border-primary/60"
                >
                  {!snap?.account ? (
                    <option value="">Connect wallet first</option>
                  ) : plotsLoading ? (
                    <option value="">Loading plots…</option>
                  ) : myPlots.length === 0 ? (
                    <option value="">No plots/tokens found for your wallet</option>
                  ) : (
                    <>
                      <option value="">Select a plot…</option>
                      {myPlots.map((p) => (
                        <option key={p.plotId} value={p.plotId}>
                          {p.plotId} • {p.dzongkhag}, {p.gewog} • You hold {tokensToNumber(p.myTokensFromThisPlot).toLocaleString()} GMCLT
                        </option>
                      ))}
                    </>
                  )}
                </select>

                {/* Plot preview */}
                {selectedPlotId ? (
                  <div className="mt-2 text-xs text-muted-foreground rounded-md border border-border/40 bg-background/30 p-3 space-y-1">
                    {(() => {
                      const p = myPlots.find((x) => x.plotId === selectedPlotId);
                      if (!p) return <div>Plot not found.</div>;
                      return (
                        <>
                          <div className="flex justify-between">
                            <span>Location</span>
                            <span className="text-foreground/90">
                              {p.dzongkhag}, {p.gewog}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Thram</span>
                            <span className="text-foreground/90">{p.thram}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Type</span>
                            <span className="text-foreground/90">{p.landType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Class</span>
                            <span className="text-foreground/90">{p.plotClass}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Area</span>
                            <span className="text-foreground/90">{fmtAreaAc(p.areaAc)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Your tokens</span>
                            <span className="text-foreground/90">
                              {tokensToNumber(p.myTokensFromThisPlot).toLocaleString()} GMCLT
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">Amount (GMCLT)</label>
                <input
                  value={askAmount}
                  onChange={(e) => setAskAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className="mt-2 w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm outline-none focus:border-primary/60"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">Price per token (ETH)</label>
                <input
                  value={askPriceEth}
                  onChange={(e) => setAskPriceEth(e.target.value)}
                  placeholder="e.g. 0.005"
                  className="mt-2 w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm outline-none focus:border-primary/60"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Calls <span className="font-semibold">createSellOrderForPlot(plotId, amount, pricePerTokenWei)</span>
                </p>
              </div>

              <button
                onClick={onCreateAsk}
                disabled={!snap?.account || plotsLoading || myPlots.length === 0}
                className="w-full text-center text-primary hover:text-primary/80 font-semibold transition-all hover:scale-[1.01] cursor-pointer bg-primary/10 px-4 py-3 rounded-md disabled:opacity-50"
              >
                ✅ Create ASK
              </button>

              {err && <p className="text-xs text-red-400">{err}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
