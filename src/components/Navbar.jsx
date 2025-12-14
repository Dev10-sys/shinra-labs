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
    { to: "/create-project", label: "New Project" },
    { to: "/datasets", label: "Datasets" },
  ];

  const freelancerNav = [
    { to: "/freelancer", label: "Workspace" },
    { to: "/datasets", label: "Marketplace" },
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
    <nav className="h-20 flex items-center justify-between px-8 bg-black border-b border-white/10 relative z-50">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="h-8 w-8 flex items-center justify-center group-hover:scale-105 transition-transform">
          <img src="/logo.png" alt="SL" className="w-full h-full object-contain filter brightness-0 invert" />
        </div>
        <span className="text-sm font-bold tracking-tight text-white group-hover:text-gray-300 transition-colors uppercase">
          SHINRA
        </span>
      </Link>

      {/* CENTER NAV ITEMS */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "text-xs font-bold uppercase tracking-widest transition-colors",
                isActive
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="flex items-center gap-4">
              {/* NOTIFICATIONS */}
              <Link to="/notifications" className="relative group">
                <span className="text-gray-500 hover:text-white transition">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Link>

              <div className="w-px h-4 bg-white/20"></div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wide hidden md:block">
                  {user.role === "company" ? "Enterprise" : "Labeler"}
                </span>
                <div className="w-8 h-8 rounded bg-white/10 border border-white/10 flex items-center justify-center text-xs text-white font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
