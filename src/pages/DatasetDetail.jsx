import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Download, DollarSign, ShoppingCart, Check } from 'lucide-react'
import { supabase, TABLES } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
import Topbar from '../components/Layout/Topbar'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

const DatasetDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const [dataset, setDataset] = useState(null)
  const [purchased, setPurchased] = useState(false)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    fetchDataset()
    checkPurchase()
  }, [id, userProfile])

  const fetchDataset = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.DATASETS)
        .select('*, users:creator_id(name, email)')
        .eq('id', id)
        .single()

      if (error) throw error
      setDataset(data)
    } catch (error) {
      console.error('Error fetching dataset:', error)
      toast.error('Failed to load dataset')
    } finally {
      setLoading(false)
    }
  }

  const checkPurchase = async () => {
    if (!userProfile) return

    try {
      const { data, error } = await supabase
        .from(TABLES.PURCHASES)
        .select('id')
        .eq('buyer_id', userProfile.id)
        .eq('dataset_id', id)
        .single()

      if (data) {
        setPurchased(true)
      }
    } catch (error) {
      // Not purchased
    }
  }

  const handlePurchase = async () => {
    if (!userProfile) {
      toast.error('Please login to purchase')
      navigate('/login')
      return
    }

    if (userProfile.balance < dataset.price) {
      toast.error('Insufficient balance')
      return
    }

    setPurchasing(true)

    try {
      // Create purchase record
      const { error: purchaseError } = await supabase
        .from(TABLES.PURCHASES)
        .insert([
          {
            buyer_id: userProfile.id,
            dataset_id: id,
            amount_paid: dataset.price,
          },
        ])

      if (purchaseError) throw purchaseError

      // Update user balance
      const { error: balanceError } = await supabase
        .from(TABLES.USERS)
        .update({ balance: userProfile.balance - dataset.price })
        .eq('id', userProfile.id)

      if (balanceError) throw balanceError

      // Create transaction
      await supabase.from(TABLES.TRANSACTIONS).insert([
        {
          user_id: userProfile.id,
          type: 'purchase',
          amount: -dataset.price,
          description: `Purchased: ${dataset.title}`,
        },
      ])

      // Update dataset downloads
      await supabase
        .from(TABLES.DATASETS)
        .update({ downloads: (dataset.downloads || 0) + 1 })
        .eq('id', id)

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      toast.success('Dataset purchased successfully!')
      setPurchased(true)
    } catch (error) {
      console.error('Error purchasing dataset:', error)
      toast.error('Failed to purchase dataset')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-cyan"></div>
      </div>
    )
  }

  if (!dataset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Dataset not found</h2>
          <button onClick={() => navigate('/marketplace')} className="btn-primary">
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:pl-64 pt-16">
      <Topbar />
      
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Marketplace</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="mb-4">
            <span className="text-xs text-gray-400 uppercase bg-white/5 px-2 py-1 rounded">
              {dataset.data_type}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-4">{dataset.title}</h1>
          <p className="text-gray-400 mb-6">{dataset.description}</p>

          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <Star className="text-yellow-400" size={20} fill="currentColor" />
              <span className="font-semibold">{dataset.rating?.toFixed(1) || '0.0'}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Download size={20} />
              <span>{dataset.downloads || 0} downloads</span>
            </div>
            <div className="text-primary-cyan font-bold text-2xl">
              ₹{dataset.price.toLocaleString()}
            </div>
          </div>

          <div className="flex space-x-4">
            {purchased ? (
              <button className="btn-secondary flex items-center space-x-2" disabled>
                <Check size={20} />
                <span>Purchased</span>
              </button>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={purchasing || !userProfile || userProfile.balance < dataset.price}
                className="btn-primary flex items-center space-x-2"
              >
                {purchasing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-dark-bg"></div>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>Purchase Dataset</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-4">Creator Information</h2>
          <p className="text-gray-400">
            Created by <span className="text-white font-semibold">{dataset.users?.name || 'Unknown'}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Uploaded on {new Date(dataset.created_at).toLocaleDateString()}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default DatasetDetail

