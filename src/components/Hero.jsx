import React from 'react';
import { Play, ArrowRight } from 'lucide-react';

const Hero = () => {
  const scrollToDemo = () => {
    const element = document.getElementById('demo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToKinogram = () => {
    const element = document.getElementById('kinogram');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-20">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                AI-Powered Cricket
                <span className="text-green-600 block">Bowling Action Analyzer</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Detect flaws, suggest improvements, and predict injury risks with our advanced biomechanical analysis system.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToDemo}
                className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg font-semibold"
              >
                <Play className="w-5 h-5" />
                <span>Try Demo</span>
              </button>
              
              <button
                onClick={scrollToKinogram}
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold"
              >
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Content - Cricket Illustration */}
          <div className="lg:w-1/2 mt-16 lg:mt-0">
            <div className="relative">
              {/* Placeholder Cricket Bowler Illustration */}
              <div className="w-full max-w-lg mx-auto">
                <div className="relative bg-gradient-to-br from-green-100 to-green-50 rounded-3xl p-12 shadow-2xl">
                  <div className="text-center">
                    {/* Simplified cricket bowler figure */}
                    <div className="w-64 h-80 mx-auto bg-gradient-to-b from-green-500 to-green-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div className="text-white text-6xl">🏏</div>
                      
                      {/* Animated dots representing analysis points */}
                      <div className="absolute top-8 left-8 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-16 right-12 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                      <div className="absolute bottom-20 left-12 w-3 h-3 bg-red-400 rounded-full animate-pulse delay-700"></div>
                      <div className="absolute bottom-8 right-8 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
                    </div>
                  </div>
                  
                  {/* Motion lines */}
                  <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <div className="space-y-2">
                      <div className="w-16 h-1 bg-green-400 rounded-full opacity-70"></div>
                      <div className="w-12 h-1 bg-green-400 rounded-full opacity-50"></div>
                      <div className="w-8 h-1 bg-green-400 rounded-full opacity-30"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-8 -left-8 bg-white rounded-2xl shadow-lg p-4 animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">AI Analysis</span>
                </div>
              </div>
              
              <div className="absolute bottom-8 -right-8 bg-white rounded-2xl shadow-lg p-4 animate-float delay-1000">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Injury Prevention</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;