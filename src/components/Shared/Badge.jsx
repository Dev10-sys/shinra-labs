import React from 'react'
import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-500/20 text-gray-300',
    success: 'bg-primary-green/20 text-primary-green',
    warning: 'bg-yellow-500/20 text-yellow-500',
    danger: 'bg-red-500/20 text-red-500',
    info: 'bg-primary-cyan/20 text-primary-cyan',
    purple: 'bg-purple-500/20 text-purple-400',
    easy: 'bg-emerald-500/20 text-emerald-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    hard: 'bg-red-500/20 text-red-400',
    image: 'bg-blue-500/20 text-blue-400',
    text: 'bg-purple-500/20 text-purple-400',
    audio: 'bg-pink-500/20 text-pink-400',
    video: 'bg-orange-500/20 text-orange-400',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.span>
  )
}

export default Badge
