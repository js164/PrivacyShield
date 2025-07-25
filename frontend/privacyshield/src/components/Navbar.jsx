import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from "../Images/logo.svg";


/*
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: 'About Us', path: '/about' },
    { label: 'Take Survey', path: '/assessment' },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">Privacy Shield</Link>
        </div>

        {/* Desktop Menu *//*}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-blue-600 hover:text-red-600 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button *//*}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Items *//*}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 bg-white">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close menu on click
              className="block py-2 text-blue-600 hover:text-red-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
*/

export default function Navbar() {
  return (
    <nav className="bg-green-200 flex justify-between items-center px-6 py-4 shadow-md bg-white">
      <a href="/" className="flex items-center space-x-2">
        <img src={logo} alt="logo" className="w-6 h-6" />
        <span className="text-lg font-bold text-purple-700" href="/">Privacy Shield</span>
      </a>
      <div className="space-x-6 text-sm font-medium text-purple-600">
        <a href="/about" className="hover:underline\">About Us</a>
        <a href="/assessment" className="hover:underline\">Take Privacy Assessment</a>
      </div>
    </nav>
  );
}

//export default Navbar;