export default function LandPage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Land Details</h1>
                <p className="text-sm text-muted-foreground">
                    Overview of your registered (dummy) thram and parcel information.
                </p>
            </div>

            {/* INFO CARD */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Parcel Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-foreground">
                    <p>
                        <span className="font-medium text-foreground">Thram ID:</span>{" "}
                        GMC-TH-0001
                    </p>
                    <p>
                        <span className="font-medium text-foreground">Plot ID:</span>{" "}
                        PLOT-A-102
                    </p>
                    <p>
                        <span className="font-medium text-foreground">Location:</span>{" "}
                        Mindfulness District, GMC
                    </p>
                    <p>
                        <span className="font-medium text-foreground">Area:</span>{" "}
                        1,200 sq.m
                    </p>
                    <p>
                        <span className="font-medium text-foreground">Valuation:</span>{" "}
                        2,500,000 BTN (dummy)
                    </p>
                    <p>
                        <span className="font-medium text-foreground">Token Peg:</span>{" "}
                        1 GMC-T = 15 BTN
                    </p>
                </div>
            </div>

            {/* VALUATION GRAPH */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            Land Valuation Trend (Demo)
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Simulated appreciation pattern for visualization only.
                        </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-foreground border border-border/40">
                        Mock Data
                    </span>
                </div>

                <div className="mt-4 h-44">
                    <svg
                        viewBox="0 0 100 40"
                        preserveAspectRatio="none"
                        className="w-full h-full"
                    >
                        <line
                            x1="0"
                            y1="32"
                            x2="100"
                            y2="32"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="0.7"
                        />

                        <polyline
                            points="0,32 20,28 40,26 60,18 80,15 100,12"
                            fill="none"
                            stroke="#FFD700"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        <polyline
                            points="0,40 0,32 20,28 40,26 60,18 80,15 100,12 100,40"
                            fill="#FFD700"
                            opacity="0.2"
                        />

                        <circle cx="100" cy="12" r="2" fill="#FFD700" />
                    </svg>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Lower valuation</span>
                    <span>Higher valuation</span>
                </div>
            </div>
        </div>
    );
}
