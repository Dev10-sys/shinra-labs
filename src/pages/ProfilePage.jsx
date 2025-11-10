import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Wallet,
  TrendingUp,
  CheckCircle,
  Star,
  Upload,
  Camera,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Award,
  Calendar,
  Target,
  Percent,
  X,
  Check,
  Loader,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Topbar from '../components/Layout/Topbar'
import LoadingSpinner from '../components/Shared/LoadingSpinner'
import toast from 'react-hot-toast'
import { useUserStats } from '../hooks/useSupabaseData'
import { updateUserProfile } from '../services/supabase'

const ProfilePage = () => {
  const { user } = useAuth()
  const { stats, loading, error } = useUserStats()
  const [activeTab, setActiveTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    skills: [],
    languages: [],
  })
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    privacyMode: false,
    language: 'en',
  })

  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    if (stats) {
      setFormData({
        name: stats.name || '',
        email: stats.email || '',
        phone: stats.phone || '',
        bio: stats.bio || '',
        skills: stats.skills || [],
        languages: stats.languages || [],
      })
    }
  }, [stats])

  const handleSave = async () => {
    if (!user?.id) return
    
    try {
      setSaving(true)
      await updateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        skills: formData.skills,
        languages: formData.languages,
      })
      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch (error) {
      console.error('Profile update failed:', error)
      toast.error('Profile update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      })
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="min-h-screen lg:pl-64 pt-16">
      <Topbar />

      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">Profile & Settings</span>
          </h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="flex space-x-4 mb-6 border-b border-white/10 overflow-x-auto">
          {['profile', 'settings', 'verification', 'statistics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-primary-cyan border-b-2 border-primary-cyan'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-cyan to-primary-blue rounded-full flex items-center justify-center text-3xl font-bold">
                      {formData.name.charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-cyan rounded-full flex items-center justify-center hover:bg-primary-blue transition-colors">
                      <Camera size={16} className="text-white" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{formData.name}</h2>
                    <p className="text-gray-400">{formData.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-primary-cyan/20 text-primary-cyan rounded-lg text-sm">
                      {userProfile?.role || 'Freelancer'}
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
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg opacity-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Skills</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 px-3 py-1 bg-primary-cyan/20 text-primary-cyan rounded-lg"
                        >
                          <span className="text-sm">{skill}</span>
                          <button
                            onClick={() => handleRemoveSkill(index)}
                            className="hover:text-white transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Add a skill..."
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                      />
                      <button onClick={handleAddSkill} className="btn-secondary">
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Languages</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button onClick={() => setEditing(false)} className="btn-outline flex-1">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="btn-primary flex-1">
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Bio</h3>
                    <p className="text-gray-300">{formData.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-cyan/20 text-primary-cyan rounded-lg text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <InfoItem icon={Phone} label="Phone" value={formData.phone} />
                    <InfoItem icon={Mail} label="Email" value={formData.email} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-6">Account Settings</h3>

              <div className="space-y-6">
                <SettingToggle
                  icon={Bell}
                  label="Email Notifications"
                  description="Receive email updates about tasks and payments"
                  value={settings.emailNotifications}
                  onChange={(val) => setSettings({ ...settings, emailNotifications: val })}
                />

                <SettingToggle
                  icon={Bell}
                  label="Push Notifications"
                  description="Receive push notifications on your device"
                  value={settings.pushNotifications}
                  onChange={(val) => setSettings({ ...settings, pushNotifications: val })}
                />

                <SettingToggle
                  icon={Shield}
                  label="Privacy Mode"
                  description="Hide your profile from public leaderboards"
                  value={settings.privacyMode}
                  onChange={(val) => setSettings({ ...settings, privacyMode: val })}
                />

                <div>
                  <label className="flex items-center space-x-3 mb-2">
                    <Globe className="text-gray-400" size={20} />
                    <div>
                      <p className="font-medium">Language Preference</p>
                      <p className="text-sm text-gray-400">Choose your preferred language</p>
                    </div>
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full md:w-64 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-cyan"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'verification' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-6">Verification Status</h3>

              <div className="space-y-4">
                <VerificationItem
                  icon={Mail}
                  label="Email Verification"
                  verified={verification.emailVerified}
                  description="Your email is verified"
                />

                <VerificationItem
                  icon={Phone}
                  label="Phone Verification"
                  verified={verification.phoneVerified}
                  description="Your phone number is verified"
                />

                <VerificationItem
                  icon={User}
                  label="ID Verification"
                  verified={verification.idVerified}
                  description="Required for payouts above ₹50,000"
                  action="Verify Now"
                />

                <VerificationItem
                  icon={CreditCard}
                  label="Bank/UPI Details"
                  verified={verification.bankAdded}
                  description="HDFC Bank ****5678"
                  action="Update"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'statistics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard
                    icon={Calendar}
                    label="Member Since"
                    value={stats?.created_at ? new Date(stats.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                    color="cyan"
                  />
                  <StatCard
                    icon={CheckCircle}
                    label="Total Tasks"
                    value={stats?.tasks_completed || 0}
                    color="purple"
                  />
                  <StatCard
                    icon={Star}
                    label="Average Rating"
                    value={`${(stats?.rating || 0).toFixed(1)}/5.0`}
                    color="yellow"
                  />
                  <StatCard
                    icon={Percent}
                    label="XP Points"
                    value={stats?.xp || 0}
                    color="green"
                  />
                  <StatCard
                    icon={Wallet}
                    label="Total Earnings"
                    value={`₹${(stats?.total_earnings || 0).toLocaleString()}`}
                    color="orange"
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Current Balance"
                    value={`₹${(stats?.balance || 0).toLocaleString()}`}
                    color="blue"
                  />
                </div>

                <div className="glass rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold mb-4">Activity Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">Earnings This Month</p>
                        <p className="text-sm text-gray-400">Recent activity</p>
                      </div>
                      <div className="text-2xl font-bold text-green-400">₹{(stats?.monthlyEarnings || 0).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">Total XP</p>
                        <p className="text-sm text-gray-400">Experience points</p>
                      </div>
                      <div className="text-2xl font-bold text-primary-cyan">{stats?.xp || 0}</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">Tasks Completed</p>
                        <p className="text-sm text-gray-400">All time</p>
                      </div>
                      <div className="text-2xl font-bold text-purple-400">{stats?.tasks_completed || 0}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
    <Icon className="text-gray-400" size={20} />
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
)

const SettingToggle = ({ icon: Icon, label, description, value, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
    <div className="flex items-center space-x-3 flex-1">
      <Icon className="text-gray-400" size={20} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-14 h-7 rounded-full transition-colors ${
        value ? 'bg-primary-cyan' : 'bg-gray-600'
      }`}
    >
      <motion.div
        animate={{ x: value ? 28 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 bg-white rounded-full"
      />
    </button>
  </div>
)

const VerificationItem = ({ icon: Icon, label, verified, description, action }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
    <div className="flex items-center space-x-3 flex-1">
      <div
        className={`p-2 rounded-lg ${verified ? 'bg-green-500/20' : 'bg-gray-500/20'}`}
      >
        <Icon className={verified ? 'text-green-400' : 'text-gray-400'} size={20} />
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <p className="font-medium">{label}</p>
          {verified && <Check className="text-green-400" size={16} />}
        </div>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
    {action && !verified && (
      <button className="btn-outline text-sm px-4 py-2">{action}</button>
    )}
    {action && verified && (
      <button className="text-sm text-gray-400 hover:text-white transition-colors">
        {action}
      </button>
    )}
  </div>
)

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorMap = {
    cyan: 'from-cyan-500 to-cyan-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    blue: 'from-blue-500 to-blue-600',
  }

  return (
    <div className="glass rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorMap[color]}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

export default ProfilePage
