import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

const VideoDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="demo" className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #10b981 0%, transparent 50%), 
                           radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%), 
                           radial-gradient(circle at 40% 80%, #8b5cf6 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            See AI Analysis in Action
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Watch how our advanced computer vision technology analyzes bowling actions in real-time, 
            highlighting key biomechanical markers and potential areas of concern.
          </p>
        </div>

        {/* Video Container */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl">
            {/* Video Player Mockup */}
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
              {/* Placeholder Video Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!isPlaying ? (
                  <button
                    onClick={togglePlay}
                    className="w-20 h-20 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 group"
                  >
                    <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform duration-200" />
                  </button>
                ) : (
                  <div className="w-full h-full relative">
                    {/* Simulated Video Playing State */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>
                    
                    {/* Analysis Overlays */}
                    <div className="absolute top-8 left-8">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                        <div className="text-sm font-semibold text-gray-800">Frame Analysis</div>
                        <div className="text-xs text-gray-600 mt-1">23 key points detected</div>
                      </div>
                    </div>

                    <div className="absolute top-8 right-8">
                      <div className="bg-green-500/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                        <div className="text-sm font-semibold text-white">Action Quality</div>
                        <div className="text-xs text-green-100 mt-1">87% Optimal</div>
                      </div>
                    </div>

                    <div className="absolute bottom-8 left-8">
                      <div className="bg-amber-500/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                        <div className="text-sm font-semibold text-white">Risk Alert</div>
                        <div className="text-xs text-amber-100 mt-1">Front foot alignment</div>
                      </div>
                    </div>

                    {/* Skeleton Points */}
                    <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                    <div className="absolute bottom-1/3 left-2/5 w-3 h-3 bg-green-400 rounded-full animate-pulse delay-400"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-600"></div>

                    {/* Pause Button */}
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100"
                    >
                      <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Pause className="w-6 h-6 text-white" />
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Progress Bar (when playing) */}
              {isPlaying && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                  <div className="h-full bg-green-500 animate-pulse" style={{ width: '34%' }}></div>
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="text-center mt-8">
            <p className="text-lg text-gray-300 font-medium">
              See How AI Analyzes Your Bowling Action in Real Time
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Tracking</h3>
            <p className="text-gray-400">23 key biomechanical points tracked in real-time</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Feedback</h3>
            <p className="text-gray-400">Get immediate insights on action quality</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Risk Detection</h3>
            <p className="text-gray-400">Identify potential injury risks early</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoDemo;