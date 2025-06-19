"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/lib/redux/store";
import {
    fetchTestimonials,
    selectTestimonials,
    selectLoading,
} from "@/lib/redux/features/testimonialSlice";

const transformationStories = [
    {
        id: "ts1",
        name: "Riya Kapoor",
        spread: "Celtic Cross",
        rating: 5,
        testimonial:
            "I was in a toxic relationship, feeling lost and unsure. The Celtic Cross reading helped me understand emotional patterns I was repeating. With the guidance I received, I began therapy and within two months, I felt empowered, healed, and found clarity in my life.",
    },
    {
        id: "ts2",
        name: "Ankit Verma",
        spread: "3-Card Spread",
        rating: 4,
        testimonial:
            "I was struggling with a big career decision and felt completely stuck. The 3-Card Spread helped me recognize my true passion and let go of fear. That reading gave me the push I needed to enroll in a UX Design course—now I feel motivated and aligned every day.",
    },
    {
        id: "ts3",
        name: "Neha Singh",
        spread: "Yes/No Spread",
        rating: 5,
        testimonial:
            "Before moving abroad, I was anxious and second-guessing everything. The Yes/No Spread provided much-needed clarity and reassurance. It helped me trust the process—and now, I’ve settled in beautifully and feel more confident than ever.",
    },
];

const renderStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
        <Star key={i} size={12} className="text-yellow-500 fill-yellow-400" />
    ));
};

const Testimonials = () => {
    const dispatch = useDispatch<AppDispatch>();
    const testimonials = useSelector(selectTestimonials);
    const loading = useSelector(selectLoading);

    const controls = useAnimation();
    const carouselRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        dispatch(fetchTestimonials());
    }, [dispatch]);

    useEffect(() => {
        if (carouselRef.current) {
            const totalWidth = carouselRef.current.scrollWidth;
            const visibleWidth = carouselRef.current.offsetWidth;
            setWidth(totalWidth - visibleWidth);
        }
    }, [testimonials]);

    useEffect(() => {
        controls.start({
            x: [-0, -width],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 80,
                    ease: "linear",
                },
            },
        });
    }, [width, controls]);

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-main)" }}>
            <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('/images/testimonial-banner.jpg')] bg-cover bg-center bg-no-repeat" />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
                        Real Stories. <span className="text-[var(--primary-gold)]">Real Testimonials</span>
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
                        Real voices. Real experiences. Let our seekers share how Card Readings helped guide their path.
                    </p>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-[var(--primary-red)] mb-10">🌟 Testimonials</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 max-w-7xl mx-auto px-4">
                {loading ? (
                    <p className="col-span-full text-center text-gray-500">Loading testimonials...</p>
                ) : testimonials.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">No testimonials found.</p>
                ) : (
                    testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="bg-white rounded-2xl shadow-[0_4px_12px_0_var(--primary-green)] border border-[var(--primary-green)] overflow-hidden hover:shadow-xl transition duration-300 flex flex-col"
                        >
                            {t.mediaType === "video" && t.media && (
                                <>
                                    <video controls src={t.media} className="w-full h-60 object-cover" />
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold text-[var(--primary-red)]">{t.name}</h2>
                                    </div>
                                </>
                            )}
                            {t.mediaType === "image" && t.media && (
                                <>
                                    <Image
                                        src={t.media}
                                        alt={t.name}
                                        width={600}
                                        height={400}
                                        className="w-full h-60 object-cover"
                                    />
                                    <div className="p-4 flex flex-col gap-1">
                                        <h2 className="text-xl font-semibold text-[var(--primary-red)]">{t.name}</h2>
                                        <div className="text-yellow-500 text-sm mt-1 flex gap-1">{renderStars(t.rating)}</div>
                                        <p className="text-sm text-gray-600 line-clamp-3">{t.description}</p>
                                    </div>
                                </>
                            )}
                            {(!t.mediaType || t.mediaType === "none" || !t.media) && (
                                <div className="p-5 flex flex-col gap-2 bg-white min-h-[280px] justify-center">
                                    <h2 className="text-xl font-semibold text-[var(--primary-red)]">{t.name}</h2>
                                    <div className="text-yellow-500 text-sm mt-1 flex gap-1">{renderStars(t.rating)}</div>
                                    {t.spread && <p className="text-xs italic text-purple-500 font-medium mt-1">Spread: {t.spread}</p>}
                                    <p className="text-sm text-gray-700 line-clamp-4 mt-5">{t.description}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="mt-24 bg-gradient-to-b from-white to-gray-100 py-16 px-4 md:px-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[var(--primary-red)] mb-12">
                    🌟 How Tarot Changed Their Path
                </h2>

                <div className="relative w-full overflow-hidden max-w-7xl mx-auto">
                    <motion.div ref={carouselRef} animate={controls} className="flex gap-6">
                        {[...transformationStories, ...transformationStories].map((story, index) => (
                            <div
                                key={`${story.id}-${index}`}
                                className="flex-shrink-0 w-full md:w-[calc(100%/3-1.5rem)] max-w-md min-h-[420px]"
                            >
                                <div className="relative bg-white rounded-2xl shadow-[0_4px_12px_0_var(--primary-green)] p-6 border border-[var(--primary-green)] hover:shadow-xl transition duration-300 w-full h-full mx-auto">
                                    <div className="flex flex-col gap-2 mb-6">
                                        <h3 className="font-semibold text-2xl mt-4 mb-3 text-[#73CDA7]">{story.name}</h3>
                                        <p className="text-xs text-black-500 font-bold">Tarot Spread: {story.spread}</p>
                                        <div className="flex items-center gap-2">{renderStars(story.rating)}</div>
                                    </div>
                                    <div className="text-[15px] leading-relaxed text-gray-700">
                                        <p>{story.testimonial}</p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--primary-gold)] to-[var(--primary-green)] rounded-b-4xl" />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;