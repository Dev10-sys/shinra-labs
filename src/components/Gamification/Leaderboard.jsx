import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Leaderboard = ({ data }) => {
  const { userProfile } = useAuth()

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="text-yellow-400" size={24} />
    if (rank === 2) return <Medal className="text-gray-300" size={24} />
    if (rank === 3) return <Award className="text-orange-400" size={24} />
    return <span className="text-gray-400 font-bold">#{rank}</span>
  }

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No leaderboard data available</div>
      ) : (
        data.map((entry, index) => {
          const isCurrentUser = entry.id === userProfile?.id
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card flex items-center justify-between ${
                isCurrentUser ? 'border-2 border-primary-cyan' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{entry.name}</h3>
                    {isCurrentUser && (
                      <span className="text-xs bg-primary-cyan/20 text-primary-cyan px-2 py-1 rounded">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{entry.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Earnings</p>
                  <p className="font-bold text-primary-cyan">₹{entry.total_earnings?.toLocaleString() || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Tasks</p>
                  <p className="font-bold">{entry.tasks_completed || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Rating</p>
                  <p className="font-bold flex items-center space-x-1">
                    <span>{entry.rating?.toFixed(1) || '0.0'}</span>
                    <TrendingUp size={16} className="text-primary-green" />
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })
      )}
    </div>
  )
}

export default Leaderboard

