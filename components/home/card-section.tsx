"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "@/app/globals.css";

type Rashifal = {
    id: string;
    title: string;
    description: string;
};

export default function TarotCardSection() {
    const [rashifals, setRashifals] = useState<Rashifal[]>([]);
    const [flippedCard, setFlippedCard] = useState<string | null>(null);

    useEffect(() => {
        const fetchRashifals = async () => {
            try {
                const res = await axios.get("/api/routes/rashifal");
                setRashifals(res.data);
            } catch (error) {
                console.error("Error fetching Rashifals:", error);
            }
        };

        fetchRashifals();
    }, []);

    return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-center overflow-hidden mt-0">
            {/* Header */}
            <section className="relative py-12 px-6 text-center bg-gradient-to-br from-white via-white to-[var(--primary-green)] rounded-xl shadow-md mx-auto w-full max-w-7xl">
                <motion.h1
                    className="relative text-3xl md:text-4xl font-extrabold bg-clip-text bg-gradient-to-r from-white to-[var(--primary-green)] mb-3 z-10 text-[var(--primary-red)]"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Discover Your Destiny with Acharya Shilpa Sethi
                </motion.h1>
                <motion.p
                    className="relative text-base md:text-lg text-[#73CDA7] max-w-2xl mx-auto mb-4 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    Tap your sign and unveil today’s cosmic message
                </motion.p>
            </section>

            {/* Cards */}
            <div className="px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto mt-6">
                    {rashifals.map((card) => (
                        <div
                            key={card.id}
                            className="w-71 h-99 perspective cursor-pointer"
                            onClick={() => setFlippedCard((prev) => (prev === card.id ? null : card.id))}
                        >
                            <div
                                className={`relative w-full h-full transition-transform duration-700 ${flippedCard === card.id ? "rotate-y-180" : ""}`}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {/* Front */}
                                <div
                                    className="absolute w-full h-full rounded-xl bg-cover bg-center shadow-[0_4px_12px_0_var(--primary-green)]"
                                    style={{
                                        backgroundImage: "url('/images/card-bg.jpg')",
                                        backfaceVisibility: "hidden",
                                    }}
                                />

                                {/* Back */}
                                <div
                                    className="absolute w-full h-full bg-gradient-to-br from-white via-white to-[var(--primary-green)] rounded-xl p-4 flex flex-col justify-center items-center shadow-[0_4px_12px_0_var(--primary-green)]"
                                    style={{
                                        transform: "rotateY(180deg)",
                                        backfaceVisibility: "hidden",
                                    }}
                                >
                                    <h3 className="text-2xl font-bold mb-2 text-[#f18a7f]">{card.title}</h3>
                                    <p className="text-l text-justify text-gray-800 whitespace-pre-line">{card.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
