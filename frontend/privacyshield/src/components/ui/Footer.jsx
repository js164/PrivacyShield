import React from "react";
import { Link } from "react-router-dom";

/**
 * Global footer displayed at the bottom of every page.
 * Shows copyright info and a link to the admin dashboard.
 */
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Dynamic current year */}
        <p className="text-base text-neutral-gray">
          &copy; {new Date().getFullYear()} PrivacyShield. All rights reserved.
        </p>

        {/* Link to Admin Dashboard */}
        <Link
          to="/admin/dashboard"
          className="inline-block bg-primary-blue text-white py-2 px-5 rounded-lg text-base font-medium hover:bg-dark-blue transition-colors shadow"
        >
          Admin Dashboard
        </Link>
      </div>
    </footer>
  );
}
