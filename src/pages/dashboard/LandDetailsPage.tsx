export default function LandDetailsPage() {
    const userName = "Yeshi Gyeltshen";
    const cid = "12000000072";

    const landDetails = [
        {
            thramNo: 2583,
            location: "Gelephu Throm",
            ownerType: "INDIVIDUAL OWNER",
            owner: `${userName} | ${cid}`,
            plots: [
                {
                    plotId: "GT1-747",
                    precinct: "Urban Village 2",
                    landType: undefined,
                    netArea: 5184,
                    lap: "SP104/ Gelephu Thromde LAP 4",
                    plotClass: undefined,
                    mortgage: "No",
                    structure: "No",
                    acquired: "Yes",
                    remarks: "Plot GT1-747 acquisition date- 27/11/25",
                    action: undefined
                }
            ],
            totalArea: 5184
        },
        {
            thramNo: 474,
            location: "Sarpang | Sarpang",
            ownerType: "JOINT OWNER",
            owner: `${userName} | ${cid}`,
            plots: [
                {
                    plotId: "SP1-631",
                    precinct: "Urban Core",
                    landType: undefined,
                    netArea: 1982,
                    lap: "SP201/ Sechamthang LAP",
                    plotClass: undefined,
                    mortgage: "Yes",
                    structure: "Yes",
                    acquired: "No",
                    remarks: "",
                    action: "View PLR"
                }
            ],
            totalArea: 1982
        },
        {
            thramNo: 63,
            location: "Sarpang | Gelephu",
            ownerType: "JOINT OWNER",
            owner: `${userName} | ${cid}`,
            plots: [
                {
                    plotId: "GEL-296",
                    precinct: undefined,
                    landType: "Kamzhing",
                    netArea: 0.10,
                    lap: undefined,
                    plotClass: "Class A1",
                    mortgage: "No",
                    structure: "No",
                    acquired: "No",
                    remarks: "Holds 50% land share of 0.10 acres",
                    action: undefined
                }
            ],
            totalArea: 0.10
        },
        {
            thramNo: 120,
            location: "Sarpang | Samtenling",
            ownerType: "INDIVIDUAL OWNER",
            owner: `${userName} | ${cid}`,
            plots: [
                {
                    plotId: "BHU-1120",
                    precinct: undefined,
                    landType: "Kamzhing",
                    netArea: 1.00,
                    lap: undefined,
                    plotClass: "Class A",
                    mortgage: "No",
                    structure: "No",
                    acquired: "Yes",
                    remarks: "Plot BHU-1120 acquisition date- 17/12/25",
                    action: undefined
                },
                {
                    plotId: "BHU-1121",
                    precinct: undefined,
                    landType: "Kamzhing",
                    netArea: 0.50,
                    lap: undefined,
                    plotClass: "Class A",
                    mortgage: "No",
                    structure: "No",
                    acquired: "No",
                    remarks: "",
                    action: undefined
                },
                {
                    plotId: "BHU-1122",
                    precinct: undefined,
                    landType: "Kamzhing",
                    netArea: 0.27,
                    lap: undefined,
                    plotClass: "Class A",
                    mortgage: "No",
                    structure: "No",
                    acquired: "No",
                    remarks: "",
                    action: undefined
                }
            ],
            totalArea: 1.77
        }
    ];

    const structureDetails = {
        plotId: "SP1-631",
        landShare: "1982 sq.ft",
        structures: [
            {
                buildingNo: 18669,
                flatNo: "1-01",
                plr: 991,
                ownerType: "Individual",
                ownerDetail: `${userName} | ${cid}`,
                flatType: "Commercial",
                mortgage: "No",
                active: true
            },
            {
                buildingNo: 18669,
                flatNo: "1-02",
                plr: 991,
                ownerType: "Individual",
                ownerDetail: `${userName} | ${cid}`,
                flatType: "Residential",
                mortgage: "Yes",
                active: false
            }
        ]
    };

    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Land Details</h1>
                <p className="text-sm text-muted-foreground">
                    {userName} | {cid}
                </p>
            </div>

            {/* LAND DETAILS SECTIONS */}
            {landDetails.map((land, index) => (
                <div key={index} className="space-y-4">
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Thram No: {land.thramNo} | {land.location}
                    </div>

                    <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-4">
                        <h3 className="text-base font-semibold text-foreground">
                            PLOT DETAILS ({land.ownerType} - {land.owner})
                        </h3>

                        <div className="overflow-x-auto rounded-lg border border-border/60 bg-background/40">
                            <table className="w-full text-xs md:text-sm">
                                <thead>
                                    <tr className="bg-primary/15 border-b-2 border-primary/30">
                                        <th className="text-left py-3 px-4 font-bold text-foreground">Sl No</th>
                                        <th className="text-left py-3 px-4 font-bold text-foreground">Plot ID</th>
                                        <th className="text-left py-3 px-4 font-bold text-foreground">
                                            {land.plots[0].landType ? "Land Type" : "Precinct"}
                                        </th>
                                        <th className="text-left py-3 px-4 font-bold text-foreground">
                                            {land.plots[0].landType ? "Land share (Acres)" : "Net Area (sq.ft)"}
                                        </th>
                                        <th className="text-left py-3 px-4 font-bold text-foreground">
                                            {land.plots[0].plotClass ? "Plot Class" : "LAP"}
                                        </th>
                                        <th className="text-left py-3 px-4 font-bold text-foreground">Mortgage</th>
                                        <th className="text-left py-3 px-4 font-bold text-foreground">Structure</th>
                                        <th className="text-left py-3 px-4 font-bold text-foreground">Acquired</th>
                                        {land.plots[0].action && (
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Action</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {land.plots.map((plot, pIndex) => (
                                        <tr key={pIndex} className={`border-b border-border/30 transition-colors ${
                                            pIndex % 2 === 0 ? 'bg-background/20' : 'bg-background/10'
                                        } hover:bg-primary/10 hover:border-primary/40`}>
                                            <td className="py-3 px-4 text-foreground font-medium">{pIndex + 1}</td>
                                            <td className="py-3 px-4 text-foreground font-bold text-primary">{plot.plotId}</td>
                                            <td className="py-3 px-4 text-foreground font-medium">
                                                {plot.precinct || plot.landType}
                                            </td>
                                            <td className="py-3 px-4 text-foreground font-bold text-lg">{plot.netArea}</td>
                                            <td className="py-3 px-4 text-foreground text-xs font-medium">
                                                {plot.lap || plot.plotClass}
                                            </td>
                                            <td className="py-3 px-4 text-foreground font-medium">{plot.mortgage}</td>
                                            <td className="py-3 px-4 text-foreground font-medium">{plot.structure}</td>
                                            <td className="py-3 px-4 text-foreground font-medium">{plot.acquired}</td>
                                            {plot.action && (
                                                <td className="py-3 px-4 text-foreground">
                                                    <button className="text-primary hover:text-primary/80 font-medium transition-all hover:scale-105 cursor-pointer bg-primary/10 px-2 py-1 rounded text-xs">
                                                        👀 {plot.action}
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-3 border-t border-border/20">
                            <p className="text-sm font-semibold text-foreground">
                                Total Net Area: {land.totalArea} {land.plots[0].landType ? "Acres" : "sq.ft"}
                            </p>
                            {land.plots[0].remarks && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    <span className="font-semibold">Remarks:</span> {land.plots[0].remarks}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* STRUCTURE DETAILS */}
            <div className="space-y-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Plot ID: {structureDetails.plotId} | Land Share: {structureDetails.landShare}
                </div>

                <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-semibold text-foreground">
                        STRUCTURE DETAILS ({userName})
                    </h3>

                    <div className="overflow-x-auto rounded-lg border border-border/60 bg-background/40">
                        <table className="w-full text-xs md:text-sm">
                            <thead>
                                <tr className="bg-primary/15 border-b-2 border-primary/30">
                                    <th className="text-left py-3 px-4 font-bold text-foreground">Status</th>
                                    <th className="text-left py-3 px-4 font-bold text-foreground">Building No</th>
                                    <th className="text-left py-3 px-4 font-bold text-foreground">Flat No.</th>
                                    <th className="text-left py-3 px-4 font-bold text-foreground">PLR (sq.ft)</th>
                                    <th className="text-left py-3 px-4 font-bold text-foreground">Owner Type</th>
                                    <th className="text-left py-3 px-4 font-bold text-foreground">Owner Detail</th>
                                    <th className="text-left py-3 px-4 font-bold text-foreground">Flat Type</th>
                                    <th className="text-left py-3 px-4 font-bold text-foreground">Mortgage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {structureDetails.structures.map((struct, sIndex) => (
                                    <tr key={sIndex} className={`border-b border-border/30 transition-colors ${
                                        sIndex % 2 === 0 ? 'bg-background/20' : 'bg-background/10'
                                    } hover:bg-primary/10 hover:border-primary/40 ${
                                        struct.active ? 'border-l-4 border-l-primary' : ''
                                    }`}>
                                        <td className="py-3 px-4 text-foreground text-xl">
                                            {struct.active ? (
                                                <span className="text-primary font-bold">➡️</span>
                                            ) : (
                                                <span className="text-foreground/30">•</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-foreground font-bold">{struct.buildingNo}</td>
                                        <td className="py-3 px-4 text-foreground font-bold text-primary">{struct.flatNo}</td>
                                        <td className="py-3 px-4 text-foreground font-bold text-lg">{struct.plr}</td>
                                        <td className="py-3 px-4 text-foreground text-xs font-medium">{struct.ownerType}</td>
                                        <td className="py-3 px-4 text-foreground text-xs">{struct.ownerDetail}</td>
                                        <td className="py-3 px-4 text-foreground text-xs font-medium bg-primary/10 rounded px-2 py-1 inline-block">{struct.flatType}</td>
                                        <td className="py-3 px-4 text-foreground font-medium">{struct.mortgage}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
