import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './animations.css';

export default function HeroSection() {
    const [isHovered, setIsHovered] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="bg-light-blue relative overflow-hidden min-h-screen flex items-center">
            {/* Shield Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-96 h-[480px]">
                    {/* Top Left Quarter */}
                    <div
                        className={`absolute w-48 h-60 transition-all duration-1000 ease-in-out ${isHovered ? 'opacity-20 transform-none' : 'opacity-10 -translate-x-96 -translate-y-32 rotate-12'
                            }`}
                        style={{
                            backgroundImage: `url('/logo.png')`,
                            backgroundSize: '384px 480px',
                            backgroundPosition: '0 0',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />

                    {/* Top Right Quarter */}
                    <div
                        className={`absolute top-0 right-0 w-48 h-60 transition-all duration-1000 ease-in-out ${isHovered ? 'opacity-20 transform-none' : 'opacity-10 translate-x-96 -translate-y-32 -rotate-12'
                            }`}
                        style={{
                            backgroundImage: `url('/logo.png')`,
                            backgroundSize: '384px 480px',
                            backgroundPosition: '-192px 0',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />

                    {/* Bottom Left Quarter */}
                    <div
                        className={`absolute bottom-0 left-0 w-48 h-60 transition-all duration-1000 ease-in-out ${isHovered ? 'opacity-20 transform-none' : 'opacity-10 -translate-x-96 translate-y-32 -rotate-12'
                            }`}
                        style={{
                            backgroundImage: `url('/logo.png')`,
                            backgroundSize: '384px 480px',
                            backgroundPosition: '0 -240px',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />

                    {/* Bottom Right Quarter */}
                    <div
                        className={`absolute bottom-0 right-0 w-48 h-60 transition-all duration-1000 ease-in-out ${isHovered ? 'opacity-20 transform-none' : 'opacity-10 translate-x-96 translate-y-32 rotate-12'
                            }`}
                        style={{
                            backgroundImage: `url('/logo.png')`,
                            backgroundSize: '384px 480px',
                            backgroundPosition: '-192px -240px',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                </div>
            </div>

            {/* Animated Content */}
            <div
                className="max-w-4xl mx-auto text-center px-4 relative z-10 w-full"
                style={{
                    transform: `translateY(${scrollY * 0.3}px)`,
                    opacity: Math.max(0, 1 - scrollY / 500)
                }}
            >
                {/* Animated Heading */}
                <h1
                    className="text-4xl font-display font-extrabold text-dark-blue sm:text-5xl md:text-6xl animate-fade-in-up"
                    style={{
                        transform: `translateY(${scrollY * 0.2}px) scale(${Math.max(0.8, 1 - scrollY / 2000)})`,
                        animationDelay: '0.2s'
                    }}
                >
                    Understand and Control Your Digital Privacy
                </h1>

                {/* Animated Paragraph */}
                <p
                    className="mt-6 max-w-2xl mx-auto text-lg text-neutral-gray font-sans animate-fade-in-up"
                    style={{
                        transform: `translateY(${scrollY * 0.25}px)`,
                        animationDelay: '0.4s'
                    }}
                >
                    Take our quick assessment to get a personalized privacy score and actionable recommendations to protect your digital life.
                </p>

                {/* Animated Button */}
                <div
                    className="mt-8 animate-fade-in-up"
                    style={{
                        transform: `translateY(${scrollY * 0.15}px)`,
                        animationDelay: '0.6s'
                    }}
                >
                    <Link
                        to='/initialassesment'
                        className="inline-block bg-primary-blue hover:bg-dark-blue text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        Start Your Privacy Assessment
                    </Link>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Floating Dots */}
                <div
                    className="absolute top-20 left-10 w-2 h-2 bg-primary-blue rounded-full opacity-30 animate-bounce"
                    style={{ animationDelay: '0s', animationDuration: '3s' }}
                />
                <div
                    className="absolute top-40 right-20 w-3 h-3 bg-dark-blue rounded-full opacity-20 animate-bounce"
                    style={{ animationDelay: '1s', animationDuration: '4s' }}
                />
                <div
                    className="absolute bottom-32 left-20 w-2 h-2 bg-primary-blue rounded-full opacity-25 animate-bounce"
                    style={{ animationDelay: '2s', animationDuration: '3.5s' }}
                />
                <div
                    className="absolute bottom-20 right-10 w-4 h-4 bg-neutral-gray rounded-full opacity-15 animate-bounce"
                    style={{ animationDelay: '0.5s', animationDuration: '5s' }}
                />
            </div>
        </section>
    );
}