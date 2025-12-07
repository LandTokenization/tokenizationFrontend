export default function AboutPage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    About the GMC Token Prototype
                </h1>
                <p className="text-sm text-muted-foreground">
                    Developed under the Innovate for GMC • Land Tokenization Programme to explore
                    transparent and mindful compensation mechanisms.
                </p>
            </div>

            {/* MAIN ABOUT CARD */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-4">
                <p className="text-sm text-foreground leading-relaxed">
                    This prototype demonstrates how land value in the Gelephu Mindfulness
                    City (GMC) could be represented using a digital token model. The idea
                    is to explore a future where compensation, valuation updates, and
                    transfers can be conducted with clarity, fairness, and auditability.
                </p>

                <p className="text-sm text-foreground leading-relaxed">
                    The system simulates token balances, land valuation insights, BID/ASK
                    price dynamics, and mock user journeys to illustrate how a transparent
                    compensation experience may function in practice. All numbers and
                    records in this demo are fictional and are intended solely for concept
                    exploration.
                </p>
            </div>

            {/* CORE PURPOSE */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-foreground mb-3">
                    Why Tokenization for GMC?
                </h2>
                <ul className="space-y-2 text-sm text-foreground leading-relaxed">
                    <li>
                        • To explore a consistent and fair model for land-related value
                        distribution.
                    </li>
                    <li>
                        • To simulate how transparent compensation may reduce disputes
                        and strengthen trust in the development process.
                    </li>
                    <li>
                        • To conceptually align with the mindful governance principles
                        guiding GMC’s emergence as a future-ready city.
                    </li>
                </ul>
            </div>

            {/* DISCLAIMER */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-2">
                    Disclaimer
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                    This application is a demonstration only. It is not a valuation tool,
                    not a financial product, and not an official government platform.
                    All token balances, land details, and prices shown within the demo
                    are simulated for illustration as part of the Innovate for GMC Land Tokenization
                    Programme.
                </p>
            </div>
        </div>
    );
}
