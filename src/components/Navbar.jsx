import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getStoredUser, logoutUser } from "../authUtils";
import { supabase } from "../supabaseClient";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications count
  useEffect(() => {
    if (user) {
      const fetchUnread = async () => {
        const { data } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", user.id)
          .eq("is_read", false);

        setUnreadCount(data ? data.length : 0);
      };

      fetchUnread();

      // Poll every 30 seconds
      const interval = setInterval(fetchUnread, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  /* Navigation items based on role */
  const companyNav = [
    { to: "/company", label: "Dashboard" },
    { to: "/post-task", label: "Post Task" },
    { to: "/datasets", label: "Datasets" },
  ];

  const freelancerNav = [
    { to: "/freelancer", label: "Dashboard" },
    { to: "/datasets", label: "Datasets" },
  ];

  let navItems = [];
  if (user?.role === "company") navItems = companyNav;
  if (user?.role === "freelancer") navItems = freelancerNav;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Don't show navbar on login page
  if (location.pathname === "/login") return null;

  return (
    <header className="border-b border-gray-700 bg-black/40 backdrop-blur sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded border border-white/20 flex items-center justify-center text-xs font-bold tracking-wider">
            SL
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-widest uppercase">
              SHINRA Labs
            </span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">
              {user?.role === "company" ? "Company Dashboard" : user?.role === "freelancer" ? "Freelancer Dashboard" : "AI Data Platform"}
            </span>
          </div>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium uppercase tracking-wide">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "transition-colors",
                  isActive
                    ? "text-white font-semibold"
                    : "text-gray-400 hover:text-gray-200",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              {/* Notifications */}
              <Link
                to="/notifications"
                className="relative px-3 py-1.5 border border-white/20 rounded hover:bg-white/5 transition"
                title="Notifications"
              >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <span className="text-gray-400 mr-2 text-xs uppercase tracking-wide">
                {user.role}
              </span>
            </>
          )}

          {/* Login/Logout */}
          {!user ? (
            <Link
              to="/login"
              className="text-xs font-semibold uppercase tracking-wide border px-4 py-1.5 rounded border-white/40 hover:bg-white hover:text-black transition-colors"
            >
              Log in
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-xs font-semibold uppercase tracking-wide border px-4 py-1.5 rounded border-white/40 hover:bg-white hover:text-black transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
