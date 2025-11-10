import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, CheckCircle, Star, Trophy, Zap, Clock, Target, Award, Play, Pause, AlertCircle, Users, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, TABLES } from '../services/supabase'
import Topbar from '../components/Layout/Topbar'
import TaskCard from '../components/Tasks/TaskCard'
import Leaderboard from '../components/Gamification/Leaderboard'
import StatsCard from '../components/Dashboard/StatsCard'
import Badge from '../components/Shared/Badge'
import ProgressBar from '../components/Shared/ProgressBar'
import FilterBar from '../components/Shared/FilterBar'
import toast from 'react-hot-toast'

const FreelancerDashboard = () => {
  const { userProfile } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('available')
  const [filters, setFilters] = useState({
    category: 'All',
    difficulty: 'All',
    minPrice: '',
    maxPrice: '',
    sortBy: 'Most Recent'
  })

  const mockActiveTasks = [
    {
      id: 1,
      title: 'Product Image Labeling',
      difficulty: 'Easy',
      progress: 40,
      total: 100,
      reward: 5000,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      category: 'Image'
    },
    {
      id: 2,
      title: 'Audio Transcription - Hindi',
      difficulty: 'Medium',
      progress: 75,
      total: 150,
      reward: 8500,
      deadline: new Date(Date.now() + 20 * 60 * 60 * 1000),
      category: 'Audio'
    },
    {
      id: 3,
      title: 'Sentiment Analysis Training',
      difficulty: 'Hard',
      progress: 22,
      total: 80,
      reward: 12000,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      category: 'Text'
    }
  ]

  const mockAvailableTasks = [
    {
      id: 4,
      title: 'E-commerce Product Categorization',
      category: 'Image',
      reward: 6000,
      items: 200,
      difficulty: 'Easy',
      acceptedBy: 45,
      rating: 4.8
    },
    {
      id: 5,
      title: 'Video Content Moderation',
      category: 'Video',
      reward: 15000,
      items: 100,
      difficulty: 'Hard',
      acceptedBy: 12,
      rating: 4.5
    },
    {
      id: 6,
      title: 'News Article Classification',
      category: 'Text',
      reward: 4500,
      items: 300,
      difficulty: 'Easy',
      acceptedBy: 78,
      rating: 4.9
    },
    {
      id: 7,
      title: 'Customer Review Sentiment Analysis',
      category: 'Text',
      reward: 7200,
      items: 250,
      difficulty: 'Medium',
      acceptedBy: 34,
      rating: 4.6
    },
    {
      id: 8,
      title: 'Voice Command Recognition',
      category: 'Audio',
      reward: 9500,
      items: 180,
      difficulty: 'Medium',
      acceptedBy: 29,
      rating: 4.7
    },
    {
      id: 9,
      title: 'Medical Image Annotation',
      category: 'Image',
      reward: 18000,
      items: 120,
      difficulty: 'Hard',
      acceptedBy: 8,
      rating: 4.9
    },
    {
      id: 10,
      title: 'Social Media Post Tagging',
      category: 'Text',
      reward: 3500,
      items: 400,
      difficulty: 'Easy',
      acceptedBy: 92,
      rating: 4.4
    },
    {
      id: 11,
      title: 'Traffic Sign Detection',
      category: 'Image',
      reward: 11000,
      items: 150,
      difficulty: 'Medium',
      acceptedBy: 21,
      rating: 4.8
    },
    {
      id: 12,
      title: 'Podcast Transcription',
      category: 'Audio',
      reward: 13000,
      items: 90,
      difficulty: 'Hard',
      acceptedBy: 15,
      rating: 4.6
    },
    {
      id: 13,
      title: 'Fashion Item Classification',
      category: 'Image',
      reward: 5500,
      items: 280,
      difficulty: 'Easy',
      acceptedBy: 67,
      rating: 4.7
    },
    {
      id: 14,
      title: 'YouTube Video Summarization',
      category: 'Video',
      reward: 16500,
      items: 75,
      difficulty: 'Hard',
      acceptedBy: 9,
      rating: 4.5
    },
    {
      id: 15,
      title: 'Product Review Analysis',
      category: 'Text',
      reward: 6800,
      items: 220,
      difficulty: 'Medium',
      acceptedBy: 41,
      rating: 4.8
    }
  ]

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

        {/* Active Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <CheckCircle className="text-primary-cyan" size={28} />
            <span>Your Active Tasks ({mockActiveTasks.length})</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockActiveTasks.map((task) => {
              const progressPercentage = (task.progress / task.total) * 100
              const daysLeft = Math.ceil((task.deadline - new Date()) / (1000 * 60 * 60 * 24))
              const hoursLeft = Math.ceil((task.deadline - new Date()) / (1000 * 60 * 60))
              const isUrgent = hoursLeft < 24

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
                    <Badge variant={task.difficulty.toLowerCase()}>{task.difficulty}</Badge>
                  </div>

                  <Badge variant={task.category.toLowerCase()} size="sm" className="mb-4">
                    {task.category}
                  </Badge>

                  <ProgressBar
                    progress={progressPercentage}
                    color="cyan"
                    className="mb-4"
                  />

                  <div className="text-sm text-gray-400 mb-4">
                    {task.progress} / {task.total} items completed
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Wallet className="text-primary-green" size={18} />
                      <span className="text-lg font-bold text-primary-green">
                        ₹{task.reward.toLocaleString()}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-2 ${isUrgent ? 'text-red-400' : 'text-gray-400'}`}>
                      {isUrgent && <AlertCircle size={16} />}
                      <Clock size={16} />
                      <span className="text-sm font-medium">
                        {isUrgent ? `${hoursLeft}h left` : `${daysLeft} days left`}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        const route = task.category === 'Image' 
                          ? `/annotate-image/${task.id}`
                          : task.category === 'Text'
                          ? `/annotate-text/${task.id}`
                          : `/annotate/${task.id}`
                        navigate(route)
                      }}
                      className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
                    >
                      <Play size={16} />
                      <span>Continue Working</span>
                    </button>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                      <Pause size={16} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
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
            <span>Available Tasks ({mockAvailableTasks.length})</span>
          </h2>

          <FilterBar 
            filters={filters}
            onFilterChange={setFilters}
            className="mb-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAvailableTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-xl p-6 border border-white/10 hover:border-primary-cyan/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold flex-1">{task.title}</h3>
                  <Badge variant={task.category.toLowerCase()} size="sm">
                    {task.category}
                  </Badge>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant={task.difficulty.toLowerCase()}>{task.difficulty}</Badge>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-medium">{task.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Wallet className="text-primary-green" size={18} />
                    <span className="text-xl font-bold text-primary-green">
                      ₹{task.reward.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{task.items} items</span>
                </div>

                <div className="flex items-center space-x-2 mb-4 text-sm text-gray-400">
                  <Users size={16} />
                  <span>{task.acceptedBy} labelers working</span>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 btn-secondary flex items-center justify-center space-x-2 py-2">
                    <Eye size={16} />
                    <span>View Details</span>
                  </button>
                  <button 
                    onClick={() => {
                      const route = task.category === 'Image' 
                        ? `/annotate-image/${task.id}`
                        : task.category === 'Text'
                        ? `/annotate-text/${task.id}`
                        : `/annotate/${task.id}`
                      navigate(route)
                      toast.success('Task accepted! Starting annotation...')
                    }}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
                  >
                    <CheckCircle size={16} />
                    <span>Accept</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
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

