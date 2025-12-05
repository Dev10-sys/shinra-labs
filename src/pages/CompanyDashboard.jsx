import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";

function CompanyDashboard() {
  const user = getStoredUser();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    open: 0,
    submitted: 0,
    approved: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data: tasksData, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("company_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTasks(tasksData || []);

      const open = tasksData.filter((t) => t.status === "open").length;
      const submitted = tasksData.filter((t) => t.status === "submitted").length;
      const approved = tasksData.filter((t) => t.status === "approved").length;
      const totalSpent = tasksData
        .filter((t) => t.status === "approved")
        .reduce((sum, t) => sum + (t.price || 0), 0);

      setStats({ open, submitted, approved, totalSpent });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse">Loading dashboard...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Overview
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your data labeling projects and track performance.
          </p>
        </div>
        <Link
          to="/post-task"
          className="px-6 py-2.5 bg-white text-black font-semibold text-sm uppercase tracking-wide rounded hover:bg-gray-200 transition shadow-lg shadow-white/5 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Post New Task
        </Link>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Open Tasks"
          value={stats.open}
          icon={<svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
          color="bg-blue-500/5"
          borderColor="border-blue-500/20"
        />
        <StatCard
          label="Pending Review"
          value={stats.submitted}
          icon={<svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>}
          color="bg-yellow-500/5"
          borderColor="border-yellow-500/20"
          highlight={stats.submitted > 0}
        />
        <StatCard
          label="Completed"
          value={stats.approved}
          icon={<svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-green-500/5"
          borderColor="border-green-500/20"
        />
        <StatCard
          label="Total Spend"
          value={`₹ ${stats.totalSpent.toLocaleString()}`}
          icon={<svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-purple-500/5"
          borderColor="border-purple-500/20"
        />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: ACTIVE TASKS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold tracking-wide">Recent Projects</h2>
            <Link to="/post-task" className="text-xs text-gray-400 hover:text-white transition uppercase tracking-wider">
              View All
            </Link>
          </div>

          <div className="bg-black/20 border border-gray-800 rounded-lg overflow-hidden backdrop-blur-sm">
            {tasks.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                <p>No active projects.</p>
                <Link to="/post-task" className="text-white hover:underline mt-2 inline-block text-sm">
                  Initialize your first project
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Project Name</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Budget</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {tasks.slice(0, 5).map((task) => (
                      <tr key={task.id} className="hover:bg-white/5 transition group">
                        <td className="px-6 py-4 font-medium text-white group-hover:text-blue-400 transition-colors">{task.title}</td>
                        <td className="px-6 py-4 text-gray-400 capitalize">{task.task_type}</td>
                        <td className="px-6 py-4 text-gray-300 font-mono">₹ {task.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          {task.status === "submitted" ? (
                            <Link
                              to={`/review-task/${task.id}`}
                              className="text-[10px] font-bold bg-yellow-500 text-black px-3 py-1.5 rounded hover:bg-yellow-400 transition uppercase tracking-wide"
                            >
                              Review
                            </Link>
                          ) : (
                            <span className="text-gray-700 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: SYSTEM STATUS / ACTIVITY */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-black/20 border border-gray-800 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/post-task"
                className="block w-full text-center py-2.5 border border-gray-700 rounded hover:bg-gray-800 transition text-sm font-medium text-gray-300 hover:text-white hover:border-gray-600"
              >
                Create New Dataset
              </Link>
              <Link
                to="/datasets"
                className="block w-full text-center py-2.5 border border-gray-700 rounded hover:bg-gray-800 transition text-sm font-medium text-gray-300 hover:text-white hover:border-gray-600"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-black/20 border border-gray-800 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              Platform Status
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">API Latency</span>
                <span className="text-green-400 font-mono text-xs">24ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Nodes</span>
                <span className="text-white font-mono text-xs">142</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Datasets</span>
                <span className="text-white font-mono text-xs">1,204</span>
              </div>
              <div className="h-px bg-gray-800 my-2"></div>
              <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-wide">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Operational
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, borderColor, highlight }) {
  return (
    <div
      className={`p-6 rounded-lg ${color} border ${borderColor} ${highlight ? "ring-1 ring-yellow-500/50" : ""
        } backdrop-blur-sm transition hover:bg-opacity-10`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          {label}
        </span>
        <span className="opacity-80">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white font-mono tracking-tight">{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    open: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    submitted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${styles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
        }`}
    >
      {status}
    </span>
  );
}

export default CompanyDashboard;
