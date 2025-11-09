import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Briefcase, Wallet, TrendingUp, CheckCircle, Star, Upload } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Topbar from '../components/Layout/Topbar'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { userProfile, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
  })

  const handleSave = async () => {
    try {
      await updateProfile(formData)
      setEditing(false)
    } catch (error) {
      // Error handled in context
    }
  }

  return (
    <div className="min-h-screen lg:pl-64 pt-16">
      <Topbar />
      
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-cyan to-primary-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-3xl">
                  {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{userProfile?.name || 'User'}</h1>
                <p className="text-gray-400">{userProfile?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-primary-cyan/20 text-primary-cyan rounded text-sm">
                  {userProfile?.role || 'user'}
                </span>
              </div>
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-outline">
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="input opacity-50"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setEditing(false)} className="btn-outline flex-1">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-primary flex-1">
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatItem icon={Wallet} label="Balance" value={`₹${(userProfile?.balance || 0).toLocaleString()}`} />
              <StatItem icon={TrendingUp} label="Total Earned" value={`₹${(userProfile?.total_earned || 0).toLocaleString()}`} />
              <StatItem icon={CheckCircle} label="Tasks Completed" value={userProfile?.tasks_completed || 0} />
              <StatItem icon={Star} label="Rating" value={userProfile?.rating?.toFixed(1) || '0.0'} />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-4">Account Information</h2>
          <div className="space-y-3">
            <InfoItem icon={Mail} label="Email" value={userProfile?.email} />
            <InfoItem icon={Briefcase} label="Role" value={userProfile?.role} />
            <InfoItem icon={User} label="Member Since" value={new Date(userProfile?.created_at).toLocaleDateString()} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
    <div className="p-2 bg-primary-cyan/10 rounded-lg">
      <Icon className="text-primary-cyan" size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  </div>
)

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <Icon className="text-gray-400" size={20} />
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
)

export default ProfilePage

