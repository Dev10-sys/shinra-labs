import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Shield, ArrowRight, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const PhoneAuthModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const { signInWithPhone, verifyPhoneOTP } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setPhoneNumber('')
      setOtp('')
      setResendTimer(0)
    }
  }, [isOpen])

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(number)
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    try {
      const fullPhone = `${countryCode}${phoneNumber}`
      await signInWithPhone(fullPhone)
      setStep(2)
      setResendTimer(30)
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const fullPhone = `${countryCode}${phoneNumber}`
      await verifyPhoneOTP(fullPhone, otp)
      onClose()
      navigate('/dashboard')
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return

    setLoading(true)
    try {
      const fullPhone = `${countryCode}${phoneNumber}`
      await signInWithPhone(fullPhone)
      setResendTimer(30)
      setOtp('')
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false)
    }
  }

  const handleBackToPhone = () => {
    setStep(1)
    setOtp('')
    setResendTimer(0)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {step === 1 ? 'Phone Authentication' : 'Verify OTP'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

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
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-cyan/10 rounded-full mb-3">
                    <Phone className="text-primary-cyan" size={32} />
                  </div>
                  <p className="text-gray-400 text-sm">
                    Enter your phone number to receive a one-time password
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="flex space-x-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="input w-24"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+86">+86</option>
                      <option value="+81">+81</option>
                    </select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="input pl-10"
                        placeholder="9876543210"
                        required
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter 10-digit mobile number without country code
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || phoneNumber.length !== 10}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-dark-bg"></div>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-cyan/10 rounded-full mb-3">
                    <Shield className="text-primary-cyan" size={32} />
                  </div>
                  <p className="text-gray-400 text-sm">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="text-white font-medium mt-1">
                    {countryCode} {phoneNumber}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">OTP Code</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="input pl-10 text-center text-2xl tracking-widest font-mono"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0 || loading}
                    className="text-primary-cyan hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-not-allowed"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToPhone}
                    className="text-gray-400 hover:text-white flex items-center space-x-1"
                  >
                    <ArrowLeft size={16} />
                    <span>Change number</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-dark-bg"></div>
                  ) : (
                    <>
                      <span>Verify & Sign In</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 p-4 bg-primary-cyan/10 rounded-lg border border-primary-cyan/20">
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-primary-cyan">Note:</span> SMS charges may apply. 
                Your phone number will be used for authentication only.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default PhoneAuthModal
