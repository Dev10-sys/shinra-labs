import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";

function ProfilePage() {
    const user = getStoredUser();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [approvedTasks, setApprovedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            // Get user meta
            let { data: metaData, error: metaError } = await supabase
                .from("users_meta")
                .select("*")
                .eq("id", user.id)
                .single();

            // If user meta doesn't exist, create it
            if (metaError && metaError.code === 'PGRST116') {
                console.log('Creating users_meta for user:', user.id);
                const { data: newMeta, error: createError } = await supabase
                    .from("users_meta")
                    .insert({
                        id: user.id,
                        role: user.role,
                        name: user.name || 'User',
                        skills: null,
                        experience: null,
                        rating: 0,
                        completed_tasks: 0,
                    })
                    .select()
                    .single();

                if (createError) {
                    console.error('Error creating users_meta:', createError);
                } else {
                    metaData = newMeta;
                }
            } else if (metaError) {
                console.error(metaError);
            }

            if (metaData) {
                setProfile(metaData);
            }

            // If freelancer, get last 3 approved tasks
            if (user.role === "freelancer") {
                const { data: tasksData, error: tasksError } = await supabase
                    .from("tasks")
                    .select("*")
                    .eq("assigned_to", user.id)
                    .eq("status", "approved")
                    .order("created_at", { ascending: false })
                    .limit(3);

                if (tasksError) {
                    console.error(tasksError);
                } else {
                    setApprovedTasks(tasksData || []);
                }
            }

            setLoading(false);
        };

        fetchProfile();
    }, [user, navigate]);

    if (loading) {
        return <div className="text-center py-10">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="text-center py-10">Creating profile...</div>;
    }

    // Determine badge based on completed tasks
    let badge = "Bronze";
    const completed = profile.completed_tasks || 0;
    if (completed >= 15) badge = "Gold";
    else if (completed >= 5) badge = "Silver";

    return (
        <section className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-semibold mb-6">Profile</h1>

            {/* Profile Card */}
            <div className="bg-black/40 border border-gray-700 rounded p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">{profile.name}</h2>
                        <p className="text-sm text-gray-400 uppercase tracking-wide mb-4">
                            {profile.role}
                        </p>

                        {profile.role === "freelancer" && (
                            <>
                                <p className="text-sm text-gray-300 mb-1">
                                    <span className="font-medium">Skills:</span> {profile.skills || "—"}
                                </p>
                                <p className="text-sm text-gray-300 mb-1">
                                    <span className="font-medium">Experience:</span> {profile.experience || "—"}
                                </p>
                                <p className="text-sm text-gray-300 mb-1">
                                    <span className="font-medium">Rating:</span>{" "}
                                    {profile.rating ? profile.rating.toFixed(1) : "0.0"}
                                </p>
                                <p className="text-sm text-gray-300 mb-1">
                                    <span className="font-medium">Completed Tasks:</span> {completed}
                                </p>
                            </>
                        )}
                    </div>

                    {profile.role === "freelancer" && (
                        <div className="text-right">
                            <div
                                className={`px-4 py-2 rounded border ${badge === "Gold"
                                    ? "border-yellow-500 text-yellow-500"
                                    : badge === "Silver"
                                        ? "border-gray-400 text-gray-400"
                                        : "border-orange-700 text-orange-700"
                                    }`}
                            >
                                <p className="text-xs uppercase tracking-wide">Badge</p>
                                <p className="text-lg font-semibold">{badge}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Portfolio / Last Approved Tasks (Freelancer Only) */}
            {profile.role === "freelancer" && approvedTasks.length > 0 && (
                <div className="bg-black/40 border border-gray-700 rounded p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Approved Tasks</h3>
                    <div className="space-y-3">
                        {approvedTasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-3 bg-black/20 border border-gray-800 rounded"
                            >
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-gray-400">{task.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Approved • ₹ {task.price}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default ProfilePage;
