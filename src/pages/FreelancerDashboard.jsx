import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";

export default function FreelancerDashboard() {
  const user = getStoredUser();
  const [tasks, setTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATS
  const [stats, setStats] = useState({
    completed: 0,
    earnings: 0,
    pending: 0,
    rating: 0,
  });

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
      const approvedSubs = mySubmissions?.filter((s) => s.status === "approved") || [];
      const pendingSubs = mySubmissions?.filter((s) => s.status === "pending") || [];
      const totalEarnings = approvedSubs.reduce((sum, s) => sum + (s.task?.price || 0), 0);

      const hasRealData = mySubmissions?.length > 0 || openTasks?.length > 0;

      // === DEMO DATA SEEDING (If Empty) ===
      if (!hasRealData) {
        setStats({
          completed: 124,
          earnings: 12500,
          pending: 4,
          rating: 4.88
        });
        setTasks([
          { id: "demo_1", status: "approved", task: { title: "Semantic Segmentation (Cityscape)", task_type: "image", price: 150 }, created_at: new Date().toISOString() },
          { id: "demo_2", status: "pending", task: { title: "RLHF: Python Code Correction", task_type: "code", price: 300 }, created_at: new Date().toISOString() },
          { id: "demo_3", status: "approved", task: { title: "Sentiment Analysis (Hindi)", task_type: "text", price: 45 }, created_at: new Date().toISOString() },
        ]);
        setAvailableTasks([
          { id: "demo_t1", title: "Lidar 3D Point Cloud Annotation", task_type: "3d", price: 450, difficulty: "expert" },
          { id: "demo_t2", title: "Medical Image Diagnosis Bounding Box", task_type: "image", price: 200, difficulty: "hard" },
          { id: "demo_t3", title: "English-Spanish Translation", task_type: "text", price: 80, difficulty: "medium" },
        ]);
      } else {
        setStats({
          completed: approvedSubs.length,
          earnings: totalEarnings,
          pending: pendingSubs.length,
          rating: profile?.rating || 0,
        });
        setTasks(mySubmissions || []);
        setAvailableTasks(openTasks || []);
      }

    } catch (error) {
      console.error("Error fetching freelancer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId) => {
    // Handle Demo Tasks
    if (taskId.startsWith("demo_")) {
      alert("This is a demo task. To perform real work, please ask an Admin/Company to create a task first.");
      return;
    }

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

  if (loading) return <div className="text-center py-20 text-gray-500 font-mono text-xs">Initializing workspace...</div>;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-medium text-white tracking-tight">Labeling Workspace</h1>
          <p className="text-gray-500 text-sm mt-1">
            Task Queue & Performance Metrics
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Unpaid Balance</div>
          <div className="text-3xl font-mono text-white tracking-tight">₹ {stats.earnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
        <StatCard
          label="Tasks Completed"
          value={stats.completed}
          unit="TASKS"
        />
        <StatCard
          label="Pending Review"
          value={stats.pending}
          unit="QUEUE"
        />
        <StatCard
          label="Quality Score"
          value={stats.rating > 0 ? stats.rating.toFixed(2) : "0.00"}
          unit="AVG"
          highlight
        />
        <StatCard
          label="Next Payout"
          value="15"
          unit="DEC"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT: MY SUBMISSIONS */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium uppercase tracking-widest text-gray-400">Work History</h2>
          </div>
          <div className="space-y-0 border border-white/10 divide-y divide-white/10">
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-gray-600 text-xs font-mono">
                No work history recorded.
              </div>
            ) : (
              tasks.map((sub) => (
                <div key={sub.id} className="bg-black p-4 flex justify-between items-center group hover:bg-white/5 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-white transition-colors">
                      {sub.task?.title || "Unknown Task"}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-3 font-mono uppercase">
                      <span>{sub.task?.task_type}</span>
                      <span className="text-gray-700">|</span>
                      <span>ID: {sub.id.slice(0, 8)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={sub.status} />
                    <div className="text-[10px] font-mono text-gray-500 mt-1">
                      {sub.status === "approved" ? (
                        <span className="text-white">+ ₹ {sub.task?.price}</span>
                      ) : (
                        <span>₹ {sub.task?.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: AVAILABLE TASKS */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium uppercase tracking-widest text-gray-400">Available Queue</h2>
          </div>
          <div className="space-y-0 border border-white/10 divide-y divide-white/10">
            {availableTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-600 text-xs font-mono">
                Queue is empty.
              </div>
            ) : (
              availableTasks.map((task) => (
                <div key={task.id} className="bg-gradient-to-r from-black to-gray-900/20 p-4 flex justify-between items-center hover:from-white/5 hover:to-white/5 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-white">{task.title}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-1.5 py-0.5 bg-white/10 text-gray-300 text-[10px] uppercase tracking-wide">
                        {task.difficulty}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{task.task_type}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-sm font-mono font-medium text-white">₹ {task.price}</span>
                    <button
                      onClick={() => handleAcceptTask(task.id)}
                      className="px-4 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-wide hover:bg-gray-200 transition"
                    >
                      Start
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
    pending: "text-yellow-500 border-yellow-500/20 bg-yellow-500/5",
    approved: "text-green-500 border-green-500/20 bg-green-500/5",
    rejected: "text-red-500 border-red-500/20 bg-red-500/5",
  };

  return (
    <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest ${styles[status] || "text-gray-500 border-gray-500"}`}>
      {status}
    </span>
  );
}
