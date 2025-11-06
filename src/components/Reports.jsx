import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Download } from 'lucide-react';

const Reports = () => {
  const reportCards = [
    {
      title: "Flaws Detected",
      icon: <XCircle className="w-6 h-6" />,
      color: "red",
      items: [
        "Front foot no-ball tendency",
        "Late arm release timing",
        "Shoulder alignment deviation"
      ],
      bgColor: "from-red-50 to-red-100",
      iconBg: "bg-red-500",
      textColor: "text-red-700"
    },
    {
      title: "Suggested Improvements",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "green",
      items: [
        "Improve follow-through extension",
        "Strengthen core stability",
        "Practice rhythm timing drills"
      ],
      bgColor: "from-green-50 to-green-100",
      iconBg: "bg-green-500",
      textColor: "text-green-700"
    },
    {
      title: "Injury Risks",
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "amber",
      items: [
        "Lower back stress (Medium)",
        "Shoulder impingement risk",
        "Knee hyperextension concern"
      ],
      bgColor: "from-amber-50 to-amber-100",
      iconBg: "bg-amber-500",
      textColor: "text-amber-700"
    }
  ];

  return (
    <section id="reports" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Analysis Reports
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get detailed insights into your bowling technique with our AI-powered analysis. 
            Each report provides actionable feedback to improve performance and prevent injuries.
          </p>
        </div>

        {/* Report Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {reportCards.map((card, index) => (
            <div key={index} className="group">
              <div className={`bg-gradient-to-br ${card.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50`}>
                {/* Header */}
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 ${card.iconBg} rounded-2xl flex items-center justify-center text-white shadow-lg mr-4`}>
                    {card.icon}
                  </div>
                  <h3 className={`text-xl font-bold ${card.textColor}`}>
                    {card.title}
                  </h3>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {card.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start">
                      <div className={`w-2 h-2 ${card.iconBg} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                      <span className={`${card.textColor} font-medium`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress indicator */}
                <div className="mt-6 pt-6 border-t border-white/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className={`${card.textColor} opacity-70`}>
                      Analysis Confidence
                    </span>
                    <span className={`${card.textColor} font-semibold`}>
                      {card.color === 'red' ? '94%' : card.color === 'green' ? '91%' : '87%'}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-white/50 rounded-full h-2">
                    <div 
                      className={`h-2 ${card.iconBg} rounded-full transition-all duration-1000 delay-300`}
                      style={{ width: card.color === 'red' ? '94%' : card.color === 'green' ? '91%' : '87%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sample Report Download */}
        <div className="text-center">
          <div className="bg-white rounded-3xl p-12 shadow-xl max-w-2xl mx-auto border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Download className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to See More?
            </h3>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Download a comprehensive sample report to see the full depth of our analysis, 
              including detailed biomechanical breakdowns, improvement timelines, and training recommendations.
            </p>
            
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg font-semibold flex items-center space-x-3 mx-auto">
              <Download className="w-5 h-5" />
              <span>Download Sample Report (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reports;