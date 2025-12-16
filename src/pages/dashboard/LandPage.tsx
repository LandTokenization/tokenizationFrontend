import { Link } from "react-router-dom";
import { Eye, FileText } from "lucide-react";

export default function LandPage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Land Management</h1>
                <p className="text-sm text-muted-foreground">
                    Access your land holdings and detailed plot information.
                </p>
            </div>

            {/* QUICK LINKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Land Holdings Card */}
                <Link 
                    to="/dashboard/land-holdings"
                    className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-primary/60 cursor-pointer group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                Land Holdings
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                View all your GMC urban and rural land holdings
                            </p>
                        </div>
                        <Eye className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="pt-4 border-t border-border/20">
                        <p className="text-xs text-muted-foreground">
                            Summary of all thram and parcel holdings with ownership details
                        </p>
                    </div>
                </Link>

                {/* Land Details Card */}
                <Link 
                    to="/dashboard/land-details"
                    className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-primary/60 cursor-pointer group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                Land Details
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Detailed plot and structure information
                            </p>
                        </div>
                        <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="pt-4 border-t border-border/20">
                        <p className="text-xs text-muted-foreground">
                            Plot specifications, ownership details, and structure information
                        </p>
                    </div>
                </Link>
            </div>

            {/* INFO CARD */}
            <div className="rounded-xl bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-3">
                <h2 className="text-lg font-semibold text-foreground">About Your Land Information</h2>

                <div className="space-y-2 text-sm text-foreground">
                    <p>
                        <span className="font-medium">Thram ID:</span> Official land parcel identifier issued by government
                    </p>
                    <p>
                        <span className="font-medium">Plot ID:</span> Specific plot reference within a thram
                    </p>
                    <p>
                        <span className="font-medium">Ownership Type:</span> Individual, Joint, or Family ownership classification
                    </p>
                    <p>
                        <span className="font-medium">LAP:</span> Land Adjustment Plan reference number
                    </p>
                    <p>
                        <span className="font-medium">Mortgage:</span> Current mortgage status of the property
                    </p>
                    <p>
                        <span className="font-medium">Structure:</span> Indicates if there are buildings on the plot
                    </p>
                </div>
            </div>
        </div>
    );
}
