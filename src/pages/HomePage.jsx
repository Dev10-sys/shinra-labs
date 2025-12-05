import React from "react";
import { Link } from "react-router-dom";
import { getStoredUser } from "../authUtils";

function HomePage() {
  const user = getStoredUser();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 opacity-50"></div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-8 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Introducing SHINRA Labs v2.0
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 animate-fade-in-up delay-100">
            Accelerate AI with <br />
            <span className="text-white">High-Quality Data.</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
            The enterprise platform for data labeling, annotation, and dataset management.
            Connect with expert labelers to train your models faster and more accurately.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            {user ? (
              <Link
                to={user.role === "company" ? "/company" : "/freelancer"}
                className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] w-full sm:w-auto"
                >
                  Start Labeling
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition w-full sm:w-auto"
                >
                  Hire Labelers
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 bg-gray-900/30 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="⚡"
              title="Rapid Annotation"
              desc="Get your data labeled in hours, not weeks. Our distributed workforce ensures speed without compromising quality."
            />
            <FeatureCard
              icon="🛡️"
              title="Enterprise Security"
              desc="Your data is protected with bank-grade encryption and strict access controls. SOC2 compliant workflow."
            />
            <FeatureCard
              icon="🎯"
              title="99.9% Accuracy"
              desc="Multi-stage review process and consensus algorithms ensure your ground truth is actually true."
            />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatItem value="10M+" label="Labels Created" />
            <StatItem value="50k+" label="Active Freelancers" />
            <StatItem value="99.9%" label="Accuracy Rate" />
            <StatItem value="24/7" label="Support" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-black text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <div className="h-6 w-6 rounded border border-white/30 flex items-center justify-center text-xs font-bold">SL</div>
          <span className="font-bold tracking-widest uppercase text-sm">SHINRA Labs</span>
        </div>
        <p className="text-gray-600 text-sm">
          &copy; 2025 SHINRA Labs Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition duration-300">
      <div className="text-4xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-mono">{value}</div>
      <div className="text-sm text-gray-500 uppercase tracking-widest font-medium">{label}</div>
    </div>
  );
}

export default HomePage;
