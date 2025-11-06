import React, { useState, useEffect } from 'react';
import { Menu, X, Upload } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CricketAnalyzer</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('kinogram')}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              Kinogram Analysis
            </button>
            <button
              onClick={() => scrollToSection('reports')}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              Reports
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              Contact
            </button>
          </div>

          {/* Upload Button */}
          <div className="hidden md:flex">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105">
              <Upload className="w-4 h-4" />
              <span>Upload Video</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('home')}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('kinogram')}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                Kinogram Analysis
              </button>
              <button
                onClick={() => scrollToSection('reports')}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                Reports
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                Contact
              </button>
              <div className="px-3 py-2">
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Video</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;