import { Routes, Route, Navigate } from "react-router-dom";

/* PUBLIC */
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/authentication/login";
import TeamPage from "../pages/Team";
import AboutPagePublic from "../pages/AboutPage";
import FAQPagePublic from "../pages/FAQPage";
import LinksPage from "../pages/LinksPage";

/* USER DASHBOARD */
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import LandPage from "../pages/dashboard/LandPage";
import WalletPage from "../pages/dashboard/WalletPage";
import MarketPage from "../pages/dashboard/MarketPage";
import TokenMarketplace from "../pages/dashboard/TokenMarketplace";
import TransactionsPage from "../pages/dashboard/TransactionsPage";
import ProfilePage from "../pages/dashboard/ProfilePage";

/* ADMIN DASHBOARD */
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboardHome from "../pages/admin/AdminDashboardHome";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminLandPage from "../pages/admin/AdminLandPage";
import AdminTokenSettingsPage from "../pages/admin/AdminTokenSettingsPage";
import AdminContentPage from "../pages/admin/AdminContentPage";
import AdminTransactionsPage from "../pages/admin/AdminTransactionsPage";

import { AdminLoadingProvider } from "../context/AdminLoadingContext";

function AdminRouteShell() {
    return (
        <AdminLoadingProvider>
            <AdminLayout />
        </AdminLoadingProvider>
    );
}

export default function AppRouter() {
    return (
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/about" element={<AboutPagePublic />} />
            <Route path="/faq" element={<FAQPagePublic />} />
            <Route path="/links" element={<LinksPage />} />

            {/* USER DASHBOARD ROUTES */}
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="land" element={<LandPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="market" element={<MarketPage />} />
                <Route path="marketplace" element={<TokenMarketplace />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* ADMIN ROUTES (wrapped) */}
            <Route path="/admin" element={<AdminRouteShell />}>
                <Route index element={<AdminDashboardHome />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="land" element={<AdminLandPage />} />
                <Route path="token-settings" element={<AdminTokenSettingsPage />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="transactions" element={<AdminTransactionsPage />} />
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
