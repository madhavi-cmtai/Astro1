"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, UserCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Try localStorage first
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem("user") || "null");
      } catch {}
      // Fallback: Try cookie if needed
      if (!user) {
        const match = document.cookie.match(/user=([^;]+)/);
        if (match) {
          try {
            user = JSON.parse(decodeURIComponent(match[1]));
          } catch {}
        }
      }
      if (user && user.role) {
        if (user.role === "admin") {
          router.replace("/dashboard");
        } else {
          router.replace("/profile");
        }
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    // Mock users
    const users = [
      { email: "admin@gmail.com", password: "admin123", role: "admin" },
      { email: "user@gmail.com", password: "user123", role: "user" },
    ];
    setTimeout(() => {
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        setSuccess(true);
        setError("");
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify({ email: found.email, role: found.role }));
          // Save to cookie for middleware
          document.cookie = `user=${encodeURIComponent(JSON.stringify({ email: found.email, role: found.role }))}; path=/`;
        }
        if (found.role === "admin") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/profile";
        }
      } else {
        setError("Invalid email or password");
        setSuccess(false);
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffe066]/40 via-[#f1faee]/60 to-[#457b9d]/10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fade-in">
        <div className="mb-6 flex flex-col items-center">
          <UserCircle2 className="w-20 h-20 text-[#e63946] drop-shadow-lg animate-bounce" />
          <h2 className="text-2xl font-bold mt-2 mb-1 text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Welcome Back!</h2>
          <p className="text-gray-500 text-sm">Sign in to your Cosmic Seer Account</p>
        </div>
        <form className="w-full space-y-5" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className={`pl-10 pr-3 ${error ? "border-red-400" : ""}`}
                required
                autoFocus
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                className={`pl-10 pr-10 ${error ? "border-red-400" : ""}`}
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e63946] cursor-pointer"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm text-center animate-shake">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center animate-fade-in">Login successful! 🎉</div>}
          <Button
            type="submit"
            className="w-full mt-2 gap-2 text-lg font-bold bg-[#e63946] hover:bg-[#d90429] transition-all shadow-md cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</span>
            ) : (
              <>Sign In</>
            )}
          </Button>
        </form>
        
      </div>
    </div>
  );
};

export default LoginPage;