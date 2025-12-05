import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";

export default function SubmitWorkPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [task, setTask] = useState(null);
  const [submissionData, setSubmissionData] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (error) console.error("Error fetching task:", error);
    else setTask(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionData.trim()) return alert("Please enter data.");

    setSubmitting(true);
    try {
      const { error } = await supabase.from("submissions").insert({
        task_id: taskId,
        freelancer_id: user.id,
        submission_data: submissionData,
        status: "pending",
      });

      if (error) throw error;

      // Update task status
      await supabase
        .from("tasks")
        .update({ status: "submitted" })
        .eq("id", taskId);

      alert("Work submitted successfully.");
      navigate("/freelancer");
    } catch (error) {
      console.error("Error submitting work:", error);
      alert("Failed to submit work.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-mono text-sm">Initializing workspace...</div>;
  if (!task) return <div className="text-center py-20 text-red-500 font-mono text-sm">Task not found.</div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* HEADER */}
      <div className="mb-8 border-b border-gray-800 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{task.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-xs font-mono text-gray-400">
              <span className="bg-gray-800 px-2 py-1 rounded text-gray-300 uppercase tracking-wide">{task.task_type}</span>
              <span>ID: {task.id.slice(0, 8)}</span>
              <span className="text-green-400">Reward: ₹ {task.price}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/freelancer")}
            className="text-xs text-gray-500 hover:text-white transition uppercase tracking-wide"
          >
            Cancel
          </button>
        </div>
        <p className="mt-4 text-gray-300 text-sm leading-relaxed max-w-2xl">
          {task.description}
        </p>
      </div>

      {/* WORKSPACE */}
      <div className="bg-black border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
        <div className="bg-gray-900/50 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Data Entry Terminal</span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-0">
          <div className="relative">
            <textarea
              value={submissionData}
              onChange={(e) => setSubmissionData(e.target.value)}
              className="w-full h-96 bg-black text-gray-300 font-mono text-sm p-6 focus:outline-none resize-none leading-relaxed"
              placeholder="// Enter labeled data here in JSON, CSV, or plain text format..."
              spellCheck="false"
            ></textarea>
            <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-mono">
              {submissionData.length} chars
            </div>
          </div>

          <div className="bg-gray-900/30 px-6 py-4 border-t border-gray-800 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              <span className="text-green-500">●</span> System Ready
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-white text-black px-6 py-2 rounded text-xs font-bold uppercase tracking-wide hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>Processing...</>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Submit Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
