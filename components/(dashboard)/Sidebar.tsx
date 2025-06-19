"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Image,
  LogOut,
  Menu,
  Boxes,
  FileText,
  UserPlus,
  Moon
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard /> },
  { name: "Products", href: "/dashboard/products", icon: <Boxes /> },
  { name: "Blogs", href: "/dashboard/blogs", icon: <FileText /> },
  { name: "Testimonial", href: "/dashboard/testimonial", icon: <BookOpen /> },
  { name: "Leads", href: "/dashboard/leads", icon: <UserPlus /> },
  { name: "Rashifal", href: "/dashboard/rashifal", icon: <Moon /> },
  { name: "Logout", href: "/logout", icon: <LogOut /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-black">Something Mystical</h1>
        <div className="w-24 h-1 rounded-full mt-2" style={{ background: 'linear-gradient(90deg, #6b21a8 0%, #ffe066 50%, #457b9d 100%)' }} />
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-2 mt-0">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <a
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-base select-none
                border-l-4
                ${isActive
                  ? "text-[#6b21a8] font-bold border-[#6b21a8] bg-white shadow-sm"
                  : "font-medium text-gray-700 hover:bg-[#6b21a8]/10 hover:text-[#6b21a8] border-transparent"}`}
              style={{ fontFamily: 'var(--font-main)' }}
              onClick={() => setOpen(false)}
            >
              <span
                className={`flex items-center justify-center transition-all
                  ${isActive
                    ? "text-[#6b21a8] font-bold scale-110"
                    : "text-gray-500"}`}
                style={{ minWidth: 32, minHeight: 32 }}
              >
                {React.cloneElement(link.icon, {
                  size: isActive ? 24 : 20,
                  strokeWidth: isActive ? 2.5 : 1.8,
                  className: isActive ? "text-[#6b21a8]" : "text-gray-500"
                })}
              </span>
              <span className="truncate">{link.name}</span>
            </a>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="flex flex-col h-screen sticky top-0">
      {/* Mobile Hamburger */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-white rounded-full p-2 shadow border border-gray-200 cursor-pointer"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-[#6b21a8]" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl border-r border-gray-200 py-8 px-4 flex flex-col gap-6 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:min-h-screen md:block
        `}
        style={{ maxWidth: 280 }}
      >
        {sidebarContent}
      </aside>
    </div>
  );
};

export default Sidebar;
