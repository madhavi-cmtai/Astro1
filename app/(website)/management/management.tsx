"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ShieldCheck, Users, Award, Heart } from "lucide-react";

const management = [
  {
    name: "Nikhil Chaudhary",
    image: "/images/contact-banner.jpg",
    designation: "Founder & CEO",
    bio: "Visionary leader with 15+ years in the travel industry, passionate about creating memorable journeys.",
  },
  {
    name: "Priya Sharma",
    image: "/images/contact-banner.jpg",
    designation: "COO",
    bio: "Expert in operations and customer experience, ensuring seamless travel for all clients.",
  },
  {
    name: "Amit Verma",
    image: "/images/contact-banner.jpg",
    designation: "Head of Sales",
    bio: "Dynamic sales strategist with a knack for building strong client relationships.",
  },
  {
    name: "Sneha Patel",
    image: "/images/contact-banner.jpg",
    designation: "Marketing Director",
    bio: "Creative marketer driving brand growth and digital presence across platforms.",
  },
];

const whyChoose = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#ffc72c] mb-2" />,
    title: "Trusted Expertise",
    desc: "15+ years of industry experience and 1000s of happy travelers.",
  },
  {
    icon: <Users className="w-8 h-8 text-[#ffc72c] mb-2" />,
    title: "Personalized Service",
    desc: "Every trip is tailored to your unique needs and dreams.",
  },
  {
    icon: <Award className="w-8 h-8 text-[#ffc72c] mb-2" />,
    title: "Award-Winning Team",
    desc: "Recognized for excellence in travel planning and customer care.",
  },
  {
    icon: <Heart className="w-8 h-8 text-[#ffc72c] mb-2" />,
    title: "Passion for Travel",
    desc: "We love what we do and it shows in every journey we create.",
  },
];

const Management = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff]/60 to-[#fffbe6]" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Hero Section */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/management-banner.jpg')] bg-cover bg-center bg-no-repeat scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#ffc72c]/20 to-black/60" />
        <div className="relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            Meet Our <span className="text-[#ffc72c] underline underline-offset-8 decoration-4 decoration-[#ffc72c]">Management</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Our leadership team brings decades of experience and a passion for travel to deliver the best for you.
          </p>
        </div>
      </div>

      {/* Management Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {management.map((member, idx) => {
            return (
              <Card key={member.name} className="bg-white rounded-[2rem] shadow-2xl border border-[#f3f4f6] flex flex-col px-0 pt-0 pb-8 min-h-[520px] h-full justify-start overflow-hidden">
                <div className="relative w-full h-50 md:h-68 rounded-t-[2rem] overflow-hidden">
                  <Image src={member.image} alt={member.name} fill className="object-cover w-full h-full" />
                </div>
                <div className="px-8 pt-6 flex flex-col items-start">
                  <CardHeader className="p-0 mb-2 w-full text-left">
                    <CardTitle className={`text-2xl font-extrabold mb-1 leading-tight text-[#e30613]`}>
                    {member.name}
                    </CardTitle>
                    <div className={`text-lg font-bold mb-1 leading-tight text-[#1a4d8f]`}>
                    {member.designation}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 flex flex-col justify-start w-full text-left">
                    <p className="text-gray-500 font-medium text-base leading-relaxed mt-2" style={{minHeight:'72px'}}>{member.bio}</p>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#e30613]">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {whyChoose.map((item, idx) => (
            <div key={item.title} className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-[#ffc72c]/30 hover:scale-105 transition-transform duration-300">
              {item.icon}
              <div className="font-bold text-[#e30613] text-lg mb-1">{item.title}</div>
              <div className="text-gray-700 text-sm md:text-base">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>


      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
        .animate-fade-in-up { animation: fadeInUp 1.1s both; }
      `}</style>
    </div>
  );
};

export default Management;  