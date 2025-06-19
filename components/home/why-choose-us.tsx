"use client";

import React from "react";
import { Star, Users, HeartHandshake, Eye, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: <Eye className="w-8 h-8 text-[var(--primary-red)]" />,
        title: "Intuitive Accuracy",
        description: "Our readings are guided by intuition and decades of practice to offer deep clarity and insight.",
    },
    {
        icon: <Users className="w-8 h-8 text-[var(--primary-red)]" />,
        title: "Trusted by Thousands",
        description: "Over 10,000 clients have trusted us to guide their journey through life’s biggest decisions.",
    },
    {
        icon: <HeartHandshake className="w-8 h-8 text-[var(--primary-red)]" />,
        title: "Empathy-Driven",
        description: "We listen with compassion and deliver messages that empower and uplift your spirit.",
    },
    {
        icon: <BookOpen className="w-8 h-8 text-[var(--primary-red)]" />,
        title: "Rooted in Tradition",
        description: "Our methods combine ancient wisdom with modern clarity, honoring the art of tarot reading.",
    },
    {
        icon: <Star className="w-8 h-8 text-[var(--primary-red)]" />,
        title: "5-Star Ratings",
        description: "Hundreds of 5-star testimonials speak to our authenticity, accuracy, and heart-centered service.",
    },
];

const WhyChooseUs: React.FC = () => {
    return (
        <section className="relative py-20 px-6 bg-gradient-to-br from-white via-white to-[var(--primary-green)] rounded-xl shadow-ms mx-auto w-full max-w-7xl overflow-hidden mt-15" style={{ fontFamily: "var(--font-main)" }}>
            {/* Glow Orbs */}
            <motion.div
                className="absolute w-28 h-28 bg-[var(--primary-red)] rounded-full blur-2xl opacity-20 top-6 left-6 z-0"
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
                className="absolute w-24 h-24 bg-[var(--primary-gold)] rounded-full blur-2xl opacity-20 bottom-6 right-6 z-0"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 7, repeat: Infinity }}
            />

            <div className="relative z-10 max-w-6xl mx-auto text-center">
                <h2 className="text-4xl sm:text-5xl font-bold text-[var(--primary-red)] mb-4">Why Choose Us</h2>
                <p className="text-lg text-[#73CDA7] mb-12">
                    Discover what sets <span className="font-semibold">Cosmic Seer</span> apart in the world of tarot reading and spiritual guidance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
                        >
                            <div className="flex justify-center mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2 text-[#73CDA7]">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
