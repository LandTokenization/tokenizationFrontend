export default function MarketPage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Market</h1>
                <p className="text-sm text-muted-foreground">
                    Simulated BID/ASK environment for the GMC-T demo token. No real orders
                    or trades occur here.
                </p>
            </div>

            {/* TOP PRICES: BID + ASK */}
            <div className="grid gap-5 md:grid-cols-2">
                {/* BID */}
                <div className="rounded-xl border border-border/40 bg-background/20 backdrop-blur p-6 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground">Highest BID</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-400">14.9 BTN</p>
                    <p className="text-xs text-muted-foreground mt-1">Buyers offering this price</p>
                </div>

                {/* ASK */}
                <div className="rounded-xl border border-border/40 bg-background/20 backdrop-blur p-6 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground">Lowest ASK</p>
                    <p className="mt-2 text-3xl font-bold text-red-400">15.2 BTN</p>
                    <p className="text-xs text-muted-foreground mt-1">Sellers asking this price</p>
                </div>
            </div>

            {/* PRICE TREND GRAPH */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Price Trend (Demo)</p>
                        <p className="text-xs text-muted-foreground">Simulated 7-point price sample</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-foreground border border-border/40">
                        Fictional
                    </span>
                </div>

                <div className="mt-4 h-44">
                    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                        {/* Baseline */}
                        <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7" />

                        {/* Fill */}
                        <polyline
                            points="0,28 15,26 30,22 45,18 60,20 75,17 100,19 100,40 0,40"
                            fill="#2563EB"
                            opacity="0.2"
                        />

                        {/* Line */}
                        <polyline
                            points="0,28 15,26 30,22 45,18 60,20 75,17 100,19"
                            fill="none"
                            stroke="#2563EB"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                        />

                        <circle cx="100" cy="19" r="2" fill="#1D4ED8" />
                    </svg>
                </div>
            </div>

            {/* ORDER BOOK (Mock) */}
            <div className="grid gap-5 md:grid-cols-2">
                {/* BID ORDER BOOK */}
                <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                    <p className="text-sm font-semibold text-foreground mb-3">BID Orders (Buyers)</p>
                    <table className="w-full text-sm">
                        <thead className="text-xs text-muted-foreground border-b border-border/40">
                            <tr>
                                <th className="text-left py-1">Price</th>
                                <th className="text-right py-1">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-foreground">
                            <tr className="border-b border-border/20">
                                <td className="py-1 text-emerald-400 font-medium">14.9 BTN</td>
                                <td className="py-1 text-right">2,000 GMC-T</td>
                            </tr>
                            <tr className="border-b border-border/20">
                                <td className="py-1 text-emerald-400 font-medium">14.8 BTN</td>
                                <td className="py-1 text-right">1,200 GMC-T</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-emerald-400 font-medium">14.7 BTN</td>
                                <td className="py-1 text-right">900 GMC-T</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ASK ORDER BOOK */}
                <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                    <p className="text-sm font-semibold text-foreground mb-3">ASK Orders (Sellers)</p>
                    <table className="w-full text-sm">
                        <thead className="text-xs text-muted-foreground border-b border-border/40">
                            <tr>
                                <th className="text-left py-1">Price</th>
                                <th className="text-right py-1">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-foreground">
                            <tr className="border-b border-border/20">
                                <td className="py-1 text-red-400 font-medium">15.2 BTN</td>
                                <td className="py-1 text-right">1,300 GMC-T</td>
                            </tr>
                            <tr className="border-b border-border/20">
                                <td className="py-1 text-red-400 font-medium">15.3 BTN</td>
                                <td className="py-1 text-right">2,500 GMC-T</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-red-400 font-medium">15.4 BTN</td>
                                <td className="py-1 text-right">800 GMC-T</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ACTION PANEL */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-4">Place Demo Order</p>

                <div className="grid sm:grid-cols-3 gap-3">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition shadow-sm">
                        Place BID (Buy)
                    </button>
                    <button className="px-4 py-2 border border-border text-foreground rounded-md text-sm font-medium hover:bg-background/30 transition">
                        Place ASK (Sell)
                    </button>
                    <button className="px-4 py-2 border border-border text-foreground rounded-md text-sm font-medium hover:bg-background/30 transition">
                        Transfer
                    </button>
                </div>
            </div>
        </div>
    );
}
