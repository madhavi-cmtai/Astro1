"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const AboutSection = () => {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-white via-white to-[var(--primary-green)] rounded-xl shadow-sm mx-auto w-full max-w-7xl overflow-hidden">
      {/* Optional Glow Orbs for Mystic Effect */}
      <motion.div
        className="absolute w-32 h-32 bg-[var(--primary-red)] rounded-full blur-2xl opacity-20 top-2 left-4 z-0"
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-24 h-24 bg-[var(--primary-gold)] rounded-full blur-2xl opacity-20 bottom-4 right-6 z-0"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0"
        >
          <Image
            src="/about.jpg"
            alt="About Tarot Reading"
            className="rounded-3xl object-cover w-full max-w-lg h-[420px] md:h-[500px]  bg-white"
            width={400}
            height={400}
          />
        </motion.div>

        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex flex-col"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-gold)] -mt-3 mb-4">
            Unlock the Mysteries of Your Destiny
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-5">
            Step into the world of tarot and discover what the universe has in store for you.
            Whether you're facing a challenge or chasing a dream, our cards offer deep insight and spiritual clarity.
            Focus your energy, draw your cards, and let the answers reveal themselves.
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-gold)] mt-6 mb-4">
            Divine Guidance at Your Fingertips
          </h2>
          <p className="text-base md:text-lg text-gray-700">
            When life feels uncertain, the cards offer a window into your soul's journey.
            Ask your question, shuffle the deck, and embrace the insight and healing the tarot can bring.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
