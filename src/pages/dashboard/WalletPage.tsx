export default function WalletPage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Token Wallet</h1>
                <p className="text-sm text-slate-500">
                    Your simulated GMC-T holdings for the compensation token demo.
                </p>
            </div>

            {/* WALLET SUMMARY CARD */}
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
                <div>
                    <p className="text-xs font-medium text-slate-500">Wallet Address</p>
                    <p className="mt-1 text-sm font-mono text-slate-700 bg-slate-50 px-3 py-2 rounded-md border border-slate-200 inline-block">
                        0xGMCDEMO…1234
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Balance */}
                    <div>
                        <p className="text-xs font-medium text-slate-500">Balance</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            12,500 GMC-T
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            ≈ 187,500 BTN
                        </p>
                    </div>

                    {/* Mini Balance Trend Graph */}
                    <div className="h-28 mt-4 md:mt-0">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                            {/* Baseline */}
                            <line x1="0" y1="30" x2="100" y2="30" stroke="#E5E7EB" strokeWidth="0.6" />

                            {/* Filled Area */}
                            <polyline
                                points="0,30 20,22 40,26 60,14 80,18 100,16 100,40 0,40"
                                fill="#DBEAFE"
                                opacity="0.55"
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
                <div className="pt-4 border-t border-slate-200 flex gap-3">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition shadow-sm">
                        Buy Tokens
                    </button>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-100 transition">
                        Sell Tokens
                    </button>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-100 transition">
                        Transfer
                    </button>
                </div>
            </div>

            {/* ADDITIONAL INFO */}
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-800 mb-3">
                    Notes (Demo Environment)
                </p>
                <ul className="space-y-1 text-sm text-slate-700">
                    <li>• This wallet is simulated and contains fictional balances.</li>
                    <li>• No real payment or blockchain actions occur in this prototype.</li>
                    <li>• Token price is pegged to the demo valuation engine.</li>
                </ul>
            </div>
        </div>
    );
}
