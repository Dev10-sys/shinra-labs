import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            // Fetch last 10 users
            const { data: usersData } = await supabase
                .from("users_meta")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(10);
            setUsers(usersData || []);

            // Fetch last 10 tasks
            const { data: tasksData } = await supabase
                .from("tasks")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(10);
            setTasks(tasksData || []);

            // Fetch last 10 submissions
            const { data: submissionsData } = await supabase
                .from("submissions")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(10);
            setSubmissions(submissionsData || []);

            setLoading(false);
        };

        fetchAdminData();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading admin data...</div>;
    }

    return (
        <section className="max-w-6xl mx-auto py-8">
            <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
            <p className="text-sm text-gray-400 mb-8">
                Read-only view of recent platform activity
            </p>

            {/* Users Table */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-3">Recent Users</h2>
                <div className="bg-black/40 border border-gray-700 rounded overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-black/60">
                            <tr className="text-left text-gray-400 uppercase text-xs">
                                <th className="p-3">Name</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Rating</th>
                                <th className="p-3">Completed</th>
                                <th className="p-3">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-t border-gray-800">
                                    <td className="p-3">{u.name}</td>
                                    <td className="p-3">{u.role}</td>
                                    <td className="p-3">{u.rating?.toFixed(1) || "—"}</td>
                                    <td className="p-3">{u.completed_tasks || 0}</td>
                                    <td className="p-3 text-xs text-gray-500">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-3">Recent Tasks</h2>
                <div className="bg-black/40 border border-gray-700 rounded overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-black/60">
                            <tr className="text-left text-gray-400 uppercase text-xs">
                                <th className="p-3">Title</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Difficulty</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((t) => (
                                <tr key={t.id} className="border-t border-gray-800">
                                    <td className="p-3">{t.title}</td>
                                    <td className="p-3">{t.task_type}</td>
                                    <td className="p-3">{t.difficulty}</td>
                                    <td className="p-3">₹ {t.price}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${t.status === "approved"
                                                ? "bg-green-900/30 text-green-400"
                                                : t.status === "rejected"
                                                    ? "bg-red-900/30 text-red-400"
                                                    : "bg-blue-900/30 text-blue-400"
                                                }`}
                                        >
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-xs text-gray-500">
                                        {new Date(t.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Submissions Table */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-3">Recent Submissions</h2>
                <div className="bg-black/40 border border-gray-700 rounded overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-black/60">
                            <tr className="text-left text-gray-400 uppercase text-xs">
                                <th className="p-3">Task ID</th>
                                <th className="p-3">Score</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((s) => (
                                <tr key={s.id} className="border-t border-gray-800">
                                    <td className="p-3 text-xs text-gray-400">
                                        {s.task_id.substring(0, 8)}...
                                    </td>
                                    <td className="p-3">{Math.round(s.auto_score)}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${s.status === "approved"
                                                ? "bg-green-900/30 text-green-400"
                                                : s.status === "rejected"
                                                    ? "bg-red-900/30 text-red-400"
                                                    : "bg-yellow-900/30 text-yellow-400"
                                                }`}
                                        >
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-xs text-gray-500">
                                        {new Date(s.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default AdminPage;
