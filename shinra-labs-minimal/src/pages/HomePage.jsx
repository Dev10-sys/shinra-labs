export default function HomePage() {
  return (
    <div className="text-gray-900">

      {/* HERO SECTION */}
      <div className="bg-gray-900 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
          SHINRA Labs — India’s First Decentralized Data Labeling Marketplace
        </h1>

        <p className="text-lg max-w-3xl mx-auto text-gray-300">
          We connect AI companies with India’s 15M+ coders to solve the global 
          <span className="font-semibold text-white"> $13 billion data annotation problem</span>.  
          Faster, cheaper, and better quality than Scale AI.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <a href="/login" className="px-6 py-3 bg-white text-gray-900 rounded shadow font-semibold hover:bg-gray-200 transition">
            Login
          </a>

          <a href="/signup" className="px-6 py-3 border border-gray-400 text-white rounded font-semibold hover:bg-gray-800 transition">
            Create Account
          </a>
        </div>
      </div>

      {/* PROBLEM SECTION */}
      <div className="py-20 px-6 text-center bg-white">
        <h2 className="text-4xl font-bold mb-6">The Problem We Solve</h2>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          Global AI companies need over <b>1 billion labeled images every year</b>.
          Current solutions are slow, expensive, and inaccurate.
        </p>
      </div>

      {/* SOLUTION SECTION */}
      <div className="py-20 px-6 text-center bg-gray-100">
        <h2 className="text-4xl font-bold mb-10">Our Solution</h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

          <div className="p-8 bg-white rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-4">1. AgentSwarm</h3>
            <p className="text-gray-600">
              Companies post tasks → Freelancers label → AI verifies → Instant payout.
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-4">2. DataSetu</h3>
            <p className="text-gray-600">
              Every labeled dataset becomes a digital product that can be resold infinitely.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

