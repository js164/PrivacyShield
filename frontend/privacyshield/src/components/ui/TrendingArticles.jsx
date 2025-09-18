import React from "react";
import { trendingArticles } from "../../data/articles"; // Article data array

/**
 * Displays a grid of trending digital privacy & security articles.
 * Each card shows an icon, headline, short summary, and an external link.
 */
export default function TrendingArticles() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading and intro */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-extrabold text-dark-blue sm:text-4xl">
            Trending Articles
          </h2>
          <p className="mt-4 text-lg text-neutral-gray">
            Stay informed with the latest in digital privacy and security.
          </p>
        </div>

        {/* Article cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingArticles.map((article, index) => (
            <div
              key={index}
              className="
                bg-light-blue rounded-xl p-8
                transform hover:-translate-y-2 transition-all duration-300
                border-2 border-transparent hover:border-primary-blue
                flex flex-col
              "
            >
              {/* Article icon */}
              <div className="text-4xl mb-4">{article.icon}</div>

              {/* Headline */}
              <h3 className="text-xl font-display font-bold text-dark-blue mb-2">
                {article.headline}
              </h3>

              {/* Short summary */}
              <p className="text-base text-neutral-gray font-sans flex-grow">
                {article.summary}
              </p>

              {/* External link opens in new tab */}
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-blue font-semibold mt-6 hover:underline"
              >
                Read More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
