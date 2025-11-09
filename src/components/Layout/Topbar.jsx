import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Search, Menu, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import Sidebar from './Sidebar'

const Topbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { userProfile } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <header className="fixed top-0 left-0 right-0 lg:left-64 glass border-b border-white/10 z-30">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          {/* Left: Menu button (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-300 hover:text-white"
          >
            <Menu size={24} />
          </button>

          {/* Center: Search */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks, datasets..."
                className="w-full pl-10 pr-4 py-2 bg-dark-card/50 border border-white/10 rounded-lg text-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-error rounded-full"></span>
              </button>

              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-80 glass rounded-lg shadow-xl p-4"
                >
                  <h3 className="font-semibold mb-3">Notifications</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-sm">New task available: Label Hindi Tweets</p>
                      <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* User Profile */}
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-cyan to-primary-blue rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium">
                {userProfile?.name || 'User'}
              </span>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}

export default Topbar

