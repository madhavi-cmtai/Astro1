import React from "react";

const MaintenancePage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full border border-gray-200">
                <svg className="w-16 h-16 text-yellow-400 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Maintenance Mode</h1>
                <p className="text-lg text-gray-600 text-center mb-4">We are currently performing scheduled maintenance.<br />Please check back soon!</p>
                <div className="mt-2 text-sm text-gray-400">&copy; {new Date().getFullYear()} Travelink County</div>
            </div>
        </div>
    );
};

export default MaintenancePage;