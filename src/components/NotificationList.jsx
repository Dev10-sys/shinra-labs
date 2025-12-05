import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";
import { useNavigate } from "react-router-dom";

function NotificationList() {
    const [notifications, setNotifications] = useState([]);
    const user = getStoredUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        const fetch = async () => {
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            if (error) console.error(error);
            else setNotifications(data || []);
        };
        fetch();
    }, [user, navigate]);

    const markAllRead = async () => {
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", user.id);
        if (!error) setNotifications((n) => n.map((i) => ({ ...i, is_read: true })));
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                <h2 className="text-lg font-bold text-white tracking-tight">Recent Alerts</h2>
                {notifications.length > 0 && (
                    <button
                        onClick={markAllRead}
                        className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-wide font-semibold transition"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-12 bg-black/20 border border-gray-800 rounded-lg">
                    <svg className="w-10 h-10 mx-auto text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <p className="text-gray-500 text-sm">No new notifications.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`p-4 border rounded-lg transition flex items-start gap-4 ${n.is_read
                                    ? "bg-black/20 border-gray-800 text-gray-400"
                                    : "bg-gray-900/50 border-blue-500/30 text-white shadow-lg shadow-blue-500/5"
                                }`}
                        >
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.is_read ? "bg-gray-700" : "bg-blue-500 animate-pulse"}`}></div>
                            <div className="flex-1">
                                <p className="text-sm leading-relaxed">{n.message}</p>
                                <p className="text-[10px] text-gray-500 mt-2 font-mono uppercase tracking-wide">
                                    {new Date(n.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotificationList;
