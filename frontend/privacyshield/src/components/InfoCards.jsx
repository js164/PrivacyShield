import React from "react";

const cards = [
  {
    title: "Assessment Privacy Concerns",
    value: "5",
    description: "Comprehensive evaluation across Digital Identity, Data Control, Location Privacy, Online Behavior, and Security Practices",
    icon: "📊",
  },
  {
    title: "Assessment Time",
    value: "8-12 min",
    description: "Quick but thorough evaluation of your privacy practices with instant feedback and personalized recommendations",
    icon: "⏱️",
  },
  {
    title: "Your Privacy Score",
    value: "0–100",
    description: "Get your personalized privacy score with detailed insights into your digital security strengths and vulnerabilities",
    icon: "🎯",
  },
];

export default function InfoCards() {
  return (
    <section className="py-10 px-6 bg-gray-50 flex flex-col items-center">
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 text-center border-t-4 border-purple-500"
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
            <p className="text-2xl text-purple-600 font-bold mb-2">{card.value}</p>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}