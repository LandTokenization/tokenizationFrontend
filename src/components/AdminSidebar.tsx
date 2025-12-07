import { Link, NavLink, useNavigate } from "react-router-dom";
import { adminNavItems } from "../lib/adminNavConfig";
import { useToast } from "../context/ToastContext";

export default function AdminSidebar() {
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
            <div className="px-6 py-4 border-b">
                <Link to="/admin" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full border flex items-center justify-center text-sm font-semibold">
                        AD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">GMC Token Admin</span>
                        <span className="text-xs text-muted-foreground">
                            Admin Console • Demo
                        </span>
                    </div>
                </Link>
            </div>

            {/* NAV ITEMS */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {adminNavItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        end={item.href === "/admin"}
                        className={({ isActive }) =>
                            [
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-background/30",
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
                    className="w-full text-sm font-medium px-3 py-2 border border-border rounded-md text-foreground bg-background/70 hover:bg-background/80 transition"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}
