import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";

export default function FreelancerDashboard() {
  const user = getStoredUser();
  const [tasks, setTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    earnings: 0,
    pending: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch My Submissions (To track status and earnings)
      const { data: mySubmissions, error: subError } = await supabase
        .from("submissions")
        .select(`
          *,
          task:tasks (title, price, task_type, difficulty)
        `)
        .eq("freelancer_id", user.id)
        .order("created_at", { ascending: false });

      if (subError) throw subError;

      // 2. Fetch Available Tasks (Open tasks not assigned to me)
      const { data: openTasks, error: taskError } = await supabase
        .from("tasks")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(5);

      if (taskError) throw taskError;

      // 3. Fetch My Profile (For Rating)
      const { data: profile } = await supabase
        .from("users_meta")
        .select("rating")
        .eq("id", user.id)
        .single();

      // Calculate Real-Time Stats
      const approvedSubs = mySubmissions.filter((s) => s.status === "approved");
      const pendingSubs = mySubmissions.filter((s) => s.status === "pending");

      const totalEarnings = approvedSubs.reduce((sum, s) => sum + (s.task?.price || 0), 0);

      setStats({
        completed: approvedSubs.length,
        earnings: totalEarnings,
        pending: pendingSubs.length,
        rating: profile?.rating || 0,
      });

      setTasks(mySubmissions);
      setAvailableTasks(openTasks || []);

    } catch (error) {
      console.error("Error fetching freelancer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId) => {
    try {
      // Assign task to freelancer
      const { error } = await supabase
        .from("tasks")
        .update({ status: "assigned", assigned_to: user.id })
        .eq("id", taskId);

      if (error) throw error;

      // Navigate to submit page
      window.location.href = `/submit-work/${taskId}`;
    } catch (error) {
      console.error("Error accepting task:", error);
      alert("Could not accept task. It may have been taken.");
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-mono text-xs">Loading workspace...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Workspace</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your submissions and earnings in real-time.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Current Balance</div>
          <div className="text-2xl font-mono text-green-400 font-bold">LKR {stats.earnings.toLocaleString()}</div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Tasks Completed"
          value={stats.completed}
          icon={<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-blue-500/5"
          borderColor="border-blue-500/20"
        />
        <StatCard
          label="Pending Review"
          value={stats.pending}
          icon={<svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-yellow-500/5"
          borderColor="border-yellow-500/20"
        />
        <StatCard
          label="Quality Score"
          value={stats.rating > 0 ? stats.rating.toFixed(1) : "N/A"}
          icon={<svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>}
          color="bg-purple-500/5"
          borderColor="border-purple-500/20"
        />
        <StatCard
          label="Next Payout"
          value="Dec 15"
          icon={<svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
          color="bg-green-500/5"
          borderColor="border-green-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: MY SUBMISSIONS */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-wide border-b border-gray-800 pb-2">My Work History</h2>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm bg-black/20 rounded border border-gray-800">
                No work history yet. Start a task!
              </div>
            ) : (
              tasks.map((sub) => (
                <div key={sub.id} className="bg-black/40 border border-gray-800 p-4 rounded hover:bg-black/60 transition flex justify-between items-center group">
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                      {sub.task?.title || "Unknown Task"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span className="uppercase tracking-wide">{sub.task?.task_type}</span>
                      <span>•</span>
                      <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={sub.status} />
                    <div className="text-xs font-mono text-gray-400 mt-1">
                      {sub.status === "approved" ? (
                        <span className="text-green-400">+ LKR {sub.task?.price}</span>
                      ) : (
                        <span>LKR {sub.task?.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: AVAILABLE TASKS */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-wide border-b border-gray-800 pb-2">Available Opportunities</h2>
          <div className="space-y-3">
            {availableTasks.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm bg-black/20 rounded border border-gray-800">
                No new tasks available right now.
              </div>
            ) : (
              availableTasks.map((task) => (
                <div key={task.id} className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 p-4 rounded hover:border-gray-600 transition flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-white">{task.title}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-1.5 py-0.5 bg-gray-800 text-gray-300 text-[10px] uppercase tracking-wide rounded">
                        {task.difficulty}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{task.task_type}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-mono font-bold text-green-400">LKR {task.price}</span>
                    <button
                      onClick={() => handleAcceptTask(task.id)}
                      className="px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wide rounded hover:bg-gray-200 transition"
                    >
                      Start Task
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, borderColor }) {
  return (
    <div className={`p-5 rounded-lg ${color} border ${borderColor} backdrop-blur-sm`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{label}</span>
        <span className="opacity-80">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    approved: "text-green-400 bg-green-400/10 border-green-400/20",
    rejected: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${styles[status] || "text-gray-400"}`}>
      {status}
    </span>
  );
}
