"use client";

import React from "react";

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
            <h1 className="text-4xl font-bold mb-6 text-[var(--primary-red)]">
                Privacy Policy
            </h1>

            <p className="mb-4">
                At <strong>Acharya Shilpa Sethi Tarot</strong>, your privacy is important to us.
                This Privacy Policy explains how we collect, use, and protect your
                personal information when you use our tarot reading services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2 text-[var(--primary-green)]">
                1. Information We Collect
            </h2>
            <p className="mb-4">
                We may collect personal details such as your name, email address, birth
                date, or zodiac sign when you:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Use our tarot reading features</li>
                <li>Sign up for newsletters or updates</li>
                <li>Contact us for inquiries or support</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2 text-[var(--primary-green)]">
                2. How We Use Your Information
            </h2>
            <p className="mb-4">
                We use your information to:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Provide personalized tarot readings</li>
                <li>Improve our website and user experience</li>
                <li>Send important updates or promotional content</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2 text-[var(--primary-green)]">
                3. Data Sharing & Security
            </h2>
            <p className="mb-4">
                We do not sell or rent your personal information. We use secure
                technologies to protect your data and restrict access to authorized
                personnel only.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2 text-[var(--primary-green)]">
                4. Third-Party Services
            </h2>
            <p className="mb-4">
                Our site may use third-party services (e.g., analytics, payment
                gateways) which may collect information independently. Please refer to
                their privacy policies for more details.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2 text-[var(--primary-green)]">
                5. Your Rights
            </h2>
            <p className="mb-4">
                You may request access, correction, or deletion of your personal data by
                contacting us. We respect your privacy and will respond to your request
                promptly.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2 text-[var(--primary-green)]">
                6. Changes to This Policy
            </h2>
            <p className="mb-4">
                We may update this Privacy Policy occasionally. We encourage you to
                review it periodically for any changes.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-2 text-[var(--primary-green)]">
                7. Contact Us
            </h2>
            <p className="mb-4">
                If you have any questions about this Privacy Policy, please email us at{" "}
                <a href="mailto:info@shilpasethtarot.com" className="text-blue-600 underline">
                    Cosmicseer111@gmail.com
                </a>.
            </p>

            <p className="text-sm text-gray-500 mt-10">
                Last updated: June 20, 2025
            </p>
        </div>
    );
}
