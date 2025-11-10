import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
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
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Topbar from '../components/Layout/Topbar'
import StatsCard from '../components/Dashboard/StatsCard'
import Badge from '../components/Shared/Badge'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [userFilters, setUserFilters] = useState({
    role: 'All',
    status: 'All',
  })
  const [taskFilters, setTaskFilters] = useState({
    status: 'Pending',
    type: 'All',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const mockUsers = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['freelancer', 'company', 'admin'][Math.floor(Math.random() * 3)],
    tasks: Math.floor(Math.random() * 150),
    earnings: Math.floor(Math.random() * 100000),
    status: ['active', 'suspended', 'banned'][Math.floor(Math.random() * 3)],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
  }))

  const mockTasks = Array.from({ length: 30 }, (_, i) => ({
    id: `TASK-${1000 + i}`,
    title: `Task ${i + 1} - ${['Image Labeling', 'Text Classification', 'Audio Transcription', 'Video Annotation'][Math.floor(Math.random() * 4)]}`,
    company: `Company ${Math.floor(Math.random() * 20) + 1}`,
    type: ['Image', 'Text', 'Audio', 'Video'][Math.floor(Math.random() * 4)],
    budget: Math.floor(Math.random() * 50000) + 5000,
    status: ['Pending', 'Approved', 'Rejected'][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }))

  const analyticsData = {
    dailyActiveUsers: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      users: Math.floor(Math.random() * 500) + 300,
    })),
    taskCompletionRate: Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      rate: Math.floor(Math.random() * 30) + 70,
    })),
    revenueGrowth: Array.from({ length: 6 }, (_, i) => ({
      month: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'][i],
      revenue: Math.floor(Math.random() * 100000) + 150000,
    })),
    topCategories: [
      { category: 'Image', value: 35, color: 'from-cyan-500 to-cyan-600' },
      { category: 'Text', value: 30, color: 'from-purple-500 to-purple-600' },
      { category: 'Audio', value: 20, color: 'from-green-500 to-green-600' },
      { category: 'Video', value: 15, color: 'from-orange-500 to-orange-600' },
    ],
  }

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = userFilters.role === 'All' || user.role === userFilters.role.toLowerCase()
    const matchesStatus = userFilters.status === 'All' || user.status === userFilters.status.toLowerCase()
    return matchesSearch && matchesRole && matchesStatus
  })

  const filteredTasks = mockTasks.filter((task) => {
    const matchesStatus = taskFilters.status === 'All' || task.status === taskFilters.status
    const matchesType = taskFilters.type === 'All' || task.type === taskFilters.type
    return matchesStatus && matchesType
  })

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handleUserAction = (userId, action) => {
    toast.success(`User ${action} successfully!`)
  }

  const handleTaskAction = (taskId, action) => {
    toast.success(`Task ${action} successfully!`)
  }

  const getTypeIcon = (type) => {
    const icons = {
      Image: Image,
      Text: Type,
      Audio: Headphones,
      Video: Video,
    }
    return icons[type] || Image
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title="Total Users"
            value="842"
            trend={{ value: 45, unit: '', label: 'this week' }}
            icon={Users}
            color="cyan"
            delay={0}
          />
          <StatsCard
            title="Active Tasks"
            value="245"
            trend={{ value: 12, unit: '', label: 'today' }}
            icon={CheckCircle}
            color="purple"
            delay={0.1}
          />
          <StatsCard
            title="Payout Queue"
            value="₹45,200"
            subtitle="34 requests"
            icon={DollarSign}
            color="orange"
            delay={0.2}
          />
          <StatsCard
            title="Platform Revenue"
            value="₹2.5L"
            trend={{ value: 18, label: 'this month' }}
            icon={TrendingUp}
            color="green"
            delay={0.3}
          />
        </div>

        <div className="flex space-x-4 mb-6 border-b border-white/10 overflow-x-auto">
          {['users', 'tasks', 'analytics'].map((section) => (
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                    />
                  </div>
                  <select
                    value={userFilters.role}
                    onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                  >
                    <option value="All">All Roles</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Company">Company</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <select
                    value={userFilters.status}
                    onChange={(e) => setUserFilters({ ...userFilters, status: e.target.value })}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Banned">Banned</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">User</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Tasks</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Earnings</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-cyan to-primary-blue flex items-center justify-center">
                              <span className="text-white font-bold">{user.name.charAt(0)}</span>
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">{user.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant={user.role === 'admin' ? 'hard' : 'medium'} size="sm">
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{user.tasks}</td>
                        <td className="py-3 px-4 text-gray-300">₹{user.earnings.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              user.status === 'active' ? 'easy' : user.status === 'suspended' ? 'medium' : 'hard'
                            }
                            size="sm"
                          >
                            {user.status}
                          </Badge>
                        </td>
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
                    ))}
                  </tbody>
                </table>
              </div>

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
            </div>
          </motion.div>
        )}

        {activeSection === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold">Task Approval Queue</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={taskFilters.status}
                    onChange={(e) => setTaskFilters({ ...taskFilters, status: e.target.value })}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <select
                    value={taskFilters.type}
                    onChange={(e) => setTaskFilters({ ...taskFilters, type: e.target.value })}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                  >
                    <option value="All">All Types</option>
                    <option value="Image">Image</option>
                    <option value="Text">Text</option>
                    <option value="Audio">Audio</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Task ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Company</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Budget</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.slice(0, 10).map((task) => {
                      const TypeIcon = getTypeIcon(task.type)
                      return (
                        <tr key={task.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-mono text-sm text-gray-400">{task.id}</td>
                          <td className="py-3 px-4 font-medium">{task.title}</td>
                          <td className="py-3 px-4 text-gray-400">{task.company}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <TypeIcon size={16} className="text-gray-400" />
                              <span className="text-sm">{task.type}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-300">₹{task.budget.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                task.status === 'Approved' ? 'easy' : task.status === 'Pending' ? 'medium' : 'hard'
                              }
                              size="sm"
                            >
                              {task.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleTaskAction(task.id, 'approved')}
                                className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <Check size={16} className="text-green-400" />
                              </button>
                              <button
                                onClick={() => handleTaskAction(task.id, 'rejected')}
                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <X size={16} className="text-red-400" />
                              </button>
                              <button
                                onClick={() => handleTaskAction(task.id, 'changes requested')}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Request Changes"
                              >
                                <AlertCircle size={16} className="text-yellow-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4">Daily Active Users (Last 30 Days)</h3>
                <div className="h-64 flex items-end justify-between gap-1">
                  {analyticsData.dailyActiveUsers.map((data, i) => {
                    const max = Math.max(...analyticsData.dailyActiveUsers.map((d) => d.users))
                    const height = (data.users / max) * 100
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full relative group">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: i * 0.02 }}
                            className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg min-h-[10px]"
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-card px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                              {data.users}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4">Revenue Growth (Monthly)</h3>
                <div className="h-64 flex items-end justify-between gap-3">
                  {analyticsData.revenueGrowth.map((data, i) => {
                    const max = Math.max(...analyticsData.revenueGrowth.map((d) => d.revenue))
                    const height = (data.revenue / max) * 100
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full relative group">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg min-h-[20px]"
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-card px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                              ₹{(data.revenue / 1000).toFixed(0)}K
                            </div>
                          </motion.div>
                        </div>
                        <span className="text-xs text-gray-400">{data.month}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4">Task Completion Rate</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analyticsData.taskCompletionRate.map((data, i) => {
                    const height = data.rate
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full relative group">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg min-h-[20px]"
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-card px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                              {data.rate}%
                            </div>
                          </motion.div>
                        </div>
                        <span className="text-xs text-gray-400">{data.month.slice(0, 3)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4">Top Categories</h3>
                <div className="space-y-4">
                  {analyticsData.topCategories.map((category, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{category.category}</span>
                        <span className="text-sm text-gray-400">{category.value}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${category.value}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
