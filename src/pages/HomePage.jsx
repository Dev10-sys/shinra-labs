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

          <h1 className="text-5xl lg:text-8xl font-medium tracking-tighter leading-none mb-10 text-white">
            The Data Engine <br />
            for <span className="text-gray-500">AGI.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mb-12 font-light leading-relaxed">
            Accelerate the development of AI applications with high-quality training data.
            Shinra Labs provides the infrastructure for labeling, RLHF, and evaluation.
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
                  Start Request
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 border border-white/20 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition w-full sm:w-auto text-center"
                >
                  Join Workforce
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CLIENTS / LOGOS STRIP */}
      <div className="border-b border-white/10 bg-black py-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-8">Trusted by leading AI labs (Simulated)</p>
          <div className="flex justify-between items-center opacity-40 grayscale gap-8 flex-wrap">
            {/* Placeholders for logos (Text for now to keep it clean) */}
            <span className="text-xl font-bold font-mono">OPENAI</span>
            <span className="text-xl font-bold font-mono">ANTHROPIC</span>
            <span className="text-xl font-bold font-mono">COHERE</span>
            <span className="text-xl font-bold font-mono">META AI</span>
            <span className="text-xl font-bold font-mono">MISTRAL</span>
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            <FeatureCard
              title="RLHF & Ranking"
              desc="Fine-tune LLMs with human feedback. Our experts rank outputs to align models with human intent."
              tag="NLP"
            />
            <FeatureCard
              title="Computer Vision"
              desc="Pixel-perfect segmentation, bounding boxes, and keypoint annotation for autonomous systems."
              tag="VISION"
            />
            <FeatureCard
              title="3D Point Cloud"
              desc="LiDAR annotation for robotics and self-driving cars. Cuboids and semantic segmentation in 3D space."
              tag="3D"
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-12">
            <StatItem value="10B+" label="Annotations" />
            <StatItem value="50k+" label="Experts" />
            <StatItem value="99.9%" label="Quality" />
            <StatItem value="API" label="Integration" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-white flex items-center justify-center text-[10px] font-bold text-black">SL</div>
            <span className="font-bold tracking-widest uppercase text-sm">SHINRA Labs</span>
          </div>
          <div className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
            © 2025 SHINRA Labs Inc. // System Operational
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, tag }) {
  return (
    <div className="p-10 bg-black hover:bg-white/5 transition duration-300 group">
      <div className="mb-8 flex justify-between items-start">
        <span className="text-[10px] font-mono border border-white/20 px-2 py-1 text-gray-400 group-hover:text-white group-hover:border-white transition-colors uppercase">{tag}</span>
        <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </div>
      <h3 className="text-2xl font-medium mb-4 text-white tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed font-light">{desc}</p>
    </div>
  );
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
