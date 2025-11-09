import React from 'react'
import { motion } from 'framer-motion'
import { Clock, DollarSign, FileText, Image, Video, Music, ArrowRight } from 'lucide-react'

const TaskCard = ({ task, onPick }) => {
  const typeIcons = {
    text: FileText,
    image: Image,
    video: Video,
    audio: Music,
  }

  const TypeIcon = typeIcons[task.task_type] || FileText

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card hover:border-primary-cyan/50 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary-cyan/10 rounded-lg">
            <TypeIcon className="text-primary-cyan" size={20} />
          </div>
          <span className="text-xs text-gray-400 uppercase">{task.task_type}</span>
        </div>
        <span className="text-lg font-bold text-primary-cyan">₹{task.payout}</span>
      </div>

      <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <span className="flex items-center space-x-1">
          <Clock size={16} />
          <span>{task.estimated_time_minutes} min</span>
        </span>
        <span className="text-xs">by {task.users?.name || 'Company'}</span>
      </div>

      <button
        onClick={onPick}
        className="btn-primary w-full flex items-center justify-center space-x-2 group"
      >
        <span>Pick Task</span>
        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
      </button>
    </motion.div>
  )
}

export default TaskCard

