import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function TaskReviewPage() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchData();
    }, [taskId]);

    const fetchData = async () => {
        try {
            // Fetch task
            const { data: taskData } = await supabase
                .from("tasks")
                .select("*")
                .eq("id", taskId)
                .single();
            setTask(taskData);

            // Fetch submissions with freelancer details
            const { data: subData } = await supabase
                .from("submissions")
                .select(`
          *,
          freelancer:users_meta!freelancer_id (name, rating, completed_tasks, skills, experience, role)
        `)
                .eq("task_id", taskId)
                .eq("status", "pending");

            setSubmissions(subData || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (submissionId, decision, freelancerId) => {
        setProcessing(submissionId);
        try {
            const isApproved = decision === "approved";

            // 1. Update Submission
            await supabase
                .from("submissions")
                .update({ status: decision })
                .eq("id", submissionId);

            // 2. Update Task Status (if approved)
            if (isApproved) {
                await supabase
                    .from("tasks")
                    .update({ status: "approved" })
                    .eq("id", taskId);

                // 3. Create Dataset
                await supabase.from("datasets").insert({
                    title: `${task.title} - Dataset`,
                    description: `Generated from task: ${task.title}`,
                    price: task.price * 2,
                    data_type: task.task_type,
                    source_task_id: taskId,
                });
            } else {
                // If rejected, reopen task
                await supabase
                    .from("tasks")
                    .update({ status: "open", assigned_to: null })
                    .eq("id", taskId);
            }

            // 4. Notify Freelancer
            await supabase.from("notifications").insert({
                user_id: freelancerId,
                message: isApproved
                    ? `Submission approved for '${task.title}'! Payment pending.`
                    : `Submission rejected for '${task.title}'. Task reopened.`,
            });

            alert(`Submission ${decision}.`);
            navigate("/company");
        } catch (error) {
            console.error("Error:", error);
            alert("Action failed.");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 font-mono text-xs">Loading review console...</div>;

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Review Submissions</h1>
                    <p className="text-gray-400 text-sm mt-1 font-mono">
                        Task ID: <span className="text-gray-300">{taskId.slice(0, 8)}</span>
                    </p>
                </div>
                <button
                    onClick={() => navigate("/company")}
                    className="text-xs text-gray-500 hover:text-white transition uppercase tracking-wide"
                >
                    Back to Dashboard
                </button>
            </div>

            {/* CONTENT */}
            {submissions.length === 0 ? (
                <div className="bg-black/20 border border-gray-800 rounded-lg p-12 text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <p className="text-gray-500 text-sm">No pending submissions for this task.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {submissions.map((sub) => (
                        <div key={sub.id} className="bg-black border border-gray-800 rounded-lg overflow-hidden shadow-lg">
                            {/* FREELANCER INFO BAR */}
                            <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-white">
                                        {sub.freelancer?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{sub.freelancer?.name || "Unknown User"}</div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                                            Rating: <span className="text-yellow-500">{sub.freelancer?.rating || "N/A"}</span> • Exp: {sub.freelancer?.experience || "N/A"}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs font-mono text-gray-500">
                                    Submitted: {new Date(sub.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            {/* SUBMISSION CONTENT */}
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Data Preview</h3>
                                    <button
                                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                        onClick={() => navigator.clipboard.writeText(sub.submission_data)}
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m2 4h6m-6 4h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        Copy Data
                                    </button>
                                </div>
                                <div className="bg-gray-900 rounded p-4 border border-gray-800 font-mono text-xs text-gray-300 overflow-x-auto max-h-64">
                                    <pre>{sub.submission_data}</pre>
                                </div>
                            </div>

                            {/* ACTION BAR */}
                            <div className="px-6 py-4 bg-gray-900/30 border-t border-gray-800 flex justify-end gap-3">
                                <button
                                    onClick={() => handleDecision(sub.id, "rejected", sub.freelancer_id)}
                                    disabled={processing === sub.id}
                                    className="px-4 py-2 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wide rounded hover:bg-red-500/10 transition disabled:opacity-50"
                                >
                                    Reject & Reopen
                                </button>
                                <button
                                    onClick={() => handleDecision(sub.id, "approved", sub.freelancer_id)}
                                    disabled={processing === sub.id}
                                    className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-wide rounded hover:bg-gray-200 transition disabled:opacity-50 shadow-lg shadow-white/5"
                                >
                                    {processing === sub.id ? "Processing..." : "Approve & Pay"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
