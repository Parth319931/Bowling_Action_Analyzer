import React from 'react';
import { Upload, Brain, FileText, ArrowRight } from 'lucide-react';

const KinogramAnalysis = () => {
  const steps = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload Bowling Video",
      description: "Simply upload your bowling action video in HD quality. Our system supports all major video formats.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Analyzes Biomechanical Movements",
      description: "Advanced computer vision and machine learning algorithms analyze every frame to detect key biomechanical markers.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Get Kinogram + Detailed Report",
      description: "Receive a comprehensive kinogram analysis with detailed insights, flaw detection, and improvement recommendations.",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <section id="kinogram" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How Kinogram Analysis Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our advanced AI system breaks down your bowling action into precise biomechanical components, 
            providing insights that were previously only available to professional teams.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-12 h-0.5 bg-gray-200 transform translate-x-6 z-10">
                  <ArrowRight className="absolute -right-3 -top-2 w-5 h-5 text-gray-400" />
                </div>
              )}

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                {/* Step Number */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step number indicator */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-green-600 text-white px-10 py-4 rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg font-semibold">
            Start Your Analysis Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default KinogramAnalysis;