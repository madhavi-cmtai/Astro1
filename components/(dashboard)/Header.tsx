"use client";

import React from "react";

const Header = ({ title }: { title: string }) => {
  return (
    <header className="sticky top-0 z-30 w-full h-16 flex flex-col justify-center px-6 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-full">
        <div>

        </div>
        <div className="flex items-center gap-4">
          {/* User avatar or profile dropdown */}
          <div className="w-9 h-9 rounded-full bg-[#ffe066] flex items-center justify-center font-bold text-[#e63946] border-2 border-[#e63946]">
            TC
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
