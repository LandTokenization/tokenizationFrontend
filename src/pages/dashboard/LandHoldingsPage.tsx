export default function LandHoldingsPage() {
    const userName = "Yeshi Gyeltshen";
    const cid = "12000000072";

    const urbanLands = [
        {
            id: 1,
            location: "Gelephu Throm",
            thram: "2583",
            owners: "Yeshi Gyeltshen | 12000000072",
            ownershipType: "Individual Ownership",
            netArea: 5184,
            action: "View Plots"
        },
        {
            id: 2,
            location: "Sarpang|Sarpang",
            thram: "474",
            owners: "1. Yeshi Gyeltshen | 12000000072\n2. Tandy Wangmo | 10111111139",
            ownershipType: "Joint Ownership",
            netArea: 3964,
            action: "View Plots"
        }
    ];

    const ruralLands = [
        {
            id: 1,
            location: "Sarpang|Gelephu",
            thram: "63",
            owners: "1. Yeshi Gyeltshen | 12000000072\n2. Tandy Wangmo | 10111111139",
            ownershipType: "Joint Ownership",
            netArea: 0.20,
            action: ""
        },
        {
            id: 2,
            location: "Sarpang|Samtenling",
            thram: "120",
            owners: "Yeshi Gyeltshen | 12000000072",
            ownershipType: "Individual Ownership",
            netArea: 1.77,
            action: ""
        },
        {
            id: 3,
            location: "Sarpang|Dekiling",
            thram: "863",
            owners: "Tashi Wangchuk | 12000000075",
            ownershipType: "Family Ownership",
            netArea: 4.05,
            action: ""
        }
    ];

    const urbanTotal = 9148;
    const ruralTotal = 6.02;
    const totalHolding = 6.23;

    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    GMC LAND HOLDING
                </h1>
                <p className="text-sm text-muted-foreground">
                    {userName} | {cid}
                </p>
            </div>

            {/* URBAN LAND HOLDING */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                    URBAN LAND HOLDING STATUS
                </h2>

                <div className="overflow-x-auto rounded-lg border border-border/60 bg-background/40">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-primary/15 border-b-2 border-primary/30">
                                <th className="text-left py-3 px-4 font-bold text-foreground">Sl No</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Location</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Thram</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Owner Detail</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Ownership Type</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Net Area (sq.ft)</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {urbanLands.map((land, idx) => (
                                <tr key={land.id} className={`border-b border-border/30 transition-colors ${
                                    idx % 2 === 0 ? 'bg-background/20' : 'bg-background/10'
                                } hover:bg-primary/10 hover:border-primary/40`}>
                                    <td className="py-3 px-4 text-foreground font-medium">{land.id}</td>
                                    <td className="py-3 px-4 text-foreground font-medium">{land.location}</td>
                                    <td className="py-3 px-4 text-foreground font-bold text-primary">{land.thram}</td>
                                    <td className="py-3 px-4 text-foreground text-xs whitespace-pre-line">
                                        {land.owners}
                                    </td>
                                    <td className="py-3 px-4 text-foreground text-xs font-medium">{land.ownershipType}</td>
                                    <td className="py-3 px-4 text-foreground font-bold text-lg">{land.netArea.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-foreground">
                                        {land.action && (
                                            <button className="text-primary hover:text-primary/80 font-medium transition-all hover:scale-105 cursor-pointer bg-primary/10 px-3 py-1 rounded-md">
                                                👀 {land.action}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-primary/20 font-bold border-t-2 border-primary/30">
                                <td colSpan={5} className="py-3 px-4 text-foreground text-right">
                                    Urban Land Holding (TOTAL)
                                </td>
                                <td className="py-3 px-4 text-foreground text-lg">{urbanTotal.toLocaleString()}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RURAL LAND HOLDING */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                    RURAL LAND HOLDING STATUS
                </h2>

                <div className="overflow-x-auto rounded-lg border border-border/60 bg-background/40">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-primary/15 border-b-2 border-primary/30">
                                <th className="text-left py-3 px-4 font-bold text-foreground">Sl No</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Location</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Thram</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Owner Detail</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Ownership Type</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Net Area (Acres)</th>
                                <th className="text-left py-3 px-4 font-bold text-foreground">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ruralLands.map((land, idx) => (
                                <tr key={land.id} className={`border-b border-border/30 transition-colors ${
                                    idx % 2 === 0 ? 'bg-background/20' : 'bg-background/10'
                                } hover:bg-primary/10 hover:border-primary/40`}>
                                    <td className="py-3 px-4 text-foreground font-medium">{land.id}</td>
                                    <td className="py-3 px-4 text-foreground font-medium">{land.location}</td>
                                    <td className="py-3 px-4 text-foreground font-bold text-primary">{land.thram}</td>
                                    <td className="py-3 px-4 text-foreground text-xs whitespace-pre-line">
                                        {land.owners}
                                    </td>
                                    <td className="py-3 px-4 text-foreground text-xs font-medium">{land.ownershipType}</td>
                                    <td className="py-3 px-4 text-foreground font-bold text-lg">{land.netArea}</td>
                                    <td className="py-3 px-4 text-foreground">
                                        {land.action && (
                                            <button className="text-primary hover:text-primary/80 font-medium transition-all hover:scale-105 cursor-pointer bg-primary/10 px-3 py-1 rounded-md">
                                                {land.action}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-primary/20 font-bold border-t-2 border-primary/30">
                                <td colSpan={5} className="py-3 px-4 text-foreground text-right">
                                    Rural Land Holding (TOTAL)
                                </td>
                                <td className="py-3 px-4 text-foreground text-lg">{ruralTotal}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TOTAL SUMMARY */}
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Urban Land Total</p>
                        <p className="text-2xl font-bold text-foreground mt-2">{urbanTotal.toLocaleString()} sq.ft</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Rural Land Total</p>
                        <p className="text-2xl font-bold text-foreground mt-2">{ruralTotal} Acres</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Total GMC Land Holding</p>
                        <p className="text-2xl font-bold text-foreground mt-2">{totalHolding} Acres</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
