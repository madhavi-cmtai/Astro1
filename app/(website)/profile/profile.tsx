'use client'

import React, { useState } from "react";
import { User, Users, BadgeCheck, Edit, PlusCircle, LogOut, Settings, History as HistoryIcon } from "lucide-react";
import Image from "next/image";

const user = {
    name: "Nikhil Chaudhary",
    email: "nikhil@example.com",
    phone: "+91 9876543210",
    photo: "/images/contact-banner.jpg",
    membership: {
        type: "Gold",
        status: "Active",
        start: "2023-01-01",
        end: "2024-01-01",
        benefits: ["Priority Support", "Exclusive Deals", "Free Upgrades"],
    },
    family: [
        { name: "Priya Chaudhary", relation: "Spouse", age: 32, photo: "/images/contact-banner.jpg" },
        { name: "Aarav Chaudhary", relation: "Son", age: 7, photo: "/images/contact-banner.jpg" },
    ],
    address: "123, Green Avenue, New Delhi, India",
    state: "Delhi",
    city: "New Delhi",
    pincode: "110016",
    dob: "1988-05-15",
    gender: "Male",
    emergency: "+91 9123456789",
    history: [
        { type: "Silver", start: "2022-01-01", end: "2023-01-01", status: "Expired" },
        { type: "Bronze", start: "2021-01-01", end: "2022-01-01", status: "Expired" },
    ],
};

const navLinks = [
    { label: "Profile", icon: <User className="w-5 h-5 mr-2" />, key: "profile" },
    { label: "Membership", icon: <BadgeCheck className="w-5 h-5 mr-2" />, key: "membership" },
    { label: "Family", icon: <Users className="w-5 h-5 mr-2" />, key: "family" },
    { label: "History", icon: <HistoryIcon className="w-5 h-5 mr-2" />, key: "history" },
    { label: "Settings", icon: <Settings className="w-5 h-5 mr-2" />, key: "settings" },
    { label: "Logout", icon: <LogOut className="w-5 h-5 mr-2" />, key: "logout", danger: true },
];

