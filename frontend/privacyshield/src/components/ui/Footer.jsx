import React from 'react';
import { Link } from 'react-router-dom';

 // Global footer displayed at the bottom of every page and Shows copyright info and a link to the admin dashboard.

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Copyright Information */}
        <p className="text-base text-neutral-gray">
          &copy; {new Date().getFullYear()} PrivacyShield. All rights reserved.
        </p>
        
        {/* Admin Dashboard Button */}
        <div>
          <Link
            to="/admin/dashboard"
            className="py-2 px-4 rounded-lg text-base font-medium 
                       text-neutral-gray 
                       hover:bg-gray-100 transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}