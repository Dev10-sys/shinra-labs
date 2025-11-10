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

const LeaderboardPage = () => {
  const [timePeriod, setTimePeriod] = useState('month')
  const [category, setCategory] = useState('overall')

  const badges = {
    topPerformer: { icon: Trophy, label: 'Top Performer', color: 'text-yellow-400' },
    speedDemon: { icon: Zap, label: 'Speed Demon', color: 'text-cyan-400' },
    accuracyMaster: { icon: Target, label: 'Accuracy Master', color: 'text-purple-400' },
    diamondTier: { icon: Award, label: 'Diamond Tier', color: 'text-blue-400' },
    hotStreak: { icon: Flame, label: 'Hot Streak', color: 'text-orange-400' },
    risingStar: { icon: Star, label: 'Rising Star', color: 'text-pink-400' },
  }

  const mockLeaderboard = Array.from({ length: 100 }, (_, i) => {
    const userBadges = []
    if (i < 10) userBadges.push('topPerformer')
    if (i < 5) userBadges.push('speedDemon')
    if (Math.random() > 0.7) userBadges.push('accuracyMaster')
    if (i < 20) userBadges.push('diamondTier')
    if (Math.random() > 0.8) userBadges.push('hotStreak')
    if (i > 90) userBadges.push('risingStar')

    return {
      rank: i + 1,
      name: `User ${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
      xp: Math.floor(Math.random() * 50000) + (100 - i) * 500,
      tasks: Math.floor(Math.random() * 200) + (100 - i) * 2,
      earnings: Math.floor(Math.random() * 200000) + (100 - i) * 1000,
      accuracy: 95 + Math.random() * 4.9,
      badges: userBadges,
      trend: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : -Math.floor(Math.random() * 5) - 1,
    }
  }).sort((a, b) => b.xp - a.xp)

  const topThree = mockLeaderboard.slice(0, 3)
  const restOfLeaderboard = mockLeaderboard.slice(3, 20)

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

            return (
              <motion.div
                key={user.rank}
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
                    <MedalIcon className="text-white" size={24} />
                  </div>
                </div>

                <div className="text-center mt-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-cyan to-primary-blue flex items-center justify-center text-2xl font-bold border-4 border-white/20">
                    {user.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{user.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">Rank #{actualRank}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-400">XP Points</span>
                      <span className="font-bold text-primary-cyan">{user.xp.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-400">Tasks</span>
                      <span className="font-bold">{user.tasks}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-400">Earnings</span>
                      <span className="font-bold text-primary-green">₹{user.earnings.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {user.badges.slice(0, 3).map((badgeKey) => {
                      const badge = badges[badgeKey]
                      const BadgeIcon = badge.icon
                      return (
                        <div
                          key={badgeKey}
                          className={`p-2 bg-white/5 rounded-lg ${badge.color}`}
                          title={badge.label}
                        >
                          <BadgeIcon size={16} />
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
          className="glass rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold">Top 100 Leaderboard</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Rank</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">User</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">XP Points</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Tasks</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Earnings</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Accuracy</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Badges</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Trend</th>
                </tr>
              </thead>
              <tbody>
                {restOfLeaderboard.map((user, index) => (
                  <motion.tr
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-400">#{user.rank}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-cyan to-primary-blue flex items-center justify-center">
                          <span className="text-white font-bold">{user.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-primary-cyan">{user.xp.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-300">{user.tasks}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-primary-green">₹{user.earnings.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                            style={{ width: `${user.accuracy}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">{user.accuracy.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-1">
                        {user.badges.slice(0, 4).map((badgeKey) => {
                          const badge = badges[badgeKey]
                          const BadgeIcon = badge.icon
                          return (
                            <div
                              key={badgeKey}
                              className={`p-1.5 bg-white/5 rounded ${badge.color}`}
                              title={badge.label}
                            >
                              <BadgeIcon size={14} />
                            </div>
                          )
                        })}
                        {user.badges.length > 4 && (
                          <div className="p-1.5 bg-white/5 rounded text-xs text-gray-400 flex items-center justify-center min-w-[24px]">
                            +{user.badges.length - 4}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div
                        className={`flex items-center space-x-1 ${
                          user.trend > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {user.trend > 0 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        <span className="text-sm font-semibold">{Math.abs(user.trend)}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 glass rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold mb-4">Badge Meanings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(badges).map(([key, badge]) => {
              const BadgeIcon = badge.icon
              return (
                <div key={key} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className={`p-2 bg-white/5 rounded-lg ${badge.color}`}>
                    <BadgeIcon size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{badge.label}</p>
                    <p className="text-xs text-gray-400">
                      {key === 'topPerformer' && 'Most tasks completed'}
                      {key === 'speedDemon' && 'Fastest completion time'}
                      {key === 'accuracyMaster' && '>99% accuracy rate'}
                      {key === 'diamondTier' && '100+ tasks completed'}
                      {key === 'hotStreak' && '7 consecutive active days'}
                      {key === 'risingStar' && 'New user, high quality'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LeaderboardPage
