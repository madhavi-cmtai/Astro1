import React from "react";
import Image from "next/image";
import { Users, Package, FileText, MapPin, PlusCircle } from "lucide-react";

const stats = [
  { label: "Users", value: 128, icon: <Users className="w-7 h-7 text-[#457b9d]" /> },
  { label: "Leads", value: 42, icon: <Users className="w-7 h-7 text-[#e63946]" /> }
];

const DashboardPage = () => {
  return (
    <div className="w-full mx-auto p-0 px-2 flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex-shrink-0 flex items-center justify-center">
          <Image src="/logo.png" alt="Prank Holidays Logo" width={180} height={80} priority className="rounded-xl" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#e63946] mb-2" style={{ fontFamily: 'var(--font-main)' }}>
            Welcome to Cosmic SeerAdmin!
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
           
            Manage client sessions, track reading history, schedule appointments, and respond to messages all from one intuitive, magical dashboard designed for modern tarot readers.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border border-gray-100 hover:shadow-xl transition-all">
            <div className="mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-main)' }}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Analytics Overview (Charts) */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#e63946] mb-4" style={{ fontFamily: 'var(--font-main)' }}>
          Analytics Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Area Chart Placeholder */}
          <div className="col-span-2 flex flex-col items-center justify-center">
            {/* Replace this SVG with a real chart (e.g., react-chartjs-2, recharts, etc.) */}
            <svg width="100%" height="180" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-44">
              <rect x="0" y="0" width="400" height="180" rx="16" fill="#f8f9fa" />
              <polyline points="0,150 50,120 100,100 150,80 200,90 250,60 300,70 350,40 400,60" fill="none" stroke="#e63946" strokeWidth="4" />
              <polyline points="0,170 50,140 100,120 150,110 200,120 250,100 300,110 350,90 400,100" fill="none" stroke="#457b9d" strokeWidth="3" strokeDasharray="6 6" />
            </svg>
            <div className="text-sm text-gray-500 mt-2">Leads & Users Growth (Last 8 Months)</div>
          </div>
          {/* Donut Chart Placeholder */}
          <div className="flex flex-col items-center justify-center">
            {/* Replace this SVG with a real donut chart */}
            <svg width="120" height="120" viewBox="0 0 120 120" className="mb-2">
              <circle cx="60" cy="60" r="50" fill="#f8f9fa" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e63946" strokeWidth="16" strokeDasharray="80 235" strokeDashoffset="-20" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#ffe066" strokeWidth="16" strokeDasharray="60 255" strokeDashoffset="60" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#457b9d" strokeWidth="16" strokeDasharray="40 275" strokeDashoffset="120" />
            </svg>
            <div className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-main)' }}>Leads by Source</div>
            <div className="flex gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-[#e63946]" /> Website</span>
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-[#ffe066]" /> Referral</span>
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-[#457b9d]" /> Social</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;