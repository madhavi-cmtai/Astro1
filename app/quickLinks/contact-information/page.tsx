"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
            <h1 className="text-4xl font-bold mb-6 text-[var(--primary-red)]">
                Contact Information
            </h1>

            <p className="mb-6 text-lg">
                We’d love to hear from you. For appointments, tarot consultations, or general questions, reach out to us through the following channels:
            </p>

            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <Mail className="text-[var(--primary-green)] w-6 h-6 mt-1" />
                    <div>
                        <h2 className="text-xl font-semibold">Email</h2>
                        <a
                            href="mailto:info@shilpasethtarot.com"
                            className="text-blue-600 underline"
                        >
                            Cosmicseer111@gmail.com
                        </a>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <Phone className="text-[var(--primary-green)] w-6 h-6 mt-1" />
                    <div>
                        <h2 className="text-xl font-semibold">Phone</h2>
                        <p className="text-gray-700">+91  7011671605</p>
                        <h2 className="text-xl font-semibold">Phone</h2>
                        <p className="text-gray-700">+91 9871776559</p>
                    </div>
                </div>      
                <div className="flex items-start gap-4">
                    <MapPin className="text-[var(--primary-green)] w-6 h-6 mt-1" />
                    <div>
                        <h2 className="text-xl font-semibold">Address</h2>
                        <p className="text-gray-700">
                            CG2 502 Supertech Capetown Noida sector 74<br />
                            Noida, Uttar Pradesh, India
                        </p>
                    </div>
                </div>
            </div>

            <p className="mt-12 text-sm text-gray-500">
                Available Monday to Saturday, 10:00 AM – 6:00 PM IST
            </p>
        </div>
    );
}
