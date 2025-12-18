import { useState } from "react";
import { X } from "lucide-react";

export default function LandPage() {
    const userName = "Yeshi Gyeltshen";
    const cid = "12000000072";

    const [selectedThram, setSelectedThram] = useState<number | null>(null);
    const [selectedPlotForStructure, setSelectedPlotForStructure] = useState<string | null>(null);

    const urbanLands = [
        {
            id: 1,
            location: "Gelephu Throm",
            thram: 2583,
            owners: "Yeshi Gyeltshen | 12000000072",
            ownershipType: "Individual Ownership",
            netArea: 5184,
        },
        {
            id: 2,
            location: "Sarpang|Sarpang",
            thram: 474,
            owners: "1. Yeshi Gyeltshen | 12000000072\n2. Tandy Wangmo | 10111111139",
            ownershipType: "Joint Ownership",
            netArea: 3964,
        }
    ];

    const ruralLands = [
        {
            id: 1,
            location: "Sarpang|Gelephu",
            thram: 63,
            owners: "1. Yeshi Gyeltshen | 12000000072\n2. Tandy Wangmo | 10111111139",
            ownershipType: "Joint Ownership",
            netArea: 0.20,
        },
        {
            id: 2,
            location: "Sarpang|Samtenling",
            thram: 120,
            owners: "Yeshi Gyeltshen | 12000000072",
            ownershipType: "Individual Ownership",
            netArea: 1.77,
        },
        {
            id: 3,
            location: "Sarpang|Dekiling",
            thram: 863,
            owners: "Tashi Wangchuk | 12000000075",
            ownershipType: "Family Ownership",
            netArea: 4.05,
        }
    ];

    const tramDetails: Record<number, any> = {
        2583: {
            location: "Gelephu Throm",
            ownerType: "INDIVIDUAL OWNER",
            owner: "Yeshi Gyeltshen | 12000000072",
            plots: [
                {
                    plotId: "GT1-747",
                    precinct: "Urban Village 2",
                    netArea: 5184,
                    lap: "SP104/ Gelephu Thromde LAP 4",
                    mortgage: "No",
                    structure: "No",
                    acquired: "Yes",
                    remarks: "Plot GT1-747 acquisition date- 27/11/25"
                }
            ],
            totalArea: 5184
        },
        474: {
            location: "Sarpang | Sarpang",
            ownerType: "JOINT OWNER",
            owner: "Yeshi Gyeltshen | 12000000072",
            plots: [
                {
                    plotId: "SP1-631",
                    precinct: "Urban Core",
                    netArea: 1982,
                    lap: "SP201/ Sechamthang LAP",
                    mortgage: "Yes",
                    structure: "Yes",
                    acquired: "No",
                    remarks: "",
                    action: "View PLR"
                }
            ],
            totalArea: 1982
        },
        63: {
            location: "Sarpang | Gelephu",
            ownerType: "JOINT OWNER",
            owner: "Yeshi Gyeltshen | 12000000072",
            plots: [
                {
                    plotId: "GEL-296",
                    landType: "Kamzhing",
                    netArea: 0.10,
                    plotClass: "Class A1",
                    mortgage: "No",
                    structure: "No",
                    acquired: "No",
                    remarks: "Holds 50% land share of 0.10 acres"
                }
            ],
            totalArea: 0.10,
            isRural: true
        },
        120: {
            location: "Sarpang | Samtenling",
            ownerType: "INDIVIDUAL OWNER",
            owner: "Yeshi Gyeltshen | 12000000072",
            plots: [
                {
                    plotId: "BHU-1120",
                    landType: "Kamzhing",
                    netArea: 1.00,
                    plotClass: "Class A",
                    mortgage: "No",
                    structure: "No",
                    acquired: "Yes",
                    remarks: "Plot BHU-1120 acquisition date- 17/12/25"
                },
                {
                    plotId: "BHU-1121",
                    landType: "Chhuzhing",
                    netArea: 0.50,
                    plotClass: "Class A",
                    mortgage: "No",
                    structure: "No",
                    acquired: "No"
                },
                {
                    plotId: "BHU-1122",
                    landType: "Residential",
                    netArea: 0.27,
                    plotClass: "Class A",
                    mortgage: "No",
                    structure: "No",
                    acquired: "No"
                }
            ],
            totalArea: 1.77,
            isRural: true
        }
    };

    const structureDetails: Record<string, any> = {
        "SP1-631": {
            plotId: "SP1-631",
            landShare: "1982 sq.ft",
            structures: [
                {
                    buildingNo: 18669,
                    flatNo: "1-01",
                    plr: 991,
                    ownerType: "Individual",
                    ownerDetail: "Yeshi Gyeltshen | 12000000072",
                    flatType: "Commercial",
                    mortgage: "No",
                    active: true
                },
                {
                    buildingNo: 18669,
                    flatNo: "1-02",
                    plr: 991,
                    ownerType: "Individual",
                    ownerDetail: "Yeshi Gyeltshen | 12000000072",
                    flatType: "Residential",
                    mortgage: "Yes",
                    active: false
                }
            ]
        }
    };

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
                                        <button 
                                            onClick={() => setSelectedThram(land.thram)}
                                            className="text-primary hover:text-primary/80 font-medium transition-all hover:scale-105 cursor-pointer bg-primary/10 px-3 py-1 rounded-md"
                                        >
                                            👀 View Plots
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-primary/20 font-bold border-t-2 border-primary/30">
                                <td colSpan={5} className="py-3 px-4 text-foreground text-right">
                                    Urban Land Holding (TOTAL)
                                </td>
                                <td className="py-3 px-4 text-foreground text-lg">9148</td>
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
                                        {land.thram !== 863 && (
                                            <button 
                                                onClick={() => setSelectedThram(land.thram)}
                                                className="text-primary hover:text-primary/80 font-medium transition-all hover:scale-105 cursor-pointer bg-primary/10 px-3 py-1 rounded-md"
                                            >
                                                👀 View Plots
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-primary/20 font-bold border-t-2 border-primary/30">
                                <td colSpan={5} className="py-3 px-4 text-foreground text-right">
                                    Rural Land Holding (TOTAL)
                                </td>
                                <td className="py-3 px-4 text-foreground text-lg">6.02</td>
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
                        <p className="text-2xl font-bold text-foreground mt-2">9,148 sq.ft</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Rural Land Total</p>
                        <p className="text-2xl font-bold text-foreground mt-2">6.02 Acres</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Total GMC Land Holding</p>
                        <p className="text-2xl font-bold text-foreground mt-2">6.23 Acres</p>
                    </div>
                </div>
            </div>

            {/* MODAL: Plot Details */}
            {selectedThram && tramDetails[selectedThram] && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl border border-primary/40 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-primary/20 border-b-2 border-primary/40 p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-foreground">
                                    Thram No: {selectedThram} | {tramDetails[selectedThram].location}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    PLOT DETAILS ({tramDetails[selectedThram].ownerType} - {tramDetails[selectedThram].owner})
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                    setSelectedThram(null);
                                    setSelectedPlotForStructure(null);
                                }}
                                className="text-foreground hover:text-primary transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Plot Details Table */}
                            <div className="overflow-x-auto rounded-lg border-2 border-primary/40 bg-background/60">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-primary/30 border-b-3 border-primary/50">
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Sl No</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Plot ID</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">
                                                {tramDetails[selectedThram].plots[0].landType ? "Land Type" : "Precinct"}
                                            </th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">
                                                {tramDetails[selectedThram].plots[0].landType ? "Net Area (Acres)" : "Net Area (sq.ft)"}
                                            </th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">
                                                {tramDetails[selectedThram].plots[0].plotClass ? "Plot Class" : "LAP"}
                                            </th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Mortgage</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Structure</th>
                                            <th className="text-left py-3 px-4 font-bold text-foreground">Acquired</th>
                                            {tramDetails[selectedThram].plots[0].action && (
                                                <th className="text-left py-3 px-4 font-bold text-foreground">Action</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tramDetails[selectedThram].plots.map((plot: any, pIndex: number) => (
                                            <tr key={pIndex} className={`border-b border-primary/20 transition-colors ${
                                                pIndex % 2 === 0 ? 'bg-background/40' : 'bg-background/60'
                                            } hover:bg-primary/20 hover:border-primary/50`}>
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
                                                        <button 
                                                            onClick={() => setSelectedPlotForStructure(plot.plotId)}
                                                            className="text-primary hover:text-primary/80 font-medium transition-all hover:scale-105 cursor-pointer bg-primary/10 px-2 py-1 rounded text-xs"
                                                        >
                                                            👀 {plot.action}
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Total Net Area */}
                            <div className="pt-3 border-t border-border/20">
                                <p className="text-sm font-semibold text-foreground">
                                    Total Net Area (Sq.ft): {tramDetails[selectedThram].totalArea.toLocaleString()}
                                </p>
                                {tramDetails[selectedThram].plots[0].remarks && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        <span className="font-semibold">Remarks:</span> {tramDetails[selectedThram].plots[0].remarks}
                                    </p>
                                )}
                            </div>

                            {/* Structure Details Modal */}
                            {selectedPlotForStructure && structureDetails[selectedPlotForStructure] && (
                                <div className="pt-6 border-t-2 border-primary/30 space-y-4">
                                    <div>
                                        <h3 className="text-base font-bold text-foreground">
                                            Plot ID: {selectedPlotForStructure} | Land Share: {structureDetails[selectedPlotForStructure].landShare}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            STRUCTURE DETAILS ({userName})
                                        </p>
                                    </div>

                                    <div className="overflow-x-auto rounded-lg border-2 border-primary/40 bg-background/60">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-primary/30 border-b-3 border-primary/50">
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
                                                {structureDetails[selectedPlotForStructure].structures.map((struct: any, sIndex: number) => (
                                                    <tr key={sIndex} className={`border-b border-primary/20 transition-colors ${
                                                        sIndex % 2 === 0 ? 'bg-background/40' : 'bg-background/60'
                                                    } hover:bg-primary/20 hover:border-primary/50 ${
                                                        struct.active ? 'border-l-4 border-l-primary ring-1 ring-primary/20' : ''
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
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
