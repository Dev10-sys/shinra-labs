import React, { useEffect } from "react";
import NotificationList from "../components/NotificationList";
import { getStoredUser } from "../authUtils";
import { useNavigate } from "react-router-dom";

function NotificationsPage() {
    const user = getStoredUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    return (
        <section className="max-w-3xl mx-auto py-10 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Stay updated with your task status and payments.
                </p>
            </div>
            <NotificationList />
        </section>
    );
}

export default NotificationsPage;
