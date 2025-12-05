import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import DatasetMarketplace from "./pages/DatasetMarketplace";
import TaskReviewPage from "./pages/TaskReviewPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

import CreateProjectPage from "./pages/CreateProjectPage";
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
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pb-12 pt-8">
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

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
            path="/create-project"
            element={
              <ProtectedRoute role="company">
                <CreateProjectPage />
              </ProtectedRoute>
            }
          />

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
