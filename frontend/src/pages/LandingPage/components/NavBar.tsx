import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './assets/Logo.jpg';

const NavBar: React.FC = () => {

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'bottom') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="bg-white/30 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Company Logo or Name */}
        <div className="text-2xl font-bold text-gray-800">
          <a href="/" className="flex items-center text-black">
            <img
              src={Logo} // Replace with your logo's path if you have one
              alt="Company Logo"
              className="w-12 h-12 mr-2"
            />
            Freely
          </a>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('product');
            }}
            className="text-gray-800 hover:text-green-600"
          >
            Product
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('solutions');
            }}
            className="text-gray-800 hover:text-green-600"
          >
            Solutions
          </a>
        </div>

        {/* Sign In/Sketch buttons */}
        <div className="hidden md:flex space-x-4">
          <Link to="/login" className="text-gray-800 hover:text-green-600 flex items-center">
            Sign In
          </Link>
          <Link to="/signup" className="flex items-center">
            <div className="cursor-pointer px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
              Sign Up
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
