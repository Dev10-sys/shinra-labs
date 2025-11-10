import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, TrendingUp, TrendingDown, Download, X, 
  Search, Filter, Calendar, ArrowUpRight, ArrowDownRight,
  CheckCircle, Clock, XCircle, CreditCard, DollarSign
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

const WalletPage = () => {
  const { userProfile } = useAuth()
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [upiId, setUpiId] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const mockTransactions = [
    { id: 1, date: '2025-11-10', description: 'Completed: Product Image Labeling', amount: 5000, type: 'credit', status: 'completed', balance: 42500 },
    { id: 2, date: '2025-11-09', description: 'Completed: Audio Transcription - Hindi', amount: 8500, type: 'credit', status: 'completed', balance: 37500 },
    { id: 3, date: '2025-11-09', description: 'Withdrawal to UPI', amount: -10000, type: 'debit', status: 'completed', balance: 29000 },
    { id: 4, date: '2025-11-08', description: 'Completed: Sentiment Analysis Training', amount: 12000, type: 'credit', status: 'completed', balance: 39000 },
    { id: 5, date: '2025-11-07', description: 'Completed: Video Content Moderation', amount: 15000, type: 'credit', status: 'pending', balance: 27000 },
    { id: 6, date: '2025-11-07', description: 'Completed: News Article Classification', amount: 4500, type: 'credit', status: 'completed', balance: 12000 },
    { id: 7, date: '2025-11-06', description: 'Completed: Customer Review Sentiment', amount: 7200, type: 'credit', status: 'completed', balance: 7500 },
    { id: 8, date: '2025-11-05', description: 'Withdrawal to UPI', amount: -5000, type: 'debit', status: 'completed', balance: 300 },
    { id: 9, date: '2025-11-05', description: 'Completed: Voice Command Recognition', amount: 9500, type: 'credit', status: 'completed', balance: 5300 },
    { id: 10, date: '2025-11-04', description: 'Completed: Medical Image Annotation', amount: 18000, type: 'credit', status: 'pending', balance: -4200 },
    { id: 11, date: '2025-11-03', description: 'Completed: Social Media Post Tagging', amount: 3500, type: 'credit', status: 'completed', balance: -22200 },
    { id: 12, date: '2025-11-02', description: 'Completed: Traffic Sign Detection', amount: 11000, type: 'credit', status: 'completed', balance: -25700 },
    { id: 13, date: '2025-11-01', description: 'Completed: Podcast Transcription', amount: 13000, type: 'credit', status: 'completed', balance: -36700 },
    { id: 14, date: '2025-10-31', description: 'Withdrawal to UPI', amount: -8000, type: 'debit', status: 'completed', balance: -49700 },
    { id: 15, date: '2025-10-30', description: 'Completed: Fashion Item Classification', amount: 5500, type: 'credit', status: 'completed', balance: -41700 },
    { id: 16, date: '2025-10-29', description: 'Completed: YouTube Video Summarization', amount: 16500, type: 'credit', status: 'pending', balance: -47200 },
    { id: 17, date: '2025-10-28', description: 'Completed: Product Review Analysis', amount: 6800, type: 'credit', status: 'completed', balance: -63700 },
    { id: 18, date: '2025-10-27', description: 'Completed: E-commerce Categorization', amount: 6000, type: 'credit', status: 'completed', balance: -70500 },
    { id: 19, date: '2025-10-26', description: 'Bonus: Referral Reward', amount: 2000, type: 'credit', status: 'completed', balance: -76500 },
    { id: 20, date: '2025-10-25', description: 'Completed: Customer Feedback Analysis', amount: 4200, type: 'credit', status: 'completed', balance: -78500 },
    { id: 21, date: '2025-10-24', description: 'Withdrawal to UPI', amount: -3000, type: 'debit', status: 'completed', balance: -82700 },
    { id: 22, date: '2025-10-23', description: 'Completed: Image Quality Check', amount: 3800, type: 'credit', status: 'completed', balance: -79700 },
    { id: 23, date: '2025-10-22', description: 'Completed: Data Validation Task', amount: 5200, type: 'credit', status: 'completed', balance: -83500 },
    { id: 24, date: '2025-10-21', description: 'Completed: Text Classification Batch', amount: 7500, type: 'credit', status: 'completed', balance: -88700 },
    { id: 25, date: '2025-10-20', description: 'Completed: Audio Labeling Task', amount: 8900, type: 'credit', status: 'pending', balance: -96200 },
    { id: 26, date: '2025-10-19', description: 'Completed: Object Detection Training', amount: 14000, type: 'credit', status: 'completed', balance: -105100 },
    { id: 27, date: '2025-10-18', description: 'Completed: Document Classification', amount: 5600, type: 'credit', status: 'completed', balance: -119100 },
    { id: 28, date: '2025-10-17', description: 'Withdrawal to UPI', amount: -6500, type: 'debit', status: 'completed', balance: -124700 },
    { id: 29, date: '2025-10-16', description: 'Completed: Multilingual Text Tagging', amount: 9200, type: 'credit', status: 'completed', balance: -118200 },
    { id: 30, date: '2025-10-15', description: 'Completed: Video Frame Annotation', amount: 12500, type: 'credit', status: 'completed', balance: -127400 }
  ]

  const walletStats = {
    available: 4250,
    pending: 850,
    totalEarned: 153400
  }

  const filteredTransactions = mockTransactions.filter(tx => {
    if (filterType === 'credits' && tx.type !== 'credit') return false
    if (filterType === 'debits' && tx.type !== 'debit') return false
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

  const handleWithdraw = () => {
    if (otp !== '123456') {
      toast.error('Invalid OTP')
      return
    }

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
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Description</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Amount</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm text-gray-400">{tx.date}</td>
                    <td className="py-4 px-4 text-sm">{tx.description}</td>
                    <td className={`py-4 px-4 text-sm text-right font-semibold ${
                      tx.type === 'credit' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <div className="flex items-center justify-end space-x-1">
                        {tx.type === 'credit' ? (
                          <ArrowDownRight size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                        <span>{tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}</span>
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
                    <td className="py-4 px-4 text-sm text-right font-mono">₹{tx.balance.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
                      className="btn-primary w-full"
                    >
                      Confirm Withdrawal
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
