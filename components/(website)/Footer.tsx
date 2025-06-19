"use client";

import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Home,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1f1f1f] text-white px-6 py-10 mt-12">
      {/* Top Centered Social Icons */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-6">
          <a
            href="https://wa.me/919871776559"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-6 h-6 hover:text-green-400 transition" />
          </a>
          <a href="https://www.facebook.com/Shilpa01sethi" target="_blank" rel="noopener noreferrer">
            <Facebook className="w-6 h-6 hover:text-blue-500 transition" />
          </a>
          <a href="https://www.linkedin.com/in/acharya-shilpa-sethi-16626110/" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-6 h-6 hover:text-blue-400 transition" />
          </a>
          <a href="https://www.instagram.com/tarotwith_shilpa/" target="_blank" rel="noopener noreferrer">
            <Instagram className="w-6 h-6 hover:text-pink-500 transition" />
          </a>
        </div>
      </div>

      {/* Footer Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Branding Section */}
    
        <div className="flex flex-col md:col-span-1 items-center md:items-start text-center md:text-left space-y-4">
          <img
            src="/images/acharya-shilpa.png"
            alt="Acharya Shilpa Sethi"
            className="w-20 h-20 object-cover rounded-full border-2 border-white"
          />
          <h3 className="text-xl font-bold">Acharya Shilpa Sethi</h3>
          <p className="text-gray-200 text-sm max-w-xs">
            Discover the magic of tarot with Acharya Shilpa Sethi — intuitive, insightful, and always on point!
          </p>
        </div>


        {/* Contact Us Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-[#e63946]" />
              CG2 502 Supertech Capetown Noida sector 74, India
            </li>
            <li className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-[#e63946]" />
              +91 7011671605
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-[#e63946]" />
              acharya.shilpa@gmail.com
            </li>
          </ul>
        </div>

        {/* Our Services Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Our Services</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="/" className="hover:text-[#e63946]">Home</a></li>
            <li><a href="/about" className="hover:text-[#e63946]">About</a></li>
            <li><a href="/blogs" className="hover:text-[#e63946]">Blogs</a></li>
            <li><a href="/products" className="hover:text-[#e63946]">Products</a></li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="/privacy-policy" className="hover:text-[#e63946]">Privacy Policy</a></li>
            <li><a href="/contact-information" className="hover:text-[#e63946]">Contact Information</a></li>
            <li><a href="/terms-and-conditions" className="hover:text-[#e63946]">Terms and Conditions</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Text */}
      <div className="text-center text-xs text-gray-400 mt-10">
        &copy; {new Date().getFullYear()} <span className="font-bold text-[var(--primary-red)]">CMT AI</span> All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
