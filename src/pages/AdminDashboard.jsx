import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Search,
  Eye,
  Ban,
  MessageSquare,
  Check,
  X,
  AlertCircle,
  Image,
  Type,
  Headphones,
  Video,
  ChevronLeft,
  ChevronRight,
  Loader,
} from 'lucide-react'
import Topbar from '../components/Layout/Topbar'
import StatsCard from '../components/Dashboard/StatsCard'
import Badge from '../components/Shared/Badge'
import LoadingSpinner from '../components/Shared/LoadingSpinner'
import ErrorMessage from '../components/Shared/ErrorMessage'
import toast from 'react-hot-toast'
import { useAdminStats, useAllUsers, useSubmissions } from '../hooks/useSupabaseData'
import { useAuth } from '../contexts/AuthContext'
import { rejectSubmission, secureApproveSubmission, createNotification } from '../services/supabase'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [userFilters, setUserFilters] = useState({
    role: 'All',
    status: 'All',
  })
  const [submissionFilters, setSubmissionFilters] = useState({
    status: 'pending',
    type: 'All',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats()
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useAllUsers()
  const { submissions, loading: submissionsLoading, error: submissionsError, refetch: refetchSubmissions } = useSubmissions(submissionFilters)

  const filteredUsers = useMemo(() => {
    if (!users) return []
    
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = userFilters.role === 'All' || user.role === userFilters.role.toLowerCase()
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, userFilters])

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handleApprove = async (submission) => {
    try {
      await secureApproveSubmission(submission.id)
      
      toast.success('Submission approved and payment credited')
      refetchSubmissions()
      refetchStats()
    } catch (error) {
      console.error('Approval failed:', error)
      toast.error(error.message || 'Approval failed')
    }
  }

  const handleReject = async (submission) => {
    try {
      await rejectSubmission(submission.id)
      
      await createNotification(
        submission.freelancer_id,
        'task',
        'Submission Rejected',
        `Your submission for ${submission.task?.title || 'the task'} needs revision`
      )
      
      toast.success('Submission rejected')
      refetchSubmissions()
      refetchStats()
    } catch (error) {
      console.error('Rejection failed:', error)
      toast.error('Rejection failed')
    }
  }

  const handleUserAction = (userId, action) => {
    toast.success(`User ${action} successfully!`)
  }

  const getTypeIcon = (type) => {
    const icons = {
      image: Image,
      text: Type,
      audio: Headphones,
      video: Video,
    }
    return icons[type?.toLowerCase()] || Image
  }

  return (
    <div className="min-h-screen lg:pl-64 pt-16">
      <Topbar />

      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">Admin Dashboard</span>
          </h1>
          <p className="text-gray-400">Platform management and analytics</p>
        </div>

        {statsError && <ErrorMessage message={statsError} className="mb-6" />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title="Total Users"
            value={statsLoading ? '...' : stats?.totalUsers?.toString() || '0'}
            icon={Users}
            color="cyan"
            delay={0}
          />
          <StatsCard
            title="Active Tasks"
            value={statsLoading ? '...' : stats?.activeTasks?.toString() || '0'}
            icon={CheckCircle}
            color="purple"
            delay={0.1}
          />
          <StatsCard
            title="Payout Queue"
            value={statsLoading ? '...' : `₹${Math.round(stats?.payoutQueue || 0).toLocaleString()}`}
            subtitle={`${stats?.pendingSubmissionsCount || 0} requests`}
            icon={DollarSign}
            color="orange"
            delay={0.2}
          />
          <StatsCard
            title="Platform Revenue"
            value={statsLoading ? '...' : `₹${Math.round(stats?.platformRevenue || 0).toLocaleString()}`}
            subtitle="this month"
            icon={TrendingUp}
            color="green"
            delay={0.3}
          />
        </div>

        <div className="flex space-x-4 mb-6 border-b border-white/10 overflow-x-auto">
          {['users', 'submissions'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`pb-4 px-4 font-semibold transition-colors whitespace-nowrap ${
                activeSection === section
                  ? 'text-primary-cyan border-b-2 border-primary-cyan'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)} Management
            </button>
          ))}
        </div>

        {activeSection === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold">User Management</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                    />
                  </div>
                  <select
                    value={userFilters.role}
                    onChange={(e) => {
                      setUserFilters({ ...userFilters, role: e.target.value })
                      setCurrentPage(1)
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                  >
                    <option value="All">All Roles</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Company">Company</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              {usersLoading ? (
                <LoadingSpinner className="py-12" />
              ) : usersError ? (
                <ErrorMessage message={usersError} />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">User</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Role</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">XP</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Balance</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-gray-400">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          paginatedUsers.map((user) => (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-cyan to-primary-blue flex items-center justify-center">
                                    <span className="text-white font-bold">
                                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                  </div>
                                  <span className="font-medium">{user.name || 'Unknown User'}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-400 text-sm">{user.email || 'N/A'}</td>
                              <td className="py-3 px-4">
                                <Badge variant={user.role === 'admin' ? 'hard' : 'medium'} size="sm">
                                  {user.role || 'user'}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-gray-300">{user.xp || 0}</td>
                              <td className="py-3 px-4 text-gray-300">₹{(user.balance || 0).toLocaleString()}</td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleUserAction(user.id, 'viewed')}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="View Profile"
                                  >
                                    <Eye size={16} className="text-gray-400" />
                                  </button>
                                  <button
                                    onClick={() => handleUserAction(user.id, 'suspended')}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Suspend"
                                  >
                                    <AlertCircle size={16} className="text-yellow-400" />
                                  </button>
                                  <button
                                    onClick={() => handleUserAction(user.id, 'banned')}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Ban"
                                  >
                                    <Ban size={16} className="text-red-400" />
                                  </button>
                                  <button
                                    onClick={() => handleUserAction(user.id, 'messaged')}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Send Message"
                                  >
                                    <MessageSquare size={16} className="text-primary-cyan" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {filteredUsers.length > itemsPerPage && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`px-3 py-1 rounded-lg transition-colors ${
                                currentPage === i + 1
                                  ? 'bg-primary-cyan text-white'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}

        {activeSection === 'submissions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold">Submission Approval Queue</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={submissionFilters.status}
                    onChange={(e) => setSubmissionFilters({ ...submissionFilters, status: e.target.value })}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {submissionsLoading ? (
                <LoadingSpinner className="py-12" />
              ) : submissionsError ? (
                <ErrorMessage message={submissionsError} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Task</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Freelancer</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Payout</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-400">
                            No {submissionFilters.status} submissions found
                          </td>
                        </tr>
                      ) : (
                        submissions.slice(0, 20).map((submission) => (
                          <tr key={submission.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 font-medium">{submission.task?.title || 'N/A'}</td>
                            <td className="py-3 px-4 text-gray-400">{submission.freelancer?.name || submission.freelancer?.email || 'N/A'}</td>
                            <td className="py-3 px-4 text-gray-300">₹{(submission.task?.payout || 0).toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={
                                  submission.status === 'approved' ? 'easy' : 
                                  submission.status === 'pending' ? 'medium' : 'hard'
                                }
                                size="sm"
                              >
                                {submission.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {submission.status === 'pending' ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleApprove(submission)}
                                    className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                                    title="Approve"
                                  >
                                    <Check size={16} className="text-green-400" />
                                  </button>
                                  <button
                                    onClick={() => handleReject(submission)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Reject"
                                  >
                                    <X size={16} className="text-red-400" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
