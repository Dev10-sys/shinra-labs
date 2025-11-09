import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FreelancerDashboard from './pages/FreelancerDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import DatasetMarketplace from './pages/DatasetMarketplace'
import DatasetDetail from './pages/DatasetDetail'
import AnnotationSuite from './pages/AnnotationSuite'
import ProfilePage from './pages/ProfilePage'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { userProfile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-cyan"></div>
      </div>
    )
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userProfile.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

function AppRoutes() {
  const { userProfile } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={userProfile ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/signup" element={userProfile ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {userProfile?.role === 'freelancer' ? (
              <FreelancerDashboard />
            ) : userProfile?.role === 'company' ? (
              <CompanyDashboard />
            ) : (
              <Navigate to="/" replace />
            )}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/freelancer"
        element={
          <ProtectedRoute requiredRole="freelancer">
            <FreelancerDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/company"
        element={
          <ProtectedRoute requiredRole="company">
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route path="/marketplace" element={<DatasetMarketplace />} />
      <Route path="/marketplace/:id" element={<DatasetDetail />} />
      
      <Route
        path="/annotate/:taskId"
        element={
          <ProtectedRoute requiredRole="freelancer">
            <AnnotationSuite />
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
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-dark-bg">
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1A1F2E',
                  color: '#FFFFFF',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#FF006E',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

