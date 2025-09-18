import React from "react";
import { ShieldCheck, Target, Users } from "lucide-react";
import { Navbar } from "./ui/Navbar"; // Site-wide navigation bar

// Team member names displayed in the Project & Team section
const teamMembers = [
  { name: "Brijesh Sukhadiya" },
  { name: "Jay Solanki" },
  { name: "Nirish Samant" },
  { name: "Sunil Kumar" },
];

/**
 * AboutUs page:
 * Presents the mission, approach, and team behind the PrivacyShield project.
 */
export default function AboutUs() {
  return (
    <>
      {/* Top navigation */}
      <Navbar />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ---------------- Mission Section ---------------- */}
          <div className="text-center mb-16">
            <ShieldCheck className="w-16 h-16 mx-auto text-primary-blue" />
            <h1 className="mt-6 text-4xl font-display font-extrabold text-dark-blue sm:text-5xl">
              Our Mission: Your Privacy, Simplified.
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-neutral-gray">
              In a complex digital world, understanding your privacy shouldn't
              be difficult. PrivacyShield empowers you with the knowledge and
              tools to confidently manage your online footprint.
            </p>
          </div>

          <div className="my-16 border-t border-gray-200"></div>

          {/* ---------------- Approach Section ---------------- */}
          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold text-dark-blue mb-6 flex items-center">
              <Target className="w-8 h-8 mr-3 text-primary-blue" />
              Our Approach
            </h2>
            <div className="space-y-4 text-lg text-neutral-gray">
              <p>
                The Privacy Assistance Tool is more than just a questionnaire;
                it’s an educational journey. We analyze your privacy practices
                through simple questions and provide a personalized score with
                clear, actionable recommendations.
              </p>
              <p>
                Our goal is to translate complex privacy concepts into
                easy-to-understand insights, helping you make informed decisions
                about the data you share online.
              </p>
            </div>
          </div>

          <div className="my-16 border-t border-gray-200"></div>

          {/* ---------------- Project & Team Section ---------------- */}
          <div>
            <h2 className="text-3xl font-display font-bold text-dark-blue mb-6 flex items-center">
              <Users className="w-8 h-8 mr-3 text-primary-blue" />
              The Project & Team
            </h2>
            <p className="text-lg text-neutral-gray mb-8">
              PrivacyShield is a project developed as part of the Lab in
              Computer Security and Privacy (SoSe 2025). It reflects our
              commitment to creating practical tools that address real-world
              privacy challenges. The team includes:
            </p>
            {/* Render team member badges */}
            <div className="flex flex-wrap justify-center gap-4">
              {teamMembers.map((member) => (
                <span
                  key={member.name}
                  className="bg-light-blue text-dark-blue text-lg font-medium px-5 py-2 rounded-lg"
                >
                  {member.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
