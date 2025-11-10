import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Briefcase, UserCircle, GraduationCap, Phone } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import PhoneAuthModal from '../components/Auth/PhoneAuthModal'

const SignupPage = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const roles = [
    { value: 'freelancer', label: t('auth.freelancer'), icon: UserCircle, description: 'Complete tasks and earn money' },
    { value: 'company', label: t('auth.company'), icon: Briefcase, description: 'Post tasks and buy datasets' },
    { value: 'researcher', label: t('auth.researcher'), icon: GraduationCap, description: 'Access research datasets' },
  ]

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role })
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.role) {
      toast.error('Please select a role')
      return
    }

    setLoading(true)
    try {
      await signUp(formData.email, formData.password, formData.name, formData.role)
      navigate('/dashboard')
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-cyan to-primary-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-gradient">SHINRA LABS</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">{t('auth.signUp')}</h1>
            <p className="text-gray-400">Join the decentralized AI workforce</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
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
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('auth.selectRole')}</h2>
              <div className="space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon
                  return (
                    <motion.button
                      key={role.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleSelect(role.value)}
                      className="w-full p-4 glass rounded-lg text-left hover:bg-white/5 transition-all border border-white/10 hover:border-primary-cyan/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary-cyan/10 rounded-lg">
                          <Icon className="text-primary-cyan" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{role.label}</h3>
                          <p className="text-sm text-gray-400">{role.description}</p>
                        </div>
                        <ArrowRight className="text-gray-400" size={20} />
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-dark-card text-gray-400">OR</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition-all border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Sign up with Google</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsPhoneModalOpen(true)}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 glass hover:bg-white/5 text-white font-medium rounded-lg transition-all border border-primary-cyan/50 hover:border-primary-cyan disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Phone size={20} className="text-primary-cyan" />
                  <span>Sign up with Phone</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t('common.name')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input pl-10"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('common.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('common.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input pl-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1"
                >
                  Back
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
                      <span>{t('auth.signUp')}</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="text-primary-cyan hover:underline">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <PhoneAuthModal isOpen={isPhoneModalOpen} onClose={() => setIsPhoneModalOpen(false)} />
    </div>
  )
}

export default SignupPage

