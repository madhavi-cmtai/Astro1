"use client";

import React, { useState, useEffect } from "react";
import {
  MessageCircle, Instagram, Linkedin, Facebook } from "lucide-react";

const actions = [
  {
    icon: <Instagram />, label: "Instagram", color: "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white", link: "https://www.instagram.com/tarotwith_shilpa/?igsh=MWJ3NHZ0eHlieHkzNQ%3D%3D"
  },
  {
    icon: <Linkedin />, label: "LinkedIn", color: "bg-[#0077B5] text-white", link: "https://www.linkedin.com/in/acharya-shilpa-sethi-16626110/"
  },
  {
    icon: <Facebook />, label: "Facebook", color: "bg-[#1877F2] text-white", link: "https://www.facebook.com/Shilpa01sethi"
  }
];

const FloatingButtons = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("#fab-root")) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div id="fab-root" className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {/* Action Buttons */}
      <div
        className={`flex flex-col gap-3 mb-2 transition-all duration-300 ${open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
          }`}
      >
        {actions.map((action, i) => (
          <a
            key={action.label}
            href={action.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg font-semibold text-base transition-transform hover:scale-105 hover:shadow-xl focus:outline-none ${action.color}`}
            aria-label={action.label}
            style={{ transitionDelay: `${open ? i * 60 : 0}ms` }}
          >
            {action.icon}
          </a>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--primary-red)] text-white shadow-xl text-2xl hover:bg-[#FF3232] transition-all focus:outline-none"
        aria-label="Open actions"
      >
        < MessageCircle
          className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          size={32}
        />
      </button>
    </div>
  );
};

export default FloatingButtons;
