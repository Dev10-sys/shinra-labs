import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Square, Pentagon, ZoomIn, ZoomOut, RotateCcw, 
  Save, SkipForward, CheckCircle, Tag, FileText, Info, Clock
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

const AnnotatePage = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  
  const [currentTool, setCurrentTool] = useState('bbox')
  const [zoom, setZoom] = useState(1)
  const [annotations, setAnnotations] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState(null)
  const [currentAnnotation, setCurrentAnnotation] = useState(null)
  const [selectedLabels, setSelectedLabels] = useState([])
  const [notes, setNotes] = useState('')
  const [currentImage, setCurrentImage] = useState(25)
  const [totalImages] = useState(100)
  const [timeSpent, setTimeSpent] = useState(0)
  const [qualityChecks, setQualityChecks] = useState({
    clearlyVisible: false,
    properBoundaries: false,
    correctLabels: false,
    noOverlap: false
  })

  const mockPlaceholderImage = 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&h=600&fit=crop'

  const labelCategories = [
    { id: 'person', name: 'Person', color: '#00D9FF' },
    { id: 'vehicle', name: 'Vehicle', color: '#FF006E' },
    { id: 'animal', name: 'Animal', color: '#10B981' },
    { id: 'building', name: 'Building', color: '#FFBE0B' },
    { id: 'object', name: 'Object', color: '#8B5CF6' }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        handleSaveDraft()
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        handleSubmitAndNext()
      } else if (e.key === 'Escape') {
        setCurrentAnnotation(null)
        setIsDrawing(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [annotations, selectedLabels, notes])

  useEffect(() => {
    if (canvasRef.current && imageRef.current) {
      drawCanvas()
    }
  }, [annotations, zoom])

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    }
  }

  const handleMouseDown = (e) => {
    if (currentTool === 'move') return
    const coords = getCanvasCoordinates(e)
    setIsDrawing(true)
    setStartPos(coords)
    setCurrentAnnotation({
      x: coords.x,
      y: coords.y,
      width: 0,
      height: 0,
      type: currentTool,
      label: selectedLabels[0] || null
    })
  }

  const handleMouseMove = (e) => {
    if (!isDrawing || !startPos) return
    const coords = getCanvasCoordinates(e)
    
    setCurrentAnnotation({
      ...currentAnnotation,
      x: Math.min(startPos.x, coords.x),
      y: Math.min(startPos.y, coords.y),
      width: Math.abs(coords.x - startPos.x),
      height: Math.abs(coords.y - startPos.y)
    })
  }

  const handleMouseUp = () => {
    if (!isDrawing || !currentAnnotation) return
    
    if (currentAnnotation.width > 5 && currentAnnotation.height > 5) {
      setAnnotations([...annotations, { ...currentAnnotation, id: Date.now() }])
      toast.success('Annotation added')
    }
    
    setIsDrawing(false)
    setStartPos(null)
    setCurrentAnnotation(null)
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const image = imageRef.current

    if (!image || !image.complete) return

    canvas.width = image.width
    canvas.height = image.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const allAnnotations = currentAnnotation 
      ? [...annotations, currentAnnotation] 
      : annotations

    allAnnotations.forEach(ann => {
      const label = labelCategories.find(l => l.id === ann.label)
      ctx.strokeStyle = label?.color || '#00D9FF'
      ctx.lineWidth = 2 / zoom
      ctx.fillStyle = label ? `${label.color}20` : '#00D9FF20'

      if (ann.type === 'bbox') {
        ctx.fillRect(ann.x, ann.y, ann.width, ann.height)
        ctx.strokeRect(ann.x, ann.y, ann.width, ann.height)
      }

      if (label) {
        ctx.fillStyle = label.color
        ctx.font = `${14 / zoom}px sans-serif`
        ctx.fillText(label.name, ann.x, ann.y - 5)
      }
    })
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleReset = () => {
    setZoom(1)
    setAnnotations([])
    setSelectedLabels([])
    setNotes('')
  }

  const handleSkip = () => {
    setCurrentImage(prev => Math.min(prev + 1, totalImages))
    handleReset()
    toast.info('Skipped to next image')
  }

  const handleSaveDraft = () => {
    localStorage.setItem(`task_${taskId}_progress`, JSON.stringify({
      currentImage,
      annotations,
      selectedLabels,
      notes,
      qualityChecks,
      timeSpent
    }))
    toast.success('Draft saved')
  }

  const handleSubmitAndNext = () => {
    if (annotations.length === 0) {
      toast.error('Please add at least one annotation')
      return
    }

    if (selectedLabels.length === 0) {
      toast.error('Please select at least one label')
      return
    }

    const allChecked = Object.values(qualityChecks).every(v => v)
    if (!allChecked) {
      toast.error('Please complete the quality checklist')
      return
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    })

    toast.success('Annotation submitted!')
    
    if (currentImage < totalImages) {
      setCurrentImage(prev => prev + 1)
      setAnnotations([])
      setNotes('')
      setQualityChecks({
        clearlyVisible: false,
        properBoundaries: false,
        correctLabels: false,
        noOverlap: false
      })
    } else {
      toast.success('Task completed!')
      navigate('/dashboard')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="p-4 lg:p-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Product Image Labeling</h1>
            <p className="text-gray-400 mt-1">Annotate objects in ecommerce product images</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock size={18} />
              <span className="font-mono">{formatTime(timeSpent)}</span>
            </div>
            <span className="text-2xl font-bold text-primary-cyan">₹5,000</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentTool('bbox')}
                    className={`p-2 rounded-lg transition-all ${
                      currentTool === 'bbox'
                        ? 'bg-primary-cyan/20 text-primary-cyan'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    title="Bounding Box (B)"
                  >
                    <Square size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentTool('polygon')}
                    className={`p-2 rounded-lg transition-all ${
                      currentTool === 'polygon'
                        ? 'bg-primary-cyan/20 text-primary-cyan'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    title="Polygon (P)"
                  >
                    <Pentagon size={20} />
                  </button>
                  <div className="w-px h-6 bg-white/10" />
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                    title="Zoom In (+)"
                  >
                    <ZoomIn size={20} />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut size={20} />
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                    title="Reset (R)"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>
                <div className="text-sm text-gray-400">
                  Zoom: {(zoom * 100).toFixed(0)}%
                </div>
              </div>

              <div className="relative bg-dark-card/50 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                <img
                  ref={imageRef}
                  src={mockPlaceholderImage}
                  alt="Annotation target"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                  onLoad={drawCanvas}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>

              <div className="mt-4 p-4 bg-dark-card/30 rounded-lg">
                <h3 className="text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Info size={16} className="text-primary-cyan" />
                  <span>Keyboard Shortcuts</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-400">
                  <div><kbd className="px-2 py-1 bg-white/5 rounded">S</kbd> Save Draft</div>
                  <div><kbd className="px-2 py-1 bg-white/5 rounded">N</kbd> Submit & Next</div>
                  <div><kbd className="px-2 py-1 bg-white/5 rounded">Esc</kbd> Cancel</div>
                  <div><kbd className="px-2 py-1 bg-white/5 rounded">B</kbd> Bounding Box</div>
                  <div><kbd className="px-2 py-1 bg-white/5 rounded">+</kbd> Zoom In</div>
                  <div><kbd className="px-2 py-1 bg-white/5 rounded">-</kbd> Zoom Out</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-bold mb-4">Task Instructions</h2>
              <div className="space-y-3 text-sm text-gray-300">
                <p>1. Draw bounding boxes around all visible objects in the image</p>
                <p>2. Select the appropriate label for each annotation</p>
                <p>3. Ensure boxes fit tightly around objects</p>
                <p>4. Complete the quality checklist before submitting</p>
              </div>

              <div className="mt-6 p-4 bg-primary-cyan/10 rounded-lg border border-primary-cyan/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-bold text-primary-cyan">
                    {currentImage} / {totalImages}
                  </span>
                </div>
                <div className="w-full bg-dark-card rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-cyan to-primary-purple h-2 rounded-full transition-all"
                    style={{ width: `${(currentImage / totalImages) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Tag size={20} className="text-primary-cyan" />
                <span>Label Categories</span>
              </h3>
              <div className="space-y-2">
                {labelCategories.map(category => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLabels.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLabels([...selectedLabels, category.id])
                        } else {
                          setSelectedLabels(selectedLabels.filter(l => l !== category.id))
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-600"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {annotations.filter(a => a.label === category.id).length}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold mb-4">Quality Checklist</h3>
              <div className="space-y-3">
                {Object.entries({
                  clearlyVisible: 'All objects are clearly visible',
                  properBoundaries: 'Bounding boxes fit tightly',
                  correctLabels: 'Labels are accurate',
                  noOverlap: 'No unnecessary overlaps'
                }).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={qualityChecks[key]}
                      onChange={(e) => setQualityChecks({
                        ...qualityChecks,
                        [key]: e.target.checked
                      })}
                      className="w-4 h-4 rounded border-gray-600"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
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
                <span>Notes</span>
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or observations about this image..."
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
        </div>
      </div>
    </div>
  )
}

export default AnnotatePage
