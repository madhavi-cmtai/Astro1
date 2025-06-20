"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  Menu,
  Boxes,
  FileText,
  UserPlus,
  Moon,
  X,
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex">
      {/* Mobile Hamburger Menu */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow border"
        onClick={() => setOpen(true)}
      >
        <Menu className="w-6 h-6 text-[#6b21a8]" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 md:z-0 bg-white h-full w-64 border-r shadow-xl md:shadow-none p-6
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:block`}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4"
          onClick={() => setOpen(false)}
        >
          <X className="text-[#6b21a8]" />
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Something Mystical</h1>
          <div
            className="w-24 h-1 mt-2 mx-auto rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #6b21a8 0%, #ffe066 50%, #457b9d 100%)",
            }}
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg border-l-4 transition
                ${isActive(link.href)
                  ? "text-[#6b21a8] font-bold bg-[#f3e8ff] border-[#6b21a8]"
                  : "text-gray-600 hover:text-[#6b21a8] hover:bg-[#6b21a8]/10 border-transparent"
                }`}
            >
              {React.cloneElement(link.icon, {
                size: 20,
                className: isActive(link.href)
                  ? "text-[#6b21a8]"
                  : "text-gray-500",
              })}
              {link.name}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
