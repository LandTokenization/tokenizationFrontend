export default function TransactionsPage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
                <p className="text-sm text-muted-foreground">
                    Your mock token transaction history for the demo environment.
                </p>
            </div>

            {/* TABLE CONTAINER */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-4">
                    Recent Activity
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-muted-foreground border-b border-border/40">
                            <tr>
                                <th className="text-left py-2">Date</th>
                                <th className="text-left py-2">Type</th>
                                <th className="text-right py-2">Amount</th>
                                <th className="text-right py-2">Price (BTN)</th>
                            </tr>
                        </thead>

                        <tbody className="text-foreground">
                            {/* Row 1 */}
                            <tr className="border-b border-border/20 hover:bg-background/30 transition">
                                <td className="py-3 text-left">2025-11-18</td>

                                <td className="py-3 text-left">
                                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        BUY
                                    </span>
                                </td>

                                <td className="py-3 text-right font-medium">
                                    1,000 GMC-T
                                </td>

                                <td className="py-3 text-right">14.8</td>
                            </tr>

                            {/* Row 2 */}
                            <tr className="border-b border-border/20 hover:bg-background/30 transition">
                                <td className="py-3 text-left">2025-11-17</td>

                                <td className="py-3 text-left">
                                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
                                        SELL
                                    </span>
                                </td>

                                <td className="py-3 text-right font-medium">
                                    500 GMC-T
                                </td>

                                <td className="py-3 text-right">15.1</td>
                            </tr>

                            {/* Row 3 */}
                            <tr className="hover:bg-background/30 transition">
                                <td className="py-3 text-left">2025-11-16</td>

                                <td className="py-3 text-left">
                                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                        TRANSFER
                                    </span>
                                </td>

                                <td className="py-3 text-right font-medium">
                                    750 GMC-T
                                </td>

                                <td className="py-3 text-right">Peg 15</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
