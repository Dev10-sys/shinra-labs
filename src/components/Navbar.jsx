import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getStoredUser, logoutUser } from "../authUtils";

/* Navigation items */
const publicNav = [{ to: "/", label: "Overview" }];

const companyNav = [
  { to: "/company", label: "Dashboard" },
  { to: "/post-task", label: "Post Task" },
  { to: "/datasets", label: "Datasets" },
];

const freelancerNav = [
  { to: "/freelancer", label: "Dashboard" },
  { to: "/submit-work", label: "Submit Work" },
  { to: "/datasets", label: "Datasets" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();

  /* Pick items based on role */
  let navItems = publicNav;
  if (user?.role === "company") navItems = [...publicNav, ...companyNav];
  if (user?.role === "freelancer") navItems = [...publicNav, ...freelancerNav];

  /* Pretty page name */
  const formatView = (path) => {
    if (path === "/") return "Overview";
    return (
      path
        .replace("/", "")
        .split("-")
        .join(" ")
        .replace(/\b\w/g, (c) => c.toUpperCase()) + " View"
    );
  };

  const currentView = formatView(location.pathname);

  /* Logout */
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded border border-white/10 flex items-center justify-center text-xs font-semibold tracking-[0.2em]">
            SL
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-medium tracking-[0.19em] uppercase">
              Shinra Labs
            </span>
            <span className="text-[10px] text-gray-400">
              Decentralized AI Workforce
            </span>
          </div>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium uppercase tracking-[0.18em]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "transition-colors",
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-black hover:transition-colors",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[10px] text-gray-400 uppercase tracking-[0.18em]">
            {currentView}
          </span>

          {!user ? (
            <Link
              to="/login"
              className="text-[11px] font-semibold uppercase tracking-[0.2em] border px-3 py-1.5 rounded-full border-white/40 hover:bg-white hover:text-black transition-colors"
            >
              Log in
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] border px-3 py-1.5 rounded-full border-white/40 hover:bg-white hover:text-black transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
