import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Flame,
  Star,
  Crown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import Topbar from '../components/Layout/Topbar'
import Badge from '../components/Shared/Badge'
import LoadingSpinner from '../components/Shared/LoadingSpinner'
import ErrorMessage from '../components/Shared/ErrorMessage'
import { useLeaderboard } from '../hooks/useSupabaseData'

const LeaderboardPage = () => {
  const [timePeriod, setTimePeriod] = useState('alltime')
  const [category, setCategory] = useState('overall')

  const { leaderboard, loading, error } = useLeaderboard(100)

  const badges = {
    topPerformer: { icon: Trophy, label: 'Top Performer', color: 'text-yellow-400' },
    speedDemon: { icon: Zap, label: 'Speed Demon', color: 'text-cyan-400' },
    accuracyMaster: { icon: Target, label: 'Accuracy Master', color: 'text-purple-400' },
    diamondTier: { icon: Award, label: 'Diamond Tier', color: 'text-blue-400' },
    hotStreak: { icon: Flame, label: 'Hot Streak', color: 'text-orange-400' },
    risingStar: { icon: Star, label: 'Rising Star', color: 'text-pink-400' },
  }

  const assignBadges = (user, rank) => {
    const userBadges = []
    if (rank <= 10) userBadges.push('topPerformer')
    if (rank <= 5) userBadges.push('speedDemon')
    if (user.xp >= 5000) userBadges.push('accuracyMaster')
    if (rank <= 20) userBadges.push('diamondTier')
    if (user.tasks_completed >= 50) userBadges.push('hotStreak')
    if (rank > 90) userBadges.push('risingStar')
    return userBadges
  }

  const topThree = leaderboard?.slice(0, 3) || []
  const restOfLeaderboard = leaderboard?.slice(3, 20) || []

  const getMedalColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'
    if (rank === 2) return 'from-gray-400 to-gray-600'
    if (rank === 3) return 'from-orange-400 to-orange-600'
    return 'from-gray-600 to-gray-800'
  }

  const getMedalIcon = (rank) => {
    if (rank === 1) return Crown
    if (rank === 2) return Medal
    if (rank === 3) return Medal
    return Trophy
  }

  return (
    <div className="min-h-screen lg:pl-64 pt-16">
      <Topbar />

      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-gray-400">Compete with the best annotators worldwide</p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {['week', 'month', 'alltime'].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  timePeriod === period
                    ? 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {['overall', 'image', 'text', 'audio', 'video'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner className="py-12" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Trophy size={48} className="mx-auto mb-4 opacity-50" />
            <p>No leaderboard data available yet</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
            >
              {[topThree[1], topThree[0], topThree[2]].map((user, index) => {
                if (!user) return null
                const actualRank = user.rank
                const MedalIcon = getMedalIcon(actualRank)
                const scale = actualRank === 1 ? 1.1 : 1
                const order = actualRank === 1 ? 'order-2' : actualRank === 2 ? 'order-1' : 'order-3'
                const userBadges = assignBadges(user, actualRank)

                return (
                  <motion.div
                    key={user.user_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass rounded-2xl p-6 border-2 ${
                      actualRank === 1 ? 'border-yellow-400/50' : 'border-white/10'
                    } relative ${order} ${actualRank === 1 ? 'lg:scale-110' : ''}`}
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${getMedalColor(
                          actualRank
                        )} flex items-center justify-center shadow-lg`}
                      >
                        <MedalIcon size={24} className="text-white" />
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-cyan to-primary-blue flex items-center justify-center text-2xl font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{user.name || 'Anonymous'}</h3>
                      <p className="text-sm text-gray-400 mb-4">Rank #{actualRank}</p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-2xl font-bold text-primary-cyan">{user.xp || 0}</p>
                          <p className="text-xs text-gray-400">XP</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-2xl font-bold text-green-400">{user.tasks_completed || 0}</p>
                          <p className="text-xs text-gray-400">Tasks</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 justify-center">
                        {userBadges.slice(0, 3).map((badgeKey) => {
                          const BadgeIcon = badges[badgeKey].icon
                          return (
                            <div
                              key={badgeKey}
                              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"
                              title={badges[badgeKey].label}
                            >
                              <BadgeIcon size={16} className={badges[badgeKey].color} />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-bold mb-6">Top 20 Rankings</h2>
              <div className="space-y-3">
                {restOfLeaderboard.map((user) => {
                  const userBadges = assignBadges(user, user.rank)
                  return (
                    <motion.div
                      key={user.user_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: user.rank * 0.02 }}
                      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center font-bold">
                          #{user.rank}
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-cyan to-primary-blue flex items-center justify-center font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold group-hover:text-primary-cyan transition-colors">
                            {user.name || 'Anonymous'}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {userBadges.slice(0, 3).map((badgeKey) => {
                              const BadgeIcon = badges[badgeKey].icon
                              return (
                                <div
                                  key={badgeKey}
                                  className="flex items-center space-x-1 text-xs"
                                  title={badges[badgeKey].label}
                                >
                                  <BadgeIcon size={12} className={badges[badgeKey].color} />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-bold text-primary-cyan">{user.xp || 0} XP</p>
                          <p className="text-sm text-gray-400">{user.tasks_completed || 0} tasks</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-400">₹{(user.total_earnings || 0).toLocaleString()}</p>
                          <p className="text-sm text-gray-400">earned</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {leaderboard.length > 20 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-6"
              >
                <p className="text-gray-400">
                  Showing top 20 of {leaderboard.length} ranked users
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default LeaderboardPage
