export default function AdminTransactionsPage() {
    const demoTx = [
        {
            id: 1,
            date: "2025-11-18 10:32",
            type: "BUY",
            from: "Mock Market",
            to: "CID 11111111111",
            amount: "1,000 GMC-T",
            price: "14.8 BTN",
        },
        {
            id: 2,
            date: "2025-11-17 15:21",
            type: "TRANSFER",
            from: "CID 11111111111",
            to: "CID 22222222222",
            amount: "500 GMC-T",
            price: "Peg 15 BTN",
        },
    ];

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Transaction Log</h1>
                <p className="text-sm text-slate-500">
                    View mock token trades and transfers executed within this demo
                    environment.
                </p>
            </div>

            {/* TABLE CARD */}
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-700 mb-4">
                    All Transactions
                </h2>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-200">
                            <th className="py-2">Date / Time</th>
                            <th className="py-2">Type</th>
                            <th className="py-2">From</th>
                            <th className="py-2">To</th>
                            <th className="py-2 text-right">Amount</th>
                            <th className="py-2 text-right">Price / Peg</th>
                        </tr>
                    </thead>

                    <tbody>
                        {demoTx.map((tx) => (
                            <tr key={tx.id} className="border-b border-slate-100">
                                <td className="py-3">{tx.date}</td>
                                <td className="py-3">{tx.type}</td>
                                <td className="py-3">{tx.from}</td>
                                <td className="py-3">{tx.to}</td>
                                <td className="py-3 text-right">{tx.amount}</td>
                                <td className="py-3 text-right">{tx.price}</td>
                            </tr>
                        ))}

                        {/* Empty State */}
                        {!demoTx.length && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-6 text-center text-slate-400"
                                >
                                    No transactions available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
