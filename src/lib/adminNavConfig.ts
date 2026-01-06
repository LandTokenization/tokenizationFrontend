import {
    LayoutDashboard,
    Users,
    Map,
    Coins,
    // FileText,
    ListOrdered,
} from "lucide-react";

export type AdminNavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

export const adminNavItems: AdminNavItem[] = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Land & Thram", href: "/admin/land", icon: Map },
    { label: "Land Inheritance", href: "/admin/token-settings", icon: Coins },
    // { label: "Content (About / FAQ)", href: "/admin/content", icon: FileText },
    { label: "Transactions", href: "/admin/transactions", icon: ListOrdered },
];
