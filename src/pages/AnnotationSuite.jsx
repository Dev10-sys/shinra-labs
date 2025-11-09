import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Undo, Redo, CheckCircle, Image, Video, Music, FileText } from 'lucide-react'
import { supabase, TABLES } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
import Topbar from '../components/Layout/Topbar'
import ImageAnnotator from '../components/Annotation/ImageAnnotator'
import TextAnnotator from '../components/Annotation/TextAnnotator'
import AudioAnnotator from '../components/Annotation/AudioAnnotator'
import VideoAnnotator from '../components/Annotation/VideoAnnotator'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

const AnnotationSuite = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const [task, setTask] = useState(null)
  const [annotationData, setAnnotationData] = useState({})
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTask()
  }, [taskId])

  const fetchTask = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.TASKS)
        .select('*, users:company_id(name)')
        .eq('id', taskId)
        .single()

      if (error) throw error
      setTask(data)

      // Check for existing submission
      const { data: submission } = await supabase
        .from(TABLES.SUBMISSIONS)
        .select('*')
        .eq('task_id', taskId)
        .eq('freelancer_id', userProfile.id)
        .single()

      if (submission?.submission_data) {
        setAnnotationData(submission.submission_data)
      }
    } catch (error) {
      console.error('Error fetching task:', error)
      toast.error('Failed to load task')
    } finally {
      setLoading(false)
    }
  }

  const updateAnnotation = (data) => {
    const newData = { ...annotationData, ...data }
    setAnnotationData(newData)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setAnnotationData(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setAnnotationData(history[historyIndex + 1])
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      // Check if submission exists
      const { data: existing } = await supabase
        .from(TABLES.SUBMISSIONS)
        .select('id')
        .eq('task_id', taskId)
        .eq('freelancer_id', userProfile.id)
        .single()

      if (existing) {
        // Update existing submission
        const { error } = await supabase
          .from(TABLES.SUBMISSIONS)
          .update({
            submission_data: annotationData,
            verified: false,
          })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Create new submission
        const { error } = await supabase
          .from(TABLES.SUBMISSIONS)
          .insert([
            {
              task_id: taskId,
              freelancer_id: userProfile.id,
              submission_data: annotationData,
              verified: false,
            },
          ])

        if (error) throw error
      }

      // Trigger confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      })

      toast.success('Annotation saved!')
    } catch (error) {
      console.error('Error saving annotation:', error)
      toast.error('Failed to save annotation')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(annotationData).length === 0) {
      toast.error('Please complete the annotation before submitting')
      return
    }

    setSaving(true)

    try {
      // Update submission as verified
      const { error: updateError } = await supabase
        .from(TABLES.SUBMISSIONS)
        .update({
          submission_data: annotationData,
          verified: true,
          ai_confidence: 0.95, // Mock AI confidence
          shinra_message: '✅ VERIFIED by SHINRA - 95% confidence',
        })
        .eq('task_id', taskId)
        .eq('freelancer_id', userProfile.id)

      if (updateError) throw updateError

      // Update user balance and stats
      const newBalance = (userProfile.balance || 0) + task.payout
      const newTotalEarned = (userProfile.total_earned || 0) + task.payout
      const newTasksCompleted = (userProfile.tasks_completed || 0) + 1

      await supabase
        .from(TABLES.USERS)
        .update({
          balance: newBalance,
          total_earned: newTotalEarned,
          tasks_completed: newTasksCompleted,
        })
        .eq('id', userProfile.id)

      // Create transaction
      await supabase.from(TABLES.TRANSACTIONS).insert([
        {
          user_id: userProfile.id,
          type: 'earning',
          amount: task.payout,
          description: `Completed task: ${task.title}`,
        },
      ])

      // Trigger confetti
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
      })

      toast.success('Task submitted successfully!')
      navigate('/freelancer')
    } catch (error) {
      console.error('Error submitting task:', error)
      toast.error('Failed to submit task')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-cyan"></div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Task not found</h2>
          <button onClick={() => navigate('/freelancer')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const renderAnnotator = () => {
    switch (task.task_type) {
      case 'image':
        return <ImageAnnotator data={annotationData} onUpdate={updateAnnotation} />
      case 'text':
        return <TextAnnotator data={annotationData} onUpdate={updateAnnotation} />
      case 'audio':
        return <AudioAnnotator data={annotationData} onUpdate={updateAnnotation} />
      case 'video':
        return <VideoAnnotator data={annotationData} onUpdate={updateAnnotation} />
      default:
        return <div className="text-center py-12 text-gray-400">Unsupported task type</div>
    }
  }

  return (
    <div className="min-h-screen lg:pl-64 pt-16">
      <Topbar />
      
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/freelancer')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white mb-2"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold">{task.title}</h1>
            <p className="text-gray-400 mt-2">{task.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-primary-cyan font-bold text-xl">₹{task.payout}</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Undo size={20} />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Redo size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-outline flex items-center space-x-2"
              >
                <Save size={20} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || Object.keys(annotationData).length === 0}
                className="btn-primary flex items-center space-x-2"
              >
                <CheckCircle size={20} />
                <span>{saving ? 'Submitting...' : 'Submit Task'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Annotator */}
        <div className="card min-h-[600px]">
          {renderAnnotator()}
        </div>
      </div>
    </div>
  )
}

export default AnnotationSuite

