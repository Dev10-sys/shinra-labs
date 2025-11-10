import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, CheckCircle, SkipForward, Save, FileText, Tag, 
  Smile, Frown, Meh, TrendingUp, Clock, Info
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

const TextAnnotationPage = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { userProfile } = useAuth()

  const [currentText, setCurrentText] = useState(0)
  const [totalTexts] = useState(150)
  const [selectedSentiment, setSelectedSentiment] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [confidence, setConfidence] = useState(75)
  const [notes, setNotes] = useState('')
  const [timeSpent, setTimeSpent] = useState(0)

  const sampleTexts = [
    "This product exceeded my expectations! The quality is outstanding and delivery was super fast. Highly recommend to anyone looking for reliable electronics.",
    "Terrible experience. The item arrived damaged and customer service was unhelpful. Would not buy from this seller again.",
    "The laptop works fine but nothing special. Battery life could be better. Decent for the price.",
    "Amazing service! The team went above and beyond to help me. Will definitely be a returning customer.",
    "Not worth the money. Found better alternatives at lower prices elsewhere. Disappointed with this purchase."
  ]

  const sentiments = [
    { id: 'positive', label: 'Positive', icon: Smile, color: 'text-green-400', bg: 'bg-green-400/20', border: 'border-green-400' },
    { id: 'negative', label: 'Negative', icon: Frown, color: 'text-red-400', bg: 'bg-red-400/20', border: 'border-red-400' },
    { id: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-400', bg: 'bg-gray-400/20', border: 'border-gray-400' }
  ]

  const categories = [
    { id: 'sports', label: 'Sports', color: '#10B981' },
    { id: 'politics', label: 'Politics', color: '#FF006E' },
    { id: 'technology', label: 'Technology', color: '#00D9FF' },
    { id: 'entertainment', label: 'Entertainment', color: '#FFBE0B' },
    { id: 'business', label: 'Business', color: '#8B5CF6' },
    { id: 'health', label: 'Health', color: '#06B6D4' },
    { id: 'science', label: 'Science', color: '#EC4899' },
    { id: 'education', label: 'Education', color: '#14B8A6' },
    { id: 'food', label: 'Food & Dining', color: '#F59E0B' }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '1' && e.key <= '3') {
        const index = parseInt(e.key) - 1
        setSelectedSentiment(sentiments[index].id)
      } else if (e.key >= '4' && e.key <= '9') {
        const index = parseInt(e.key) - 4
        if (categories[index]) {
          toggleCategory(categories[index].id)
        }
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        handleSaveDraft()
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        handleSubmitAndNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedSentiment, selectedCategories, confidence, notes])

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSkip = () => {
    if (currentText < totalTexts - 1) {
      setCurrentText(prev => prev + 1)
      resetForm()
      toast.info('Skipped to next text')
    }
  }

  const handleSaveDraft = () => {
    localStorage.setItem(`text_task_${taskId}_progress`, JSON.stringify({
      currentText,
      selectedSentiment,
      selectedCategories,
      confidence,
      notes,
      timeSpent
    }))
    toast.success('Draft saved')
  }

  const handleSubmitAndNext = () => {
    if (!selectedSentiment) {
      toast.error('Please select a sentiment')
      return
    }

    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category')
      return
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    })

    toast.success('Classification submitted!')

    if (currentText < totalTexts - 1) {
      setCurrentText(prev => prev + 1)
      resetForm()
    } else {
      toast.success('Task completed!')
      navigate('/dashboard')
    }
  }

  const resetForm = () => {
    setSelectedSentiment(null)
    setSelectedCategories([])
    setConfidence(75)
    setNotes('')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Text Sentiment Classification</h1>
            <p className="text-gray-400 mt-1">Classify customer reviews and feedback</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock size={18} />
              <span className="font-mono">{formatTime(timeSpent)}</span>
            </div>
            <span className="text-2xl font-bold text-primary-cyan">₹4,500</span>
          </div>
        </div>

        <div className="mb-6 p-4 glass rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-bold text-primary-cyan">
              {currentText + 1} / {totalTexts}
            </span>
          </div>
          <div className="w-full bg-dark-card rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-cyan to-primary-purple h-2 rounded-full transition-all"
              style={{ width: `${((currentText + 1) / totalTexts) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center space-x-2">
                  <FileText size={20} className="text-primary-cyan" />
                  <span>Text Passage</span>
                </h2>
                <span className="text-sm text-gray-400">Text #{currentText + 1}</span>
              </div>
              <div className="bg-dark-card/50 rounded-lg p-6 min-h-[200px]">
                <p className="text-lg leading-relaxed">
                  {sampleTexts[currentText % sampleTexts.length]}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Tag size={20} className="text-primary-cyan" />
                <span>Sentiment Analysis</span>
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {sentiments.map((sentiment, index) => {
                  const Icon = sentiment.icon
                  const isSelected = selectedSentiment === sentiment.id
                  return (
                    <button
                      key={sentiment.id}
                      onClick={() => setSelectedSentiment(sentiment.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `${sentiment.bg} ${sentiment.border}`
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Icon
                        size={32}
                        className={`mx-auto mb-3 ${isSelected ? sentiment.color : 'text-gray-400'}`}
                      />
                      <div className="text-center">
                        <p className="font-semibold mb-1">{sentiment.label}</p>
                        <p className="text-xs text-gray-400">Press {index + 1}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold mb-4">Categories (Multi-select)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category, index) => {
                  const isSelected = selectedCategories.includes(category.id)
                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'bg-white/10 border-white/30'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-sm">{category.label}</span>
                      </div>
                      <p className="text-xs text-gray-400">Press {index + 4}</p>
                    </button>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <TrendingUp size={20} className="text-primary-cyan" />
                  <span>Confidence Level</span>
                </h3>
                <span className="text-2xl font-bold text-primary-cyan">{confidence}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #00D9FF 0%, #00D9FF ${confidence}%, rgba(255,255,255,0.1) ${confidence}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Not Sure</span>
                <span>Very Confident</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <FileText size={20} className="text-primary-cyan" />
                <span>Additional Notes</span>
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any observations or notes about this text..."
                className="input min-h-[100px] resize-none"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col space-y-3"
            >
              <button
                onClick={handleSubmitAndNext}
                className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
              >
                <CheckCircle size={20} />
                <span>Submit & Next</span>
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSaveDraft}
                  className="btn-outline flex items-center justify-center space-x-2 py-2"
                >
                  <Save size={18} />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handleSkip}
                  className="btn-secondary flex items-center justify-center space-x-2 py-2"
                >
                  <SkipForward size={18} />
                  <span>Skip</span>
                </button>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10 sticky top-4"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Info size={20} className="text-primary-cyan" />
                <span>Instructions</span>
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="text-primary-cyan font-bold">1.</span>
                  <p>Read the text passage carefully</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary-cyan font-bold">2.</span>
                  <p>Select the overall sentiment (Positive/Negative/Neutral)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary-cyan font-bold">3.</span>
                  <p>Choose all relevant categories that apply</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary-cyan font-bold">4.</span>
                  <p>Adjust confidence slider based on how sure you are</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary-cyan font-bold">5.</span>
                  <p>Add notes for ambiguous or complex texts</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary-cyan/10 rounded-lg border border-primary-cyan/20">
                <h4 className="text-sm font-semibold mb-3">Keyboard Shortcuts</h4>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>Positive</span>
                    <kbd className="px-2 py-1 bg-white/5 rounded">1</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Negative</span>
                    <kbd className="px-2 py-1 bg-white/5 rounded">2</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Neutral</span>
                    <kbd className="px-2 py-1 bg-white/5 rounded">3</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Categories</span>
                    <kbd className="px-2 py-1 bg-white/5 rounded">4-9</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Save Draft</span>
                    <kbd className="px-2 py-1 bg-white/5 rounded">S</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Submit & Next</span>
                    <kbd className="px-2 py-1 bg-white/5 rounded">N</kbd>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-dark-card/50 rounded-lg">
                <h4 className="text-sm font-semibold mb-3">Current Selection</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Sentiment:</span>
                    <span className="font-medium">
                      {selectedSentiment ? sentiments.find(s => s.id === selectedSentiment)?.label : 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Categories:</span>
                    <span className="font-medium">{selectedCategories.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Confidence:</span>
                    <span className="font-medium">{confidence}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextAnnotationPage
