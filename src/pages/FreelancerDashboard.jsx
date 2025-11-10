import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, CheckCircle, Star, Trophy, Zap, Clock, Target, Award } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, TABLES } from '../services/supabase'
import Topbar from '../components/Layout/Topbar'
import TaskCard from '../components/Tasks/TaskCard'
import Leaderboard from '../components/Gamification/Leaderboard'
import StatsCard from '../components/Dashboard/StatsCard'
import toast from 'react-hot-toast'

const FreelancerDashboard = () => {
  const { userProfile } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('available')

  useEffect(() => {
    if (userProfile) {
      fetchData()
    }
  }, [userProfile])

  const fetchData = async () => {
    try {
      // Fetch available tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from(TABLES.TASKS)
        .select('*, users:company_id(name)')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(10)

      if (tasksError) throw tasksError
      setTasks(tasksData || [])

      // Fetch my tasks (submissions)
      const { data: submissionsData, error: submissionsError } = await supabase
        .from(TABLES.SUBMISSIONS)
        .select('*, tasks(*)')
        .eq('freelancer_id', userProfile.id)
        .order('created_at', { ascending: false })

      if (submissionsError) throw submissionsError
      setMyTasks(submissionsData || [])

      // Fetch leaderboard
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from(TABLES.LEADERBOARD)
        .select('*')
        .order('rank', { ascending: true })
        .limit(10)

      if (leaderboardError) throw leaderboardError
      setLeaderboard(leaderboardData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handlePickTask = async (taskId) => {
    try {
      // Update task status to in_progress
      const { error: updateError } = await supabase
        .from(TABLES.TASKS)
        .update({ status: 'in_progress' })
        .eq('id', taskId)

      if (updateError) throw updateError

      // Navigate to annotation suite
      navigate(`/annotate/${taskId}`)
      toast.success('Task picked! Starting annotation...')
    } catch (error) {
      console.error('Error picking task:', error)
      toast.error('Failed to pick task')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-cyan"></div>
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
            value={`₹${((userProfile?.total_earned ?? 4250)).toLocaleString()}`}
            trend={{ value: 12.5, label: 'vs last month' }}
            icon={Wallet}
            color="cyan"
            delay={0}
          />
          <StatsCard
            title="Tasks Completed"
            value={(userProfile?.tasks_completed ?? 28)}
            trend={{ value: 5, unit: '', label: 'new this week' }}
            icon={CheckCircle}
            color="purple"
            delay={0.1}
          />
          <StatsCard
            title="Success Rate"
            value={`${(userProfile?.rating ? (userProfile.rating * 20).toFixed(0) : 96)}%`}
            trend={{ value: 2.3, label: 'improvement' }}
            icon={Target}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title="Leaderboard Rank"
            value={`#${userProfile?.rank ?? 45}`}
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
              const earningsData = [
                { day: 'Mon', amount: 120 },
                { day: 'Tue', amount: 250 },
                { day: 'Wed', amount: 180 },
                { day: 'Thu', amount: 320 },
                { day: 'Fri', amount: 280 },
                { day: 'Sat', amount: 410 },
                { day: 'Sun', amount: 390 }
              ]
              const maxAmount = Math.max(...earningsData.map(d => d.amount))
              
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
              <p className="text-lg font-bold text-primary-cyan">₹1,950</p>
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
                <p className="text-lg font-bold">₹{(userProfile?.balance ?? 0).toLocaleString()}</p>
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
                <p className="text-lg font-bold">{userProfile?.rating?.toFixed(1) ?? '4.8'} / 5.0</p>
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
                <p className="text-lg font-bold">₹{(userProfile?.total_earned ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>

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
            {tasks.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                No available tasks at the moment
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPick={() => handlePickTask(task.id)}
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
            {myTasks.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                You haven't picked any tasks yet
              </div>
            ) : (
              myTasks.map((submission) => (
                <div key={submission.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{submission.tasks?.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{submission.tasks?.description}</p>
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
                      </div>
                    </div>
                    {!submission.verified && (
                      <button
                        onClick={() => navigate(`/annotate/${submission.task_id}`)}
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

        {activeTab === 'leaderboard' && <Leaderboard data={leaderboard} />}
      </div>
    </div>
  )
}

export default FreelancerDashboard

