import React, { useState } from 'react'
import { motion } from 'framer-motion'

const TextAnnotator = ({ data, onUpdate }) => {
  const [text, setText] = useState(data.text || '')
  const [annotations, setAnnotations] = useState(data.annotations || [])
  const [selectedText, setSelectedText] = useState('')
  const [selectedRange, setSelectedRange] = useState(null)

  const handleTextChange = (e) => {
    setText(e.target.value)
    onUpdate({ text, annotations })
  }

  const handleTextSelect = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString()
      
      if (selectedText) {
        setSelectedText(selectedText)
        setSelectedRange({
          start: range.startOffset,
          end: range.endOffset,
        })
      }
    }
  }

  const addAnnotation = (label) => {
    if (!selectedText || !selectedRange) return

    const newAnnotation = {
      id: Date.now(),
      text: selectedText,
      start: selectedRange.start,
      end: selectedRange.end,
      label,
    }

    setAnnotations([...annotations, newAnnotation])
    setSelectedText('')
    setSelectedRange(null)
    onUpdate({ text, annotations: [...annotations, newAnnotation] })
  }

  const labels = ['PERSON', 'ORG', 'LOC', 'MISC', 'POSITIVE', 'NEGATIVE', 'NEUTRAL']

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Text Content</label>
        <textarea
          value={text}
          onChange={handleTextChange}
          onMouseUp={handleTextSelect}
          className="input min-h-[400px] font-mono"
          placeholder="Paste or type text here, then select spans to annotate..."
        />
      </div>

      {selectedText && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-primary-cyan/10 rounded-lg border border-primary-cyan/20"
        >
          <p className="text-sm mb-2">Selected: "{selectedText}"</p>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <button
                key={label}
                onClick={() => addAnnotation(label)}
                className="px-3 py-1 bg-primary-cyan/20 text-primary-cyan rounded text-sm hover:bg-primary-cyan/30"
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {annotations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h3 className="font-semibold mb-2">Annotations ({annotations.length})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {annotations.map((ann) => (
              <div
                key={ann.id}
                className="p-3 bg-white/5 rounded flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-semibold text-primary-cyan">{ann.label}</span>
                  <p className="text-sm text-gray-400 mt-1">"{ann.text}"</p>
                </div>
                <button
                  onClick={() => {
                    const newAnnotations = annotations.filter((a) => a.id !== ann.id)
                    setAnnotations(newAnnotations)
                    onUpdate({ text, annotations: newAnnotations })
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

export default TextAnnotator

