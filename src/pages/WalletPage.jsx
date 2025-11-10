import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, TrendingUp, TrendingDown, Download, X, 
  Search, Filter, Calendar, ArrowUpRight, ArrowDownRight,
  CheckCircle, Clock, XCircle, CreditCard, DollarSign
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTransactions, useUserStats } from '../hooks/useSupabaseData'
import { secureWithdrawal, createNotification } from '../services/supabase'
import LoadingSpinner from '../components/Shared/LoadingSpinner'
import ErrorMessage from '../components/Shared/ErrorMessage'
import EmptyState from '../components/Shared/EmptyState'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

const WalletPage = () => {
  const { user, userProfile } = useAuth()
  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactions()
  const { stats, loading: statsLoading, error: statsError } = useUserStats()
  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [upiId, setUpiId] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)

  const walletStats = {
    available: stats?.balance || 0,
    pending: stats?.pending_earnings || 0,
    totalEarned: stats?.total_earned || 0
  }

  const filteredTransactions = (transactions || []).filter(tx => {
    if (filterType === 'credits' && tx.type !== 'earning' && tx.type !== 'credit') return false
    if (filterType === 'debits' && tx.type !== 'withdrawal' && tx.type !== 'purchase' && tx.type !== 'debit') return false
    if (filterType === 'pending' && tx.status !== 'pending') return false
    if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleSendOTP = () => {
    if (!upiId || !withdrawAmount) {
      toast.error('Please fill in all fields')
      return
    }
    
    const amount = parseFloat(withdrawAmount)
    if (amount < 100 || amount > walletStats.available) {
      toast.error(`Amount must be between ₹100 and ₹${walletStats.available}`)
      return
    }

    setOtpSent(true)
    toast.success('OTP sent to your registered mobile number')
  }

  const handleWithdraw = async () => {
    if (otp !== '123456') {
      toast.error('Invalid OTP')
      return
    }

    try {
      setWithdrawing(true)
      const amount = parseFloat(withdrawAmount)
      
      await secureWithdrawal(user.id, amount, `Withdrawal to ${upiId}`)
      
      await createNotification(
        user.id,
        'payment',
        'Withdrawal Initiated',
        `₹${amount.toLocaleString()} withdrawal is being processed`
      )

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      toast.success('Withdrawal request submitted!')
      setShowWithdrawModal(false)
      setWithdrawAmount('')
      setUpiId('')
      setOtp('')
      setOtpSent(false)
      
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      console.error('Error processing withdrawal:', err)
      toast.error(err.message || 'Failed to process withdrawal. Please try again.')
    } finally {
      setWithdrawing(false)
    }
  }

  const exportToCSV = () => {
    const csv = [
      ['Date', 'Description', 'Amount', 'Status', 'Balance'],
      ...filteredTransactions.map(tx => [
        tx.date,
        tx.description,
        tx.amount,
        tx.status,
        tx.balance
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Transactions exported')
  }

  const loading = transactionsLoading || statsLoading
  const error = transactionsError || statsError

  if (loading) {
    return (
      <div className="min-h-screen lg:pl-64 pt-16 bg-bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading wallet data..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen lg:pl-64 pt-16 bg-bg-primary p-4 lg:p-8">
        <ErrorMessage
          title="Failed to Load Wallet Data"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:pl-64 pt-16 bg-bg-primary">
      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center space-x-3">
            <Wallet className="text-primary-cyan" size={32} />
            <span>My Wallet</span>
          </h1>
          <p className="text-gray-400">Manage your earnings and withdrawals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-cyan/20 rounded-lg">
                <Wallet size={24} className="text-primary-cyan" />
              </div>
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp size={16} />
                <span className="text-sm">+12.5%</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-primary-cyan">₹{walletStats.available.toLocaleString()}</p>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="btn-primary w-full mt-4"
            >
              Withdraw to UPI
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-400/20 rounded-lg">
                <Clock size={24} className="text-yellow-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">₹{walletStats.pending.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">Being verified</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-green/20 rounded-lg">
                <TrendingUp size={24} className="text-primary-green" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Earned</p>
            <p className="text-3xl font-bold text-primary-green">₹{walletStats.totalEarned.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">All time earnings</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <button
              onClick={exportToCSV}
              className="btn-outline flex items-center space-x-2"
            >
              <Download size={18} />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="input pl-10"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === 'all'
                    ? 'bg-primary-cyan/20 text-primary-cyan'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('credits')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === 'credits'
                    ? 'bg-green-400/20 text-green-400'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                Credits
              </button>
              <button
                onClick={() => setFilterType('debits')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === 'debits'
                    ? 'bg-red-400/20 text-red-400'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                Debits
              </button>
              <button
                onClick={() => setFilterType('pending')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === 'pending'
                    ? 'bg-yellow-400/20 text-yellow-400'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredTransactions.length === 0 ? (
              <EmptyState
                title="No Transactions Found"
                message={searchQuery || filterType !== 'all' 
                  ? "No transactions match your filters. Try adjusting your search criteria."
                  : "You haven't made any transactions yet. Start completing tasks to earn!"}
                icon="list"
                variant="default"
              />
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Description</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Amount</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx, index) => {
                    const isCredit = tx.type === 'earning' || tx.type === 'credit' || tx.amount > 0
                    const formattedDate = new Date(tx.created_at || tx.date).toLocaleDateString()
                    
                    return (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-sm text-gray-400">{formattedDate}</td>
                        <td className="py-4 px-4 text-sm">{tx.description}</td>
                        <td className={`py-4 px-4 text-sm text-right font-semibold ${
                          isCredit ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <div className="flex items-center justify-end space-x-1">
                            {isCredit ? (
                              <ArrowDownRight size={16} />
                            ) : (
                              <ArrowUpRight size={16} />
                            )}
                            <span>{isCredit ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'completed'
                              ? 'bg-green-400/20 text-green-400'
                              : tx.status === 'pending'
                              ? 'bg-yellow-400/20 text-yellow-400'
                              : 'bg-red-400/20 text-red-400'
                          }`}>
                            {tx.status === 'completed' && <CheckCircle size={12} />}
                            {tx.status === 'pending' && <Clock size={12} />}
                            {tx.status === 'failed' && <XCircle size={12} />}
                            <span className="capitalize">{tx.status}</span>
                          </span>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWithdrawModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-8 border border-white/10 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <CreditCard className="text-primary-cyan" size={28} />
                  <span>Withdraw Funds</span>
                </h2>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="input"
                    disabled={otpSent}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="input pl-10"
                      disabled={otpSent}
                      min="100"
                      max={walletStats.available}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Min: ₹100 | Max: ₹{walletStats.available.toLocaleString()}
                  </p>
                </div>

                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-sm font-medium mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="input"
                      maxLength="6"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      OTP sent to your registered mobile number (Use: 123456 for demo)
                    </p>
                  </motion.div>
                )}

                <div className="pt-4">
                  {!otpSent ? (
                    <button
                      onClick={handleSendOTP}
                      className="btn-primary w-full"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <button
                      onClick={handleWithdraw}
                      disabled={withdrawing}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {withdrawing ? 'Processing...' : 'Confirm Withdrawal'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WalletPage
