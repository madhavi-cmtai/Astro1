"use client";

import React from "react";

const Header = ({ title }: { title: string }) => {
  return (
    <header className="sticky top-0 z-30 w-full h-16 flex justify-between items-center px-4 sm:px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Left: Title */}
      <h1 className="text-lg sm:text-xl font-semibold text-gray-800 ml-12 md:ml-0 truncate">
        {title}
      </h1>

      {/* Right: Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-[#ffe066] flex items-center justify-center font-bold text-[#e63946] border-2 border-[#e63946]">
          TC
        </div>
      </div>
    </header>
  );
};

export default Header;
