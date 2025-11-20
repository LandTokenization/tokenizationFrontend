import { Link, NavLink } from "react-router-dom";
import { adminNavItems } from "../lib/adminNavConfig";

export default function AdminSidebar() {
    return (
        <aside className="hidden md:flex md:flex-col h-screen w-64 border-r bg-white/90 backdrop-blur">
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
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-700 hover:bg-slate-100",
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
                <p className="text-xs text-slate-500">
                    Fictional demo • Not real financial system.
                </p>

                <button
                    onClick={() => alert("Demo only — No real logout.")}
                    className="w-full text-sm font-medium px-3 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100 transition"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}
