import React from "react";

export default function HeroSection() {
  return (
    <section className="text-center py-16 px-4 bg-white">
      <div className="flex flex-col items-center">
        <img src="/shield-icon.png" alt="shield logo" className="w-14 h-14 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Shield</h1>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all">
          Take Privacy Assessment
        </button>
      </div>
    </section>
  );
}