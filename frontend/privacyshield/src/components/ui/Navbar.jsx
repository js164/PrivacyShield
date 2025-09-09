import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../public/Images/log.jpg'; // Your logo path

export function Navbar() {
  return (
    <header className="bg-white fixed w-full top-0 z-50 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img className="h-12 w-auto" src={logo} alt="PrivacyShield" />
              <span className="text-2xl font-display font-bold text-dark-blue">
                PrivacyShield
              </span>
            </Link>
          </div>

          {/* Navigation Links and Buttons */}
          <div className="space-x-4 flex items-center">
            <Link 
              to="/about" 
              
              className="inline-block bg-primary-blue text-white py-2 px-5 rounded-lg text-base font-medium hover:bg-dark-blue transition-colors shadow"
            >
              About Us
            </Link>
            <Link
              to="/initialassesment"
              className="inline-block bg-primary-blue text-white py-2 px-5 rounded-lg text-base font-medium hover:bg-dark-blue transition-colors shadow"
            >
              Get My Privacy Score
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function Navbar_Questions({ isChecking }) {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img className="h-12 w-auto" src={logo} alt="PrivacyShield" />
              <span className="text-2xl font-display font-bold text-dark-blue">
                PrivacyShield
              </span>
            </Link>
          </div>
          <div className="space-x-4 flex items-center">
            <Link 
              to="/about" 
              className="bg-primary-blue text-white py-2 px-5 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors shadow"
            >
              About Us
            </Link>
          {/* Restart Survey button (only if isChecking is false) */}
          {!isChecking && (
            <Link
              to="/initialassesment"
              className="bg-primary-blue text-white py-2 px-5 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors shadow"
            >
              Restart Survey
            </Link>
          )}
          </div>
        </div>
      </nav>
    </header>
  );
}