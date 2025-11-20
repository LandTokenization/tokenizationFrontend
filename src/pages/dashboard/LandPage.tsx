export default function LandPage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Land Details</h1>
                <p className="text-sm text-slate-500">
                    Overview of your registered (dummy) thram and parcel information.
                </p>
            </div>

            {/* INFO CARD */}
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
                <h2 className="text-lg font-semibold text-slate-800">Parcel Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-700">
                    <p>
                        <span className="font-medium text-slate-800">Thram ID:</span>{" "}
                        GMC-TH-0001
                    </p>
                    <p>
                        <span className="font-medium text-slate-800">Plot ID:</span>{" "}
                        PLOT-A-102
                    </p>
                    <p>
                        <span className="font-medium text-slate-800">Location:</span>{" "}
                        Mindfulness District, GMC
                    </p>
                    <p>
                        <span className="font-medium text-slate-800">Area:</span>{" "}
                        1,200 sq.m
                    </p>
                    <p>
                        <span className="font-medium text-slate-800">Valuation:</span>{" "}
                        2,500,000 BTN (dummy)
                    </p>
                    <p>
                        <span className="font-medium text-slate-800">Token Peg:</span>{" "}
                        1 GMC-T = 15 BTN
                    </p>
                </div>
            </div>

            {/* VALUATION GRAPH */}
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            Land Valuation Trend (Demo)
                        </p>
                        <p className="text-xs text-slate-500">
                            Simulated appreciation pattern for visualization only.
                        </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
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
                            stroke="#E5E7EB"
                            strokeWidth="0.7"
                        />

                        <polyline
                            points="0,32 20,28 40,26 60,18 80,15 100,12"
                            fill="none"
                            stroke="#0F172A"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        <polyline
                            points="0,40 0,32 20,28 40,26 60,18 80,15 100,12 100,40"
                            fill="#CBD5E1"
                            opacity="0.55"
                        />

                        <circle cx="100" cy="12" r="2" fill="#0F172A" />
                    </svg>
                </div>

                <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Lower valuation</span>
                    <span>Higher valuation</span>
                </div>
            </div>
        </div>
    );
}
