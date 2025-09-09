// frontend/privacyshield/src/components/AboutUs.jsx

import React from 'react';
import { ShieldCheck, Target, Users } from 'lucide-react';
import { Navbar } from './ui/Navbar'; 

const teamMembers = [
  { name: 'Brijesh Sukhadiya' },
  { name: 'Jay Solanki' },
  { name: 'Nirish Samant' },
  { name: 'Sunil Kumar' },
];

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          
          <div className="text-center">
            <ShieldCheck className="w-16 h-16 mx-auto text-primary-blue" />
            <h1 className="mt-4 text-4xl font-display font-extrabold text-dark-blue dark:text-white sm:text-5xl">
              Our Mission: Your Privacy, Simplified.
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-neutral-gray dark:text-slate-300">
              In a complex digital world, understanding your privacy shouldn't be difficult. PrivacyShield was built to empower you with the knowledge and tools to confidently manage your online footprint.
            </p>
          </div>

          <div className="my-16 border-t border-gray-200 dark:border-slate-800"></div>

          <div className="text-left">
            <h2 className="text-3xl font-display font-bold text-dark-blue dark:text-white mb-4 flex items-center">
              <Target className="w-8 h-8 mr-3 text-primary-blue" />
              Our Approach
            </h2>
            <div className="space-y-4 text-lg text-neutral-gray dark:text-slate-300">
              <p>
                The Privacy Assistance Tool is more than just a questionnaire; it's an educational journey. We analyze your personal privacy practices through a series of simple questions and provide a personalized score with clear, actionable recommendations.
              </p>
              <p>
                Our goal is to translate complex privacy concepts into easy-to-understand insights, helping you make informed decisions about the data you share online.
              </p>
            </div>
          </div>
          
          <div className="my-16 border-t border-gray-200 dark:border-slate-800"></div>

          <div className="text-left">
            <h2 className="text-3xl font-display font-bold text-dark-blue dark:text-white mb-4 flex items-center">
              <Users className="w-8 h-8 mr-3 text-primary-blue" />
              The Project & Team
            </h2>
            <p className="text-lg text-neutral-gray dark:text-slate-300 mb-8">
              PrivacyShield is a project developed as part of the Lab in Computer Security and Privacy (SoSe 2025)**. It represents our commitment to creating practical tools that solve real-world privacy challenges. The team behind this project includes:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {teamMembers.map((member) => (
                <span key={member.name} className="bg-light-blue dark:bg-slate-800 text-dark-blue dark:text-slate-200 text-lg font-medium px-5 py-2 rounded-lg">
                  {member.name}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}