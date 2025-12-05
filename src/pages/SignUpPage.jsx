import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { storeUser } from "../authUtils";

/* ==================================================================================
   SHINRA LABS PLATFORM - ONBOARDING & REGISTRATION
   - Professional Scale AI Aesthetic
   - Role-based input fields
   ================================================================================== */

export default function SignUpPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState("company"); // 'company' or 'freelancer'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Common Fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    // Company Fields
    const [companyName, setCompanyName] = useState("");
    const [gstId, setGstId] = useState("");
    const [industry, setIndustry] = useState("Technology");
    const [website, setWebsite] = useState("");

    // Freelancer Fields
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState("Beginner");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Create Auth User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;
            const user = authData.user;

            if (!user) {
                throw new Error("Registration succeeded but no user returned. Check email confirmation settings.");
            }

            // 2. Insert into users_meta (Profile)
            // Note: We use the auth.uid as the primary key for the meta table
            const metaData = {
                id: user.id,
                role: role,
                name: role === "company" ? companyName : name,
                email: email,
                created_at: new Date(),
                // Company Specific
                gst_id: role === "company" ? gstId : null,
                industry: role === "company" ? industry : null,
                website: role === "company" ? website : null,
                // Freelancer Specific
                skills: role === "freelancer" ? skills.split(",").map(s => s.trim()) : null,
                experience: role === "freelancer" ? experience : null,
                rating: role === "freelancer" ? 5.0 : null,
                completed_tasks: 0,
                earnings: 0,
            };

            const { error: metaError } = await supabase
                .from("users_meta")
                .insert(metaData);

            // If users_meta fails, it might be because the table doesn't exist or RLS.
            // We will proceed but warn.
            if (metaError) {
                console.error("Meta insert error:", metaError);
                // Fallback for demo: just store locally
            }

            // 3. Auto Login (Store in LocalStorage as per our app's pattern)
            storeUser(metaData);

            // 4. Redirect
            navigate(role === "company" ? "/company" : "/freelancer");

        } catch (err) {
            console.error(err);
            setError(err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-[#050505] border border-white/10 shadow-2xl overflow-hidden animate-fade-in-up">

                {/* LEFT: INFO & ANIMATION */}
                <div className="p-12 hidden md:flex flex-col justify-between bg-zinc-900/30 border-r border-white/5">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <div className="h-6 w-6 bg-white flex items-center justify-center text-[10px] font-bold text-black">SL</div>
                            <span className="font-bold tracking-widest uppercase text-sm text-gray-400">SHINRA Labs</span>
                        </div>

                        <h2 className="text-3xl font-light leading-tight mb-4">
                            Join the future of <br />
                            <span className="text-white font-bold">Data Intelligence.</span>
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Whether you are an enterprise seeking ground truth or an expert labeler shaping AI, Shinra provides the infrastructure for AGI.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="w-4 h-4 rounded-full border border-gray-700 flex items-center justify-center text-[8px]">✓</span>
                            SOC2 Compliant Security
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="w-4 h-4 rounded-full border border-gray-700 flex items-center justify-center text-[8px]">✓</span>
                            Automated Payouts
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="w-4 h-4 rounded-full border border-gray-700 flex items-center justify-center text-[8px]">✓</span>
                            Real-time Analytics
                        </div>
                    </div>
                </div>

                {/* RIGHT: FORM */}
                <div className="p-12 relative">
                    <div className="flex justify-end mb-6">
                        <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition">Back to Login</Link>
                    </div>

                    <h2 className="text-xl font-bold mb-1">Create Account</h2>
                    <p className="text-gray-500 text-xs mb-8">Enter your credentials to access the console.</p>

                    {/* ROLE SWITCHER */}
                    <div className="flex bg-white/5 p-1 rounded mb-6">
                        <button
                            onClick={() => setRole("company")}
                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wide transition-all ${role === "company" ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"}`}
                        >
                            Enterprise
                        </button>
                        <button
                            onClick={() => setRole("freelancer")}
                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wide transition-all ${role === "freelancer" ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"}`}
                        >
                            Labeler
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
                            Error: {error}
                        </div>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-4">

                        {/* COMMON: EMAIL & PASS */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Work Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* CONDITIONAL FIELDS */}
                        {role === "company" ? (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company / Org Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Industry</label>
                                        <select
                                            value={industry}
                                            onChange={(e) => setIndustry(e.target.value)}
                                            className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-white focus:outline-none appearance-none"
                                        >
                                            <option>Technology</option>
                                            <option>Automotive</option>
                                            <option>Healthcare</option>
                                            <option>Retail</option>
                                            <option>Agriculture</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">GST / Tax ID</label>
                                        <input
                                            type="text"
                                            value={gstId}
                                            onChange={(e) => setGstId(e.target.value)}
                                            className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                                            placeholder="OPTIONAL"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Website</label>
                                    <input
                                        type="url"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                                        placeholder="https://"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Skills (Comma Separated)</label>
                                    <input
                                        type="text"
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                        className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                                        placeholder="e.g. Bounding Boxes, Segmentation, Translation"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Experience Level</label>
                                    <select
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-white focus:outline-none appearance-none"
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Expert</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-white text-black font-bold text-sm uppercase tracking-wide hover:bg-gray-200 transition disabled:opacity-50"
                        >
                            {loading ? "Registering..." : "Create Account"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
