import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="bg-light-blue">
        <div className="max-w-4xl mx-auto text-center py-24 px-4 sm:py-32">
            {/* Add 'font-display' to the heading */}
            <h1 className="text-4xl font-display font-extrabold text-dark-blue sm:text-5xl md:text-6xl">
                Understand and Control Your Digital Privacy
            </h1>
            {/* Add 'font-sans' to the paragraph */}
            <p className="mt-6 max-w-2xl mx-auto text-lg text-neutral-gray font-sans">
                Take our quick assessment to get a personalized privacy score and actionable recommendations to protect your digital life.
            </p>
            <div className="mt-8">
                <Link 
                    to='/assesment' 
                    className="inline-block bg-primary-blue hover:bg-dark-blue text-white font-semibold px-8 py-3 rounded-full shadow-lg"
                >
                    Reveal My Privacy Risks
                </Link>
            </div>
        </div>
    </section>
  );
}