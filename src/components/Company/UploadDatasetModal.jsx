import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, FileText, Image, Video, Music } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase, TABLES } from '../../services/supabase'
import toast from 'react-hot-toast'

const UploadDatasetModal = ({ onClose, onSuccess }) => {
  const { userProfile } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    data_type: 'text',
    price: '',
  })
  const [loading, setLoading] = useState(false)

  const dataTypes = [
    { value: 'text', label: 'Text', icon: FileText },
    { value: 'image', label: 'Image', icon: Image },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'audio', label: 'Audio', icon: Music },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from(TABLES.DATASETS)
        .insert([
          {
            creator_id: userProfile.id,
            ...formData,
            price: parseFloat(formData.price),
            downloads: 0,
            rating: 0,
          },
        ])

      if (error) throw error

      toast.success('Dataset uploaded successfully!')
      onSuccess()
    } catch (error) {
      console.error('Error uploading dataset:', error)
      toast.error('Failed to upload dataset')
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
          className="glass rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Upload Dataset</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Data Type</label>
              <div className="grid grid-cols-2 gap-4">
                {dataTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, data_type: type.value })}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                        formData.data_type === type.value
                          ? 'border-primary-cyan bg-primary-cyan/10'
                          : 'border-white/10 hover:border-primary-cyan/50'
                      }`}
                    >
                      <Icon size={24} />
                      <span className="font-semibold">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="e.g., 50K Hindi Movie Reviews"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input min-h-[120px]"
                placeholder="Describe your dataset..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input"
                placeholder="15000"
                min="0"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-dark-bg"></div>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Upload Dataset</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default UploadDatasetModal

