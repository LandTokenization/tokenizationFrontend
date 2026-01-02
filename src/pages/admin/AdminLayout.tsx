// src/pages/admin/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { useAdminLoading } from "../../context/AdminLoadingContext";

function AdminLoaderOverlay({ message }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-slate-700/60 bg-slate-950/80 p-5 shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
                    </div>

                    <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-100">Loading…</div>
                        <div className="text-xs text-slate-400">
                            {message || "Fetching blockchain data"}
                        </div>
                    </div>
                </div>

                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-1/2 animate-[loader_1.2s_ease-in-out_infinite] bg-amber-400/80" />
                </div>

                <style>{`
                  @keyframes loader {
                    0% { transform: translateX(-120%); }
                    100% { transform: translateX(220%); }
                  }
                `}</style>
            </div>
        </div>
    );
}

export default function AdminLayout() {
    const { isLoading, message } = useAdminLoading();

    return (
        <div className="flex bg-transparent h-screen overflow-hidden text-foreground font-sans selection:bg-primary/20">
            <AdminSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="md:hidden px-4 py-3 border-b bg-background/80 backdrop-blur-sm">
                    <h1 className="text-base font-semibold">GMC Token Admin Console</h1>
                </header>
                
                <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
                    <Outlet />
                </main>
            </div>

            {isLoading && <AdminLoaderOverlay message={message} />}
        </div>
    );
}
