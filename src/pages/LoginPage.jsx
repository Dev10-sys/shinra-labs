import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState(""); // local only
  const [role, setRole] = useState("freelancer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in name, email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data: existing, error: selectError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("role", role)
        .maybeSingle();

      if (selectError) throw selectError;

      let user = existing;

      if (!existing) {
        const { data: created, error: insertError } = await supabase
          .from("users")
          .insert([{ email, name, role }])
          .select()
          .single();
        if (insertError) throw insertError;
        user = created;
      }

      const stored = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      localStorage.setItem("shinra_user", JSON.stringify(stored));

      navigate(role === "freelancer" ? "/freelancer" : "/company", {
        replace: true,
      });
    } catch (err) {
      console.error(err);
      setError("We could not sign you in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-8 flex justify-center">
      <div className="shinra-card w-full max-w-md px-6 py-7">
        <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-1">
          Access
        </div>
        <h2 className="text-xl font-semibold mb-4">Sign in to Shinra Labs</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-black border border-shinra-border px-3 py-2 text-sm outline-none focus:border-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg bg-black border border-shinra-border px-3 py-2 text-sm outline-none focus:border-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg bg-black border border-shinra-border px-3 py-2 text-sm outline-none focus:border-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password for this account"
            />
            <p className="text-[10px] text-gray-500">
              Used only inside this workspace.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              Role
            </label>
            <div className="flex gap-2 text-[11px] uppercase tracking-[0.18em]">
              <button
                type="button"
                onClick={() => setRole("freelancer")}
                className={
                  "flex-1 border rounded-full px-3 py-2 " +
                  (role === "freelancer"
                    ? "border-white bg-white text-black"
                    : "border-shinra-border text-gray-400 hover:border-white/60")
                }
              >
                Freelancer
              </button>
              <button
                type="button"
                onClick={() => setRole("company")}
                className={
                  "flex-1 border rounded-full px-3 py-2 " +
                  (role === "company"
                    ? "border-white bg-white text-black"
                    : "border-shinra-border text-gray-400 hover:border-white/60")
                }
              >
                Company
              </button>
            </div>
          </div>

          {error && <p className="text-[11px] text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full text-[11px] uppercase tracking-[0.2em] border border-white rounded-full px-4 py-2 hover:bg-white hover:text-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
