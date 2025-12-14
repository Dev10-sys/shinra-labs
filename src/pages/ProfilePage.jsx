import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";

function ProfilePage() {
    const user = getStoredUser();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ approvedCount: 0, totalEarned: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            // 1. Fetch Meta
            let { data: metaData, error: metaError } = await supabase
                .from("users_meta")
                .select("*")
                .eq("id", user.id)
                .single();

            // If missing meta, create simulated fallback for older accounts
            if (!metaData) {
                metaData = {
                    ...user,
                    skills: ["General Annotation"],
                    experience: "N/A",
                    gst_id: "N/A",
                    industry: "N/A",
                    website: "N/A"
                };
            }
            // 1b. Fetch AI Reputation
            if (user.role === "freelancer") {
                try {
                    const res = await fetch(`/api/reputation/${user.id}`);
                    if (res.ok) {
                        const reputationData = await res.json();
                        metaData = { ...metaData, ai_reputation: reputationData };
                    }
                } catch (e) {
                    console.error("Reputation fetch failed", e);
                }
            }
            setProfile(metaData);

            // 2. Fetch Stats
            if (user.role === "freelancer") {
                const { data: tasks } = await supabase
                    .from("tasks")
                    .select("price")
                    .eq("assigned_to", user.id)
                    .eq("status", "approved");

                const totalEarned = tasks?.reduce((sum, t) => sum + (t.price || 0), 0) || 0;
                setStats({ approvedCount: tasks?.length || 0, totalEarned });
            }

            setLoading(false);
        };

        fetchProfile();
    }, [user, navigate]);

    if (loading) return <div className="text-center py-20 text-gray-500 font-mono text-xs">Loading profile...</div>;
    if (!profile) return null;

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 animate-fade-in text-white font-sans">

            {/* HEADER */}
            <div className="flex items-start justify-between border-b border-white/10 pb-8 mb-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-2xl font-bold">
                        {profile.name?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-medium tracking-tight mb-2">{profile.name}</h1>
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest">
                                {profile.role === "company" ? "Enterprise" : "Expert Labeler"}
                            </span>
                            <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                Active
                            </span>
                        </div>
                    </div>
                </div>

                {profile.role === "freelancer" && (
                    <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Earnings</div>
                        <div className="text-4xl font-light font-mono">₹ {stats.totalEarned.toLocaleString()}</div>
                    </div>
                )}
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* LEFT: IDENTITY */}
                <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">Identity</h3>

                    <InfoRow label="User ID" value={user.id} mono />
                    <InfoRow label="Email" value={profile.email} />

                    {profile.role === "company" && (
                        <>
                            <InfoRow label="Organization" value={profile.name} />
                            <InfoRow label="Industry" value={profile.industry || "Not Specified"} />
                            <InfoRow label="Tax / GST ID" value={profile.gst_id ? profile.gst_id : "Unverified"} mono />
                            <InfoRow label="Website" value={profile.website} isLink />
                        </>
                    )}

                    {profile.role === "freelancer" && (
                        <>
                            <InfoRow label="Experience" value={profile.experience} />
                            <InfoRow label="Tasks Completed" value={stats.approvedCount} />
                            <InfoRow label="Rating" value={profile.rating ? `${profile.rating} / 5.0` : "New"} />
                        </>
                    )}
                </div>

                {/* RIGHT: PROFESSIONAL */}
                <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
                        {profile.role === "company" ? "Subscription" : "Qualifications"}
                    </h3>

                    {profile.role === "company" ? (
                        <div className="p-6 border border-white/10 bg-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-lg font-medium">Enterprise Tier</div>
                                    <div className="text-xs text-gray-400">Unlimited Datasets, Priority Support</div>
                                </div>
                                <button className="text-[10px] font-bold border border-white px-3 py-1 hover:bg-white hover:text-black transition uppercase">Manage</button>
                            </div>
                            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-3/4"></div>
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
                                <span>USAGE: 75%</span>
                                <span>RENEWS: DEC 31</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* AI REPUTATION CARD */}
                            <div className="p-5 border border-purple-500/30 bg-purple-900/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/20 blur-3xl rounded-full -mr-10 -mt-10"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">AI TRUST SCORE</div>
                                        <div className="text-4xl font-mono text-white flex items-baseline gap-2">
                                            {profile.ai_reputation?.trust_score || 0}
                                            <span className="text-xs text-gray-400 font-sans font-normal">/ 100</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-2 py-1 bg-purple-500 text-white text-[10px] font-bold uppercase">Shinra S-Rank</span>
                                    </div>
                                </div>

                                <p className="text-xs text-purple-200/80 leading-relaxed mb-4 italic">
                                    "{profile.ai_reputation?.summary || "AI is analyzing your recent submissions..."}"
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {profile.ai_reputation?.badges?.map(badge => (
                                        <span key={badge} className="px-2 py-1 border border-purple-400/30 text-[10px] text-purple-200 uppercase bg-purple-500/10">
                                            ★ {badge}
                                        </span>
                                    )) || <span className="text-xs text-gray-500">No badges earned yet.</span>}
                                </div>
                            </div>

                            <div>
                                <div className="text-[10px] text-gray-500 uppercase mb-2">Verified Skills</div>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills && Array.isArray(profile.skills) ?
                                        profile.skills.map(s => (
                                            <span key={s} className="px-3 py-1 border border-white/20 text-xs text-gray-300 hover:border-white hover:text-white transition cursor-default">
                                                {s}
                                            </span>
                                        ))
                                        : <span className="text-gray-600 text-xs italic">No skills listed.</span>
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function InfoRow({ label, value, mono, isLink }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <span className="text-sm text-gray-500">{label}</span>
            {isLink ? (
                <a href={value} target="_blank" rel="noreferrer" className="col-span-2 text-sm text-blue-400 hover:underline truncate">{value || "-"}</a>
            ) : (
                <span className={`col-span-2 text-sm text-gray-200 truncate ${mono ? "font-mono" : ""}`}>{value || "-"}</span>
            )}
        </div>
    );
}

export default ProfilePage;
