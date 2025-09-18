import React from "react";

const cards = [
  {
    title: "Comprehensive Assessment",
    description: "Evaluate your privacy across 22 key areas, from data collection to security practices.",
    icon: "📊",
  },
  {
    title: "Quick & Easy",
    description: "Our assessment takes just 8-15 minutes to complete, with instant, easy-to-understand results.",
    icon: "⏱️",
  },
  {
    title: "Personalized Score",
    description: "Receive a privacy score from 0 to 100, with detailed insights and actionable recommendations.",
    icon: "🎯",
  },
];

export default function InfoCards() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-extrabold text-dark-blue">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-light-blue rounded-xl p-8 transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-display font-bold text-dark-blue mb-2">{card.title}</h3>
              <p className="text-base text-neutral-gray">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}