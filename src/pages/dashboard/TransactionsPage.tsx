import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TRANSACTIONS = [
  { id: 1, type: "SELL", tokens: 750, pricePeg: 5000, total: 3750000, date: "05-02-2024" },
  { id: 2, type: "BUY", tokens: 500, pricePeg: 4500, total: 2250000, date: "22-08-2024" },
  { id: 3, type: "SELL", tokens: 150, pricePeg: 6300, total: 945000, date: "25-12-2024" },
  { id: 4, type: "INHERITANCE", tokens: 300, pricePeg: null, total: null, date: "05-03-2025" },
  { id: 5, type: "GIFT", tokens: 100, pricePeg: null, total: null, date: "05-03-2025" },
  { id: 6, type: "SELL", tokens: 55, pricePeg: 10000, total: 550000, date: "13-05-2025" },
  { id: 7, type: "BUY", tokens: 30, pricePeg: 10500, total: 315000, date: "17-12-2025" },
];

const MONTHLY_PEGS = [
  { month: "January", peg: 5182 },
  { month: "February", peg: 5563 },
  { month: "March", peg: 6357 },
  { month: "April", peg: 6878 },
  { month: "May", peg: 7720 },
  { month: "June", peg: 7543 },
  { month: "July", peg: 7959 },
  { month: "August", peg: 8493 },
  { month: "September", peg: 9574 },
  { month: "October", peg: 11353 },
  { month: "November", peg: 13803 },
  { month: "December", peg: 17727 },
];

const YEARS_DATA: { [key: string]: typeof MONTHLY_PEGS } = {
  "2024": [
    { month: "January", peg: 4200 },
    { month: "February", peg: 4450 },
    { month: "March", peg: 4800 },
    { month: "April", peg: 5100 },
    { month: "May", peg: 5300 },
    { month: "June", peg: 5200 },
    { month: "July", peg: 5600 },
    { month: "August", peg: 5900 },
    { month: "September", peg: 6400 },
    { month: "October", peg: 7100 },
    { month: "November", peg: 8200 },
    { month: "December", peg: 9500 },
  ],
  "2025": MONTHLY_PEGS,
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "BUY":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "SELL":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "INHERITANCE":
    case "GIFT":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    default:
      return "bg-primary/20 text-primary border-primary/30";
  }
};

export default function TransactionsPage() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const chartData = YEARS_DATA[selectedYear];
  const currentBalance = 1675;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your GMCT transactions and token valuation history
        </p>
      </div>

      {/* TRANSACTION HISTORY TABLE */}
      <div className="rounded-lg bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary/30 border-b-2 border-primary/50">
                <th className="px-4 py-3 text-left text-foreground font-semibold">Sl No</th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">Type</th>
                <th className="px-4 py-3 text-right text-foreground font-semibold">Tokens/Shares</th>
                <th className="px-4 py-3 text-right text-foreground font-semibold">Price Peg @ 1 GMCT (BTN)</th>
                <th className="px-4 py-3 text-right text-foreground font-semibold">Total (BTN)</th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="bg-background/40 border-b border-border/20 hover:bg-primary/10 transition">
                  <td className="px-4 py-3 text-foreground font-medium">{tx.id}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded border ${getTypeColor(tx.type)}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground font-medium">{tx.tokens.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {tx.pricePeg ? tx.pricePeg.toLocaleString() : "–"}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {tx.total ? tx.total.toLocaleString() : "–"}
                  </td>
                  <td className="px-4 py-3 text-foreground">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BALANCE DISPLAY */}
        <div className="pt-4 border-t border-border/20">
          <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Current Balance</p>
            <p className="text-2xl font-bold text-primary mt-1">{currentBalance.toLocaleString()} GMCT</p>
          </div>
        </div>
      </div>

      {/* MONTHLY PRICING TABLE */}
      <div className="rounded-lg bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Monthly Price Peg (15th of every month)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MONTHLY_PEGS.map((item) => (
            <div key={item.month} className="bg-background/40 border border-border/20 rounded-lg p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase">{item.month}</p>
              <p className="text-xl font-bold text-foreground mt-2">{item.peg.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">BTN</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="space-y-6">
        {/* YEAR SELECTOR */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-foreground">Select Year:</label>
          <div className="flex gap-2">
            {Object.keys(YEARS_DATA).map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  selectedYear === year
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/40 border border-border/40 text-foreground hover:bg-background/60"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* BAR CHART */}
        <div className="rounded-lg bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Price Peg - {selectedYear}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 20, 30, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.8)" }}
              />
              <Bar dataKey="peg" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="rounded-lg bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Price Trend - {selectedYear}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 20, 30, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.8)" }}
              />
              <Legend />
              <Line type="monotone" dataKey="peg" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
