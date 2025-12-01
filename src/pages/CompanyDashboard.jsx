import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";

const defaultTask = {
  title: "",
  description: "",
  task_type: "image",
  payout: "",
  estimated_time_minutes: "",
};

function CompanyDashboard() {
  const navigate = useNavigate();
  const [user] = useState(getStoredUser());
  const [taskForm, setTaskForm] = useState(defaultTask);
  const [creating, setCreating] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "company") {
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
          .eq("company_id", user.id)
          .order("created_at", { ascending: false });
        if (tasksError) throw tasksError;
        setTasks(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load your tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate, user]);

  const sidebarItems = [
    { label: "Company dashboard", to: "/company" },
    { label: "Dataset marketplace", to: "/datasets" },
  ];

  const onChangeField = (field, value) => {
    setTaskForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.description || !taskForm.payout) return;

    setCreating(true);
    setError("");

    try {
      const payload = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        task_type: taskForm.task_type,
        payout: Number(taskForm.payout),
        estimated_time_minutes: taskForm.estimated_time_minutes
          ? Number(taskForm.estimated_time_minutes)
          : null,
        company_id: user.id,
      };

      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert([payload])
        .select();

      if (insertError) throw insertError;

      setTasks((prev) => [...data, ...prev]);
      setTaskForm(defaultTask);
    } catch (err) {
      console.error(err);
      setError("Task could not be created. Please check the fields and try again.");
    } finally {
      setCreating(false);
    }
  };

  const totalBudget = tasks.reduce(
    (sum, t) => sum + Number(t.payout || 0),
    0
  );

  return (
    <section className="pt-6 flex gap-6">
      <Sidebar items={sidebarItems} />

      <div className="flex-1 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
              Company dashboard
            </div>
            <h2 className="text-xl font-semibold mt-1">
              {user ? user.name : "Company"}
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard label="Posted tasks" value={tasks.length} />
          <StatCard
            label="Budget in play"
            value={`₹${totalBudget}`}
            sub="Total payout across open tasks"
          />
          <StatCard
            label="Workspace status"
            value="Live"
            sub="Configured for ongoing projects"
          />
        </div>

        {error && <p className="text-[11px] text-red-400">{error}</p>}

        <div className="grid lg:grid-cols-[2fr,3fr] gap-6 items-start">
          {/* FORM */}
          <form
            onSubmit={handleCreateTask}
            className="shinra-card p-5 space-y-4 text-sm"
          >
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
              Post labeling task
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                Title
              </label>
              <input
                type="text"
                className="w-full rounded-lg bg-black border border-shinra-border px-3 py-2 text-sm outline-none focus:border-white"
                value={taskForm.title}
                onChange={(e) => onChangeField("title", e.target.value)}
                placeholder="Label 10K Hindi tweets"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                Description
              </label>
              <textarea
                className="w-full h-24 rounded-lg bg-black border border-shinra-border px-3 py-2 text-sm outline-none focus:border-white resize-none"
                value={taskForm.description}
                onChange={(e) => onChangeField("description", e.target.value)}
                placeholder="Add task instructions, examples and output format. Include any links to spec docs or sample files."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                  Type
                </label>
                <select
                  className="w-full rounded-lg bg-black border border-shinra-border px-3 py-2 text-sm outline-none focus:border-white"
                  value={taskForm.task_type}
                  onChange={(e) => onChangeField("task_type", e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                  Payout (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-lg bg-black border border-shinra-border px-3 py-2 text-sm outline-none focus:border-white"
                  value={taskForm.payout}
                  onChange={(e) => onChangeField("payout", e.target.value)}
                  placeholder="5000"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                Estimated time (minutes)
              </label>
              <input
                type="number"
                min="0"
                className="w-full rounded-lg bg-black border border-shinra-border px-3 py-2 text-sm outline-none focus:border-white"
                value={taskForm.estimated_time_minutes}
                onChange={(e) =>
                  onChangeField("estimated_time_minutes", e.target.value)
                }
                placeholder="60"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="mt-2 w-full text-[11px] uppercase tracking-[0.2em] border border-white rounded-full px-4 py-2 hover:bg-white hover:text-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {creating ? "Publishing…" : "Create task"}
            </button>
          </form>

          {/* RECENT TASKS */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
              Your recent tasks
            </div>
            {loading ? (
              <p className="text-sm text-gray-400">Loading…</p>
            ) : tasks.length === 0 ? (
              <p className="text-sm text-gray-400">
                No tasks yet. Use the form on the left to create your first
                labeling batch.
              </p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="shinra-card p-4 flex items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <div className="font-medium text-xs">{task.title}</div>
                      <div className="text-[11px] text-gray-500">
                        {task.task_type} · ₹{task.payout}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                      {task.status || "open"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompanyDashboard;
