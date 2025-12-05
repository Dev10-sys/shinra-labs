import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import DatasetMarketplace from "./pages/DatasetMarketplace";

import PostTaskPage from "./pages/PostTaskPage";
import SubmitWorkPage from "./pages/SubmitWorkPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";

import Navbar from "./components/Navbar";
import { getStoredUser } from "./authUtils";

/* ------------------ PROTECTED ROUTE SYSTEM ------------------ */
function ProtectedRoute({ children, role }) {
  const user = getStoredUser();

  // Not logged in → redirect
  if (!user) return <Navigate to="/login" replace />;

  // Role mismatch → redirect
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
}

/* --------------------------- APP ----------------------------- */
function App() {
  return (
    <div className="min-h-screen bg-black/50 text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pb-10 pt-4">
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* FREELANCER DASH */}
          <Route
            path="/freelancer"
            element={
              <ProtectedRoute role="freelancer">
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />

          {/* COMPANY DASH */}
          <Route
            path="/company"
            element={
              <ProtectedRoute role="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />

          {/* UNIVERSAL TASK DETAILS (both roles can open) */}
          <Route
            path="/task/:id"
            element={
              <ProtectedRoute>
                <TaskDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* COMPANY ONLY */}
          <Route
            path="/post-task"
            element={
              <ProtectedRoute role="company">
                <PostTaskPage />
              </ProtectedRoute>
            }
          />

          {/* FREELANCER ONLY */}
          <Route
            path="/submit-work"
            element={
              <ProtectedRoute role="freelancer">
                <SubmitWorkPage />
              </ProtectedRoute>
            }
          />

          {/* LOGGED-IN BOTH */}
          <Route
            path="/datasets"
            element={
              <ProtectedRoute>
                <DatasetMarketplace />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;
