import {
    LayoutDashboard,
    Map,
    Wallet,
    LineChart,
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
    { label: "Land", href: "/dashboard/land", icon: Map },
    { label: "Land Holdings", href: "/dashboard/land-holdings", icon: Map },
    { label: "Land Details", href: "/dashboard/land-details", icon: Map },
    { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { label: "Market", href: "/dashboard/market", icon: LineChart },
    { label: "Transactions", href: "/dashboard/transactions", icon: ListOrdered },
    { label: "Help & FAQ", href: "/dashboard/help", icon: HelpCircle },
    { label: "About", href: "/dashboard/about", icon: Info },
    { label: "Profile", href: "/dashboard/profile", icon: User },
];
