import { useState } from 'react'
import { Copy, Check, Database, AlertCircle, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

const DatabaseSetup = () => {
  const [copiedStep, setCopiedStep] = useState(null)

  const sqlFiles = [
    {
      id: 1,
      name: '1. Core Schema (schema.sql)',
      description: 'Creates core tables: users, tasks, datasets, submissions, purchases, transactions',
      file: 'database/schema.sql',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 2,
      name: '2. Enhanced Features (schema_v2_enhancements.sql)',
      description: 'Adds gamification (XP, badges), admin roles, notifications, and RLS policies',
      file: 'database/schema_v2_enhancements.sql',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 3,
      name: '3. Secure Operations (secure_operations.sql)',
      description: 'Creates secure RPC functions for withdrawals, purchases, and approvals',
      file: 'database/secure_operations.sql',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const copyToClipboard = async (fileContent, stepId) => {
    try {
      // In a real implementation, you'd fetch the actual file content
      // For now, we'll show instructions
      await navigator.clipboard.writeText(`-- Copy content from ${fileContent}`)
      setCopiedStep(stepId)
      setTimeout(() => setCopiedStep(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Database Setup
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Complete these 3 simple steps to setup your SHINRA Labs database
          </p>
        </motion.div>

        {/* Instructions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-xl mb-8 border border-cyan-500/20"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Quick Setup Instructions</h3>
              <ol className="text-gray-300 space-y-2 list-decimal list-inside">
                <li>Open your <a href={process.env.VITE_SUPABASE_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Supabase Dashboard</a></li>
                <li>Go to <span className="text-purple-400 font-semibold">SQL Editor</span> (left sidebar)</li>
                <li>Click <span className="text-purple-400 font-semibold">"New Query"</span></li>
                <li>Copy & paste each SQL file below (in order)</li>
                <li>Click <span className="text-purple-400 font-semibold">"Run"</span> for each file</li>
              </ol>
              <p className="mt-4 text-sm text-gray-400">
                ⏱️ Total time: ~2 minutes | 🔒 One-time setup
              </p>
            </div>
          </div>
        </motion.div>

        {/* SQL Files */}
        <div className="space-y-6">
          {sqlFiles.map((sql, index) => (
            <motion.div
              key={sql.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${sql.color} flex items-center justify-center text-white font-bold`}>
                      {sql.id}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{sql.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm ml-13">{sql.description}</p>
                </div>
                
                <button
                  onClick={() => window.open(`/database/${sql.file.split('/')[1]}`, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open File
                </button>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">📁 {sql.file}</span>
                  <button
                    onClick={() => copyToClipboard(sql.file, sql.id)}
                    className="flex items-center gap-2 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                  >
                    {copiedStep === sql.id ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Path</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-gray-500 text-xs">
                  Click "Open File" above to view the SQL code, then copy-paste it into Supabase SQL Editor
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Completion Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass p-6 rounded-xl border border-green-500/20"
        >
          <div className="flex items-start gap-4">
            <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">After Setup Complete</h3>
              <p className="text-gray-300 mb-4">
                Once you've run all 3 SQL files in Supabase, your database is ready!
              </p>
              <div className="flex gap-4">
                <a
                  href="/dashboard"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold transition-all"
                >
                  Go to Dashboard
                </a>
                <a
                  href="/"
                  className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-all"
                >
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-gray-400 text-sm"
        >
          <p>
            Need help? Check the{' '}
            <a href="/docs" className="text-cyan-400 hover:underline">
              documentation
            </a>{' '}
            or contact support.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default DatabaseSetup
