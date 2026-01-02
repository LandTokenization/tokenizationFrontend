export default function AdminLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="h-10 w-10 rounded-full border-4 border-amber-400/30 border-t-amber-400 animate-spin" />

                {/* Text */}
                <p className="text-sm text-slate-300 tracking-wide">
                    Syncing blockchain data…
                </p>
            </div>
        </div>
    );
}