const Profile = () => {
    const [active, setActive] = useState("profile");

    // Section renderers
    const renderSection = () => {
        if (active === "profile") {
            return (
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-[#ffe066]/40 w-full max-w-4xl md:ml-0 flex flex-col gap-6">
                    <div className="flex items-start justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#ffe066] shadow-md">
                                <Image src={user.photo} alt={user.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-[#e30613]">{user.name}</span>
                                <span className="text-gray-600 text-base">{user.email}</span>
                            </div>
                        </div>
                        <button className="p-2 rounded-full hover:bg-gray-100"><Edit className="w-5 h-5 text-gray-400" /></button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-gray-600 text-base"><Users className="w-5 h-5" />{user.phone}</div>
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="w-5 h-5 text-[#ffe066]" />
                            <span className="font-semibold text-[#457b9d]">{user.membership.type} Member</span>
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${user.membership.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.membership.status}</span>
                        </div>
                    </div>
                </div>
            );
        }
        if (active === "membership") {
            return (
                <div className="bg-white rounded-2xl shadow p-8 md:p-10 border border-[#ffe066]/30 w-full max-w-4xl md:ml-0 flex flex-col gap-6">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-2xl font-bold text-[#e30613] flex items-center gap-2"><BadgeCheck className="w-6 h-6 text-[#ffe066]" /> Membership Details</h3>
                        <button className="p-1 rounded-full hover:bg-gray-100"><Edit className="w-6 h-6 text-gray-400" /></button>
                    </div>
                    <div className="flex flex-col gap-4 text-lg font-semibold text-[#23272b]">
                        <div><span className="font-bold">Type:</span> {user.membership.type}</div>
                        <div><span className="font-bold">Start:</span> {user.membership.start}</div>
                        <div><span className="font-bold">End:</span> {user.membership.end}</div>
                        <div><span className="font-bold">Benefits:</span> <span className="font-normal">{user.membership.benefits.join(", ")}</span></div>
                        <button className="mt-2 px-8 py-3 bg-[#ffe066] text-[#e30613] font-bold rounded-full shadow hover:bg-[#e30613] hover:text-white transition text-xl w-fit">Renew Membership</button>
                    </div>
                </div>
            );
        }
        if (active === "family") {
            return (
                <div className="bg-white rounded-2xl shadow p-8 md:p-10 border border-[#ffe066]/30 w-full max-w-4xl md:ml-0 flex flex-col gap-6">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-2xl font-bold text-[#e30613] flex items-center gap-2"><Users className="w-6 h-6 text-[#ffe066]" /> Family Details</h3>
                        <button className="p-1 rounded-full hover:bg-gray-100"><PlusCircle className="w-6 h-6 text-[#457b9d]" /></button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {user.family.map((member, idx) => (
                            <div key={idx} className="flex flex-row flex-wrap items-center gap-4 bg-[#f8fafc] rounded-xl p-3 border border-[#ffe066]/20 w-full">
                                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#ffe066]">
                                    <Image src={member.photo} alt={member.name} fill className="object-cover" />
                                </div>
                                <div className="font-bold text-[#e30613]">{member.name}</div>
                                <div className="text-sm text-[#457b9d] font-semibold">{member.relation}</div>
                                <div className="text-xs text-gray-500">Age: {member.age}</div>
                                <button className="p-1 rounded-full hover:bg-gray-100 ml-auto"><Edit className="w-4 h-4 text-gray-400" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        if (active === "history") {
            return (
                <div className="bg-white rounded-2xl shadow p-8 md:p-10 border border-[#ffe066]/30 w-full max-w-4xl md:ml-0 flex flex-col gap-6">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-2xl font-bold text-[#e30613] flex items-center gap-2"><HistoryIcon className="w-6 h-6 text-[#ffe066]" /> Membership History</h3>
                    </div>
                    {user.history && user.history.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-[#1a4d8f] text-lg">
                                        <th className="pr-8">Type</th>
                                        <th className="pr-8">Start</th>
                                        <th className="pr-8">End</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.history.map((item, idx) => (
                                        <tr key={idx} className="bg-[#f8fafc] rounded-xl">
                                            <td className="font-bold text-[#e30613] pr-8 py-2">{item.type}</td>
                                            <td className="pr-8 py-2">{item.start}</td>
                                            <td className="pr-8 py-2">{item.end}</td>
                                            <td className="py-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Expired' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>{item.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-lg">No previous memberships found.</div>
                    )}
                </div>
            );
        }
        if (active === "settings") {
            return (
                <div className="bg-white rounded-2xl shadow p-8 md:p-10 border border-[#ffe066]/30 w-full max-w-4xl md:ml-0 flex flex-col gap-6">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-2xl font-bold text-[#e30613] flex items-center gap-2"><User className="w-6 h-6 text-[#ffe066]" /> Other Details</h3>
                        <button className="p-1 rounded-full hover:bg-gray-100"><Edit className="w-6 h-6 text-gray-400" /></button>
                    </div>
                    <div className="flex flex-col gap-4 text-lg font-semibold text-[#23272b]">
                        <div><span className="font-bold">Date of Birth:</span> {user.dob}</div>
                        <div><span className="font-bold">Address:</span> {user.address}</div>
                        <div><span className="font-bold">State:</span> {user.state}</div>
                        <div><span className="font-bold">City:</span> {user.city}</div>
                        <div><span className="font-bold">Pincode:</span> {user.pincode}</div>
                        <div><span className="font-bold">Emergency Contact:</span> {user.emergency}</div>
                    </div>
                </div>
            );
        }
        if (active === "logout") {
            // You can add logout logic here
            return (
                <div className="flex flex-col items-center justify-center h-full py-20">
                    <LogOut className="w-12 h-12 text-red-500 mb-4" />
                    <div className="text-xl font-bold text-red-600 mb-2">Logged Out</div>
                    <div className="text-gray-500">You have been logged out.</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen max-w-7xl mx-auto py-0 md:py-10 px-0 md:px-6 flex flex-col md:flex-row" style={{ fontFamily: 'var(--font-main)' }}>
            {/* Sidebar */}
            <aside className="w-full h-fit md:w-72 bg-white/70 backdrop-blur-md shadow-xl rounded-b-3xl md:rounded-3xl md:mr-4 flex flex-row md:flex-col items-center px-6 py-4 md:py-8 mb-4 md:mb-0 z-10">
                <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-6 w-full">
                    <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-[#ffe066] shadow-lg">
                        <Image src={user.photo} alt={user.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 md:text-center">
                        <div className="text-lg md:text-xl font-bold text-[#e30613] leading-tight">{user.name}</div>
                        <div className="text-xs md:text-sm text-gray-500">{user.email}</div>
                    </div>
                </div>
                <nav className="mt-0 md:mt-8 w-full">
                    <ul className="flex flex-row md:flex-col gap-2 md:gap-3 w-full justify-center md:justify-start">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <button
                                    className={`w-full flex items-center px-4 py-2 rounded-xl font-semibold transition-colors duration-200 hover:bg-[#ffe066]/40 hover:text-[#e30613] ${link.danger ? 'text-red-600 hover:bg-red-50' : 'text-[#1a4d8f]'} ${active === link.key ? 'bg-[#ffe066]/60 text-[#e30613]' : ''}`}
                                    onClick={() => setActive(link.key)}
                                >
                                    {link.icon}{link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-stretch pb-10 w-full">
                <div className="w-full">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
};

export default Profile;