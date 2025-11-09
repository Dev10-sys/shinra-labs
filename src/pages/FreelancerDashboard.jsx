import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, CheckCircle, Star, Trophy, Zap, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, TABLES } from '../services/supabase'
import Topbar from '../components/Layout/Topbar'
import TaskCard from '../components/Tasks/TaskCard'
import Leaderboard from '../components/Gamification/Leaderboard'
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Wallet}
            label="Balance"
            value={`₹${(userProfile?.balance || 0).toLocaleString()}`}
            color="cyan"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Earned"
            value={`₹${(userProfile?.total_earned || 0).toLocaleString()}`}
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            label="Tasks Completed"
            value={userProfile?.tasks_completed || 0}
            color="green"
          />
          <StatCard
            icon={Star}
            label="Rating"
            value={userProfile?.rating?.toFixed(1) || '0.0'}
            color="yellow"
          />
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

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    cyan: 'text-primary-cyan bg-primary-cyan/10',
    blue: 'text-primary-blue bg-primary-blue/10',
    green: 'text-primary-green bg-primary-green/10',
    yellow: 'text-yellow-400 bg-yellow-400/10',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 ${colorClasses[color]} rounded-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  )
}

export default FreelancerDashboard

