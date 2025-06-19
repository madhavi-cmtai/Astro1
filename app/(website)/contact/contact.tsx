"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Facebook, Instagram, Youtube } from "lucide-react";

const socialLinks = [
    {
        icon: Facebook,
        label: "Facebook",
        href: "https://facebook.com/prankholidays",
    },
    {
        icon: Instagram,
        label: "Instagram",
        href: "https://instagram.com/prankholidays",
    },
    {
        icon: Youtube,
        label: "Youtube",
        href: "https://youtube.com/@prankholidays",
    },
];

const ContactPage = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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
                setForm({ name: "", email: "", message: "", phone: "" });
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
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-main)" }}>
            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[500px] flex flex-col items-center justify-center text-white text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/contact-banner.webp')] bg-cover bg-center bg-no-repeat" />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
                        Let's <span className="text-[var(--primary-gold)] font-bold">Connect</span>  & Uncover <span className="text-[var(--primary-gold)]">Your Destiny</span>
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
                        Perhaps the <span className="font-bold">universe</span> is nudging you toward <span className="font-bold">clarity? </span>
                        We're here to help! Reach out to us anytime.
                    </p>

                </div>
            </div>

            {/* Contact Form */}
            <section className="flex justify-center items-start px-4 py-12">
                {/* Form */}
                <div className="w-full max-w-2xl">
                <Card className="shadow-lg border-[#e3061320]">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-[var(--primary-red)]">Send us a Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {success && (
                            <div className="col-span-1 md:col-span-2 mb-6">
                                <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md text-center font-semibold">
                                    Your message has been sent successfully!<br />We will connect with you soon.
                                </div>
                            </div>
                        )}
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col col-span-1 md:col-span-1">
                                    <label className="block mb-1 font-semibold text-[#73CDA7]">Name</label>
                                <Input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Your Name" required />
                            </div>
                            <div className="flex flex-col col-span-1 md:col-span-1">
                                    <label className="block mb-1 font-semibold text-[#73CDA7]">Phone</label>
                                <Input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="Your Phone Number" />
                            </div>
                            <div className="flex flex-col col-span-1 md:col-span-2">
                                    <label className="block mb-1 font-semibold text-[#73CDA7]">Email</label>
                                <Input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@email.com" required />
                            </div>
                            <div className="flex flex-col col-span-1 md:col-span-2">
                                    <label className="block mb-1 font-semibold text-[#73CDA7]">Message</label>
                                <Textarea name="message" value={form.message} onChange={handleChange} rows={7} className="min-h-[140px]" placeholder="Type your message..." required />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <Button type="submit" className=" w-full bg-[var(--primary-red)] text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-[#e74d3cdc] transition-colors text-base mt-2" disabled={loading}>
                                    {loading ? "Sending..." : "Send Message"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                </div>
            </section>

            {/* Google Map */}
            <section className=" mx-auto p-0">
                <div className=" overflow-hidden shadow-lg border border-[#e3061320]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.1129592121843!2d77.29684207552862!3d28.506248989804043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce7610a80d203%3A0x29ad7342e5dc9348!2sTravelink%20County%20Private%20Limited!5e0!3m2!1sen!2sin!4v1748864512264!5m2!1sen!2sin"
                        height="600"
                        width="100%"
                        allowFullScreen={true}
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map"
                    ></iframe>
                </div>
            </section>

        </div>
    );
};

export default ContactPage;
