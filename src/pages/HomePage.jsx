import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Users, Database, Zap } from 'lucide-react'
import { supabase, TABLES } from '../services/supabase'
import { useTranslation } from 'react-i18next'

const HomePage = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    freelancersEarned: 0,
    datasetsSold: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch tasks completed
      const { count: tasksCount } = await supabase
        .from(TABLES.SUBMISSIONS)
        .select('*', { count: 'exact', head: true })

      // Fetch total earnings
      const { data: earningsData } = await supabase
        .from(TABLES.TRANSACTIONS)
        .select('amount')
        .eq('type', 'earning')

      const totalEarned = earningsData?.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) || 0

      // Fetch datasets sold
      const { count: datasetsCount } = await supabase
        .from(TABLES.PURCHASES)
        .select('*', { count: 'exact', head: true })

      setStats({
        tasksCompleted: tasksCount || 0,
        freelancersEarned: totalEarned,
        datasetsSold: datasetsCount || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-cyan/10 via-transparent to-primary-blue/10"></div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 lg:px-8 relative z-10"
        >
          <motion.div variants={itemVariants} className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-gradient"
            >
              {t('home.tagline')}
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              {t('home.subtitle')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/signup"
                className="btn-primary inline-flex items-center space-x-2 group"
              >
                <span>{t('home.getStarted')}</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              
              <Link
                to="/marketplace"
                className="btn-outline inline-flex items-center space-x-2"
              >
                <span>{t('home.learnMore')}</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <StatCard
              icon={Zap}
              value={stats.tasksCompleted.toLocaleString()}
              label="Tasks Completed"
              color="cyan"
            />
            <StatCard
              icon={TrendingUp}
              value={`₹${(stats.freelancersEarned / 1000).toFixed(0)}K`}
              label="Freelancers Earned"
              color="blue"
            />
            <StatCard
              icon={Database}
              value={stats.datasetsSold}
              label="Datasets Sold"
              color="green"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Why Choose SHINRA?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Multi-Modal Annotation',
                description: 'Support for images, videos, audio, and text with AI-powered suggestions',
                icon: Zap,
              },
              {
                title: 'Fair Marketplace',
                description: 'Buy and sell high-quality datasets with transparent pricing and ratings',
                icon: Database,
              },
              {
                title: 'Gamified Experience',
                description: 'Earn XP, unlock badges, and climb the leaderboard',
                icon: TrendingUp,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card hover:scale-105 transition-transform cursor-pointer"
              >
                <feature.icon className="text-primary-cyan mb-4" size={40} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const StatCard = ({ icon: Icon, value, label, color }) => {
  const colorClasses = {
    cyan: 'text-primary-cyan bg-primary-cyan/10',
    blue: 'text-primary-blue bg-primary-blue/10',
    green: 'text-primary-green bg-primary-green/10',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card text-center"
    >
      <div className={`w-16 h-16 ${colorClasses[color]} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon size={32} />
      </div>
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-gray-400">{label}</div>
    </motion.div>
  )
}

export default HomePage

