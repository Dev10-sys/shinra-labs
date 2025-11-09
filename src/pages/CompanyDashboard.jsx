import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, DollarSign, Database, TrendingUp, Plus, FileText, Image, Video, Music } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, TABLES } from '../services/supabase'
import Topbar from '../components/Layout/Topbar'
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            label="Total Tasks"
            value={stats.totalTasks}
            color="cyan"
          />
          <StatCard
            icon={DollarSign}
            label="Dataset Earnings"
            value={`₹${stats.totalEarnings.toLocaleString()}`}
            color="green"
          />
          <StatCard
            icon={Database}
            label="Datasets Sold"
            value={stats.datasetsSold}
            color="blue"
          />
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
                      <span className="text-gray-400">Downloads: {dataset.downloads || 0}</span>
                      <span className="text-gray-400">Rating: {dataset.rating?.toFixed(1) || '0.0'} ⭐</span>
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

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    cyan: 'text-primary-cyan bg-primary-cyan/10',
    blue: 'text-primary-blue bg-primary-blue/10',
    green: 'text-primary-green bg-primary-green/10',
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

export default CompanyDashboard

