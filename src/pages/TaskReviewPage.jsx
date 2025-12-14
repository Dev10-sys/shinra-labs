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
    const [liveFeed, setLiveFeed] = useState([
        { id: 1, text: "System Auto-Flagged Submission #9921 for 'Blurry'", type: "system", time: "2m ago" },
        { id: 2, text: "QA Specialist approved Task #8842", type: "human", time: "5m ago" },
        { id: 3, text: "AI Confidence dropping on Project 'Alpha'", type: "alert", time: "12m ago" }
    ]);

    useEffect(() => {
        fetchData();
        // Simulate Live Feed updates
        const interval = setInterval(() => {
            const events = [
                { text: `AI Verification confirmed for Sub #${Math.floor(Math.random() * 9000) + 1000}`, type: "system" },
                { text: `New discrepancy flagged in sector 4`, type: "alert" },
                { text: `Orchestrator re-routed 15 tasks to 'Expert' pool`, type: "system" }
            ];
            const newEvent = { ...events[Math.floor(Math.random() * events.length)], id: Date.now(), time: "Just now" };
            setLiveFeed(prev => [newEvent, ...prev].slice(0, 5));
        }, 8000);
        return () => clearInterval(interval);
    }, [taskId]);

    const fetchData = async () => {
        try {
            const { data: taskData } = await supabase
                .from("tasks")
                .select("*")
                .eq("id", taskId)
                .single();
            setTask(taskData);

            const { data: subData } = await supabase
                .from("submissions")
                .select(`*, freelancer:users_meta!freelancer_id (name, rating, completed_tasks, skills, experience, role)`)
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

            // 2. Update Task & Create Assets
            if (isApproved) {
                await supabase
                    .from("tasks")
                    .update({ status: "approved" })
                    .eq("id", taskId);

                await supabase.from("datasets").insert({
                    title: `${task.title} (Verified)`,
                    description: `Professional quality dataset generated from task: ${task.title}. Contains approved annotations verified by Shinra QA.`,
                    price: task.price * 2.5,
                    data_type: task.task_type,
                    source_task_id: taskId,
                });
            } else {
                await supabase
                    .from("tasks")
                    .update({ status: "open", assigned_to: null })
                    .eq("id", taskId);
            }

            // 3. Notify
            await supabase.from("notifications").insert({
                user_id: freelancerId,
                message: isApproved
                    ? `PAYMENT RELEASED: ₹${task.price} for '${task.title}' has been credited.`
                    : `REVISION REQUESTED: Your submission for '${task.title}' was rejected.`,
            });

            // Update local state instead of reload
            setSubmissions(prev => prev.filter(s => s.id !== submissionId));

        } catch (error) {
            console.error("Error processing decision:", error);
            alert("Error processing decision");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 font-mono text-xs">Loading QA console...</div>;

    return (
        <div className="max-w-7xl mx-auto animate-fade-in text-white font-sans pb-20 px-6">

            {/* CONTROL CENTER HEADER */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12 border-b border-white/10 pb-8">
                <div className="lg:col-span-2">
                    <div className="text-[10px] uppercase tracking-widest text-purple-400 mb-1">Human-in-the-Loop</div>
                    <h1 className="text-3xl font-medium tracking-tight">Quality Control Center</h1>
                </div>

                {/* QUALITY TRENDS SPARKLINE (MOCKED) */}
                <div className="bg-white/5 border border-white/10 p-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Quality Trend (24h)</div>
                    <div className="h-12 flex items-end gap-1">
                        {[40, 60, 45, 70, 85, 90, 80, 95, 88, 92].map((h, i) => (
                            <div key={i} className="flex-1 bg-purple-500/50 hover:bg-purple-400 transition-colors" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>

                {/* LIVE AUDIT FEED */}
                <div className="bg-black border border-white/10 p-4 overflow-hidden relative">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Live Audit Log</div>
                    <div className="space-y-2 max-h-16 overflow-hidden">
                        {liveFeed.map(item => (
                            <div key={item.id} className="text-[10px] font-mono flex gap-2 animate-fade-in">
                                <span className={item.type === 'alert' ? 'text-red-500' : item.type === 'human' ? 'text-green-500' : 'text-blue-500'}>
                                    [{item.type.toUpperCase()}]
                                </span>
                                <span className="text-gray-400 truncate">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* REVIEW QUEUE */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-sm font-medium uppercase tracking-widest text-gray-400">Review Queue ({submissions.length})</h2>
                <button onClick={() => navigate("/company")} className="text-xs text-gray-500 hover:text-white uppercase">Return to Dashboard</button>
            </div>

            {submissions.length === 0 ? (
                <div className="border border-white/10 bg-black p-20 text-center">
                    <div className="text-5xl mb-6 text-gray-800 grayscale">✓</div>
                    <p className="text-gray-400 text-sm font-medium">All caught up!</p>
                    <p className="text-gray-600 text-xs mt-2">No pending reviews in the queue.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {submissions.map((sub) => (
                        <SubmissionItem key={sub.id} sub={sub} taskId={taskId} onDecide={handleDecision} processingId={processing} />
                    ))}
                </div>
            )}
        </div>
    );
}

function SubmissionItem({ sub, taskId, onDecide, processingId }) {
    const [aiData, setAiData] = useState(null);

    useEffect(() => {
        async function getJudgment() {
            try {
                const res = await fetch("/api/judge", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        submission_data: sub.submission_data || "mock data",
                        task_type: "text"
                    }),
                });
                const data = await res.json();
                setAiData(data);
            } catch (e) {
                console.error("AI Judge Error", e);
            }
        }
        getJudgment();
    }, [sub.id]);

    const isProcessing = processingId === sub.id;
    const aiScore = aiData ? aiData.score : 0;
    const scorePercentage = (aiScore * 100).toFixed(1);

    return (
        <div className="border border-white/10 bg-[#050505] grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-2xl shadow-black/50">

            {/* VISUALIZER (Left Main) */}
            <div className="lg:col-span-8 relative min-h-[500px] border-r border-white/10 bg-black group">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 opacity-50"></div>

                {/* MOCKED CONTENT DISPLAY */}
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <p className="font-mono text-gray-500 text-sm leading-8 max-w-2xl">
                        {sub.submission_data || "No preview data available for this submission."}
                    </p>
                </div>

                {/* AI OVERLAY */}
                {aiData && (
                    <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                        <div className={`px-4 py-2 text-xl font-bold font-mono text-black ${aiScore > 0.8 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                            {scorePercentage}% MATCH
                        </div>
                        <div className="text-[10px] bg-black/80 px-2 py-1 text-gray-400 border border-white/10 uppercase tracking-widest">
                            AI Confidence: {aiData.confidence}
                        </div>
                    </div>
                )}
            </div>

            {/* CONTROLS (Right Sidebar) */}
            <div className="lg:col-span-4 flex flex-col bg-[#070707]">

                {/* SUBMITTER INFO */}
                <div className="p-6 border-b border-white/10">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Submitted By</div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20"></div>
                        <div>
                            <div className="text-sm font-bold text-white">{sub.freelancer?.name || "Unknown"}</div>
                            <div className="text-[10px] text-gray-500">{sub.freelancer?.role} • Tier {sub.freelancer?.rating}</div>
                        </div>
                    </div>
                </div>

                {/* AI ANALYSIS */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    <div>
                        <h3 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                            AI Analysis
                        </h3>
                        {aiData ? (
                            <div className="space-y-3">
                                <p className="text-xs text-gray-300 leading-relaxed border-l-2 border-purple-500/30 pl-3">
                                    {aiData.reasoning}
                                </p>
                                {aiData.error_categories?.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {aiData.error_categories.map(e => <span key={e} className="px-2 py-1 bg-red-900/20 text-red-400 text-[9px] font-bold border border-red-500/20 uppercase">{e}</span>)}
                                    </div>
                                )}
                            </div>
                        ) : <div className="animate-pulse h-20 bg-white/5 rounded"></div>}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="p-6 border-t border-white/10 bg-black/50">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => onDecide(sub.id, "rejected", sub.freelancer_id)}
                            disabled={isProcessing}
                            className="py-4 border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-bold uppercase tracking-widest transition"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => onDecide(sub.id, "approved", sub.freelancer_id)}
                            disabled={isProcessing}
                            className="py-4 bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-widest transition"
                        >
                            Approve
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
