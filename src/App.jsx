import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import DatasetMarketplace from "./pages/DatasetMarketplace";
import TaskReviewPage from "./pages/TaskReviewPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

import PostTaskPage from "./pages/PostTaskPage";
import SubmitWorkPage from "./pages/SubmitWorkPage";

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

          {/* COMPANY ONLY */}
          <Route
            path="/post-task"
            element={
              <ProtectedRoute role="company">
                <PostTaskPage />
              </ProtectedRoute>
            }
          />

          {/* COMPANY - REVIEW TASK */}
          <Route
            path="/review-task/:taskId"
            element={
              <ProtectedRoute role="company">
                <TaskReviewPage />
              </ProtectedRoute>
            }
          />

          {/* FREELANCER - SUBMIT WORK */}
          <Route
            path="/submit-work/:taskId"
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

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN (OPTIONAL) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
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
