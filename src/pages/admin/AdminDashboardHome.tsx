export default function AdminDashboardHome() {
    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Admin Overview
                </h1>
                <p className="text-sm text-muted-foreground">
                    Control dummy users, land records, token parameters, and content for
                    the GMC tokenization prototype.
                </p>
            </div>

            {/* TOP METRIC CARDS */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground">
                        Total Demo Users
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">42</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                        Includes citizen and admin accounts (dummy).
                    </p>
                </div>

                <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground">
                        Land Records
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">18</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                        Thram & parcel entries used in the demo.
                    </p>
                </div>

                <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground">
                        Token Price (Demo)
                    </p>
                    <p className="mt-2 text-xl font-semibold text-foreground">
                        1 GMC-T = 15 BTN
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                        Configure under Token & Valuation.
                    </p>
                </div>
            </div>

            {/* GRAPHS ROW */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* GMC TOKEN PRICE GRAPH */}
                <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                GMC Token Price (Last 7 Points)
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Mock price movement in BTN (ups & downs)
                            </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Demo Data
                        </span>
                    </div>

                    <div className="mt-4 h-40">
                        <svg
                            viewBox="0 0 100 40"
                            className="w-full h-full"
                            preserveAspectRatio="none"
                        >
                            {/* Background grid line */}
                            <line
                                x1="0"
                                y1="30"
                                x2="100"
                                y2="30"
                                stroke="#E5E7EB"
                                strokeWidth="0.5"
                            />
                            {/* Area fill */}
                            <polyline
                                points="0,28 16,18 32,22 48,10 64,20 80,14 100,18 100,40 0,40"
                                fill="#DBEAFE"
                                opacity="0.7"
                            />
                            {/* Price line */}
                            <polyline
                                points="0,28 16,18 32,22 48,10 64,20 80,14 100,18"
                                fill="none"
                                stroke="#2563EB"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            {/* Last point dot */}
                            <circle cx="100" cy="18" r="1.8" fill="#1D4ED8" />
                        </svg>
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>Older</span>
                        <span>Newer</span>
                    </div>
                </div>

                {/* GMC TOKEN VOLUME / ACTIVITY GRAPH */}
                <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                GMC Token Activity (Volume Index)
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Mock transaction activity showing spikes and drops
                            </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                            Simulated
                        </span>
                    </div>

                    <div className="mt-4 h-40">
                        <svg
                            viewBox="0 0 100 40"
                            className="w-full h-full"
                            preserveAspectRatio="none"
                        >
                            {/* Baseline */}
                            <line
                                x1="0"
                                y1="32"
                                x2="100"
                                y2="32"
                                stroke="#E5E7EB"
                                strokeWidth="0.5"
                            />
                            {/* Area fill */}
                            <polyline
                                points="0,32 16,26 32,34 48,20 64,30 80,16 100,24 100,40 0,40"
                                fill="#E5E7EB"
                                opacity="0.8"
                            />
                            {/* Volume line */}
                            <polyline
                                points="0,32 16,26 32,34 48,20 64,30 80,16 100,24"
                                fill="none"
                                stroke="#0F172A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="80" cy="16" r="1.8" fill="#0F172A" />
                        </svg>
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>Low activity</span>
                        <span>High activity</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
