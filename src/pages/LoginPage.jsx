import React, { useState } from "react";
import { storeUser } from "../authUtils";
import { supabase } from "../supabaseClient";

export default function LoginPage() {
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill email and password");
      return;
    }

    setLoading(true);

    /* -------------------------------------------
       1) TRY LOGIN FIRST
    --------------------------------------------*/
    let { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

    if (loginData?.user && !loginError) {
      const user = loginData.user;

      // Upsert users_meta
      await supabase.from("users_meta").upsert({
        id: user.id,
        role,
        name: form.name || form.companyName || "User",
        skills: form.skills || null,
        experience: form.experience || null,
      });

      storeUser({
        id: user.id,
        email: user.email,
        role,
        name: form.name || form.companyName || "User",
      });

      window.location.href =
        role === "company" ? "/company" : "/freelancer";
      return;
    }

    /* -------------------------------------------
       2) TRY SIGNUP (IF LOGIN FAILED)
    --------------------------------------------*/
    let { data: signupData, error: signupError } =
      await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

    /* -------------------------------------------
       CASE A: USER ALREADY EXISTS
       → TRY LOGIN AGAIN
    --------------------------------------------*/
    if (signupError?.message === "User already registered") {
      let retry = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (retry.data?.user) {
        const user = retry.data.user;

        // Upsert users_meta
        await supabase.from("users_meta").upsert({
          id: user.id,
          role,
          name: form.name || form.companyName || "User",
          skills: form.skills || null,
          experience: form.experience || null,
        });

        storeUser({
          id: user.id,
          email: user.email,
          role,
          name: form.name || form.companyName || "User",
        });

        window.location.href =
          role === "company" ? "/company" : "/freelancer";
        return;
      }

      alert("Wrong password.");
      setLoading(false);
      return;
    }

    /* -------------------------------------------
       CASE B: SIGNUP SUCCESS
    --------------------------------------------*/
    if (!signupError && signupData?.user) {
      const user = signupData.user;

      // Insert users_meta
      await supabase.from("users_meta").insert({
        id: user.id,
        role,
        name: form.name || form.companyName || "User",
        skills: form.skills || null,
        experience: form.experience || null,
      });

      storeUser({
        id: user.id,
        email: user.email,
        role,
        name: form.name || form.companyName || "User",
      });

      window.location.href =
        role === "company" ? "/company" : "/freelancer";
      return;
    }

    /* -------------------------------------------
       OTHER ERRORS
    --------------------------------------------*/
    if (signupError) {
      alert(signupError.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07070A] px-4">
      <div className="w-full max-w-md bg-[#0F1014] border border-[#1F2128] rounded-xl p-8 shadow-sm">

        {!role && (
          <>
            <h1 className="text-2xl font-semibold text-white mb-6 text-center">
              Login to SHINRA
            </h1>

            <div className="space-y-3">
              <button
                onClick={() => setRole("company")}
                className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Company Login
              </button>

              <button
                onClick={() => setRole("freelancer")}
                className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Freelancer Login
              </button>
            </div>
          </>
        )}

        {role === "company" && (
          <>
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              Company Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="companyName" onChange={handleChange} placeholder="Company Name" className="input" />
              <input name="website" onChange={handleChange} placeholder="Company Website" className="input" />
              <input name="industry" onChange={handleChange} placeholder="Industry" className="input" />
              <input name="companySize" onChange={handleChange} placeholder="Company Size" className="input" />
              <input name="gst" onChange={handleChange} placeholder="GST / Registration No." className="input" />
              <input type="email" name="email" onChange={handleChange} placeholder="Email" className="input" />
              <input type="password" name="password" onChange={handleChange} placeholder="Password" className="input" />

              <button className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-300 transition"
                disabled={loading}>
                {loading ? "Loading..." : "Continue"}
              </button>

              <div onClick={() => setRole(null)} className="text-center text-gray-400 text-sm cursor-pointer hover:text-white">
                Back
              </div>
            </form>
          </>
        )}

        {role === "freelancer" && (
          <>
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              Freelancer Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="name" onChange={handleChange} placeholder="Full Name" className="input" />
              <textarea name="skills" onChange={handleChange} placeholder="Skills (e.g. NLP, Data Labeling)" className="input h-20" />
              <input name="languages" onChange={handleChange} placeholder="Languages" className="input" />

              <select name="experience" onChange={handleChange} className="input">
                <option value="">Experience</option>
                <option value="0-1">0–1 years</option>
                <option value="1-3">1–3 years</option>
                <option value="3-5">3–5 years</option>
                <option value="5+">5+ years</option>
              </select>

              <input type="email" name="email" onChange={handleChange} placeholder="Email" className="input" />
              <input type="password" name="password" onChange={handleChange} placeholder="Password" className="input" />

              <button className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-300 transition"
                disabled={loading}>
                {loading ? "Loading..." : "Continue"}
              </button>

              <div onClick={() => setRole(null)} className="text-center text-gray-400 text-sm cursor-pointer hover:text-white">
                Back
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
}
