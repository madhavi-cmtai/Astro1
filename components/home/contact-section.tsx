"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/routes/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Something went wrong!");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }

    setLoading(false);
  };
  
  return (
    <section className="relative py-10 px-4 sm:px-8 lg:px-20 flex justify-center items-center mt-20">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6 sm:p-8">

        <h2 className="text-3xl font-bold text-center text-[var(--primary-red)] mb-2">Contact Us</h2>
        <p className="text-center text-gray-600 mb-8">We’d love to hear from you. Send us your questions, feedback, or book a reading session.</p>

        {success && (
          <div className="col-span-1 md:col-span-2 mb-6">
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md text-center font-semibold">
              Your message has been sent successfully!<br />We will connect with you soon.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-[#73CDA7]">Name</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Full Name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-[#73CDA7]">Phone</label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Optional"
              type="tel"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold mb-1 text-[#73CDA7]">Email</label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              type="email"
              required
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold mb-1 text-[#73CDA7]">Message</label>
            <Textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={6}
              placeholder="What would you like to share or ask?"
              required
            />
          </div>

          <div className="md:col-span-2">
            <Button
              type="submit"
              className="w-full bg-[var(--primary-red)] text-white font-bold py-3 rounded-lg hover:bg-[#F21616] transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
