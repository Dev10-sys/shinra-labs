import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="pt-14 px-6 max-w-7xl mx-auto">

      {/* TOP BREADCRUMB */}
      <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500 flex items-center gap-2 mb-6">
        <span className="h-[1px] w-10 bg-gray-700"></span>
        SHINRA Labs — Data Workforce Platform
      </div>

      {/* HERO SECTION */}
      <div className="grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT TEXT */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            A structured workflow  
            <span className="block text-gray-300">
              built for real data operations.
            </span>
          </h1>

          <p className="text-sm text-gray-300 max-w-lg leading-relaxed">
            Manage projects, publish tasks, coordinate contributors, review submissions,
            and maintain dataset records — all inside one clean, unified workspace.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 pt-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-full border border-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition"
            >
              Freelancer Login
            </Link>

            <Link
              to="/login"
              className="px-5 py-2 rounded-full border border-gray-400 text-xs tracking-[0.25em] uppercase hover:border-white hover:text-white transition"
            >
              Company Login
            </Link>
          </div>
        </div>

        {/* RIGHT — FEATURE BOXES */}
        <div className="grid grid-cols-2 gap-4">
          <FeatureCard
            label="Projects"
            value="Organized"
            note="structured workflows"
          />
          <FeatureCard
            label="Contributors"
            value="Verified"
            note="screened & managed"
          />
          <FeatureCard
            label="Payouts"
            value="On-Time"
            note="secure processing"
          />
          <FeatureCard
            label="Setup"
            value="Instant"
            note="start in minutes"
          />
        </div>

      </div>

      {/* FEATURE GRID SECTION */}
      <div className="mt-24">
        <h2 className="text-2xl font-semibold mb-8">Why teams use SHINRA?</h2>

        <div className="grid md:grid-cols-3 gap-5">
          <InfoBox
            title="Task Management"
            text="Publish tasks with clear instructions, deadlines, and payout rules."
          />
          <InfoBox
            title="Submission Review"
            text="Contributors upload work that you can validate and approve easily."
          />
          <InfoBox
            title="Dataset Records"
            text="Maintain datasets, history, and labeling logs in a single library."
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-24 border-t border-gray-800 pt-10 pb-6 text-gray-400 text-sm">
        <div className="grid md:grid-cols-4 gap-6">

          {/* Brand */}
          <div>
            <h4 className="font-semibold text-white mb-2">SHINRA Labs</h4>
            <p className="text-gray-500 text-sm">
              A minimal, structured workspace crafted for demonstration purposes.
            </p>
          </div>

          {/* Product */}
          <FooterList title="Product" items={["Tasks", "Datasets", "Freelancer Area", "Company Panel"]} />

          {/* Company */}
          <FooterList title="Company" items={["About Us", "How It Works", "Contact", "Policies"]} />

          {/* Resources */}
          <FooterList title="Resources" items={["Guide", "Notes", "Documentation"]} />

        </div>

        <div className="text-center text-gray-600 text-xs mt-10">
          © {new Date().getFullYear()} SHINRA Labs — All Rights Reserved
        </div>
      </footer>

    </section>
  );
}

/* ---------------- COMPONENTS ---------------- */

function FeatureCard({ label, value, note }) {
  return (
    <div className="p-5 rounded-md bg-black/40 border border-gray-700 backdrop-blur">
      <div className="text-gray-400 text-xs uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <p className="text-gray-500 text-xs mt-[6px]">{note}</p>
    </div>
  );
}

function InfoBox({ title, text }) {
  return (
    <div className="p-6 rounded-lg bg-black/40 border border-gray-700 backdrop-blur">
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
}

function FooterList({ title, items }) {
  return (
    <div>
      <h4 className="font-semibold text-white mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
