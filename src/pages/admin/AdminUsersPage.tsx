import { useState } from "react";

type DemoUser = {
    id: number;
    name: string;
    cid: string;
    role: "citizen" | "admin";
};

const initialUsers: DemoUser[] = [
    { id: 1, name: "Demo Citizen 1", cid: "11111111111", role: "citizen" },
    { id: 2, name: "Demo Citizen 2", cid: "22222222222", role: "citizen" },
    { id: 3, name: "Admin User", cid: "99999999999", role: "admin" },
];

export default function AdminUsersPage() {
    const [users, setUsers] = useState<DemoUser[]>(initialUsers);
    const [form, setForm] = useState<Omit<DemoUser, "id">>({
        name: "",
        cid: "",
        role: "citizen",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.cid) return;

        setUsers((prev) => [...prev, { id: prev.length + 1, ...form }]);
        setForm({ name: "", cid: "", role: "citizen" });
    };

    const handleDelete = (id: number) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
                <p className="text-sm text-slate-500">
                    Add, view, and remove demo users for the prototype.
                </p>
            </div>

            {/* FORM CARD */}
            <form
                onSubmit={handleAdd}
                className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-6"
            >
                <h2 className="text-lg font-semibold text-slate-700">Add New User</h2>

                <div className="grid md:grid-cols-3 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">Full Name</label>
                        <input
                            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-800 text-sm shadow-sm focus:ring-2 focus:ring-slate-400 focus:outline-none"
                            placeholder="John Doe"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* CID */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">CID</label>
                        <input
                            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-800 text-sm shadow-sm focus:ring-2 focus:ring-slate-400 focus:outline-none"
                            placeholder="CID Number"
                            name="cid"
                            value={form.cid}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-800 text-sm shadow-sm focus:ring-2 focus:ring-slate-400 focus:outline-none"
                        >
                            <option value="citizen">Citizen</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium shadow-sm transition"
                    >
                        Add User
                    </button>
                </div>
            </form>

            {/* TABLE CARD */}
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-700 mb-4">User List</h2>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-200">
                            <th className="py-2">Name</th>
                            <th className="py-2">CID</th>
                            <th className="py-2">Role</th>
                            <th className="py-2 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b border-slate-100">
                                <td className="py-3">{u.name}</td>
                                <td className="py-3">{u.cid}</td>
                                <td className="py-3 capitalize">{u.role}</td>
                                <td className="py-3 text-right">
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="px-3 py-1 text-xs rounded-md border border-red-300 text-red-600 bg-red-50 hover:bg-red-100 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {!users.length && (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-slate-400">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
