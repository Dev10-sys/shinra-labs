import React from 'react'
import { motion } from 'framer-motion'

const ProgressBar = ({ 
  progress = 0, 
  showLabel = true,
  color = 'cyan',
  height = 'md',
  className = '' 
}) => {
  const colors = {
    cyan: 'from-primary-cyan to-primary-blue',
    green: 'from-emerald-500 to-green-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-yellow-500',
    red: 'from-red-500 to-pink-500',
  }

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const percentage = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Progress</span>
          <span className="text-sm font-bold text-primary-cyan">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-dark-bg rounded-full ${heights[height]} overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full relative`}
        >
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default ProgressBar
