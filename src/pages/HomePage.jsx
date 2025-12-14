import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion";
import { getStoredUser } from "../authUtils";

function HomePage() {
  const user = getStoredUser();

  // Scroll Parallax
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // Cursor Ambient Light
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >

      {/* AMBIENT LIGHT FOLLOWER */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.03), transparent 80%)`
        }}
      />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 border-b border-white/10 overflow-hidden">

        {/* Animated Grid Background */}
        <motion.div
          style={{ y: y1, opacity: 0.4 }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"
        />

        {/* Scan Line Animation */}
        <motion.div
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none z-0"
        />

        <div className="max-w-6xl mx-auto relative z-10">

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* SYSTEM BADGE */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-1.5 border border-white/20 bg-white/5 mb-8 group cursor-help relative hover:bg-white/10 transition-colors">
              <span className="relative flex h-2 w-2">
                <motion.span
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                ></motion.span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-dm font-mono tracking-widest uppercase text-gray-300 group-hover:text-white transition-colors">System v2.0 Operational</span>

              {/* TOOLTIP */}
              <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-48 bg-[#0F1014] border border-white/20 p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Status Report</div>
                <div className="text-xs text-green-400 font-mono">ALL SYSTEMS NOMINAL</div>
              </span>
            </motion.div>

            {/* HEADLINE */}
            <motion.h1 variants={fadeInUp} className="text-6xl lg:text-8xl font-medium tracking-tighter leading-[0.9] mb-10 text-white max-w-5xl">
              The Operational Backbone for <br />
              <motion.span
                className="text-gray-500 inline-block relative"
                whileHover={{ color: "#ffffff", transition: { duration: 0.3 } }}
              >
                High-Performance AI Systems
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-2xl text-gray-400 max-w-3xl mb-14 font-light leading-relaxed">
              SHINRA Labs delivers the data infrastructure that modern AI demands — expert-driven annotation, automated quality governance, AI-assisted workflows, and globally scalable operations.
              <br /><br />
              Build and evaluate models with the precision, reliability, and throughput trusted by advanced AI teams.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-6">
              {user ? (
                <Link to={user.role === "company" ? "/company" : "/freelancer"}>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest transition"
                  >
                    Launch Console
                  </motion.button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest transition w-full sm:w-auto text-center"
                    >
                      Launch a Project
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 border border-white/20 text-white text-sm font-bold uppercase tracking-widest transition w-full sm:w-auto text-center"
                    >
                      Access the Workforce
                    </motion.button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUST STATEMENT - SCROLL REVEAL */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="border-b border-white/10 bg-black py-12"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-xl md:text-2xl font-light text-white mb-8">Trusted by organizations building mission-critical AI, enterprise automation, and next-generation intelligence systems.</h2>
          <div className="flex justify-center items-center opacity-40 grayscale gap-12 flex-wrap">
            {/* Placeholders for logos (Text for now to keep it clean) */}
            <span className="text-xl font-bold font-mono">OPENAI</span>
            <span className="text-xl font-bold font-mono">ANTHROPIC</span>
            <span className="text-xl font-bold font-mono">COHERE</span>
            <span className="text-xl font-bold font-mono">META AI</span>
          </div>
        </div>
      </motion.div>

      {/* CORE CAPABILITIES */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-medium tracking-tight mb-4">Core Capabilities</h2>
            <div className="h-1 w-20 bg-white"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            <FeatureCard
              title="Full-Stack Data Labeling Infrastructure"
              desc="From ingestion to delivery, SHINRA orchestrates high-volume annotation across images, text, audio, video, and spatial data — with deterministic quality and predictable turnaround times."
              tag="INFRA"
            />
            <FeatureCard
              title="AI-Accelerated Annotation Pipelines"
              desc="Model-driven pre-labeling, intelligent sample selection, and automated verification loops dramatically reduce labeling time while improving consistency."
              tag="PIPELINE"
            />
            <FeatureCard
              title="Human-in-the-Loop Quality Governance"
              desc="A multi-tier QC engine combining consensus algorithms, gold standards, anomaly detection, and expert adjudication ensures every dataset reaches production-ready accuracy."
              tag="QUALITY"
            />
            <FeatureCard
              title="Autonomous Workforce Management"
              desc="AI-routed task distribution, performance scoring, fraud detection, and adaptive worker selection ensure optimal throughput and reliability under real-world demands."
              tag="WORKFORCE"
            />
          </div>
        </div>
      </section>

      {/* INDUSTRY VERTICALS */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-medium tracking-tight mb-4">Industry Verticals</h2>
            <div className="h-1 w-20 bg-white"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <VerticalCard title="Computer Vision Systems" desc="Pixel-accurate segmentation, detection, tracking, and high-density visual annotation for real-time and offline perception stacks." />
            <VerticalCard title="Language & NLP Intelligence" desc="NER, classification, safety evaluation, conversational ranking, summarization scoring, and high-fidelity text annotation for model alignment." />
            <VerticalCard title="Speech & Audio Understanding" desc="Event detection, timestamping, ASR correction, speaker segmentation, and multi-modal acoustic labeling." />
            <VerticalCard title="Video Intelligence & Temporal AI" desc="Action recognition, frame-level labeling, temporal segmentation, multi-object tracking, and long-range sequence annotation." />
          </div>
        </div>
      </section>

      {/* WHY SHINRA */}
      <section className="py-24 bg-zinc-900 text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-medium tracking-tight mb-4 text-white">Why SHINRA</h2>
            <div className="h-1 w-20 bg-white"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-lg font-bold mb-3 text-white">Precision Built Into Every Stage</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Automated validation, consistency scoring, and multi-model cross checks ensure high-integrity outputs across modalities.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-white">Scalable for Enterprise Workloads</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Elastic processing pipelines and workforce management enable throughput from thousands to millions of assets without sacrificing quality.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-white">Guaranteed Accuracy Through Governance</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Quality gates, gold tasks, reviewer oversight, and continuous calibration deliver predictable performance at production scale.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-white">Deployment-Ready Datasets</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Export in COCO, YOLO, TFRecord, CSV, JSON, or custom enterprise schemas — ready for immediate training or evaluation workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT METRICS */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="border-l border-white/20 pl-6">
              <div className="text-4xl md:text-5xl font-light text-white mb-2">99.9%</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-6">Verified Accuracy through AI + human governance</div>
            </div>
            <div className="border-l border-white/20 pl-6">
              <div className="text-4xl md:text-5xl font-light text-white mb-2">Millions</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-6">of annotations processed with consistency guarantees</div>
            </div>
            <div className="border-l border-white/20 pl-6">
              <div className="text-4xl md:text-5xl font-light text-white mb-2">Real-Time</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-6">Scoring & Routing of calibrated workforce</div>
            </div>
            <div className="border-l border-white/20 pl-6">
              <div className="text-4xl md:text-5xl font-light text-white mb-2">API-First</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-6">Integration for seamless automation</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-32 bg-zinc-900 border-t border-white/10 text-center relative overflow-hidden">
        {/* Background glow */}
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full pointer-events-none"
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-8 tracking-tighter">Power your AI with enterprise-grade <br />data operations.</h2>
          <p className="text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto">Start your project today or join the SHINRA workforce powering the next generation of intelligence systems.</p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-black text-sm font-bold uppercase tracking-widest transition"
              >
                Launch a Project
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 border border-white/20 text-white text-sm font-bold uppercase tracking-widest transition"
              >
                Access the Workforce
              </motion.button>
            </Link>
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="py-16 bg-black border-t border-white/10 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 text-gray-500">

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 flex items-center justify-center">
              <img src="/logo.png" alt="SL" className="w-full h-full object-contain filter brightness-0 invert" />
            </div>
            <span className="text-white font-bold tracking-widest uppercase">SHINRA LABS</span>
          </div>

          <div className="flex flex-wrap gap-8 uppercase tracking-widest text-[11px] font-bold">
            <a href="#" className="hover:text-white transition-colors">Solutions</a>
            <a href="#" className="hover:text-white transition-colors">Workforce</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>

          <div className="flex gap-8 uppercase tracking-widest text-[11px] font-bold">
            <Link to="/login" className="hover:text-white transition-colors">Log In</Link>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
            © SHINRA Labs. All rights reserved.
          </div>
          <div className="text-[10px] text-gray-700 font-mono">
            INDIA
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, tag }) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      className="p-10 bg-black transition duration-300 group min-h-[320px] flex flex-col cursor-crosshair"
    >
      <div className="mb-auto flex justify-between items-start">
        <span className="text-[10px] font-mono border border-white/20 px-2 py-1 text-gray-400 group-hover:text-white group-hover:border-white transition-colors uppercase">{tag}</span>
      </div>
      <h3 className="text-2xl font-medium mb-4 text-white tracking-tight mt-8">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed font-light">{desc}</p>
    </motion.div>
  );
}

function VerticalCard({ title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition group"
    >
      <h3 className="text-white text-lg font-medium mb-4 group-hover:text-green-400 transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm font-light leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function StatItem({ value, label }) {
  return (
    <div>
      <div className="text-4xl md:text-6xl font-light text-white mb-2 tracking-tighter">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">{label}</div>
    </div>
  );
}

export default HomePage;
