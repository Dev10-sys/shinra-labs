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
      // Fallback for demo
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-mono text-xs">Loading enterprise console...</div>;

  return (
    <div className="space-y-12 animate-fade-in text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            Enterprise Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Data Pipeline & Labeling Operations
          </p>
        </div>
        <Link
          to="/create-project"
          className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-wide hover:bg-gray-200 transition flex items-center gap-2"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          New Project
        </Link>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
        <StatCard
          label="Active Tasks"
          value={stats.open}
          unit="TASKS"
        />
        <StatCard
          label="Review Queue"
          value={stats.submitted}
          unit="PENDING"
          highlight={stats.submitted > 0}
        />
        <StatCard
          label="Completed"
          value={stats.approved}
          unit="DONE"
        />
        <StatCard
          label="Total Spend"
          value={`₹ ${stats.totalSpent.toLocaleString()}`}
          unit="INR"
        />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: ACTIVE TASKS LIST */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium uppercase tracking-widest text-gray-400">Pipeline Activity</h2>
            <Link to="/post-task" className="text-[10px] text-gray-500 hover:text-white transition uppercase tracking-widest">
              View All
            </Link>
          </div>

          <div className="border border-white/10 bg-black">
            {tasks.length === 0 ? (
              <div className="p-12 text-center text-gray-600">
                <p className="text-xs font-mono mb-2">No active pipelines.</p>
                <Link to="/post-task" className="text-white hover:underline text-xs">
                  Initialize Project
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-widest font-mono">
                    <tr>
                      <th className="px-6 py-4 font-normal">Project Name</th>
                      <th className="px-6 py-4 font-normal">Type</th>
                      <th className="px-6 py-4 font-normal">Budget</th>
                      <th className="px-6 py-4 font-normal">Status</th>
                      <th className="px-6 py-4 font-normal text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 font-light">
                    {tasks.slice(0, 5).map((task) => (
                      <tr key={task.id} className="hover:bg-white/5 transition group">
                        <td className="px-6 py-4 text-white font-medium group-hover:text-blue-400 transition-colors">{task.title}</td>
                        <td className="px-6 py-4 text-gray-400 capitalize">{task.task_type}</td>
                        <td className="px-6 py-4 text-gray-300 font-mono">₹ {task.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          {task.status === "submitted" ? (
                            <Link
                              to={`/review-task/${task.id}`}
                              className="text-[10px] font-bold bg-white text-black px-3 py-1 hover:bg-gray-200 transition uppercase tracking-wide"
                            >
                              Review
                            </Link>
                          ) : (
                            <span className="text-gray-700 text-xs font-mono">--</span>
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
          <div className="border border-white/10 p-6 bg-black">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">
              Operations
            </h3>
            <div className="space-y-3">
              <Link
                to="/post-task"
                className="block w-full text-center py-3 border border-white/10 hover:bg-white/5 transition text-xs font-bold text-gray-300 hover:text-white uppercase tracking-wide"
              >
                Create New Dataset
              </Link>
              <Link
                to="/datasets"
                className="block w-full text-center py-3 border border-white/10 hover:bg-white/5 transition text-xs font-bold text-gray-300 hover:text-white uppercase tracking-wide"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="border border-white/10 p-6 bg-black">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">
              Network Status
            </h3>
            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-500">API LATENCY</span>
                <span className="text-green-500">24ms</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-500">GPU NODES</span>
                <span className="text-white">142</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-500">DATASETS</span>
                <span className="text-white">1,204</span>
              </div>
              <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-wide pt-2">
                <span className="w-1.5 h-1.5 bg-green-500 animate-pulse"></span>
                System Operational
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, highlight }) {
  return (
    <div className="p-6 bg-black hover:bg-white/5 transition-colors">
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-light tracking-tighter ${highlight ? "text-white" : "text-gray-200"}`}>{value}</span>
        {unit && <span className="text-[10px] text-gray-600 font-bold">{unit}</span>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    open: "text-blue-500 border-blue-500/20 bg-blue-500/5",
    submitted: "text-yellow-500 border-yellow-500/20 bg-yellow-500/5",
    approved: "text-green-500 border-green-500/20 bg-green-500/5",
    rejected: "text-red-500 border-red-500/20 bg-red-500/5",
  };

  return (
    <span
      className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest ${styles[status] || "text-gray-500 border-gray-500"}`}
    >
      {status}
    </span>
  );
}

export default CompanyDashboard;
