import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Star, Download, DollarSign } from 'lucide-react'
import { supabase, TABLES } from '../services/supabase'
import Topbar from '../components/Layout/Topbar'

const DatasetMarketplace = () => {
  const [datasets, setDatasets] = useState([])
  const [filteredDatasets, setFilteredDatasets] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDatasets()
  }, [])

  useEffect(() => {
    filterAndSort()
  }, [datasets, searchQuery, filterType, sortBy])

  const fetchDatasets = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.DATASETS)
        .select('*, users:creator_id(name)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDatasets(data || [])
    } catch (error) {
      console.error('Error fetching datasets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSort = () => {
    let filtered = [...datasets]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((d) => d.data_type === filterType)
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0)
      return 0
    })

    setFilteredDatasets(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-cyan"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:pl-64 pt-16">
      <Topbar />
      
      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dataset Marketplace</h1>
          <p className="text-gray-400">Discover and purchase high-quality AI datasets</p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search datasets..."
                className="input pl-10"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
              <option value="downloads">Sort by Downloads</option>
            </select>
          </div>
        </div>

        {/* Datasets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No datasets found
            </div>
          ) : (
            filteredDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const DatasetCard = ({ dataset }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card hover:border-primary-cyan/50 transition-all cursor-pointer"
    >
      <Link to={`/marketplace/${dataset.id}`}>
        <div className="mb-4">
          <span className="text-xs text-gray-400 uppercase bg-white/5 px-2 py-1 rounded">
            {dataset.data_type}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{dataset.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{dataset.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1 text-yellow-400">
              <Star size={16} fill="currentColor" />
              <span>{dataset.rating?.toFixed(1) || '0.0'}</span>
            </span>
            <span className="flex items-center space-x-1 text-gray-400">
              <Download size={16} />
              <span>{dataset.downloads || 0}</span>
            </span>
          </div>

          <div className="flex items-center space-x-1 text-primary-cyan font-bold">
            <DollarSign size={18} />
            <span>{dataset.price.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400">by {dataset.users?.name || 'Creator'}</p>
        </div>
      </Link>
    </motion.div>
  )
}

export default DatasetMarketplace

