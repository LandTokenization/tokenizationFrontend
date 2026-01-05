import {
    LayoutDashboard,
    Map,
    Wallet,
    LineChart,
    ShoppingCart,
    ListOrdered,
    HelpCircle,
    Info,
    User,
} from "lucide-react";

export type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

export const dashboardNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Land", href: "/dashboard/land", icon: Map },
    { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { label: "Market", href: "/dashboard/market", icon: LineChart },
    { label: "Market Place", href: "/dashboard/marketplace", icon: ShoppingCart },
    { label: "Activity Logs", href: "/dashboard/transactions", icon: ListOrdered },
];
