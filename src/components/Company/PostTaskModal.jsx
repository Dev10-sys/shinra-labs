import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase, TABLES } from '../../services/supabase'
import toast from 'react-hot-toast'

const PostTaskModal = ({ onClose, onSuccess }) => {
  const { userProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    task_type: 'text',
    payout: '',
    estimated_time_minutes: '',
  })
  const [loading, setLoading] = useState(false)

  const taskTypes = [
    { value: 'text', label: 'Text Annotation', icon: '📝' },
    { value: 'image', label: 'Image Annotation', icon: '🖼️' },
    { value: 'video', label: 'Video Annotation', icon: '🎥' },
    { value: 'audio', label: 'Audio Annotation', icon: '🎵' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from(TABLES.TASKS)
        .insert([
          {
            company_id: userProfile.id,
            ...formData,
            payout: parseFloat(formData.payout),
            estimated_time_minutes: parseInt(formData.estimated_time_minutes),
            status: 'open',
          },
        ])

      if (error) throw error

      toast.success('Task posted successfully!')
      onSuccess()
    } catch (error) {
      console.error('Error posting task:', error)
      toast.error('Failed to post task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Post New Task</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Step {step} of 2</span>
              <span className="text-sm text-gray-400">{Math.round((step / 2) * 100)}%</span>
            </div>
            <div className="w-full bg-dark-card/50 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(step / 2) * 100}%` }}
                className="bg-primary-cyan h-2 rounded-full"
              />
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Task Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {taskTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, task_type: type.value })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.task_type === type.value
                          ? 'border-primary-cyan bg-primary-cyan/10'
                          : 'border-white/10 hover:border-primary-cyan/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-semibold">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="e.g., Label 500 Hindi Sentiment Tweets"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[120px]"
                  placeholder="Describe the task requirements..."
                  required
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.description}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Payout (₹)</label>
                <input
                  type="number"
                  value={formData.payout}
                  onChange={(e) => setFormData({ ...formData, payout: e.target.value })}
                  className="input"
                  placeholder="50"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Time (minutes)</label>
                <input
                  type="number"
                  value={formData.estimated_time_minutes}
                  onChange={(e) => setFormData({ ...formData, estimated_time_minutes: e.target.value })}
                  className="input"
                  placeholder="20"
                  min="1"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.payout || !formData.estimated_time_minutes}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-dark-bg"></div>
                  ) : (
                    <>
                      <span>Post Task</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default PostTaskModal

