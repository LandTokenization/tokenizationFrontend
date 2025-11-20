export default function ProfilePage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
                <p className="text-sm text-slate-500">
                    Basic user information for demo identity within the GMC token portal.
                </p>
            </div>

            {/* PROFILE CARD */}
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-semibold">
                        DU
                    </div>

                    <div>
                        <p className="text-lg font-semibold text-slate-900">Demo User</p>
                        <p className="text-xs text-slate-500">
                            Identity simulated for concept demonstration
                        </p>
                    </div>
                </div>

                <div className="h-px bg-slate-200" />

                {/* Details */}
                <div className="space-y-3 text-sm text-slate-700">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase">
                            CID Number
                        </p>
                        <p className="mt-1 font-medium">11111111111</p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase">
                            Login Method
                        </p>
                        <p className="mt-1 font-medium">Password (Demo)</p>
                        <p className="text-xs text-slate-500">
                            NDI login will be available in future versions.
                        </p>
                    </div>
                </div>

                <div className="h-px bg-slate-200" />

                {/* Buttons */}
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md shadow-sm hover:bg-slate-800 transition">
                        Edit Profile (Mock)
                    </button>

                    <button className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-100 transition">
                        Reset Password (Mock)
                    </button>
                </div>
            </div>

            {/* INFO CARD */}
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-800 mb-2">
                    Identity Notice
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                    This profile does not represent a real individual. All user
                    attributes shown here are fictional and used only to illustrate
                    how identity, NDI integration, and account information may appear
                    in a future production system.
                </p>
            </div>
        </div>
    );
}
