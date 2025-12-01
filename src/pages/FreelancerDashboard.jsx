import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";

function FreelancerDashboard() {
  const navigate = useNavigate();
  const [user] = useState(getStoredUser());
  const [tasks, setTasks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "freelancer") {
      navigate("/login");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .eq("status", "open")
          .order("created_at", { ascending: false });
        if (tasksError) throw tasksError;
        setTasks(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load tasks right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate, user]);

  const handleSubmitWork = async () => {
    if (!activeTask || !note.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const { error: insertError } = await supabase.from("submissions").insert([
        {
          task_id: activeTask.id,
          freelancer_id: user.id,
          submission_data: note.trim(),
          verified: false,
          ai_confidence: 0,
          shinra_message: "Queued for review",
        },
      ]);
      if (insertError) throw insertError;

      setActiveTask(null);
      setNote("");
      alert("Submission received. It has been added to the review queue.");
    } catch (err) {
      console.error(err);
      setError("We could not submit your work. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  const sidebarItems = [
    { label: "Task feed", to: "/freelancer" },
    { label: "Dataset marketplace", to: "/datasets" },
  ];

  return (
    <section className="pt-6 flex gap-6">
      <Sidebar items={sidebarItems} />

      <div className="flex-1 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
              Freelancer dashboard
            </div>
            <h2 className="text-xl font-semibold mt-1">Welcome, {user.name}</h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard label="Open tasks" value={tasks.length} sub="Available to pick" />
          <StatCard label="Your rank" value="#—" sub="Leaderboard to be added" />
          <StatCard
            label="Earnings"
            value="₹0"
            sub="Wallet integration can be wired later"
          />
        </div>

        {error && <p className="text-[11px] text-red-400">{error}</p>}

        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
            Task feed
          </div>
          {loading ? (
            <p className="text-sm text-gray-400">Loading tasks…</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-gray-400">
              No open tasks at the moment. New projects will appear here as they go live.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onPick={setActiveTask} />
              ))}
            </div>
          )}
        </div>

        {activeTask && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20">
            <div className="shinra-card w-full max-w-lg p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-1">
                    Submit work
                  </div>
                  <div className="text-sm font-medium">{activeTask.title}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="text-[11px] text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <p className="text-[11px] text-gray-400">
                Paste a short description, link or file location for your completed work.
                This note is stored with the submission for review.
              </p>

              <textarea
                className="w-full h-32 rounded-lg bg-black border border-shinra-border px-3 py-2 text-sm outline-none focus:border-white resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Example: Completed labeling in shared sheet: https://..."
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 border border-shinra-border rounded-full hover:border-white/60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitWork}
                  className="text-[11px] uppercase tracking-[0.18em] px-4 py-1.5 border border-white rounded-full hover:bg-white hover:text-black disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FreelancerDashboard;
