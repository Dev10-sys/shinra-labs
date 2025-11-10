import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, User, Menu, X, Settings, Wallet, LogOut, Image, Type, Headphones, Video, Users, FileText } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import NotificationPanel from '../Notifications/NotificationPanel'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userProfile, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  const notificationCount = 3

  const mockSearchResults = {
    tasks: [
      { id: 1, title: 'Product Image Labeling', category: 'Image', reward: 5000 },
      { id: 2, title: 'Text Classification Project', category: 'Text', reward: 4500 },
      { id: 3, title: 'Audio Transcription Task', category: 'Audio', reward: 7000 },
    ],
    datasets: [
      { id: 1, name: 'E-commerce Product Images', price: 25000, items: 5000 },
      { id: 2, name: 'Customer Reviews Dataset', price: 15000, items: 10000 },
    ],
    users: [
      { id: 1, name: 'John Doe', role: 'Freelancer' },
      { id: 2, name: 'Jane Smith', role: 'Company' },
    ],
  }

  const recentSearches = ['Image annotation', 'Text classification', 'Audio tasks']

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', id: 'nav-dashboard' },
    { name: 'Tasks', path: '/marketplace', id: 'nav-tasks' },
    { name: 'Datasets', path: '/marketplace', id: 'nav-datasets' },
    { name: 'Leaderboard', path: '/leaderboard', id: 'nav-leaderboard' },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut()
    setProfileDropdownOpen(false)
    navigate('/')
  }

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-border-light"
      >
        <div className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-text-primary font-bold text-lg group-hover:text-gradient transition-all">
              SHINRA Labs
            </span>
          </Link>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                className="relative text-text-secondary hover:text-text-primary transition-colors py-2"
              >
                {link.name}
                {isActiveLink(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg hover:bg-bg-tertiary transition-colors"
              aria-label="Search"
            >
              <Search size={20} className="text-text-secondary" />
            </button>

            {/* Notifications Bell */}
            {userProfile && (
              <button
                onClick={() => setNotificationPanelOpen(true)}
                className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-tertiary transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-text-secondary" />
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-accent-error text-white text-xs font-semibold rounded-full flex items-center justify-center"
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </button>
            )}

            {/* Profile Dropdown */}
            {userProfile ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary hover:shadow-glow transition-all"
                  aria-label="Profile menu"
                >
                  <User size={20} className="text-white" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 card-glass border border-border-light rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="p-4 border-b border-border-color">
                        <p className="text-text-primary font-semibold">{userProfile.full_name || 'User'}</p>
                        <p className="text-text-tertiary text-sm">{userProfile.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            navigate('/profile')
                            setProfileDropdownOpen(false)
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-bg-tertiary transition-colors text-left"
                        >
                          <Settings size={18} className="text-text-secondary" />
                          <span className="text-text-primary">Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false)
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-bg-tertiary transition-colors text-left"
                        >
                          <Wallet size={18} className="text-text-secondary" />
                          <span className="text-text-primary">Wallet</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-bg-tertiary transition-colors text-left text-accent-error"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block btn-primary text-sm px-4 py-2">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-tertiary transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-bg-secondary border-l border-border-light z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-text-primary font-bold text-lg">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-tertiary transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* User Profile Section */}
                {userProfile && (
                  <div className="mb-6 p-4 card rounded-xl">
                    <p className="text-text-primary font-semibold">{userProfile.full_name || 'User'}</p>
                    <p className="text-text-tertiary text-sm">{userProfile.email}</p>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-2 mb-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.id}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg transition-colors ${
                        isActiveLink(link.path)
                          ? 'bg-accent-primary/10 text-accent-primary'
                          : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Actions */}
                {userProfile ? (
                  <div className="space-y-2 border-t border-border-color pt-4">
                    <button
                      onClick={() => {
                        navigate('/profile')
                        setMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-bg-tertiary transition-colors text-left"
                    >
                      <Settings size={18} className="text-text-secondary" />
                      <span className="text-text-primary">Settings</span>
                    </button>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-bg-tertiary transition-colors text-left"
                    >
                      <Wallet size={18} className="text-text-secondary" />
                      <span className="text-text-primary">Wallet</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-bg-tertiary transition-colors text-left text-accent-error"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block btn-outline text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block btn-primary text-center"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Search Modal */}
      <AnimatePresence>
        {searchModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-3xl z-50 px-4"
            >
              <div className="card-glass rounded-2xl border border-border-light overflow-hidden">
                <div className="p-6 border-b border-border-light">
                  <div className="flex items-center space-x-3">
                    <Search className="text-text-secondary" size={24} />
                    <input
                      type="text"
                      placeholder="Search tasks, datasets, users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-text-primary placeholder-text-tertiary outline-none text-lg"
                      autoFocus
                    />
                    <button
                      onClick={() => setSearchModalOpen(false)}
                      className="text-text-tertiary hover:text-text-primary"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {searchQuery.length === 0 ? (
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-text-tertiary mb-3">Recent Searches</h3>
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(search)}
                            className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-bg-tertiary transition-colors text-left"
                          >
                            <Search size={16} className="text-text-tertiary" />
                            <span className="text-text-secondary">{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 space-y-6">
                      {mockSearchResults.tasks.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-text-tertiary mb-3">Tasks</h3>
                          <div className="space-y-2">
                            {mockSearchResults.tasks.map((task) => {
                              const categoryIcon =
                                task.category === 'Image' ? Image :
                                task.category === 'Text' ? Type :
                                task.category === 'Audio' ? Headphones : Video
                              const CategoryIcon = categoryIcon
                              return (
                                <button
                                  key={task.id}
                                  onClick={() => setSearchModalOpen(false)}
                                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-bg-secondary hover:bg-bg-tertiary transition-colors text-left"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-accent-primary/20 rounded-lg">
                                      <CategoryIcon size={18} className="text-accent-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-text-primary">{task.title}</p>
                                      <p className="text-sm text-text-tertiary">{task.category}</p>
                                    </div>
                                  </div>
                                  <span className="text-sm font-semibold text-accent-success">
                                    ₹{task.reward.toLocaleString()}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {mockSearchResults.datasets.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-text-tertiary mb-3">Datasets</h3>
                          <div className="space-y-2">
                            {mockSearchResults.datasets.map((dataset) => (
                              <button
                                key={dataset.id}
                                onClick={() => setSearchModalOpen(false)}
                                className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-bg-secondary hover:bg-bg-tertiary transition-colors text-left"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <FileText size={18} className="text-purple-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-text-primary">{dataset.name}</p>
                                    <p className="text-sm text-text-tertiary">{dataset.items} items</p>
                                  </div>
                                </div>
                                <span className="text-sm font-semibold text-accent-warning">
                                  ₹{dataset.price.toLocaleString()}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {mockSearchResults.users.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-text-tertiary mb-3">Users</h3>
                          <div className="space-y-2">
                            {mockSearchResults.users.map((user) => (
                              <button
                                key={user.id}
                                onClick={() => setSearchModalOpen(false)}
                                className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-bg-secondary hover:bg-bg-tertiary transition-colors text-left"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">{user.name.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-text-primary">{user.name}</p>
                                    <p className="text-sm text-text-tertiary">{user.role}</p>
                                  </div>
                                </div>
                                <Users size={18} className="text-text-tertiary" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />
    </>
  )
}

export default Header
