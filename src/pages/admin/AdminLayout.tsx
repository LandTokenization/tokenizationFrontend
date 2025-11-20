import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";


export default function AdminLayout() {
    return (
        <div className="flex bg-slate-50 h-screen overflow-hidden">
            <AdminSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="md:hidden px-4 py-3 border-b bg-white">
                    <h1 className="text-base font-semibold">GMC Token Admin Console</h1>
                </header>

                <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}


