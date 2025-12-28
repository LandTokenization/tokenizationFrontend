import { useEffect, useMemo, useState } from "react";

type WalletUser = {
    id: string;        // address
    address: string;
    label: string;     // "Connected" / "Available"
};

function shortAddr(addr: string) {
    if (!addr) return "—";
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function AdminUsersPage() {
    const [connected, setConnected] = useState<string>("");
    const [accounts, setAccounts] = useState<string[]>([]);
    const [err, setErr] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const rows = useMemo<WalletUser[]>(() => {
        const uniq = Array.from(new Set(accounts.map((a) => a.toLowerCase())));
        return uniq
            .map((a) => {
                const address = accounts.find((x) => x.toLowerCase() === a) || a;
                const label = connected && address.toLowerCase() === connected.toLowerCase() ? "Connected" : "Available";
                return { id: address, address, label };
            })
            .sort((a, b) => (a.label === "Connected" ? -1 : 1) - (b.label === "Connected" ? -1 : 1));
    }, [accounts, connected]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setErr("");
                setLoading(true);

                // 1) what metamask already exposed (no popup)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const eth = (window as any).ethereum;

                const accs = (await eth.request({ method: "eth_accounts" })) as string[];
                if (!mounted) return;

                setAccounts(accs || []);
                setConnected(accs?.[0] || "");

                // if you want, you can force a connect popup:
                // const requested = (await eth.request({ method: "eth_requestAccounts" })) as string[];
                // setAccounts(requested || []);
                // setConnected(requested?.[0] || "");

                // keep in sync if user switches accounts
                const onAccountsChanged = (next: string[]) => {
                    setAccounts(next || []);
                    setConnected(next?.[0] || "");
                };

                eth.on?.("accountsChanged", onAccountsChanged);

                return () => {
                    eth.removeListener?.("accountsChanged", onAccountsChanged);
                };
            } catch (e) {
                if (!mounted) return;
                setErr(e instanceof Error ? e.message : "Failed to read MetaMask accounts");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const handleConnect = async () => {
        try {
            setErr("");
            setLoading(true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const eth = (window as any).ethereum;
            const requested = (await eth.request({ method: "eth_requestAccounts" })) as string[];
            setAccounts(requested || []);
            setConnected(requested?.[0] || "");
        } catch (e) {
            setErr(e instanceof Error ? e.message : "User rejected connection or wallet error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-100">Connected Wallets</h1>
                <p className="text-sm text-slate-500">
                    This is NOT a global user list. It shows the wallet account(s) currently available from the user’s MetaMask session.
                </p>

                {err && (
                    <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {err}
                    </div>
                )}
            </div>

            {/* Card */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-700/60 p-6 shadow-lg backdrop-blur">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <h2 className="text-lg font-semibold text-slate-100">Wallet Session</h2>

                    <div className="flex items-center gap-3">
                        {loading ? (
                            <span className="text-xs text-slate-500">Checking…</span>
                        ) : (
                            <span className="text-xs text-slate-500">
                                Accounts: <span className="font-mono">{rows.length}</span>
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={handleConnect}
                            className="px-4 py-2 rounded-md text-sm font-medium shadow-sm transition bg-amber-400/90 hover:bg-amber-400 text-slate-900"
                        >
                            Connect Wallet
                        </button>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-4" />

                <div className="max-h-[420px] overflow-auto rounded-lg border border-slate-800/60">
                    <table className="min-w-full text-sm">
                        <thead className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Status</th>
                                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Address</th>
                                <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Short</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/70">
                            {rows.map((u, idx) => (
                                <tr
                                    key={u.id}
                                    className={[
                                        "transition",
                                        idx % 2 === 0 ? "bg-slate-900/30" : "bg-slate-900/10",
                                        "hover:bg-slate-800/40",
                                    ].join(" ")}
                                >
                                    <td className="px-4 py-3 align-top">
                                        <span
                                            className={[
                                                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                                                u.label === "Connected"
                                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                                    : "border-slate-600/40 bg-slate-800/20 text-slate-300",
                                            ].join(" ")}
                                        >
                                            {u.label}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 align-top">
                                        <div className="font-mono text-xs text-slate-200" title={u.address}>
                                            {u.address}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 align-top text-slate-300 font-mono whitespace-nowrap">
                                        {shortAddr(u.address)}
                                    </td>
                                </tr>
                            ))}

                            {!loading && !rows.length && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-10 text-center text-slate-500 italic">
                                        No accounts available. Click “Connect Wallet”.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {connected && (
                    <p className="mt-3 text-xs text-slate-500">
                        Active wallet: <span className="font-mono text-slate-300">{connected}</span>
                    </p>
                )}
            </div>
        </div>
    );
}
