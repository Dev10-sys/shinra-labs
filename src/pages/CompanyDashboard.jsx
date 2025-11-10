import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, DollarSign, Database, TrendingUp, Plus, FileText, Image, Video, Music, Users, CheckCircle2, Activity } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, TABLES } from '../services/supabase'
import Topbar from '../components/Layout/Topbar'
import StatsCard from '../components/Dashboard/StatsCard'
import PostTaskModal from '../components/Company/PostTaskModal'
import UploadDatasetModal from '../components/Company/UploadDatasetModal'
import toast from 'react-hot-toast'

const CompanyDashboard = () => {
  const { userProfile } = useAuth()
  const [tasks, setTasks] = useState([])
  const [datasets, setDatasets] = useState([])
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalEarnings: 0,
    datasetsSold: 0,
  })
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showDatasetModal, setShowDatasetModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userProfile) {
      fetchData()
    }
  }, [userProfile])

  const fetchData = async () => {
    try {
      // Fetch company tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from(TABLES.TASKS)
        .select('*, submissions(count)')
        .eq('company_id', userProfile.id)
        .order('created_at', { ascending: false })

      if (tasksError) throw tasksError
      setTasks(tasksData || [])

      // Fetch company datasets
      const { data: datasetsData, error: datasetsError } = await supabase
        .from(TABLES.DATASETS)
        .select('*, purchases(count)')
        .eq('creator_id', userProfile.id)
        .order('created_at', { ascending: false })

      if (datasetsError) throw datasetsError
      setDatasets(datasetsData || [])

      // Calculate stats
      const totalEarnings = datasetsData?.reduce((sum, d) => {
        const purchases = d.purchases?.[0]?.count || 0
        return sum + (d.price * purchases)
      }, 0) || 0

      setStats({
        totalTasks: tasksData?.length || 0,
        totalEarnings,
        datasetsSold: datasetsData?.reduce((sum, d) => sum + (d.purchases?.[0]?.count || 0), 0) || 0,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
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
            Company <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-gray-400">Monitor your projects and workforce performance</p>
        </div>

        {/* Modern Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title="Active Projects"
            value={stats.totalTasks}
            trend={{ value: 8.2, label: 'vs last month' }}
            icon={Briefcase}
            color="cyan"
            delay={0}
          />
          <StatsCard
            title="Total Spent"
            value={`₹${(stats.totalEarnings + 25000).toLocaleString()}`}
            trend={{ value: 15.3, label: 'this month' }}
            icon={DollarSign}
            color="green"
            delay={0.1}
          />
          <StatsCard
            title="Labelers Online"
            value={45}
            trend={{ value: 12, unit: '', label: 'active now' }}
            icon={Users}
            color="purple"
            delay={0.2}
          />
          <StatsCard
            title="Labels Completed"
            value="2,450"
            trend={{ value: 23.5, label: 'this week' }}
            icon={CheckCircle2}
            color="blue"
            delay={0.3}
          />
        </div>

        {/* Project Progress Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-white/10 mb-8"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Activity className="text-primary-cyan" size={24} />
            <span>Project Progress Overview</span>
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Product Catalog Labeling</span>
                <span className="text-sm text-gray-400">1,250 / 1,500 items</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '83%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                ></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Audio Transcription</span>
                <span className="text-sm text-gray-400">680 / 1,000 hours</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '68%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                ></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Video Annotation</span>
                <span className="text-sm text-gray-400">520 / 800 videos</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-cyan/20 rounded-lg">
                <Database size={20} className="text-primary-cyan" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Datasets Sold</p>
                <p className="text-lg font-bold">{stats.datasetsSold}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <TrendingUp size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Dataset Revenue</p>
                <p className="text-lg font-bold">₹{stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Activity size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Avg. Accuracy</p>
                <p className="text-lg font-bold">96.4%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setShowTaskModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Post New Task</span>
          </button>
          <button
            onClick={() => setShowDatasetModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Upload Dataset</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-white/10">
          <button className="pb-4 px-4 font-semibold text-primary-cyan border-b-2 border-primary-cyan">
            My Tasks
          </button>
          <button className="pb-4 px-4 font-semibold text-gray-400 hover:text-white">
            My Datasets
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4 mb-8">
          {tasks.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              No tasks posted yet. Create your first task!
            </div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {task.task_type === 'text' && <FileText className="text-primary-cyan" size={20} />}
                      {task.task_type === 'image' && <Image className="text-primary-cyan" size={20} />}
                      {task.task_type === 'video' && <Video className="text-primary-cyan" size={20} />}
                      {task.task_type === 'audio' && <Music className="text-primary-cyan" size={20} />}
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'open' ? 'bg-green-500/20 text-green-500' :
                        task.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-3">{task.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Payout: ₹{task.payout}</span>
                      <span>Submissions: {task.submissions?.[0]?.count || 0}</span>
                      <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Datasets List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">My Datasets</h2>
          {datasets.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              No datasets uploaded yet. Upload your first dataset!
            </div>
          ) : (
            datasets.map((dataset) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{dataset.title}</h3>
                    <p className="text-gray-400 mb-3">{dataset.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-primary-cyan font-bold">₹{dataset.price.toLocaleString()}</span>
                      <span className="text-gray-400">Downloads: {dataset.downloads ?? 0}</span>
                      <span className="text-gray-400">Rating: {dataset.rating?.toFixed(1) ?? '0.0'} ⭐</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {showTaskModal && (
        <PostTaskModal
          onClose={() => setShowTaskModal(false)}
          onSuccess={() => {
            setShowTaskModal(false)
            fetchData()
          }}
        />
      )}

      {showDatasetModal && (
        <UploadDatasetModal
          onClose={() => setShowDatasetModal(false)}
          onSuccess={() => {
            setShowDatasetModal(false)
            fetchData()
          }}
        />
      )}
    </div>
  )
}

export default CompanyDashboard

