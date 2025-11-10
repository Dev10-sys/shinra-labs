import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, CheckCircle, Star, Trophy, Zap, Clock, Target, Award, Play, Pause, AlertCircle, Users, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { updateTask, createNotification } from '../services/supabase'
import { useUserStats, useTasks, useLeaderboard, useTransactions, useSubmissions } from '../hooks/useSupabaseData'
import Topbar from '../components/Layout/Topbar'
import TaskCard from '../components/Tasks/TaskCard'
import Leaderboard from '../components/Gamification/Leaderboard'
import StatsCard from '../components/Dashboard/StatsCard'
import Badge from '../components/Shared/Badge'
import ProgressBar from '../components/Shared/ProgressBar'
import FilterBar from '../components/Shared/FilterBar'
import LoadingSpinner from '../components/Shared/LoadingSpinner'
import ErrorMessage from '../components/Shared/ErrorMessage'
import EmptyState from '../components/Shared/EmptyState'
import toast from 'react-hot-toast'

const FreelancerDashboard = () => {
  const { userProfile, user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('available')
  const [taskFilters, setTaskFilters] = useState({
    category: 'All',
    difficulty: 'All',
    minPrice: '',
    maxPrice: '',
    sortBy: 'Most Recent'
  })

  const { stats: userStats, loading: statsLoading, error: statsError } = useUserStats()
  
  const { tasks: availableTasks, loading: availableLoading, error: availableError, refetch: refetchAvailable } = useTasks({ 
    status: 'open',
    limit: 20
  })

  const { tasks: activeTasks, loading: activeLoading, error: activeError } = useTasks({ 
    status: 'in_progress',
    freelancer_id: user?.id
  })

  const { submissions: mySubmissions, loading: submissionsLoading, error: submissionsError } = useSubmissions({
    freelancer_id: user?.id
  })

  const { leaderboard, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard(10)
  
  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactions()

  const handleAcceptTask = async (task) => {
    try {
      await updateTask(task.id, {
        status: 'in_progress',
        accepted_by: (task.accepted_by || 0) + 1
      })
      
      await createNotification(
        user.id,
        'task',
        'Task Accepted',
        `You accepted "${task.title}"`,
        `/annotate-${task.task_type}/${task.id}`
      )
      
      toast.success('Task accepted! Start working now.')
      refetchAvailable()
      navigate(`/annotate-${task.task_type}/${task.id}`)
    } catch (error) {
      console.error('Accept task error:', error)
      toast.error('Failed to accept task')
    }
  }

  const getWeeklyEarningsData = () => {
    if (!transactions || transactions.length === 0) {
      return [
        { day: 'Mon', amount: 120 },
        { day: 'Tue', amount: 250 },
        { day: 'Wed', amount: 180 },
        { day: 'Thu', amount: 320 },
        { day: 'Fri', amount: 280 },
        { day: 'Sat', amount: 410 },
        { day: 'Sun', amount: 390 }
      ]
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weekData = Array(7).fill(0)
    const now = new Date()
    
    transactions.forEach(t => {
      const date = new Date(t.created_at)
      const diffTime = now - date
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 7 && t.type === 'earning') {
        const dayIndex = date.getDay()
        weekData[dayIndex] += parseFloat(t.amount)
      }
    })

    return days.map((day, i) => ({ day, amount: Math.round(weekData[i]) }))
  }

  const filteredAvailableTasks = availableTasks?.filter(task => {
    if (taskFilters.category !== 'All' && task.task_type !== taskFilters.category.toLowerCase()) return false
    if (taskFilters.difficulty !== 'All' && task.difficulty !== taskFilters.difficulty.toLowerCase()) return false
    if (taskFilters.minPrice && task.payout < parseFloat(taskFilters.minPrice)) return false
    if (taskFilters.maxPrice && task.payout > parseFloat(taskFilters.maxPrice)) return false
    return true
  }) || []

  if (statsLoading || availableLoading) {
    return <LoadingSpinner fullScreen message="Loading your dashboard..." size="lg" />
  }

  if (statsError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage 
          title="Failed to load dashboard" 
          message={statsError}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:pl-64 pt-16">
      <Topbar />
      
      <div className="p-4 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="text-gradient">{userProfile?.name || 'Freelancer'}!</span>
          </h1>
          <p className="text-gray-400">Here's your performance overview</p>
        </div>

        {/* Modern Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title="Earnings This Month"
            value={`₹${(userStats?.monthlyEarnings ?? 0).toLocaleString()}`}
            trend={{ value: 12.5, label: 'vs last month' }}
            icon={Wallet}
            color="cyan"
            delay={0}
          />
          <StatsCard
            title="Tasks Completed"
            value={userStats?.tasks_completed ?? 0}
            trend={{ value: activeTasks?.length ?? 0, unit: '', label: 'in progress' }}
            icon={CheckCircle}
            color="purple"
            delay={0.1}
          />
          <StatsCard
            title="Success Rate"
            value={`${userStats?.rating ? (userStats.rating * 20).toFixed(0) : 0}%`}
            trend={{ value: 2.3, label: 'improvement' }}
            icon={Target}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title="Leaderboard Rank"
            value={`#${userStats?.rank ?? '-'}`}
            trend={{ value: -3, unit: '', label: 'positions' }}
            icon={Trophy}
            color="orange"
            delay={0.3}
            invertTrend={true}
          />
        </div>

        {/* Earnings Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <TrendingUp className="text-primary-cyan" size={24} />
              <span>Earnings Trend</span>
            </h3>
            <span className="text-sm text-gray-400">Last 7 Days</span>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-2">
            {(() => {
              const earningsData = getWeeklyEarningsData()
              const maxAmount = Math.max(...earningsData.map(d => d.amount), 1)
              
              return earningsData.map((data, index) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.amount / maxAmount) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                      className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg min-h-[20px] cursor-pointer hover:from-cyan-400 hover:to-cyan-300 transition-all"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-card px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                        ₹{data.amount}
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{data.day}</span>
                </div>
              ))
            })()}
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"></div>
                <span className="text-sm text-gray-400">Daily Earnings</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Week Total</p>
              <p className="text-lg font-bold text-primary-cyan">
                ₹{getWeeklyEarningsData().reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-cyan/20 rounded-lg">
                <Wallet size={20} className="text-primary-cyan" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Available Balance</p>
                <p className="text-lg font-bold">₹{(userStats?.balance ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-400/20 rounded-lg">
                <Star size={20} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Average Rating</p>
                <p className="text-lg font-bold">{userStats?.rating?.toFixed(1) ?? '0.0'} / 5.0</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-green/20 rounded-lg">
                <Zap size={20} className="text-primary-green" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Earned</p>
                <p className="text-lg font-bold">₹{(userStats?.total_earned ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <CheckCircle className="text-primary-cyan" size={28} />
            <span>Your Active Tasks ({activeTasks?.length ?? 0})</span>
          </h2>

          {activeLoading ? (
            <LoadingSpinner message="Loading your active tasks..." />
          ) : activeError ? (
            <ErrorMessage message={activeError} />
          ) : !activeTasks || activeTasks.length === 0 ? (
            <EmptyState 
              icon="list"
              title="No Active Tasks"
              message="You haven't started any tasks yet. Browse available tasks below to get started!"
              variant="primary"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeTasks.map((task) => {
                const progressPercentage = task.progress || 0
                const deadline = task.deadline ? new Date(task.deadline) : null
                const daysLeft = deadline ? Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)) : null
                const hoursLeft = deadline ? Math.ceil((deadline - new Date()) / (1000 * 60 * 60)) : null
                const isUrgent = hoursLeft && hoursLeft < 24

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass rounded-xl p-6 border border-white/10 hover:border-primary-cyan/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold flex-1">{task.title}</h3>
                      <Badge variant={task.difficulty || 'easy'}>{task.difficulty || 'Easy'}</Badge>
                    </div>

                    <Badge variant={task.task_type || 'text'} size="sm" className="mb-4">
                      {task.task_type || 'Text'}
                    </Badge>

                    <ProgressBar
                      progress={progressPercentage}
                      color="cyan"
                      className="mb-4"
                    />

                    <div className="text-sm text-gray-400 mb-4">
                      {progressPercentage.toFixed(0)}% completed
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Wallet className="text-primary-green" size={18} />
                        <span className="text-lg font-bold text-primary-green">
                          ₹{(task.payout || 0).toLocaleString()}
                        </span>
                      </div>
                      {deadline && (
                        <div className={`flex items-center space-x-2 ${isUrgent ? 'text-red-400' : 'text-gray-400'}`}>
                          {isUrgent && <AlertCircle size={16} />}
                          <Clock size={16} />
                          <span className="text-sm font-medium">
                            {isUrgent ? `${hoursLeft}h left` : `${daysLeft} days left`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => navigate(`/annotate-${task.task_type}/${task.id}`)}
                        className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
                      >
                        <Play size={16} />
                        <span>Continue Working</span>
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Browse Available Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Target className="text-primary-cyan" size={28} />
            <span>Available Tasks ({filteredAvailableTasks.length})</span>
          </h2>

          <FilterBar 
            filters={taskFilters}
            onFilterChange={setTaskFilters}
            className="mb-6"
          />

          {availableLoading ? (
            <LoadingSpinner message="Loading available tasks..." />
          ) : availableError ? (
            <ErrorMessage message={availableError} />
          ) : filteredAvailableTasks.length === 0 ? (
            <EmptyState 
              icon="search"
              title="No Tasks Found"
              message="No tasks match your current filters. Try adjusting your search criteria."
              variant="default"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailableTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * Math.min(index, 5) }}
                  whileHover={{ scale: 1.02 }}
                  className="glass rounded-xl p-6 border border-white/10 hover:border-primary-cyan/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold flex-1">{task.title}</h3>
                    <Badge variant={task.task_type || 'text'} size="sm">
                      {task.task_type || 'Text'}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant={task.difficulty || 'easy'}>{task.difficulty || 'Easy'}</Badge>
                    {task.company?.name && (
                      <span className="text-xs text-gray-400">by {task.company.name}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Wallet className="text-primary-green" size={18} />
                      <span className="text-xl font-bold text-primary-green">
                        ₹{(task.payout || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4 text-sm text-gray-400">
                    <Users size={16} />
                    <span>{task.accepted_by || 0} labelers working</span>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 btn-secondary flex items-center justify-center space-x-2 py-2">
                      <Eye size={16} />
                      <span>View Details</span>
                    </button>
                    <button 
                      onClick={() => handleAcceptTask(task)}
                      className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
                    >
                      <CheckCircle size={16} />
                      <span>Accept</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('available')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'available'
                ? 'text-primary-cyan border-b-2 border-primary-cyan'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Available Tasks
          </button>
          <button
            onClick={() => setActiveTab('my-tasks')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'my-tasks'
                ? 'text-primary-cyan border-b-2 border-primary-cyan'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Tasks
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'leaderboard'
                ? 'text-primary-cyan border-b-2 border-primary-cyan'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Content */}
        {activeTab === 'available' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {availableLoading ? (
              <div className="col-span-full"><LoadingSpinner message="Loading tasks..." /></div>
            ) : filteredAvailableTasks.length === 0 ? (
              <div className="col-span-full">
                <EmptyState 
                  icon="inbox"
                  title="No Available Tasks"
                  message="There are no tasks available at the moment. Check back later!"
                  variant="default"
                />
              </div>
            ) : (
              filteredAvailableTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPick={() => handleAcceptTask(task)}
                />
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'my-tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {submissionsLoading ? (
              <LoadingSpinner message="Loading your submissions..." />
            ) : !mySubmissions || mySubmissions.length === 0 ? (
              <EmptyState 
                icon="list"
                title="No Submissions Yet"
                message="You haven't submitted any work yet. Start working on tasks to see them here!"
                variant="primary"
              />
            ) : (
              mySubmissions.map((submission) => (
                <div key={submission.id} className="glass rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{submission.task?.title || 'Task'}</h3>
                      <p className="text-gray-400 text-sm mb-2">{submission.task?.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          submission.verified
                            ? 'bg-primary-green/20 text-primary-green'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {submission.verified ? 'Verified' : 'Pending'}
                        </span>
                        {submission.task?.payout && (
                          <span className="text-primary-green font-bold">
                            ₹{submission.task.payout.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {!submission.verified && (
                      <button
                        onClick={() => navigate(`/annotate-${submission.task?.task_type || 'text'}/${submission.task_id}`)}
                        className="btn-primary"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          leaderboardLoading ? (
            <LoadingSpinner message="Loading leaderboard..." />
          ) : (
            <Leaderboard data={leaderboard || []} />
          )
        )}
      </div>
    </div>
  )
}

export default FreelancerDashboard

