import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Square, Circle, Move } from 'lucide-react'

const ImageAnnotator = ({ data, onUpdate }) => {
  const [annotations, setAnnotations] = useState(data.annotations || [])
  const [currentTool, setCurrentTool] = useState('bbox')
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState(null)
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    onUpdate({ annotations })
  }, [annotations])

  const handleMouseDown = (e) => {
    if (currentTool === 'move') return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setStartPos({ x, y })
  }

  const handleMouseMove = (e) => {
    if (!isDrawing || !startPos || currentTool === 'move') return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Update preview annotation
    const newAnnotation = {
      type: currentTool,
      x: Math.min(startPos.x, x),
      y: Math.min(startPos.y, y),
      width: Math.abs(x - startPos.x),
      height: Math.abs(y - startPos.y),
      id: Date.now(),
    }

    // Draw preview
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAnnotations([...annotations, newAnnotation])
  }

  const handleMouseUp = () => {
    if (!isDrawing || !startPos || currentTool === 'move') return

    setIsDrawing(false)
    const newAnnotation = {
      type: currentTool,
      x: Math.min(startPos.x, startPos.x),
      y: Math.min(startPos.y, startPos.y),
      width: Math.abs(startPos.x - startPos.x),
      height: Math.abs(startPos.y - startPos.y),
      id: Date.now(),
    }

    setAnnotations([...annotations, newAnnotation])
    setStartPos(null)
  }

  const drawAnnotations = (anns) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    anns.forEach((ann) => {
      ctx.strokeStyle = '#00D9FF'
      ctx.lineWidth = 2
      
      if (ann.type === 'bbox') {
        ctx.strokeRect(ann.x, ann.y, ann.width, ann.height)
      } else if (ann.type === 'circle') {
        ctx.beginPath()
        ctx.arc(ann.x + ann.width / 2, ann.y + ann.height / 2, ann.width / 2, 0, 2 * Math.PI)
        ctx.stroke()
      }
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    drawAnnotations(annotations)
  }, [annotations])

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-white/10">
        <button
          onClick={() => setCurrentTool('bbox')}
          className={`p-2 rounded-lg ${
            currentTool === 'bbox' ? 'bg-primary-cyan/20 text-primary-cyan' : 'bg-white/5'
          }`}
        >
          <Square size={20} />
        </button>
        <button
          onClick={() => setCurrentTool('circle')}
          className={`p-2 rounded-lg ${
            currentTool === 'circle' ? 'bg-primary-cyan/20 text-primary-cyan' : 'bg-white/5'
          }`}
        >
          <Circle size={20} />
        </button>
        <button
          onClick={() => setCurrentTool('move')}
          className={`p-2 rounded-lg ${
            currentTool === 'move' ? 'bg-primary-cyan/20 text-primary-cyan' : 'bg-white/5'
          }`}
        >
          <Move size={20} />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setAnnotations([])}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Clear All
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative bg-dark-card/50 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="mb-2">Upload or drag an image here</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    imageRef.current.src = e.target.result
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
            <label
              htmlFor="image-upload"
              className="btn-outline cursor-pointer inline-block"
            >
              Select Image
            </label>
          </div>
        </div>
        <img
          ref={imageRef}
          className="absolute inset-0 w-full h-full object-contain"
          style={{ display: imageRef.current?.src ? 'block' : 'none' }}
        />
      </div>

      {/* Annotations List */}
      {annotations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h3 className="font-semibold mb-2">Annotations ({annotations.length})</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
            {annotations.map((ann, index) => (
              <div
                key={ann.id}
                className="flex items-center justify-between p-2 bg-white/5 rounded"
              >
                <span className="text-sm">
                  {ann.type === 'bbox' ? 'Bounding Box' : 'Circle'} {index + 1}
                </span>
                <button
                  onClick={() => setAnnotations(annotations.filter((a) => a.id !== ann.id))}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageAnnotator

