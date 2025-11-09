import React, { useState, useRef } from 'react'
import { Play, Pause, Square } from 'lucide-react'

const VideoAnnotator = ({ data, onUpdate }) => {
  const [annotations, setAnnotations] = useState(data.annotations || [])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef(null)

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const addFrame = () => {
    const newAnnotation = {
      id: Date.now(),
      timestamp: currentTime,
      label: 'Key Frame',
    }

    const newAnnotations = [...annotations, newAnnotation]
    setAnnotations(newAnnotations)
    onUpdate({ annotations: newAnnotations })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Upload Video File</label>
        <input
          type="file"
          accept="video/*"
          className="input"
          onChange={(e) => {
            const file = e.target.files[0]
            if (file && videoRef.current) {
              videoRef.current.src = URL.createObjectURL(file)
            }
          }}
        />
      </div>

      {videoRef.current?.src && (
        <div className="mb-6">
          <video
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full rounded-lg"
            controls
          />

          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={() => {
                if (isPlaying) {
                  videoRef.current?.pause()
                } else {
                  videoRef.current?.play()
                }
              }}
              className="btn-primary flex items-center space-x-2"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={addFrame}
              className="btn-outline"
            >
              Mark Frame at {Math.floor(currentTime)}s
            </button>
          </div>
        </div>
      )}

      {annotations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h3 className="font-semibold mb-2">Frames ({annotations.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {annotations.map((ann) => (
              <div
                key={ann.id}
                className="p-3 bg-white/5 rounded flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-semibold">{ann.label}</span>
                  <p className="text-sm text-gray-400">
                    {Math.floor(ann.timestamp)}s
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newAnnotations = annotations.filter((a) => a.id !== ann.id)
                    setAnnotations(newAnnotations)
                    onUpdate({ annotations: newAnnotations })
                  }}
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

export default VideoAnnotator

