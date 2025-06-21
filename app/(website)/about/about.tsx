'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, Moon, Star, Sun } from 'lucide-react';
import { toast } from 'sonner';


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
    desc: "Connect with our certified readers via video or chat from anywhere in the world.",
  },
];

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/routes/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setSuccess(true);  
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 🌟 Hero Section */}
      <section className="relative min-h-[340px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0">
          <Image
            src="/images/about-banner.jpg"
            alt="Acharya Shilpa Sethi"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg leading-tight">
            ✨ About <span className="text-[var(--primary-gold)]">Acharya Shilpa Sethi</span>
          </h1>
          <p className="text-lg md:text-xl font-semibold drop-shadow-lg mt-2">
            Intuitive Tarot Reader | Reiki Healer | Numerologist<br />
            Guiding Souls Since 2008
          </p>
        </div>
      </section>

      {/* 🧘 About Shilpa Sethi */}
      <section className="relative py-10 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-white via-white to-[var(--primary-green)] rounded-xl shadow-md px-6 py-10 overflow-hidden relative">
          {/* Glows */}
          <motion.div
            className="absolute w-32 h-32 bg-[var(--primary-red)] rounded-full blur-2xl opacity-20 top-2 left-4 z-0"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute w-24 h-24 bg-[var(--primary-gold)] rounded-full blur-2xl opacity-20 bottom-4 right-6 z-0"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 7, repeat: Infinity }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <div className="relative w-full max-w-lg h-[420px] md:h-[500px]">
                <Image
                  src="/about.jpg"
                  alt="Acharya Shilpa Sethi portrait"
                  fill
                  className="rounded-3xl shadow-2xl object-cover   bg-white"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="w-full md:w-1/2 space-y-6"
            >
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-gold)]">
                Your Journey to Clarity Starts Here
              </h2>

              <p className="text-lg text-gray-800 leading-relaxed mt-6">
                I'm <span className="text-[var(--primary-red)] font-bold">Acharya Shilpa Sethi</span> — a devoted spiritual guide and healer. I offer transformative experiences through the sacred sciences of Tarot, Reiki, and Numerology. Over the years, I've had the honor of guiding thousands through life's transitions.
              </p>

              <blockquote className="border-l-4 border-[#73CDA7] pl-4 italic text-[var(--primary-red)] font-medium bg-[var(--primary-green)]/10 rounded-md mt-4 leading-relaxed text-xl">
                "Since 2008, I've walked the path of spiritual service — blending ancient metaphysical wisdom with divine intuition to help others align with their true essence."
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌌 Soulful Journey */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-white via-white to-[var(--primary-green)] rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
          {/* Glows */}
          <motion.div
            className="absolute w-24 h-24 bg-[var(--primary-red)] rounded-full blur-2xl opacity-20 top-6 left-6 z-0"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute w-32 h-32 bg-[var(--primary-green)] rounded-full blur-2xl opacity-20 bottom-6 right-8 z-0"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 7, repeat: Infinity }}
            aria-hidden="true"
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full md:w-1/2 space-y-5 relative z-10"
          >
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-gold)] bg-clip-text text-transparent">
              A Soulful Journey of Awakening
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed">
              My work is more than just readings — it's a soulful journey. Together, we'll release energetic blocks, connect to your higher self, and restore your spiritual balance.
            </p>
            <blockquote className="border-l-4 border-[#73CDA7] pl-4 italic text-[var(--primary-red)] font-medium bg-[var(--primary-green)]/10 rounded-md leading-relaxed text-xl">
              Over the years, I've had the honor of guiding thousands through life's transitions. Whether you seek clarity, healing, or awakening, my mission is to empower your path with insight, energy, and confidence.
            </blockquote>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full md:w-1/2 relative z-10"
          >
            <div className="relative w-full h-[580px]">
              <Image
                src="/images/soulful-journey.jpg"
                alt="Spiritual journey illustration"
                fill
                className="rounded-2xl shadow-[var(--primary-green)] object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🎥 Meet Shilpa: Soul Guide Videos */}
      
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-14 text-[var(--primary-red)]">
          Meet Shilpa: Soul Guide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center">
          {/* Video 1 */}
          <div className="w-full max-w-[500px] h-[550px] rounded-2xl overflow-hidden shadow-[0_4px_20px_0_var(--primary-green)]">
            <video
              controls
              className="w-full h-full object-fill"
              preload="metadata"
            >
              <source src="/videos/about-video1.mp4" type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
          </div>

          {/* Video 2 */}
          <div className="w-full max-w-[500px] h-[550px] rounded-2xl overflow-hidden shadow-[0_4px_20px_0_var(--primary-green)]">
            <video
              controls
              className="w-full h-full object-fill"
              preload="metadata"
            >
              <source src="/videos/about-video2.mp4" type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
          </div>
        </div>
      </section>




      {/* 💫 Services */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
        <h2 className="text-5xl font-extrabold text-center mb-14 text-[var(--primary-red)]">✨ Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition border-2 border-[var(--primary-green)]/40"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-[#73CDA7]">{service.title}</h3>
              <p className="text-gray-700">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🙌 CTA Booking */}
      <section className="w-full max-w-7xl mx-auto my-16 px-4 md:px-6 lg:px-8">
        <div className="rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-lg bg-[#fdf3e7]">
          <div className="flex-1 flex flex-col justify-center p-12">
            <span className="uppercase text-2xl font-bold text-[#73CDA7] mb-2">Book A Reading</span>
            <h2 className="text-4xl font-extrabold mb-2 text-[#73CDA7]">Let the Divine Guide You</h2>
            <p className="text-lg mb-6 text-[#222]">
              Connect with Shilpa Sethi for a personalized and healing session today.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center p-12">
            { success && (
              <div className="mb-6">
                <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md text-center font-semibold">
                  Your message has been sent successfully!
                  <br />
                  We will connect with you soon.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="px-4 py-3 rounded border border-[var(--primary-green)] focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="px-4 py-3 rounded border border-[var(--primary-green)] focus:outline-none"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                className="px-4 py-3 rounded border border-[var(--primary-green)] focus:outline-none"
              />
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Question or Concern"
                className="px-4 py-3 rounded border border-[var(--primary-green)] focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--primary-red)] text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-[#e74d3cdc] transition-colors mt-2 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Book Now'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;