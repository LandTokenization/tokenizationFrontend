import { Link, NavLink, useNavigate } from "react-router-dom";
import { dashboardNavItems } from "../lib/navConfig";
import { LogOut } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Sidebar() {
    const { showSuccess } = useToast();
    const navigate = useNavigate();

    const handleLogout = () => {
        showSuccess("Logged out successfully!");
        setTimeout(() => {
            navigate("/login");
        }, 500);
    };

    return (
        <aside className="hidden md:flex md:flex-col h-screen w-64 border-r bg-background/60 backdrop-blur text-foreground">
            <div className="px-6 py-4 border-b hover:bg-background/30 transition-colors">
                <Link to="/dashboard" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center hover:shadow-md transition-shadow">
                        <span className="text-primary-foreground font-bold text-lg">LT</span>
                    </div>
                    <span className="text-xl font-semibold tracking-tight">Land Tokenization</span>
                </Link>
            </div>

            {/* NAV ITEMS */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {dashboardNavItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        end={item.href === "/dashboard"}
                        className={({ isActive }) =>
                            [
                                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm hover:shadow-md"
                                    : "text-muted-foreground hover:bg-background/30 active:bg-background/40",
                            ].join(" ")
                        }
                    >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* FOOTER + LOGOUT */}
            <div className="px-4 py-3 border-t space-y-3">
                <p className="text-xs text-muted-foreground">
                    Fictional demo • Not real financial system.
                </p>

                <button
                    onClick={handleLogout}
                    className="w-full text-sm font-medium px-3 py-2 border border-border rounded-lg text-foreground bg-background/70 hover:bg-background/80 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
