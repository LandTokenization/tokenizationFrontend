export default function HelpPage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Help & FAQ</h1>
                <p className="text-sm text-muted-foreground">
                    Quick explanations to guide evaluators and visitors through the demo.
                </p>
            </div>

            {/* FAQ CARD */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-5">
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Frequently Asked Questions
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Q1 */}
                    <div>
                        <p className="font-semibold text-sm text-foreground">
                            What is this system?
                        </p>
                        <p className="text-sm text-foreground mt-1">
                            This is a prototype that illustrates how land value in Gelephu
                            Mindfulness City (GMC) could be represented as digital tokens.
                            The goal is to explore a more transparent and fair compensation
                            mechanism, not to provide a live production platform.
                        </p>
                    </div>

                    {/* Q2 */}
                    <div>
                        <p className="font-semibold text-sm text-foreground">
                            Is this real money or real land data?
                        </p>
                        <p className="text-sm text-foreground mt-1">
                            No. All numbers, plots, and token balances are fictional. They
                            exist only to help explain the concept. Nothing shown here
                            represents real ownership, legal rights, or financial value.
                        </p>
                    </div>

                    {/* Q3 */}
                    <div>
                        <p className="font-semibold text-sm text-foreground">
                            What does "tokenization" mean in this context?
                        </p>
                        <p className="text-sm text-foreground mt-1">
                            In this demo, tokenization simply means converting a hypothetical
                            land valuation into digital units called GMC-T tokens. These
                            units can then be simulated for allocation, transfers, or
                            compensation scenarios.
                        </p>
                    </div>

                    {/* Q4 */}
                    <div>
                        <p className="font-semibold text-sm text-foreground">
                            Are these screens connected to a real blockchain?
                        </p>
                        <p className="text-sm text-foreground mt-1">
                            No. The interface mimics how a future blockchain or ledger-based
                            system might look, but all interactions in this prototype run on
                            dummy data only.
                        </p>
                    </div>
                </div>
            </div>

            {/* INFO / DISCLAIMER CARD */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-2">
                    Important Demo Disclaimer
                </p>
                <p className="text-sm text-foreground">
                    This prototype is built solely for the Innovate for GMC / Land Tokenization
                    demonstration. It is not a financial product, not an official
                    government system, and not a legal representation of land, value, or
                    compensation. All figures are illustrative and may change as the
                    concept evolves.
                </p>
            </div>
        </div>
    );
}
