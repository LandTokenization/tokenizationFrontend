import { useState } from "react";

type LandRecord = {
    id: number;
    thramId: string;
    plotId: string;
    location: string;
    areaSqm: number;
    valuationBtn: number;
};

const initialLand: LandRecord[] = [
    {
        id: 1,
        thramId: "GMC-TH-0001",
        plotId: "PLOT-A-102",
        location: "Mindfulness District",
        areaSqm: 1200,
        valuationBtn: 2500000,
    },
];

export default function AdminLandPage() {
    const [landRecords, setLandRecords] = useState<LandRecord[]>(initialLand);
    const [form, setForm] = useState<Omit<LandRecord, "id">>({
        thramId: "",
        plotId: "",
        location: "",
        areaSqm: 0,
        valuationBtn: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                name === "areaSqm" || name === "valuationBtn"
                    ? Number(value)
                    : value,
        }));
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.thramId || !form.plotId) return;

        setLandRecords((prev) => [...prev, { id: prev.length + 1, ...form }]);
        setForm({
            thramId: "",
            plotId: "",
            location: "",
            areaSqm: 0,
            valuationBtn: 0,
        });
    };

    const handleDelete = (id: number) => {
        setLandRecords((prev) => prev.filter((l) => l.id !== id));
    };

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Land & Thram Records
                </h1>
                <p className="text-sm text-slate-500">
                    Manage demo land valuations and parcel details for the prototype.
                </p>
            </div>

            {/* FORM CARD */}
            <form
                onSubmit={handleAdd}
                className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-6"
            >
                <h2 className="text-lg font-semibold text-slate-700">
                    Add New Land Record
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                    {/* Thram ID */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">
                            Thram ID
                        </label>
                        <input
                            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                            placeholder="e.g., GMC-TH-0002"
                            name="thramId"
                            value={form.thramId}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Plot ID */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">
                            Plot ID
                        </label>
                        <input
                            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                            placeholder="e.g., PLOT-B-110"
                            name="plotId"
                            value={form.plotId}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">
                            Location
                        </label>
                        <input
                            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                            placeholder="e.g., Wellness District"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Area */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">
                            Area (sq.m)
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                            placeholder="1200"
                            name="areaSqm"
                            value={form.areaSqm || ""}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Valuation */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">
                            Valuation (BTN)
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                            placeholder="2500000"
                            name="valuationBtn"
                            value={form.valuationBtn || ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-5 py-2 bg-slate-900 text-white rounded-md text-sm font-medium shadow-sm hover:bg-slate-800 transition"
                    >
                        Add Land Record
                    </button>
                </div>
            </form>

            {/* TABLE CARD */}
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-700 mb-4">
                    Existing Records
                </h2>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-200">
                            <th className="py-2">Thram ID</th>
                            <th className="py-2">Plot ID</th>
                            <th className="py-2">Location</th>
                            <th className="py-2 text-right">Area (sq.m)</th>
                            <th className="py-2 text-right">Valuation (BTN)</th>
                            <th className="py-2 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {landRecords.map((l) => (
                            <tr key={l.id} className="border-b border-slate-100">
                                <td className="py-3">{l.thramId}</td>
                                <td className="py-3">{l.plotId}</td>
                                <td className="py-3">{l.location}</td>
                                <td className="py-3 text-right">{l.areaSqm}</td>
                                <td className="py-3 text-right">
                                    {l.valuationBtn.toLocaleString()} BTN
                                </td>
                                <td className="py-3 text-right">
                                    <button
                                        onClick={() => handleDelete(l.id)}
                                        className="px-3 py-1 text-xs rounded-md border border-red-300 text-red-600 bg-red-50 hover:bg-red-100 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {!landRecords.length && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-6 text-center text-slate-400"
                                >
                                    No land records available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
