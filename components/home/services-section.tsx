'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Moon, Star, Sun } from 'lucide-react';

const services = [
    {
        icon: <Moon className="w-9 h-9 text-[var(--primary-red)]" />,
        title: "Love & Relationship Reading",
        desc: "Understand your love life, soulmate energy, and relationship patterns with in-depth guidance.",
    },
    {
        icon: <Star className="w-9 h-9 text-[var(--primary-gold)]" />,
        title: "Career & Finance Reading",
        desc: "Find direction in your professional path and gain clarity on financial decisions.",
    },
    {
        icon: <Sun className="w-9 h-9 text-[#73CDA7]" />,
        title: "Life Purpose & Spiritual Path",
        desc: "Explore your soul's journey and receive insights to align your life purpose.",
    },
    {
        icon: <Globe className="w-9 h-9 text-[var(--primary-gold)]" />,
        title: "Online Tarot Sessions",
        desc: "Connect with certified readers via video or chat from anywhere in the world.",
    },
];

const ServicesSection = () => {
    return (
        <section
            className="relative py-20 px-6 bg-gradient-to-b from-white via-[#f9f9f9] to-[var(--primary-green)] rounded-xl shadow-ms mx-auto w-full max-w-7xl overflow-hidden mt-15"
            style={{ fontFamily: "var(--font-main)" }}
        >
            <div className="max-w-7xl mx-auto text-center mb-14">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--primary-red)] mb-4">
                ✨ Our Services
                </h2>
                <p className="text-lg  max-w-3xl mx-auto text-[#73CDA7]">
                    Unlock guidance, clarity, and healing through personalized readings and sessions crafted to align your soul.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
                {services.map((service, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-[var(--primary-green)]/30 hover:shadow-2xl transition-transform hover:-translate-y-1"
                    >
                        <div className="mb-4">{service.icon}</div>
                        <h3 className="text-xl font-bold text-[#73CDA7] mb-2">{service.title}</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{service.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ServicesSection;
