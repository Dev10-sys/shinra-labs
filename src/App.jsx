import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import FreelancerDashboard from './pages/FreelancerDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import DatasetMarketplace from './pages/DatasetMarketplace'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-shinra-bg text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pb-10 pt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/freelancer" element={<FreelancerDashboard />} />
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/datasets" element={<DatasetMarketplace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
