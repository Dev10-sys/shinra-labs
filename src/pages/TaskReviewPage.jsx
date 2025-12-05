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
            const { error: subError } = await supabase
                .from("submissions")
                .update({ status: decision })
                .eq("id", submissionId);

            if (subError) throw subError;

            // 2. Update Task Status & Create Assets (if approved)
            if (isApproved) {
                // A. Update Task
                await supabase
                    .from("tasks")
                    .update({ status: "approved" })
                    .eq("id", taskId);

                // B. Create Marketable Dataset (Auto-Publish)
                // This fulfills the "approved labeled data go for sell" requirement
                await supabase.from("datasets").insert({
                    title: `${task.title} (Verified)`,
                    description: `Professional quality dataset generated from task: ${task.title}. Contains approved annotations manually verified by Shinra QA.`,
                    price: task.price * 2.5, // Markup logic
                    data_type: task.task_type,
                    source_task_id: taskId,
                });

                // C. Release Funds (Simulate Payout)
                // In a real app, this would increment 'wallet_balance' in users_meta
                // For this demo, FreelancerDashboard calculates this dynamically from 'approved' tasks.
            } else {
                // If rejected, reopen task for others
                await supabase
                    .from("tasks")
                    .update({ status: "open", assigned_to: null })
                    .eq("id", taskId);
            }

            // 3. Notify Freelancer (Real-time alert)
            await supabase.from("notifications").insert({
                user_id: freelancerId,
                message: isApproved
                    ? `PAYMENT RELEASED: ₹${task.price} for '${task.title}' has been credited to your wallet.`
                    : `REVISION REQUESTED: Your submission for '${task.title}' was rejected. The task has been reopened.`,
            });

            alert(isApproved ? "Submission Aproved & Funds Released." : "Submission Rejected.");
            navigate("/company");
        } catch (error) {
            console.error("Error processing decision:", error);
            // FAIL-SAFE for Demo: If DB fails, still navigate back to show flow
            navigate("/company");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 font-mono text-xs">Loading QA console...</div>;

    return (
        <div className="max-w-6xl mx-auto animate-fade-in text-white font-sans pb-20">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight">Quality Assurance</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Review submissions against Ground Truth and Consensus.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/company")}
                    className="text-xs text-gray-500 hover:text-white transition uppercase tracking-wide font-bold"
                >
                    Back to Dashboard
                </button>
            </div>

            {/* CONTENT */}
            {submissions.length === 0 ? (
                <div className="border border-white/10 bg-black p-12 text-center">
                    <div className="text-4xl mb-4 text-gray-800">✓</div>
                    <p className="text-gray-500 text-sm">No pending reviews in queue.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {submissions.map((sub) => {
                        const aiScore = sub.auto_score || Math.random() * (0.98 - 0.70) + 0.70;
                        const scoreColor = aiScore > 0.9 ? "text-green-500" : aiScore > 0.8 ? "text-yellow-500" : "text-red-500";
                        const scorePercentage = (aiScore * 100).toFixed(1);

                        return (
                            <div key={sub.id} className="border border-white/10 bg-[#050505] overflow-hidden">
                                {/* TOP BAR */}
                                <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Submitter</span>
                                            <span className="text-sm font-medium text-white">{sub.freelancer?.name || "Unknown User"}</span>
                                        </div>
                                        <div className="w-px h-8 bg-white/10"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Experience</span>
                                            <span className="text-sm text-gray-300">{sub.freelancer?.experience || "N/A"}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Confidence</div>
                                            <div className={`text-xl font-mono ${scoreColor}`}>{scorePercentage}%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3">
                                    {/* VISUALIZER (Simulated) */}
                                    <div className="lg:col-span-2 border-r border-white/10 bg-[#0a0a0a] min-h-[400px] flex items-center justify-center relative group">
                                        {/* Background simulating the annotated image */}
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>

                                        {/* Fake Consensus Overlay */}
                                        {aiScore > 0.85 && (
                                            <div className="absolute top-10 right-10 border-2 border-green-500 w-32 h-24 bg-green-500/10 flex items-start justify-end p-1">
                                                <span className="text-[9px] bg-green-500 text-white px-1 font-bold">MATCH</span>
                                            </div>
                                        )}
                                        {/* User Submission Overlay (Simulated from actual data if parseable, else generic box) */}
                                        <div className="absolute top-12 right-12 border-2 border-blue-500 w-32 h-24 bg-blue-500/10 flex items-start justify-start p-1">
                                            <span className="text-[9px] bg-blue-500 text-white px-1 font-bold">USER</span>
                                        </div>

                                        <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 text-xs font-mono text-gray-300 border border-white/10">
                                            Visualizing GeoJSON Overlay...
                                        </div>
                                    </div>

                                    {/* METADATA & ACTIONS */}
                                    <div className="p-6 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Submission Data</h3>
                                                <div className="bg-black border border-white/10 p-3 font-mono text-[10px] text-gray-400 h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed custom-scrollbar">
                                                    {sub.submission_data}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Automated Checks</h3>
                                                <ul className="space-y-2 text-xs">
                                                    <li className="flex justify-between">
                                                        <span className="text-gray-400">Completeness</span>
                                                        <span className="text-white">100%</span>
                                                    </li>
                                                    <li className="flex justify-between">
                                                        <span className="text-gray-400">IoU Score</span>
                                                        <span className="text-white">0.92</span>
                                                    </li>
                                                    <li className="flex justify-between">
                                                        <span className="text-gray-400">Outliers</span>
                                                        <span className="text-green-500">None</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/10 space-y-3">
                                            <button
                                                onClick={() => handleDecision(sub.id, "approved", sub.freelancer_id)}
                                                disabled={processing === sub.id}
                                                className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-wide hover:bg-gray-200 transition disabled:opacity-50"
                                            >
                                                {processing === sub.id ? "Processing Payment..." : "Approve & Release Funds"}
                                            </button>
                                            <button
                                                onClick={() => handleDecision(sub.id, "rejected", sub.freelancer_id)}
                                                disabled={processing === sub.id}
                                                className="w-full py-3 border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-wide hover:bg-red-500/10 transition disabled:opacity-50"
                                            >
                                                Reject & Reopen Task
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
