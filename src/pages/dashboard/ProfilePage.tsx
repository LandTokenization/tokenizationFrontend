export default function ProfilePage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Basic user information for demo identity within the GMC token portal.
                </p>
            </div>

            {/* PROFILE CARD */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-background/40 border border-border/60 flex items-center justify-center text-foreground font-semibold">
                        DU
                    </div>

                    <div>
                        <p className="text-lg font-semibold text-foreground">Demo User</p>
                        <p className="text-xs text-muted-foreground">
                            Identity simulated for concept demonstration
                        </p>
                    </div>
                </div>

                <div className="h-px bg-border/40" />

                {/* Details */}
                <div className="space-y-3 text-sm text-foreground">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">
                            CID Number
                        </p>
                        <p className="mt-1 font-medium">11111111111</p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">
                            Login Method
                        </p>
                        <p className="mt-1 font-medium">Password (Demo)</p>
                        <p className="text-xs text-muted-foreground">
                            NDI login will be available in future versions.
                        </p>
                    </div>
                </div>

                <div className="h-px bg-border/40" />

                {/* Buttons */}
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm hover:bg-primary/90 transition">
                        Edit Profile (Mock)
                    </button>

                    <button className="px-4 py-2 border border-border text-foreground text-sm font-medium rounded-md hover:bg-background/30 transition">
                        Reset Password (Mock)
                    </button>
                </div>
            </div>

            {/* INFO CARD */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-2">
                    Identity Notice
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                    This profile does not represent a real individual. All user
                    attributes shown here are fictional and used only to illustrate
                    how identity, NDI integration, and account information may appear
                    in a future production system.
                </p>
            </div>
        </div>
    );
}
