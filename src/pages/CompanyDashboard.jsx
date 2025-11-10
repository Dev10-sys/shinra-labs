import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, DollarSign, Database, TrendingUp, Plus, FileText, Image, Video, Music, Users, CheckCircle2, Activity, Download, Eye, Check, Clock, AlertCircle, Folder } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCompanyStats, useTasks, useSubmissions } from '../hooks/useSupabaseData'
import Topbar from '../components/Layout/Topbar'
import StatsCard from '../components/Dashboard/StatsCard'
import ProjectCard from '../components/Shared/ProjectCard'
import Badge from '../components/Shared/Badge'
import LoadingSpinner from '../components/Shared/LoadingSpinner'
import ErrorMessage from '../components/Shared/ErrorMessage'
import EmptyState from '../components/Shared/EmptyState'
import PostTaskModal from '../components/Company/PostTaskModal'
import UploadDatasetModal from '../components/Company/UploadDatasetModal'
import toast from 'react-hot-toast'

const CompanyDashboard = () => {
  const { userProfile, user } = useAuth()
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showDatasetModal, setShowDatasetModal] = useState(false)

  const { stats: companyStats, loading: statsLoading, error: statsError } = useCompanyStats()
  
  const { tasks: companyTasks, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = useTasks({ 
    company_id: user?.id
  })

  const { submissions: recentSubmissions, loading: submissionsLoading, error: submissionsError } = useSubmissions({
    limit: 10
  })

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`
    return new Date(date).toLocaleDateString()
  }

  const getActivityIcon = (verified) => {
    if (verified === true) return { icon: 'check', color: 'green' }
    if (verified === false) return { icon: 'alert', color: 'red' }
    return { icon: 'clock', color: 'orange' }
  }

  if (statsLoading || tasksLoading) {
    return <LoadingSpinner fullScreen message="Loading company dashboard..." size="lg" />
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
            Company <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-gray-400">Monitor your projects and workforce performance</p>
        </div>

        {/* Modern Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title="Active Projects"
            value={companyStats?.activeProjects ?? 0}
            trend={{ value: 8.2, label: 'vs last month' }}
            icon={Briefcase}
            color="cyan"
            delay={0}
          />
          <StatsCard
            title="Total Spent"
            value={`₹${(companyStats?.totalSpent ?? 0).toLocaleString()}`}
            trend={{ value: 15.3, label: 'this month' }}
            icon={DollarSign}
            color="green"
            delay={0.1}
          />
          <StatsCard
            title="Labelers Online"
            value={recentSubmissions?.length ?? 0}
            trend={{ value: recentSubmissions?.filter(s => !s.verified).length ?? 0, unit: '', label: 'pending review' }}
            icon={Users}
            color="purple"
            delay={0.2}
          />
          <StatsCard
            title="Labels Completed"
            value={(companyStats?.labelsCompleted ?? 0).toLocaleString()}
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

        {/* Projects List Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Folder className="text-primary-cyan" size={28} />
            <span>Your Projects ({companyTasks?.length ?? 0})</span>
          </h2>

          {tasksLoading ? (
            <LoadingSpinner message="Loading your projects..." />
          ) : tasksError ? (
            <ErrorMessage message={tasksError} />
          ) : !companyTasks || companyTasks.length === 0 ? (
            <EmptyState 
              icon="folder"
              title="No Projects Yet"
              message="You haven't created any projects yet. Click 'Post New Task' to get started!"
              action={() => setShowTaskModal(true)}
              actionLabel="Create Project"
              variant="primary"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {companyTasks.map((task, index) => {
                const project = {
                  id: task.id,
                  name: task.title,
                  status: task.status === 'open' ? 'Open' : task.status === 'in_progress' ? 'In Progress' : 'Completed',
                  progress: task.progress || 0,
                  labelersActive: task.accepted_by || 0,
                  accuracy: 96.0,
                  deadline: task.deadline ? new Date(task.deadline) : null,
                  budget: task.payout || 0
                }
                
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewDetails={() => toast.info('View Details clicked')}
                    onDownloadData={() => toast.success('Download started')}
                    onAddBudget={() => toast.info('Add Budget modal would open')}
                  />
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Activity className="text-primary-cyan" size={28} />
            <span>Recent Activity</span>
          </h2>

          {submissionsLoading ? (
            <LoadingSpinner message="Loading recent activity..." />
          ) : submissionsError ? (
            <ErrorMessage message={submissionsError} />
          ) : !recentSubmissions || recentSubmissions.length === 0 ? (
            <EmptyState 
              icon="activity"
              title="No Recent Activity"
              message="No recent submissions from freelancers. Your tasks will appear here once freelancers start working on them."
              variant="default"
            />
          ) : (
            <div className="glass rounded-xl p-6 border border-white/10">
              <div className="space-y-4">
                {recentSubmissions.map((submission, index) => {
                  const activityIcon = getActivityIcon(submission.verified)
                  const iconColors = {
                    green: 'text-primary-green',
                    orange: 'text-yellow-500',
                    blue: 'text-primary-cyan',
                    red: 'text-red-500',
                  }

                  const iconBgColors = {
                    green: 'bg-primary-green/20',
                    orange: 'bg-yellow-500/20',
                    blue: 'bg-primary-cyan/20',
                    red: 'bg-red-500/20',
                  }

                  const freelancerName = submission.freelancer?.name || 'Anonymous'
                  const taskTitle = submission.task?.title || 'Task'
                  const initials = freelancerName.split(' ').map(n => n[0]).join('').toUpperCase()

                  return (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * Math.min(index, 5) }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-cyan to-primary-blue flex items-center justify-center text-white font-bold text-sm">
                          {initials}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold text-white">{freelancerName}</span>
                          {' '}
                          <span className="text-gray-400">submitted work for {taskTitle}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{getTimeAgo(submission.created_at)}</p>
                      </div>

                      <div className={`flex-shrink-0 p-2 rounded-lg ${iconBgColors[activityIcon.color]}`}>
                        {activityIcon.icon === 'check' && (
                          <Check className={iconColors[activityIcon.color]} size={18} />
                        )}
                        {activityIcon.icon === 'clock' && (
                          <Clock className={iconColors[activityIcon.color]} size={18} />
                        )}
                        {activityIcon.icon === 'alert' && (
                          <AlertCircle className={iconColors[activityIcon.color]} size={18} />
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

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
          {tasksLoading ? (
            <LoadingSpinner message="Loading your tasks..." />
          ) : !companyTasks || companyTasks.length === 0 ? (
            <div className="glass rounded-xl p-6 border border-white/10 text-center py-12">
              <EmptyState 
                icon="inbox"
                title="No Tasks Posted"
                message="You haven't created any tasks yet. Click 'Post New Task' above to get started!"
                variant="default"
              />
            </div>
          ) : (
            companyTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-6 border border-white/10"
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
                      <span>Payout: ₹{(task.payout || 0).toLocaleString()}</span>
                      <span>Labelers: {task.accepted_by || 0}</span>
                      <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
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

