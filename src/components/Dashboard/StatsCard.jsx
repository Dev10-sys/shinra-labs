import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const StatsCard = ({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  color = 'cyan',
  subtitle,
  delay = 0,
  invertTrend = false
}) => {
  const colorConfig = {
    cyan: {
      gradient: 'from-cyan-500/20 via-cyan-600/10 to-transparent',
      iconBg: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/20',
      border: 'border-cyan-500/30'
    },
    purple: {
      gradient: 'from-purple-500/20 via-purple-600/10 to-transparent',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/20',
      border: 'border-purple-500/30'
    },
    green: {
      gradient: 'from-emerald-500/20 via-emerald-600/10 to-transparent',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      border: 'border-emerald-500/30'
    },
    blue: {
      gradient: 'from-blue-500/20 via-blue-600/10 to-transparent',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/20',
      border: 'border-blue-500/30'
    },
    orange: {
      gradient: 'from-orange-500/20 via-orange-600/10 to-transparent',
      iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      text: 'text-orange-400',
      glow: 'shadow-orange-500/20',
      border: 'border-orange-500/30'
    },
    red: {
      gradient: 'from-red-500/20 via-red-600/10 to-transparent',
      iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
      text: 'text-red-400',
      glow: 'shadow-red-500/20',
      border: 'border-red-500/30'
    }
  }

  const config = colorConfig[color] || colorConfig.cyan
  const isPositiveTrend = invertTrend ? trend?.value <= 0 : trend?.value >= 0
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown
  
  const getTrendValue = () => {
    if (!trend) return ''
    const absValue = Math.abs(trend.value)
    if (absValue === 0) return '0'
    const sign = isPositiveTrend ? '+' : '-'
    return `${sign}${absValue}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.gradient} backdrop-blur-xl border ${config.border} p-6 shadow-xl ${config.glow} hover:shadow-2xl transition-all duration-300`}
    >
      <div className="absolute inset-0 bg-dark-card/80 backdrop-blur-xl"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
          
          {subtitle && (
            <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
          )}
          
          {trend && (
            <div className="flex items-center space-x-2 mt-3">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                isPositiveTrend 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                <TrendIcon size={14} />
                <span className="text-xs font-semibold">
                  {getTrendValue()}{trend.unit ?? ''}
                </span>
              </div>
              {trend.label && (
                <span className="text-xs text-gray-500">{trend.label}</span>
              )}
            </div>
          )}
        </div>

        <motion.div 
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`p-4 rounded-2xl ${config.iconBg} shadow-lg`}
        >
          <Icon size={28} className="text-white" />
        </motion.div>
      </div>

      <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br ${config.gradient} blur-3xl opacity-30`}></div>
    </motion.div>
  )
}

export default StatsCard
