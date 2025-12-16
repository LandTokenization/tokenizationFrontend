import { Routes, Route, Navigate } from "react-router-dom";

/* --------------------------
   PUBLIC PAGES
--------------------------- */
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/authentication/login";
import TeamPage from "../pages/Team";
import AboutPagePublic from "../pages/AboutPage";
import FAQPagePublic from "../pages/FAQPage";
import LinksPage from "../pages/LinksPage";

/* --------------------------
   USER DASHBOARD
--------------------------- */
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import LandPage from "../pages/dashboard/LandPage";
import LandHoldingsPage from "../pages/dashboard/LandHoldingsPage";
import LandDetailsPage from "../pages/dashboard/LandDetailsPage";
import WalletPage from "../pages/dashboard/WalletPage";
import MarketPage from "../pages/dashboard/MarketPage";
import TransactionsPage from "../pages/dashboard/TransactionsPage";
import HelpPage from "../pages/dashboard/HelpPage";
import AboutPage from "../pages/dashboard/AboutPage";
import ProfilePage from "../pages/dashboard/ProfilePage";

/* --------------------------
   ADMIN DASHBOARD
--------------------------- */
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboardHome from "../pages/admin/AdminDashboardHome";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminLandPage from "../pages/admin/AdminLandPage";
import AdminTokenSettingsPage from "../pages/admin/AdminTokenSettingsPage";
import AdminContentPage from "../pages/admin/AdminContentPage";
import AdminTransactionsPage from "../pages/admin/AdminTransactionsPage";

/* --------------------------
   ROUTER COMPONENT
--------------------------- */
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
                <Route path="land-holdings" element={<LandHoldingsPage />} />
                <Route path="land-details" element={<LandDetailsPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="market" element={<MarketPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* ADMIN ROUTES */}
            <Route path="/admin" element={<AdminLayout />}>
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
