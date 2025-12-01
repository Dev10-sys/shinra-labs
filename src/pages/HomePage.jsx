import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="pt-10 px-6 max-w-7xl mx-auto">

      {/* TOP BREADCRUMB */}
      <div className="text-[10px] uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
        <span className="h-[1px] w-6 bg-gray-600"></span>
        SHINRA Labs • Workspace Platform
      </div>

      {/* HERO SECTION */}
      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT TEXT */}
        <div className="space-y-6">
          <h1 className="text-5xl font-semibold leading-tight">
            Reliable data workflows  
            <span className="block text-gray-300">built for everyday teams.</span>
          </h1>

          <p className="text-sm text-gray-300 max-w-lg leading-relaxed">
            SHINRA Labs provides a simple workspace where teams can manage projects, 
            assign contributors, review submissions, and maintain datasets in one clean interface.
          </p>

          <div className="flex gap-4 pt-2">
            <Link
              to="/login"
              className="px-5 py-2 rounded-full border border-white text-xs tracking-widest uppercase hover:bg-white hover:text-black transition"
            >
              Join as Freelancer
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 rounded-full border border-gray-400 text-xs tracking-widest uppercase hover:border-white transition"
            >
              Create Project
            </Link>
          </div>
        </div>

        {/* RIGHT SIMPLE STAT GRID */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-md bg-[#1c1c1c] border border-gray-700">
            <div className="text-gray-400 text-xs">Projects</div>
            <div className="text-2xl font-semibold">Active</div>
            <p className="text-gray-500 text-xs mt-1">manage your workflow</p>
          </div>

          <div className="p-5 rounded-md bg-[#1c1c1c] border border-gray-700">
            <div className="text-gray-400 text-xs">Contributors</div>
            <div className="text-2xl font-semibold">Verified</div>
            <p className="text-gray-500 text-xs mt-1">screened members</p>
          </div>

          <div className="p-5 rounded-md bg-[#1c1c1c] border border-gray-700">
            <div className="text-gray-400 text-xs">Payouts</div>
            <div className="text-2xl font-semibold">Secure</div>
            <p className="text-gray-500 text-xs mt-1">safe & simple</p>
          </div>

          <div className="p-5 rounded-md bg-[#1c1c1c] border border-gray-700">
            <div className="text-gray-400 text-xs">Setup</div>
            <div className="text-2xl font-semibold">Quick</div>
            <p className="text-gray-500 text-xs mt-1">easy start</p>
          </div>
        </div>

      </div>

      {/* FEATURES SECTION */}
      <div className="mt-20">
        <h2 className="text-2xl font-semibold mb-6">Platform Highlights</h2>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="p-5 rounded-lg bg-[#1b1b1b] border border-gray-700">
            <h3 className="text-white font-semibold mb-2">Organized Projects</h3>
            <p className="text-gray-400 text-sm">
              Create structured tasks with clear instructions and timelines.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#1b1b1b] border border-gray-700">
            <h3 className="text-white font-semibold mb-2">Smooth Submissions</h3>
            <p className="text-gray-400 text-sm">
              Contributors upload files or links for review in one place.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#1b1b1b] border border-gray-700">
            <h3 className="text-white font-semibold mb-2">Dataset Library</h3>
            <p className="text-gray-400 text-sm">
              Access stored datasets and previous project records easily.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-gray-800 pt-10 pb-6 text-gray-400 text-sm">
        <div className="grid md:grid-cols-4 gap-6">

          <div>
            <h4 className="font-semibold text-white mb-2">SHINRA Labs</h4>
            <p className="text-gray-500 text-sm">
              A clean and functional workspace created for demonstration.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Product</h4>
            <ul className="space-y-1">
              <li>Tasks</li>
              <li>Datasets</li>
              <li>Freelancer Area</li>
              <li>Company Panel</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Company</h4>
            <ul className="space-y-1">
              <li>About Us</li>
              <li>How It Works</li>
              <li>Contact</li>
              <li>Policies</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Resources</h4>
            <ul className="space-y-1">
              <li>Help Guide</li>
              <li>Documentation</li>
              <li>Notes</li>
            </ul>
          </div>

        </div>

        <div className="text-center text-gray-600 text-xs mt-10">
          © {new Date().getFullYear()} SHINRA Labs — All Rights Reserved
        </div>
      </footer>

    </section>
  );
}

export default HomePage;
