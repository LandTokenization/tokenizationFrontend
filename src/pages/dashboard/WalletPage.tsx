export default function WalletPage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Token Wallet</h1>
                <p className="text-sm text-muted-foreground">
                    Your simulated GMC-T holdings for the compensation token demo.
                </p>
            </div>

            {/* WALLET SUMMARY CARD */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-5">
                <div>
                    <p className="text-xs font-medium text-muted-foreground">Wallet Address</p>
                    <p className="mt-1 text-sm font-mono text-foreground bg-background/40 px-3 py-2 rounded-md border border-border/40 inline-block">
                        0xGMCDEMO…1234
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Balance */}
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Balance</p>
                        <p className="mt-2 text-3xl font-bold text-foreground">
                            12,500 GMC-T
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            ≈ 187,500 BTN
                        </p>
                    </div>

                    {/* Mini Balance Trend Graph */}
                    <div className="h-28 mt-4 md:mt-0">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                            {/* Baseline */}
                            <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />

                            {/* Filled Area */}
                            <polyline
                                points="0,30 20,22 40,26 60,14 80,18 100,16 100,40 0,40"
                                fill="#2563EB"
                                opacity="0.2"
                            />

                            {/* Line */}
                            <polyline
                                points="0,30 20,22 40,26 60,14 80,18 100,16"
                                stroke="#2563EB"
                                strokeWidth="1.7"
                                fill="none"
                                strokeLinecap="round"
                            />

                            <circle cx="100" cy="16" r="2" fill="#1D4ED8" />
                        </svg>
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="pt-4 border-t border-border/40 flex gap-3">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition shadow-sm">
                        Buy Tokens
                    </button>
                    <button className="px-4 py-2 border border-border rounded-md text-foreground text-sm font-medium hover:bg-background/30 transition">
                        Sell Tokens
                    </button>
                    <button className="px-4 py-2 border border-border rounded-md text-foreground text-sm font-medium hover:bg-background/30 transition">
                        Transfer
                    </button>
                </div>
            </div>

            {/* ADDITIONAL INFO */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-3">
                    Notes (Demo Environment)
                </p>
                <ul className="space-y-1 text-sm text-foreground">
                    <li>• This wallet is simulated and contains fictional balances.</li>
                    <li>• No real payment or blockchain actions occur in this prototype.</li>
                    <li>• Token price is pegged to the demo valuation engine.</li>
                </ul>
            </div>
        </div>
    );
}
