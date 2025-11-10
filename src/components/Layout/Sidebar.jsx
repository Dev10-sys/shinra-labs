import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  List,
  CheckSquare,
  Wallet,
  Trophy,
  User,
  LogOut,
  X,
  Plus,
  Folder,
  Database,
  BarChart,
  Shield,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from 'react-i18next'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userProfile, signOut } = useAuth()
  const { t, i18n } = useTranslation()

  const isActive = (path) => location.pathname === path

  const freelancerLinks = [
    { path: '/freelancer', icon: Home, label: 'Dashboard' },
    { path: '/freelancer/browse-tasks', icon: List, label: 'Browse Tasks' },
    { path: '/freelancer/my-tasks', icon: CheckSquare, label: 'My Tasks' },
    { path: '/freelancer/earnings', icon: Wallet, label: 'Earnings' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  const companyLinks = [
    { path: '/company', icon: Home, label: 'Dashboard' },
    { path: '/company/create-task', icon: Plus, label: 'Create Task' },
    { path: '/company/projects', icon: Folder, label: 'My Projects' },
    { path: '/marketplace', icon: Database, label: 'Dataset Marketplace' },
    { path: '/company/analytics', icon: BarChart, label: 'Analytics' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  const adminLinks = [
    { path: '/admin', icon: Shield, label: 'Admin Dashboard' },
    { path: '/marketplace', icon: Database, label: 'Dataset Marketplace' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  const links = 
    userProfile?.role === 'admin' ? adminLinks :
    userProfile?.role === 'freelancer' ? freelancerLinks : 
    companyLinks

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
        }}
        className="fixed left-0 top-0 h-full w-60 glass z-50 lg:relative lg:z-auto lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-cyan to-primary-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gradient">SHINRA</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
            {links.map((link) => {
              const Icon = link.icon
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-primary-cyan/20 text-primary-cyan'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            >
              {i18n.language === 'en' ? 'हिंदी' : 'English'}
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut size={20} />
              <span>{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar

