import React from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../authUtils";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (role) => {
    const success = await loginUser(role);
    if (success) {
      if (role === "company") navigate("/company");
      else navigate("/freelancer");
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* LEFT: BRANDING & VISUALS */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-900 items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>

        <div className="relative z-10 max-w-lg px-12">
          <div className="h-12 w-12 rounded border border-white/20 flex items-center justify-center text-lg font-bold tracking-wider mb-8 backdrop-blur-md bg-white/5">
            SL
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
            Powering the Next Generation of AI.
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            SHINRA Labs connects world-class enterprises with expert data labelers to build superior datasets for machine learning models.
          </p>

          <div className="mt-12 flex gap-4 text-sm font-mono text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Operational
            </div>
            <span>•</span>
            <div>v2.4.0-stable</div>
          </div>
        </div>
      </div>

      {/* RIGHT: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
            <p className="text-gray-400">Select your workspace to continue.</p>
          </div>

          <div className="space-y-4">
            {/* Company Login */}
            <button
              onClick={() => handleLogin("company")}
              className="group w-full p-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 text-left flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded bg-blue-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🏢
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">Company Workspace</div>
                <div className="text-xs text-gray-500 mt-0.5">Post tasks, manage datasets, and review work.</div>
              </div>
              <div className="ml-auto text-gray-600 group-hover:text-white transition-colors">→</div>
            </button>

            {/* Freelancer Login */}
            <button
              onClick={() => handleLogin("freelancer")}
              className="group w-full p-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 text-left flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded bg-purple-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                👨‍💻
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-purple-400 transition-colors">Freelancer Workspace</div>
                <div className="text-xs text-gray-500 mt-0.5">Complete tasks, earn money, and build reputation.</div>
              </div>
              <div className="ml-auto text-gray-600 group-hover:text-white transition-colors">→</div>
            </button>
          </div>

          <div className="mt-10 text-center text-xs text-gray-600">
            By logging in, you agree to our Terms of Service and Privacy Policy.
            <br />
            &copy; 2025 SHINRA Labs Inc.
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
