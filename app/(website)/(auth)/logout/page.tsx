"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Remove user from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      // Remove user cookie (set expiry in past)
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffe066]/40 via-[#f1faee]/60 to-[#457b9d]/10 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fade-in">
        <LogOut className="w-16 h-16 text-[#e63946] animate-pulse mb-4" />
        <h2 className="text-xl font-bold text-[#e63946] mb-2" style={{ fontFamily: 'var(--font-main)' }}>Logging you out...</h2>
        <div className="text-gray-500 text-sm mb-4">You will be redirected to the homepage in a moment.</div>
        <div className="w-10 h-10 border-4 border-[#e63946]/30 border-t-[#e63946] rounded-full animate-spin mb-2" />
      </div>
    </div>
  );
};

export default LogoutPage;