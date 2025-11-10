import React from 'react'
import { motion } from 'framer-motion'
import { 
  Inbox, 
  FileX, 
  Search, 
  Package, 
  AlertCircle,
  DatabaseZap,
  ListX,
  Sparkles
} from 'lucide-react'

const EmptyState = ({ 
  title = 'No data found',
  message = 'There is nothing to display here yet.',
  icon = 'inbox',
  action = null,
  actionLabel = 'Get Started',
  variant = 'default',
  className = '' 
}) => {
  const icons = {
    inbox: Inbox,
    file: FileX,
    search: Search,
    package: Package,
    alert: AlertCircle,
    database: DatabaseZap,
    list: ListX,
    sparkles: Sparkles,
  }

  const variants = {
    default: {
      iconBg: 'bg-gray-500/10',
      iconColor: 'text-gray-400',
      glow: 'text-gray-400',
    },
    primary: {
      iconBg: 'bg-primary-cyan/10',
      iconColor: 'text-primary-cyan',
      glow: 'text-primary-cyan',
    },
    success: {
      iconBg: 'bg-primary-green/10',
      iconColor: 'text-primary-green',
      glow: 'text-primary-green',
    },
    warning: {
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400',
      glow: 'text-yellow-400',
    },
  }

  const IconComponent = icons[icon] || icons.inbox
  const currentVariant = variants[variant] || variants.default

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 15,
          delay: 0.1 
        }}
        className="relative mb-6"
      >
        <div className={`${currentVariant.iconBg} rounded-full p-6 relative`}>
          <IconComponent className={currentVariant.iconColor} size={48} />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`absolute inset-0 rounded-full ${currentVariant.iconBg} blur-xl`}
          />
        </div>
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          className={`absolute -inset-4 rounded-full bg-gradient-to-r from-transparent via-${currentVariant.glow}/20 to-transparent blur-2xl`}
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-white mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-gray-400 max-w-md mb-6"
      >
        {message}
      </motion.p>

      {action && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action}
          className="btn-primary px-6 py-3 flex items-center space-x-2"
        >
          <Sparkles size={18} />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  )
}

export default EmptyState
