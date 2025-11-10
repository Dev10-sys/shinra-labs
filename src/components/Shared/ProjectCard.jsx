import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, TrendingUp, Download, DollarSign, Eye } from 'lucide-react'
import Badge from './Badge'
import ProgressBar from './ProgressBar'

const ProjectCard = ({ 
  project,
  onViewDetails,
  onDownloadData,
  onAddBudget,
}) => {
  const statusVariant = {
    'In Progress': 'info',
    'Completed': 'success',
    'Reviewing': 'warning',
  }

  const getDeadlineColor = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    if (daysLeft < 2) return 'text-red-400'
    if (daysLeft < 7) return 'text-yellow-400'
    return 'text-gray-400'
  }

  const daysLeft = Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="glass rounded-xl p-6 border border-white/10 hover:border-primary-cyan/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">{project.name}</h3>
          <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
        </div>
      </div>

      <ProgressBar 
        progress={project.progress} 
        color="cyan"
        className="mb-4"
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <Users className="text-primary-cyan" size={16} />
          <div>
            <p className="text-gray-400 text-xs">Labelers Active</p>
            <p className="font-semibold">{project.labelersActive}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <TrendingUp className="text-primary-green" size={16} />
          <div>
            <p className="text-gray-400 text-xs">Accuracy</p>
            <p className="font-semibold">{project.accuracy}%</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Calendar className={getDeadlineColor(project.deadline)} size={16} />
          <div>
            <p className="text-gray-400 text-xs">Deadline</p>
            <p className={`font-semibold ${getDeadlineColor(project.deadline)}`}>
              {daysLeft} days left
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <DollarSign className="text-yellow-400" size={16} />
          <div>
            <p className="text-gray-400 text-xs">Budget</p>
            <p className="font-semibold">₹{project.budget.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onViewDetails}
          className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2 text-sm"
        >
          <Eye size={16} />
          <span>View Details</span>
        </button>
        <button
          onClick={onDownloadData}
          className="flex-1 btn-secondary flex items-center justify-center space-x-2 py-2 text-sm"
        >
          <Download size={16} />
          <span>Download</span>
        </button>
        <button
          onClick={onAddBudget}
          className="px-4 py-2 bg-primary-green/20 text-primary-green rounded-lg hover:bg-primary-green/30 transition-colors text-sm font-medium"
        >
          Add Budget
        </button>
      </div>
    </motion.div>
  )
}

export default ProjectCard
