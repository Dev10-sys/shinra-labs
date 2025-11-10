import React from 'react'
import { motion } from 'framer-motion'
import { Filter, SlidersHorizontal } from 'lucide-react'

const FilterBar = ({ 
  filters = {},
  onFilterChange,
  className = ''
}) => {
  const categories = ['All', 'Image', 'Text', 'Audio', 'Video']
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']
  const sortOptions = ['Most Recent', 'Highest Pay', 'Easiest First', 'Deadline']

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl p-4 border border-white/10 ${className}`}
    >
      <div className="flex items-center space-x-2 mb-4">
        <SlidersHorizontal className="text-primary-cyan" size={20} />
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Category</label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-cyan transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Difficulty</label>
          <select
            value={filters.difficulty || 'All'}
            onChange={(e) => onFilterChange({ ...filters, difficulty: e.target.value })}
            className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-cyan transition-colors"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Price Range</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
              className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-cyan transition-colors"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
              className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-cyan transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Sort By</label>
          <select
            value={filters.sortBy || 'Most Recent'}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-cyan transition-colors"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  )
}

export default FilterBar
