import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Target, 
  Briefcase, 
  Shield, 
  Upload, 
  CheckCircle, 
  Sparkles, 
  Wallet,
  Check
} from 'lucide-react'

const HomePage = () => {
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

  const features = [
    {
      title: 'For Freelancers',
      icon: Target,
      color: 'from-accent-primary to-accent-secondary',
      benefits: [
        'Earn ₹3-10K/month',
        'Flexible working hours',
        'Instant payouts'
      ]
    },
    {
      title: 'For Companies',
      icon: Briefcase,
      color: 'from-accent-secondary to-accent-primary',
      benefits: [
        '50% cheaper than competitors',
        '2-3 day turnaround',
        'Scale easily on demand'
      ]
    },
    {
      title: 'Quality Guaranteed',
      icon: Shield,
      color: 'from-accent-success to-accent-secondary',
      benefits: [
        'AI-verified accuracy',
        '99% quality guarantee',
        '24/7 dedicated support'
      ]
    }
  ]

  const workflowSteps = [
    {
      title: 'Company Uploads',
      description: 'Upload your dataset and define labeling requirements',
      icon: Upload,
      color: 'accent-primary'
    },
    {
      title: 'Freelancer Labels',
      description: 'Skilled annotators work on your data',
      icon: CheckCircle,
      color: 'accent-secondary'
    },
    {
      title: 'AI Verifies',
      description: 'Our AI checks quality automatically',
      icon: Sparkles,
      color: 'accent-success'
    },
    {
      title: 'Instant Payout',
      description: 'Pay only for verified, quality work',
      icon: Wallet,
      color: 'accent-warning'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/10"></div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl"
          />
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 lg:px-8 relative z-10"
        >
          <motion.div variants={itemVariants} className="text-center max-w-5xl mx-auto">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient leading-tight"
            >
              Build AI Faster with High-Quality Data
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-2xl text-text-secondary mb-10 max-w-3xl mx-auto"
            >
              India's First Decentralized Data Labeling Platform — Earn, Learn, Scale
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link
                to="/signup"
                className="btn-primary inline-flex items-center space-x-2 group text-base md:text-lg px-8 py-4"
              >
                <span>Get Started Free</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              
              <Link
                to="/marketplace"
                className="btn-outline inline-flex items-center space-x-2 text-base md:text-lg px-8 py-4"
              >
                <span>View Demo</span>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-text-tertiary text-sm md:text-base"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-accent-success" />
                <span>Trusted by 500+ Freelancers</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-text-tertiary rounded-full"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-accent-success" />
                <span>₹10L+ Data Labeled</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text-primary">
              Built for Everyone
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Whether you're a freelancer looking to earn or a company needing quality data, we've got you covered
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="card group cursor-pointer"
                >
                  <div className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:shadow-glow transition-all`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-text-primary">
                    {feature.title}
                  </h3>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <Check size={20} className="text-accent-success mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text-primary">
              How It Works
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Simple, transparent process from upload to payout
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Lines (Desktop) */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-success mx-24"></div>

            {workflowSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-${step.color}/10 border-2 border-${step.color} flex items-center justify-center relative z-10`}>
                      <Icon size={36} className={`text-${step.color}`} />
                    </div>
                    <div className="mb-2">
                      <span className="text-text-tertiary text-sm font-semibold">
                        STEP {index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-text-primary">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">
              Ready to get started?
            </h2>
            <p className="text-text-secondary text-lg mb-10">
              Join thousands of freelancers earning or companies scaling with quality data
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup?role=freelancer"
                className="btn-primary inline-flex items-center space-x-2 group px-8 py-4"
              >
                <Target size={20} />
                <span>Sign Up as Freelancer</span>
              </Link>
              <Link
                to="/signup?role=company"
                className="btn-secondary inline-flex items-center space-x-2 px-8 py-4"
              >
                <Briefcase size={20} />
                <span>Sign Up as Company</span>
              </Link>
            </div>
            <div className="mt-6">
              <Link to="/contact" className="text-accent-primary hover:text-accent-secondary transition-colors">
                or Schedule a Demo →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

