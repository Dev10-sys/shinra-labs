import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCircle,
  DollarSign,
  AlertCircle,
  Info,
  X,
  Check,
  ExternalLink,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const NotificationPanel = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('all')

  const mockNotifications = [
    {
      id: 1,
      type: 'task',
      title: 'New Task Available',
      description: 'Product Image Labeling - ₹5,000',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      action: 'View Task',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      description: 'Payout of ₹12,500 has been processed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      action: 'View Wallet',
    },
    {
      id: 3,
      type: 'task',
      title: 'Task Completed',
      description: 'Text Classification task marked as complete',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update',
      description: 'Platform will be under maintenance tonight',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      action: 'Learn More',
    },
    {
      id: 5,
      type: 'task',
      title: 'Task Approved',
      description: 'Your submission has been approved',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 6,
      type: 'payment',
      title: 'Bonus Earned',
      description: 'Quality bonus of ₹500 added',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 7,
      type: 'task',
      title: 'Task Deadline Approaching',
      description: 'Audio Transcription due in 2 hours',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      action: 'Continue Task',
    },
    {
      id: 8,
      type: 'system',
      title: 'New Features Available',
      description: 'Check out our new annotation tools',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      action: 'Explore',
    },
    {
      id: 9,
      type: 'payment',
      title: 'Payment Processing',
      description: 'Your payout request is being processed',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 10,
      type: 'task',
      title: 'Quality Check Passed',
      description: 'Your work met quality standards',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 11,
      type: 'system',
      title: 'Account Verification',
      description: 'Please verify your email address',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      read: true,
      action: 'Verify Now',
    },
    {
      id: 12,
      type: 'task',
      title: 'Task Recommended',
      description: 'Based on your skills: Video Annotation',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      read: true,
      action: 'View Task',
    },
    {
      id: 13,
      type: 'payment',
      title: 'Withdrawal Successful',
      description: 'Amount transferred to your bank account',
      timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 14,
      type: 'task',
      title: 'Task Rejected',
      description: 'Please review and resubmit',
      timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      read: true,
      action: 'View Feedback',
    },
    {
      id: 15,
      type: 'system',
      title: 'Profile Updated',
      description: 'Your profile changes have been saved',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 16,
      type: 'payment',
      title: 'Earnings Milestone',
      description: 'Congratulations! You earned ₹1,00,000',
      timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 17,
      type: 'task',
      title: 'New Task Category',
      description: 'Medical Image tasks now available',
      timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      read: true,
      action: 'Browse Tasks',
    },
    {
      id: 18,
      type: 'system',
      title: 'Security Alert',
      description: 'Login from a new device detected',
      timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      read: true,
      action: 'Review Activity',
    },
    {
      id: 19,
      type: 'payment',
      title: 'Referral Bonus',
      description: 'Earned ₹1,000 from referral',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 20,
      type: 'task',
      title: 'Task Started',
      description: 'You started working on Image Segmentation',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ]

  const categories = [
    { id: 'all', label: 'All Notifications', count: mockNotifications.length },
    { id: 'task', label: 'Tasks', count: mockNotifications.filter((n) => n.type === 'task').length },
    { id: 'payment', label: 'Payments', count: mockNotifications.filter((n) => n.type === 'payment').length },
    { id: 'system', label: 'System', count: mockNotifications.filter((n) => n.type === 'system').length },
  ]

  const filteredNotifications =
    activeCategory === 'all'
      ? mockNotifications
      : mockNotifications.filter((n) => n.type === activeCategory)

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task':
        return CheckCircle
      case 'payment':
        return DollarSign
      case 'system':
        return Info
      default:
        return Bell
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'task':
        return 'text-cyan-400 bg-cyan-500/20'
      case 'payment':
        return 'text-green-400 bg-green-500/20'
      case 'system':
        return 'text-orange-400 bg-orange-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  const markAllAsRead = () => {
    console.log('Marking all as read...')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-bg-secondary border-l border-border-light z-50 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-border-light">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Notifications</h2>
                  <p className="text-sm text-text-tertiary">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-tertiary transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex space-x-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      activeCategory === category.id
                        ? 'bg-accent-primary text-white'
                        : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/80'
                    }`}
                  >
                    {category.label}
                    {category.count > 0 && (
                      <span className="ml-2 text-xs">({category.count})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {unreadCount > 0 && (
              <div className="px-6 py-3 bg-bg-tertiary/50 border-b border-border-light">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-accent-primary hover:text-accent-secondary transition-colors flex items-center space-x-2"
                >
                  <Check size={16} />
                  <span>Mark all as read</span>
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Bell size={48} className="text-text-tertiary mb-4" />
                  <p className="text-text-secondary">No notifications</p>
                  <p className="text-sm text-text-tertiary">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-border-color">
                  {filteredNotifications.map((notification) => {
                    const NotificationIcon = getNotificationIcon(notification.type)
                    const iconColor = getNotificationColor(notification.type)

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 hover:bg-bg-tertiary/50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-accent-primary/5' : ''
                        }`}
                      >
                        <div className="flex space-x-3">
                          <div className={`p-2 rounded-lg ${iconColor} flex-shrink-0 h-fit`}>
                            <NotificationIcon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-text-primary">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-accent-primary rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-sm text-text-secondary mb-2">{notification.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-text-tertiary">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                              </span>
                              {notification.action && (
                                <button className="text-xs text-accent-primary hover:text-accent-secondary flex items-center space-x-1 transition-colors">
                                  <span>{notification.action}</span>
                                  <ExternalLink size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationPanel
