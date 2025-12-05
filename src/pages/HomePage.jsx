import React from "react";
import { Link } from "react-router-dom";
import { getStoredUser } from "../authUtils";

function HomePage() {
  const user = getStoredUser();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 border-b border-white/10">

        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-white/20 bg-white/5 mb-8">
            <span className="w-1.5 h-1.5 bg-green-500 animate-pulse"></span>
            <span className="text-xs font-dm font-mono tracking-widest uppercase text-gray-300">System v2.0 Operational</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-medium tracking-tighter leading-tight mb-8 text-white max-w-5xl">
            The Operational Backbone for <br />
            <span className="text-gray-500">High-Performance AI Systems</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mb-12 font-light leading-relaxed">
            SHINRA Labs delivers the data infrastructure that modern AI demands — expert-driven annotation, automated quality governance, AI-assisted workflows, and globally scalable operations.
            <br /><br />
            Build and evaluate models with the precision, reliability, and throughput trusted by advanced AI teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {user ? (
              <Link
                to={user.role === "company" ? "/company" : "/freelancer"}
                className="px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition"
              >
                Launch Console
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition w-full sm:w-auto text-center"
                >
                  Launch a Project
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 border border-white/20 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition w-full sm:w-auto text-center"
                >
                  Access the Workforce
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* TRUST STATEMENT */}
      <div className="border-b border-white/10 bg-black py-12">
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
      </div>

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-8 tracking-tighter">Power your AI with enterprise-grade <br />data operations.</h2>
          <p className="text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto">Start your project today or join the SHINRA workforce powering the next generation of intelligence systems.</p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/login" className="px-10 py-5 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition">
              Launch a Project
            </Link>
            <Link to="/signup" className="px-10 py-5 border border-white/20 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition">
              Access the Workforce
            </Link>
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="py-16 bg-black border-t border-white/10 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 text-gray-500">

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-white text-black flex items-center justify-center font-bold text-xs tracking-tighter">SL</div>
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
            SAN FRANCISCO // TOKYO // SINGAPORE
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, tag }) {
  return (
    <div className="p-10 bg-black hover:bg-white/5 transition duration-300 group min-h-[320px] flex flex-col">
      <div className="mb-auto flex justify-between items-start">
        <span className="text-[10px] font-mono border border-white/20 px-2 py-1 text-gray-400 group-hover:text-white group-hover:border-white transition-colors uppercase">{tag}</span>
      </div>
      <h3 className="text-2xl font-medium mb-4 text-white tracking-tight mt-8">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed font-light">{desc}</p>
    </div>
  );
}

function VerticalCard({ title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition group">
      <h3 className="text-white text-lg font-medium mb-4 group-hover:text-green-400 transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm font-light leading-relaxed">{desc}</p>
    </div>
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
