"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Blogs", href: "/blogs" },
  { name: "Products", href: "/products" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-[#e3061320]">
      <div className="container mx-auto px-4 flex items-center justify-between py-2 min-h-[50px]">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center">
          <Image src="/logo.png" alt="logo" width={120} height={50} className="object-contain h-full w-auto rounded-md" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-5 items-center text-[16.5px] font-bold" style={{ fontFamily: "var(--font-main)" }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={
                  `px-2 py-1 rounded-md transition-colors ` +
                  (isActive
                    ? "font-bold text-[var(--primary-red)]"
                    : " hover:text-[var(--primary-red)] hover:bg-[#fff1e6]")
                }
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-[var(--primary-red)]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-3 border-t border-[#e3061320]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={
                  `block py-2 text-base font-semibold ` +
                  (isActive
                    ? "text-[var(--primary-red)]"
                    : "text-[var(--primary-green)] hover:text-[var(--primary-gold)]")
                }
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Header;
