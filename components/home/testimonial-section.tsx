"use client";

import React, { useEffect, useState, useRef } from "react";
import { Star } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

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
      "Before moving abroad, I was anxious and second-guessing everything. The Yes/No Spread provided much-needed clarity and reassurance. It helped me trust the process and now, I’ve settled in beautifully and feel more confident than ever.",
  },
  {
    id: "ts4",
    name: "Rohit Mehra",
    spread: "Career Path Spread",
    rating: 4,
    testimonial:
      "I was stuck in a job I didn’t love and unsure of what direction to take. The Career Path Spread gave me insights I hadn’t considered and pushed me to explore creative opportunities. I’ve since launched my own design studio!",
  },
  {
    id: "ts5",
    name: "Aarushi Patel",
    spread: "Love & Relationship Spread",
    rating: 5,
    testimonial:
      "I was feeling lost in my relationship, unsure if we were truly compatible. The Love Spread revealed patterns that helped me communicate better and reconnect with my partner. It was a turning point for us.",
  },
];

const renderStars = (count: number) => {
  return Array.from({ length: count }).map((_, i) => (
    <Star key={i} className="w-5 h-5 text-[var(--primary-gold)] fill-[#FEDC01]" />
  ));
};

const TestimonialSection = () => {
  const controls = useAnimation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      const totalWidth = carouselRef.current.scrollWidth;
      const visibleWidth = carouselRef.current.offsetWidth;
      setWidth(totalWidth - visibleWidth);
    }
  }, []);

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
    <section className="w-full bg-gradient-to-b from-white via-white to-[var(--primary-green)] min-h-[90vh] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-[var(--primary-red)] mb-4 mt-15">
          🌟 How Tarot Changed Their Path
        </h2>
        <p className="text-lg leading-relaxed text-center mt-4 mb-12 max-w-2xl mx-auto text-[#73CDA7]">
          Discover the journeys of real people who found clarity, courage, and transformation through the sacred art of Tarot.
        </p>


        <div className="relative w-full overflow-hidden">
          <motion.div
            ref={carouselRef}
            animate={controls}
            className="flex gap-6"
          >
            {[...transformationStories, ...transformationStories].map(
              (story, index) => (
                <div
                  key={`${story.id}-${index}`}
                  className="flex-shrink-0 w-full md:w-[calc(100%/3-1.5rem)] max-w-ms min-h-[380px]"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300 mx-auto h-full">
                    <div className="flex items-center gap-7 mb-10">
                      <div>
                        <h3 className="font-semibold text-2xl text-[#73CDA7] mb-1">
                          {story.name}
                        </h3>
                        <p className="text-xs text-black font-bold mb-1">
                          Tarot Spread: {story.spread}
                        </p>
                        <div className="flex items-center gap-1">
                          {renderStars(story.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="text-[15px] leading-relaxed text-gray-700 mt-2 mb-4">
                      <p>{story.testimonial}</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
