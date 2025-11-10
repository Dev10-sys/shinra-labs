import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react'

const ErrorMessage = ({ 
  title = 'Something went wrong',
  message = 'An error occurred while loading the data. Please try again.',
  error = null,
  onRetry = null,
  onDismiss = null,
  variant = 'default',
  showIcon = true,
  className = '' 
}) => {
  const variants = {
    default: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: AlertCircle,
    },
    danger: {
      bg: 'bg-red-600/10',
      border: 'border-red-600/30',
      text: 'text-red-500',
      icon: XCircle,
    },
  }

  const currentVariant = variants[variant] || variants.default
  const IconComponent = currentVariant.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, type: 'spring' }}
      className={`relative glass ${currentVariant.bg} border ${currentVariant.border} rounded-xl p-6 ${className}`}
    >
      <div className="flex items-start space-x-4">
        {showIcon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <IconComponent className={`${currentVariant.text} flex-shrink-0`} size={24} />
          </motion.div>
        )}
        <div className="flex-1 min-w-0">
          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className={`text-lg font-semibold ${currentVariant.text} mb-1`}
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-sm"
          >
            {message}
          </motion.p>
          {error && (
            <motion.details
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-3"
            >
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400 transition-colors">
                Technical details
              </summary>
              <pre className="mt-2 text-xs text-gray-500 bg-dark-bg/50 p-3 rounded-lg overflow-auto">
                {error.toString()}
              </pre>
            </motion.details>
          )}
        </div>
        {onDismiss && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDismiss}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <XCircle size={20} />
          </motion.button>
        )}
      </div>
      {onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="btn-primary flex items-center space-x-2 px-4 py-2"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ErrorMessage
