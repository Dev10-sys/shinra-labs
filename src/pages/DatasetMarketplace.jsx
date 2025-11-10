import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Star, Download, X, Eye, ShoppingCart, 
  Database, FileText, Image as ImageIcon, Video, Music, 
  DollarSign, Users, Calendar, Tag, MessageSquare, Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

const DatasetMarketplace = () => {
  const [filteredDatasets, setFilteredDatasets] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPrice, setFilterPrice] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [selectedDataset, setSelectedDataset] = useState(null)

  const mockDatasets = [
    {
      id: 1,
      title: 'E-commerce Product Images Dataset',
      description: 'High-quality product images with detailed annotations for object detection and classification. Perfect for training retail AI models.',
      category: 'Image',
      size: '10K images',
      price: 5000,
      rating: 4.5,
      reviews: 23,
      downloads: 142,
      format: 'JPEG, JSON',
      icon: ImageIcon,
      creator: 'DataVision Labs',
      createdDate: '2025-10-15',
      sampleData: 'Sample images include: electronics, clothing, furniture, accessories',
      metadata: {
        resolution: '1920x1080',
        annotations: 'Bounding boxes, categories, attributes',
        license: 'Commercial use allowed'
      },
      reviewsList: [
        { user: 'Priya S.', rating: 5, comment: 'Excellent quality dataset! Very well annotated.' },
        { user: 'Rahul M.', rating: 4, comment: 'Good variety of products, helpful for our model.' }
      ]
    },
    {
      id: 2,
      title: 'Customer Reviews Sentiment Dataset',
      description: 'Over 50K customer reviews labeled with sentiment and emotion categories. Ideal for NLP sentiment analysis tasks.',
      category: 'Text',
      size: '50K reviews',
      price: 3500,
      rating: 4.8,
      reviews: 45,
      downloads: 289,
      format: 'CSV, JSON',
      icon: FileText,
      creator: 'NLP Experts',
      createdDate: '2025-09-20',
      sampleData: 'Reviews from multiple industries: retail, hospitality, tech, healthcare',
      metadata: {
        languages: 'English, Hindi',
        sentiments: 'Positive, Negative, Neutral',
        license: 'Research & Commercial'
      },
      reviewsList: [
        { user: 'Amit K.', rating: 5, comment: 'Perfect for training sentiment models!' },
        { user: 'Sneha R.', rating: 5, comment: 'Clean and well-structured data.' }
      ]
    },
    {
      id: 3,
      title: 'Video Content Moderation Dataset',
      description: 'Annotated video clips for content moderation, including violence, profanity, and safe content labels.',
      category: 'Video',
      size: '5K videos',
      price: 12000,
      rating: 4.6,
      reviews: 18,
      downloads: 67,
      format: 'MP4, JSON',
      icon: Video,
      creator: 'SafeContent AI',
      createdDate: '2025-08-10',
      sampleData: 'Various content types with frame-level annotations',
      metadata: {
        duration: '30-180 seconds per clip',
        resolution: '720p, 1080p',
        license: 'Commercial use allowed'
      },
      reviewsList: [
        { user: 'Vikram P.', rating: 5, comment: 'Essential for content moderation systems.' },
        { user: 'Ananya G.', rating: 4, comment: 'Good quality but could use more variety.' }
      ]
    },
    {
      id: 4,
      title: 'Indian Voice Commands Dataset',
      description: 'Audio recordings of voice commands in English and Hindi with transcriptions and intent labels.',
      category: 'Audio',
      size: '25K audio clips',
      price: 8500,
      rating: 4.7,
      reviews: 31,
      downloads: 156,
      format: 'WAV, JSON',
      icon: Music,
      creator: 'VoiceTech India',
      createdDate: '2025-07-25',
      sampleData: 'Commands for smart home, navigation, shopping, entertainment',
      metadata: {
        sampleRate: '16kHz',
        duration: '2-5 seconds per clip',
        license: 'Commercial use allowed'
      },
      reviewsList: [
        { user: 'Rohan D.', rating: 5, comment: 'Great for building Indian voice assistants!' }
      ]
    },
    {
      id: 5,
      title: 'Medical Image Analysis Dataset',
      description: 'Anonymized medical scans with expert annotations for disease detection and diagnosis AI models.',
      category: 'Image',
      size: '8K scans',
      price: 18000,
      rating: 4.9,
      reviews: 12,
      downloads: 45,
      format: 'DICOM, PNG, JSON',
      icon: ImageIcon,
      creator: 'MedAI Research',
      createdDate: '2025-06-15',
      sampleData: 'X-rays, CT scans, MRI with disease labels',
      metadata: {
        modalities: 'X-ray, CT, MRI',
        annotations: 'Disease labels, region annotations',
        license: 'Research only'
      },
      reviewsList: [
        { user: 'Dr. Sharma', rating: 5, comment: 'Excellent for medical AI research.' }
      ]
    },
    {
      id: 6,
      title: 'Social Media Posts Dataset',
      description: 'Millions of social media posts with hashtags, engagement metrics, and category labels.',
      category: 'Text',
      size: '1M posts',
      price: 0,
      rating: 4.3,
      reviews: 89,
      downloads: 512,
      format: 'JSON, CSV',
      icon: FileText,
      creator: 'SocialData Corp',
      createdDate: '2025-10-01',
      sampleData: 'Posts from Twitter, Instagram with metadata',
      metadata: {
        fields: 'text, hashtags, likes, shares, timestamp',
        period: 'Jan 2024 - Dec 2024',
        license: 'Non-commercial use'
      },
      reviewsList: [
        { user: 'Maya L.', rating: 4, comment: 'Great free dataset for social media analysis.' }
      ]
    },
    {
      id: 7,
      title: 'Traffic Sign Detection Dataset',
      description: 'Comprehensive collection of traffic signs from Indian roads with bounding box annotations.',
      category: 'Image',
      size: '15K images',
      price: 6500,
      rating: 4.6,
      reviews: 27,
      downloads: 98,
      format: 'JPEG, XML, JSON',
      icon: ImageIcon,
      creator: 'DriveAI Solutions',
      createdDate: '2025-08-20',
      sampleData: 'Stop signs, speed limits, warnings, directional signs',
      metadata: {
        conditions: 'Day/night, various weather',
        classes: '45 sign types',
        license: 'Commercial use allowed'
      },
      reviewsList: [
        { user: 'Karthik N.', rating: 5, comment: 'Perfect for autonomous driving projects.' }
      ]
    },
    {
      id: 8,
      title: 'News Article Classification Dataset',
      description: 'Categorized news articles across politics, sports, technology, entertainment, and more.',
      category: 'Text',
      size: '100K articles',
      price: 4500,
      rating: 4.7,
      reviews: 36,
      downloads: 201,
      format: 'JSON, TXT',
      icon: FileText,
      creator: 'NewsML Corp',
      createdDate: '2025-09-05',
      sampleData: 'Articles from major Indian news sources',
      metadata: {
        categories: '12 categories',
        languages: 'English, Hindi',
        license: 'Research & Commercial'
      },
      reviewsList: [
        { user: 'Pooja V.', rating: 5, comment: 'Well-organized and diverse content.' }
      ]
    },
    {
      id: 9,
      title: 'Fashion Product Images Dataset',
      description: 'Clothing and accessory images with style attributes, colors, and category labels.',
      category: 'Image',
      size: '20K images',
      price: 7200,
      rating: 4.5,
      reviews: 19,
      downloads: 134,
      format: 'JPEG, JSON',
      icon: ImageIcon,
      creator: 'FashionTech AI',
      createdDate: '2025-07-10',
      sampleData: 'Apparel, shoes, bags, accessories with detailed attributes',
      metadata: {
        attributes: 'Color, style, pattern, material',
        resolution: '800x800 minimum',
        license: 'Commercial use allowed'
      },
      reviewsList: [
        { user: 'Divya S.', rating: 4, comment: 'Good variety of fashion items.' }
      ]
    },
    {
      id: 10,
      title: 'Podcast Transcription Dataset',
      description: 'Audio podcasts with high-quality transcriptions in multiple Indian languages.',
      category: 'Audio',
      size: '500 hours',
      price: 15000,
      rating: 4.8,
      reviews: 14,
      downloads: 56,
      format: 'MP3, JSON, TXT',
      icon: Music,
      creator: 'AudioScribe India',
      createdDate: '2025-06-01',
      sampleData: 'Podcasts on tech, business, entertainment, education',
      metadata: {
        languages: 'Hindi, Tamil, Telugu, English',
        quality: 'Professional transcription',
        license: 'Commercial use allowed'
      },
      reviewsList: [
        { user: 'Arjun M.', rating: 5, comment: 'Excellent transcription quality!' }
      ]
    },
    {
      id: 11,
      title: 'Handwritten Digit Recognition Dataset',
      description: 'Large collection of handwritten digits for OCR and digit recognition training.',
      category: 'Image',
      size: '70K images',
      price: 0,
      rating: 4.9,
      reviews: 156,
      downloads: 892,
      format: 'PNG, CSV',
      icon: ImageIcon,
      creator: 'OpenML Community',
      createdDate: '2025-05-15',
      sampleData: 'Digits 0-9 in various handwriting styles',
      metadata: {
        resolution: '28x28 pixels',
        format: 'Grayscale PNG',
        license: 'Public domain'
      },
      reviewsList: [
        { user: 'Students', rating: 5, comment: 'Perfect for learning ML!' }
      ]
    },
    {
      id: 12,
      title: 'Restaurant Review Analysis Dataset',
      description: 'Restaurant reviews with ratings, sentiment, and cuisine category labels.',
      category: 'Text',
      size: '30K reviews',
      price: 3200,
      rating: 4.6,
      reviews: 28,
      downloads: 178,
      format: 'CSV, JSON',
      icon: FileText,
      creator: 'FoodieData',
      createdDate: '2025-08-30',
      sampleData: 'Reviews from Zomato, Swiggy, Google',
      metadata: {
        ratings: '1-5 stars',
        cuisines: '25+ cuisine types',
        license: 'Research & Commercial'
      },
      reviewsList: [
        { user: 'Neha K.', rating: 5, comment: 'Great for restaurant recommendation systems.' }
      ]
    },
    {
      id: 13,
      title: 'Urban Scene Segmentation Dataset',
      description: 'Street-level images with pixel-wise segmentation for autonomous driving applications.',
      category: 'Image',
      size: '5K images',
      price: 16000,
      rating: 4.7,
      reviews: 11,
      downloads: 34,
      format: 'PNG, JSON',
      icon: ImageIcon,
      creator: 'UrbanAI Labs',
      createdDate: '2025-05-20',
      sampleData: 'Roads, vehicles, pedestrians, buildings, traffic signs',
      metadata: {
        resolution: '1920x1080',
        classes: '19 object classes',
        license: 'Research & Commercial'
      },
      reviewsList: [
        { user: 'Sanjay T.', rating: 5, comment: 'High-quality segmentation masks.' }
      ]
    },
    {
      id: 14,
      title: 'Customer Support Chat Dataset',
      description: 'Real customer support conversations with intent classification and entity extraction.',
      category: 'Text',
      size: '40K conversations',
      price: 9500,
      rating: 4.5,
      reviews: 22,
      downloads: 89,
      format: 'JSON, CSV',
      icon: FileText,
      creator: 'ChatBot Solutions',
      createdDate: '2025-07-05',
      sampleData: 'Multi-turn conversations across various industries',
      metadata: {
        intents: '50+ intent categories',
        entities: 'Product, date, location, person',
        license: 'Commercial use allowed'
      },
      reviewsList: [
        { user: 'Ravi P.', rating: 4, comment: 'Useful for building chatbots.' }
      ]
    },
    {
      id: 15,
      title: 'Wildlife Camera Trap Images',
      description: 'Camera trap images of wildlife with species identification and behavioral annotations.',
      category: 'Image',
      size: '12K images',
      price: 8000,
      rating: 4.8,
      reviews: 16,
      downloads: 72,
      format: 'JPEG, JSON',
      icon: ImageIcon,
      creator: 'Wildlife Conservation AI',
      createdDate: '2025-06-25',
      sampleData: 'Tigers, elephants, deer, birds with location data',
      metadata: {
        species: '25+ species',
        location: 'Indian national parks',
        license: 'Research only'
      },
      reviewsList: [
        { user: 'Dr. Gupta', rating: 5, comment: 'Invaluable for conservation research.' }
      ]
    },
    {
      id: 16,
      title: 'Financial News Sentiment Dataset',
      description: 'Financial news articles with market sentiment labels and stock price correlations.',
      category: 'Text',
      size: '25K articles',
      price: 11000,
      rating: 4.6,
      reviews: 19,
      downloads: 94,
      format: 'JSON, CSV',
      icon: FileText,
      creator: 'FinTech Analytics',
      createdDate: '2025-08-15',
      sampleData: 'News from BSE, NSE with sentiment scores',
      metadata: {
        period: '2020-2024',
        stocks: '500+ companies',
        license: 'Commercial use allowed'
      },
      reviewsList: [
        { user: 'Investor AI', rating: 5, comment: 'Great for algorithmic trading.' }
      ]
    },
    {
      id: 17,
      title: 'Satellite Imagery Land Use Dataset',
      description: 'Satellite images with land use classification for agriculture and urban planning.',
      category: 'Image',
      size: '3K images',
      price: 14000,
      rating: 4.7,
      reviews: 9,
      downloads: 41,
      format: 'TIFF, JSON',
      icon: ImageIcon,
      creator: 'GeoAI Research',
      createdDate: '2025-04-10',
      sampleData: 'Agricultural land, urban areas, forests, water bodies',
      metadata: {
        resolution: '10m per pixel',
        classes: '8 land use types',
        license: 'Research & Commercial'
      },
      reviewsList: [
        { user: 'Urban Planner', rating: 5, comment: 'Excellent for GIS applications.' }
      ]
    },
    {
      id: 18,
      title: 'Movie Reviews Multilingual Dataset',
      description: 'Movie reviews in English and regional Indian languages with ratings and sentiment.',
      category: 'Text',
      size: '60K reviews',
      price: 5500,
      rating: 4.4,
      reviews: 33,
      downloads: 167,
      format: 'JSON, CSV',
      icon: FileText,
      creator: 'CinemaData Labs',
      createdDate: '2025-09-10',
      sampleData: 'Reviews from IMDb, BookMyShow, regional platforms',
      metadata: {
        languages: 'English, Hindi, Tamil, Telugu',
        ratings: '1-10 scale',
        license: 'Research & Commercial'
      },
      reviewsList: [
        { user: 'Film Buff', rating: 4, comment: 'Good multilingual coverage.' }
      ]
    },
    {
      id: 19,
      title: 'Gesture Recognition Video Dataset',
      description: 'Video clips of hand gestures for sign language and HCI applications.',
      category: 'Video',
      size: '8K videos',
      price: 10000,
      rating: 4.7,
      reviews: 15,
      downloads: 63,
      format: 'MP4, JSON',
      icon: Video,
      creator: 'GestureAI Labs',
      createdDate: '2025-05-30',
      sampleData: '30 common gestures with multiple performers',
      metadata: {
        duration: '3-5 seconds per clip',
        resolution: '720p',
        license: 'Commercial use allowed'
      },
      reviewsList: [
        { user: 'HCI Researcher', rating: 5, comment: 'Perfect for gesture recognition models.' }
      ]
    },
    {
      id: 20,
      title: 'Agricultural Crop Disease Dataset',
      description: 'Plant leaf images with disease identification for precision agriculture AI.',
      category: 'Image',
      size: '18K images',
      price: 7800,
      rating: 4.8,
      reviews: 21,
      downloads: 112,
      format: 'JPEG, JSON',
      icon: ImageIcon,
      creator: 'AgriTech Solutions',
      createdDate: '2025-07-15',
      sampleData: 'Wheat, rice, cotton diseases with severity labels',
      metadata: {
        crops: '10 crop types',
        diseases: '25+ disease types',
        license: 'Research & Commercial'
      },
      reviewsList: [
        { user: 'Farmer Tech', rating: 5, comment: 'Helping farmers with early disease detection!' }
      ]
    }
  ]

  useEffect(() => {
    filterDatasets()
  }, [searchQuery, filterCategory, filterPrice, sortBy])

  const filterDatasets = () => {
    let filtered = [...mockDatasets]

    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(d => d.category.toLowerCase() === filterCategory.toLowerCase())
    }

    if (filterPrice === 'free') {
      filtered = filtered.filter(d => d.price === 0)
    } else if (filterPrice === 'paid') {
      filtered = filtered.filter(d => d.price > 0)
    }

    filtered.sort((a, b) => {
      if (sortBy === 'popular') return b.downloads - a.downloads
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'recent') return new Date(b.createdDate) - new Date(a.createdDate)
      return 0
    })

    setFilteredDatasets(filtered)
  }

  const handlePurchase = (dataset) => {
    if (dataset.price === 0) {
      toast.success(`${dataset.title} downloaded!`)
    } else {
      toast.success(`Purchase initiated for ${dataset.title}!`)
    }
    setSelectedDataset(null)
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-16">
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
            <Database className="text-primary-cyan" size={36} />
            <span>Dataset Marketplace</span>
          </h1>
          <p className="text-gray-400">Discover and purchase high-quality AI datasets</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search datasets..."
                className="input pl-10"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              <option value="image">Image</option>
              <option value="text">Text</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>

            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="input"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <span className="text-sm text-gray-400">
              {filteredDatasets.length} datasets found
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input w-auto"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="recent">Most Recent</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset, index) => {
            const Icon = dataset.icon
            return (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-primary-cyan/30 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary-cyan/20 rounded-lg">
                    <Icon size={24} className="text-primary-cyan" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      dataset.price === 0
                        ? 'bg-green-400/20 text-green-400'
                        : 'bg-primary-cyan/20 text-primary-cyan'
                    }`}>
                      {dataset.price === 0 ? 'Free' : `₹${dataset.price.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2 line-clamp-2">{dataset.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-3">{dataset.description}</p>

                <div className="flex items-center space-x-4 mb-4 text-sm">
                  <span className="flex items-center space-x-1 text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <span>{dataset.rating}</span>
                  </span>
                  <span className="text-gray-400">({dataset.reviews})</span>
                  <span className="flex items-center space-x-1 text-gray-400">
                    <Download size={14} />
                    <span>{dataset.downloads}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Database size={14} />
                    <span>{dataset.size}</span>
                  </span>
                  <span>{dataset.format}</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedDataset(dataset)}
                    className="flex-1 btn-outline flex items-center justify-center space-x-2 py-2"
                  >
                    <Eye size={16} />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handlePurchase(dataset)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
                  >
                    <ShoppingCart size={16} />
                    <span>{dataset.price === 0 ? 'Download' : 'Buy'}</span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDataset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setSelectedDataset(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-8 border border-white/10 max-w-4xl w-full my-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="p-4 bg-primary-cyan/20 rounded-lg">
                    {React.createElement(selectedDataset.icon, { size: 32, className: "text-primary-cyan" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedDataset.title}</h2>
                    <p className="text-gray-400 flex items-center space-x-2">
                      <Users size={16} />
                      <span>by {selectedDataset.creator}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDataset(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                    <Star size={20} fill="currentColor" />
                    <span className="text-xl font-bold">{selectedDataset.rating}</span>
                  </div>
                  <p className="text-sm text-gray-400">{selectedDataset.reviews} reviews</p>
                </div>
                <div className="glass rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2 text-primary-cyan mb-2">
                    <Download size={20} />
                    <span className="text-xl font-bold">{selectedDataset.downloads}</span>
                  </div>
                  <p className="text-sm text-gray-400">Downloads</p>
                </div>
                <div className="glass rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2 text-primary-green mb-2">
                    <Database size={20} />
                    <span className="text-xl font-bold">{selectedDataset.size}</span>
                  </div>
                  <p className="text-sm text-gray-400">Dataset Size</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-3">Description</h3>
                  <p className="text-gray-300">{selectedDataset.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3">Sample Data</h3>
                  <div className="bg-dark-card/50 rounded-lg p-4">
                    <p className="text-gray-300 font-mono text-sm">{selectedDataset.sampleData}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3">Metadata</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(selectedDataset.metadata).map(([key, value]) => (
                      <div key={key} className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-sm font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                    <MessageSquare size={20} />
                    <span>Reviews</span>
                  </h3>
                  <div className="space-y-3">
                    {selectedDataset.reviewsList.map((review, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{review.user}</span>
                          <div className="flex items-center space-x-1 text-yellow-400">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} size={14} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => handlePurchase(selectedDataset)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3"
                  >
                    <ShoppingCart size={20} />
                    <span>
                      {selectedDataset.price === 0
                        ? 'Download Now'
                        : `Purchase for ₹${selectedDataset.price.toLocaleString()}`}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DatasetMarketplace
