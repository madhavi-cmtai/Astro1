"use client";

import { Sparkles, Eye, Moon, Stars } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] py-16 px-4 overflow-hidden bg-black">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/videos/hero.mov"
        autoPlay
        loop
        muted
        playsInline
        poster="/videos/hero-poster.jpg"
        preload="auto"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#457b9d]/40 to-black/60 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-2xl text-center flex flex-col items-center">
        {/* Tarot Icons */}
        <div className="flex justify-center gap-3 mb-4 animate-fade-in">
          <Sparkles className="w-10 h-10 text-purple-600 animate-bounce-slow" />
          <Eye className="w-10 h-10 text-indigo-500 animate-pulse" />
          <Moon className="w-10 h-10 text-[var(--primary-red)] animate-wiggle" />
          <Stars className="w-10 h-10 text-yellow-500 animate-spin-slow" />
        </div>

        {/* Heading */}
        <h1
          className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-4 animate-fade-in-up"
          style={{ fontFamily: 'var(--font-main)' }}
        >
          Unlock the Secrets of <span className="text-[var(--primary-gold)]">Tomorrow</span>
        </h1>


        {/* Subheading */}
        <p
          className="text-lg sm:text-xl text-white/90 mb-8 animate-fade-in-up delay-100"
          style={{ fontFamily: 'var(--font-main)' }}
        >
          Unveil your path, <span className="font-bold">decode your destiny</span> Tarot insights for the soul.
        </p>

        {/* CTA Button */}
        <a
          href="/contact"
          className="inline-block bg-[var(--primary-red)] text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[#F21616]] transition-colors text-lg animate-fade-in-up delay-200"
          style={{ fontFamily: 'var(--font-main)' }}
        >
          Find Clarity
        </a>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-wiggle { animation: wiggle 2.5s infinite; }
        .animate-bounce-slow { animation: bounce 2.2s infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-fade-in { animation: fadeIn 1s both; }
        .animate-fade-in-up { animation: fadeInUp 1.1s both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
