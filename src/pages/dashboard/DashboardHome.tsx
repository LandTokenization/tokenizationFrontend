import { useState } from 'react';
import { TrendingUp, Send, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useToast } from '../../context/ToastContext';

export default function DashboardHome() {
    const { showSuccess, showInfo } = useToast();
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleBuyTokens = async () => {
        setActionLoading('buy');
        showInfo('Initializing token purchase...');
        await new Promise(resolve => setTimeout(resolve, 1200));
        showSuccess('Buy tokens interface loaded!');
        setActionLoading(null);
    };

    const handleTransfer = async () => {
        setActionLoading('transfer');
        showInfo('Opening transfer dialog...');
        await new Promise(resolve => setTimeout(resolve, 800));
        showSuccess('Transfer interface ready!');
        setActionLoading(null);
    };

    const handleViewDetails = async () => {
        setActionLoading('details');
        showInfo('Loading detailed analytics...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        showSuccess('Analytics loaded!');
        setActionLoading(null);
    };

    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">
                    GMC land tokenization demo – fictional data only.
                </p>
            </div>

            {/* QUICK ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button 
                    onClick={handleBuyTokens}
                    isLoading={actionLoading === 'buy'}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Buy Tokens
                </Button>
                <Button 
                    onClick={handleTransfer}
                    isLoading={actionLoading === 'transfer'}
                    variant="outline"
                    className="gap-2"
                >
                    <Send className="h-4 w-4" />
                    Transfer
                </Button>
                <Button 
                    onClick={handleViewDetails}
                    isLoading={actionLoading === 'details'}
                    variant="ghost"
                    className="gap-2"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    View Details
                </Button>
            </div>

            {/* TOP METRICS */}
            <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <p className="text-xs font-medium text-slate-500 group-hover:text-slate-700">Token Balance</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 group-hover:text-primary transition-colors">12,500 GMC-T</p>
                    <p className="mt-1 text-xs text-slate-500">≈ 187,500 BTN</p>
                </div>

                <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <p className="text-xs font-medium text-slate-500 group-hover:text-slate-700">Land Value</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 group-hover:text-primary transition-colors">2,500,000 BTN</p>
                    <p className="mt-1 text-xs text-slate-500">Peg: 1 GMC-T = 15 BTN</p>
                </div>

                <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <p className="text-xs font-medium text-slate-500 group-hover:text-slate-700">Valuation Indicator</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                        <TrendingUp className="h-5 w-5" />
                        +8.2% (demo)
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Based on mock GMC growth index.
                    </p>
                </div>
            </div>

            {/* GRAPHS */}
            <div className="grid gap-5 md:grid-cols-2">
                {/* PRICE GRAPH */}
                <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-sm font-semibold text-slate-800">
                                GMC-T Price Trend
                            </p>
                            <p className="text-xs text-slate-500">
                                Demo: Past 7 mock price points
                            </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            Fictional
                        </span>
                    </div>

                    <div className="mt-4 h-40">
                        <svg
                            viewBox="0 0 100 40"
                            preserveAspectRatio="none"
                            className="w-full h-full"
                        >
                            <line x1="0" y1="30" x2="100" y2="30" stroke="#E5E7EB" strokeWidth="0.7" />

                            <polyline
                                points="0,28 15,20 30,22 45,10 60,14 75,12 100,18"
                                fill="none"
                                stroke="#2563EB"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <polyline
                                points="0,40 0,28 15,20 30,22 45,10 60,14 75,12 100,18 100,40"
                                fill="#BFDBFE"
                                opacity="0.4"
                            />

                            <circle cx="100" cy="18" r="2" fill="#1D4ED8" />
                        </svg>
                    </div>

                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>Past</span>
                        <span>Now</span>
                    </div>
                </div>

                {/* LAND VALUE GRAPH */}
                <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-sm font-semibold text-slate-800">
                                Land Valuation Trend
                            </p>
                            <p className="text-xs text-slate-500">
                                Demo land appreciation curve
                            </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                            Mock Data
                        </span>
                    </div>

                    <div className="mt-4 h-40">
                        <svg
                            viewBox="0 0 100 40"
                            preserveAspectRatio="none"
                            className="w-full h-full"
                        >
                            <line x1="0" y1="32" x2="100" y2="32" stroke="#E5E7EB" strokeWidth="0.7" />

                            <polyline
                                points="0,32 20,28 40,26 60,18 80,15 100,12"
                                fill="none"
                                stroke="#0F172A"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <polyline
                                points="0,40 0,32 20,28 40,26 60,18 80,15 100,12 100,40"
                                fill="#CBD5E1"
                                opacity="0.5"
                            />

                            <circle cx="100" cy="12" r="2" fill="#0F172A" />
                        </svg>
                    </div>

                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>Low Growth</span>
                        <span>High Growth</span>
                    </div>
                </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm font-semibold text-slate-800 mb-3">
                    Recent Activity (Mock)
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer">
                        <span className="text-emerald-600 font-bold">+</span>
                        <span>Bought 1,000 GMC-T @ 14.8 BTN</span>
                    </li>
                    <li className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer">
                        <span className="text-red-600 font-bold">−</span>
                        <span>Sold 500 GMC-T @ 15.1 BTN</span>
                    </li>
                    <li className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer">
                        <span className="text-blue-600 font-bold">→</span>
                        <span>Transfer to User #102 (Compensation Pilot)</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
