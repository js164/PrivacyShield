import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './animations.css';

/**
 * HeroSection
 *
 * Top-level landing hero used on the homepage. It contains:
 * - A decorative 'shield' composed of 4 background slices (visual only)
 * - A headline, short description, and a CTA link
 * - Subtle scroll-based parallax and opacity effects
 *
 * Notes for maintainers:
 * - Visual background pieces use the public `/logo.png` file and are pointer-events: none.
 * - The component measures `window.scrollY` for simple transform effects. This is lightweight and
 *   acceptable for this small project; if you add many listeners, debounce or use requestAnimationFrame.
 */
export default function HeroSection() {
    // Tracks whether the CTA is hovered (used to subtly change background slice opacity)
    const [isHovered, setIsHovered] = useState(false);

    // Tracks vertical scroll to drive small parallax and fade effects
    const [scrollY, setScrollY] = useState(0);

    // Set up a single scroll listener when mounted and clean up on unmount
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="bg-light-blue relative overflow-hidden min-h-screen flex items-center">
            {/* Decorative shield split into 4 slices. These are visual only and should not capture pointer events. */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-96 h-[480px]">
                    {/* Top-left slice */}
                    <div
                        className={`absolute w-48 h-60 transition-all duration-1000 ease-in-out ${isHovered ? 'opacity-20 transform-none' : 'opacity-10 -translate-x-96 -translate-y-32 rotate-12'}`}
                        style={{
                            backgroundImage: `url('/logo.png')`,
                            backgroundSize: '384px 480px',
                            backgroundPosition: '0 0',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />

                    {/* Top-right slice */}
                    <div
                        className={`absolute top-0 right-0 w-48 h-60 transition-all duration-1000 ease-in-out ${isHovered ? 'opacity-20 transform-none' : 'opacity-10 translate-x-96 -translate-y-32 -rotate-12'}`}
                        style={{
                            backgroundImage: `url('/logo.png')`,
                            backgroundSize: '384px 480px',
                            backgroundPosition: '-192px 0',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />

                    {/* Bottom-left slice */}
                    <div
                        className={`absolute bottom-0 left-0 w-48 h-60 transition-all duration-1000 ease-in-out ${isHovered ? 'opacity-20 transform-none' : 'opacity-10 -translate-x-96 translate-y-32 -rotate-12'}`}
                        style={{
                            backgroundImage: `url('/logo.png')`,
                            backgroundSize: '384px 480px',
                            backgroundPosition: '0 -240px',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />

                    {/* Bottom-right slice */}
                    <div
                        className={`absolute bottom-0 right-0 w-48 h-60 transition-all duration-1000 ease-in-out ${isHovered ? 'opacity-20 transform-none' : 'opacity-10 translate-x-96 translate-y-32 rotate-12'}`}
                        style={{
                            backgroundImage: `url('/logo.png')`,
                            backgroundSize: '384px 480px',
                            backgroundPosition: '-192px -240px',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                </div>
            </div>

            {/* Main content container: headline, paragraph, CTA. Parallax transforms depend on scrollY. */}
            <div
                className="max-w-4xl mx-auto text-center px-4 relative z-10 w-full"
                style={{
                    transform: `translateY(${scrollY * 0.3}px)`,
                    opacity: Math.max(0, 1 - scrollY / 500)
                }}
            >
                {/* Headline with subtle scale & translate driven by scroll */}
                <h1
                    className="text-4xl font-display font-extrabold text-dark-blue sm:text-5xl md:text-6xl animate-fade-in-up"
                    style={{
                        transform: `translateY(${scrollY * 0.2}px) scale(${Math.max(0.8, 1 - scrollY / 2000)})`,
                        animationDelay: '0.2s'
                    }}
                >
                    Understand and Control Your Digital Privacy
                </h1>

                {/* Short description under the headline */}
                <p
                    className="mt-6 max-w-2xl mx-auto text-lg text-neutral-gray font-sans animate-fade-in-up"
                    style={{
                        transform: `translateY(${scrollY * 0.25}px)`,
                        animationDelay: '0.4s'
                    }}
                >
                    Take our quick assessment to get a personalized privacy score and actionable recommendations to protect your digital life.
                </p>

                {/* Call-to-action. Hover state toggles the decorative shield opacity. */}
                <div
                    className="mt-8 animate-fade-in-up"
                    style={{
                        transform: `translateY(${scrollY * 0.15}px)`,
                        animationDelay: '0.6s'
                    }}
                >
                    <Link
                        to='/initialassesment'
                        className="inline-block bg-primary-blue hover:bg-dark-blue text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        Start My Privacy Checkup
                    </Link>
                </div>
            </div>

            {/* Floating decorative dots. Kept pointer-events: none by container to avoid intercepting clicks. */}
            <div className="absolute inset-0 pointer-events-none">
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