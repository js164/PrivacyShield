import React, { useState } from 'react';

// Simple icon components to replace lucide-react
const ShieldIcon = () => (
  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
);

const WarningIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
  </svg>
);

const RotateIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
  </svg>
);

const PrivacyReport = () => {
  // Sample data - in real app this would come from props or context
  const [reportData, setReportData] = useState({
    score: 65,
    questionsAnswered: 22,
    totalQuestions: 25,
    riskLevel: "Moderate Risk"
  });

  const getRiskDetails = (score) => {
    if (score >= 80) {
      return {
        level: "Low Risk",
        color: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-300",
        icon: CheckIcon
      };
    } else if (score >= 60) {
      return {
        level: "Moderate Risk",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: WarningIcon
      };
    } else if (score >= 40) {
      return {
        level: "High Risk",
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-400",
        icon: XIcon
      };
    } else {
      return {
        level: "Critical Risk",
        color: "text-red-800",
        bgColor: "bg-red-200",
        borderColor: "border-red-500",
        icon: XIcon
      };
    }
  };

  const getPrivacyCategories = () => [
    {
      title: "Digital Identity & Authentication",
      suggestion: "Use strong, unique passwords and enable two-factor authentication on all your important accounts. Consider using a reputable password manager to generate and store complex passwords securely."
    },
    {
      title: "Data Collection & Control",
      suggestion: "Review and adjust privacy settings on all platforms. Limit data sharing with third parties and regularly audit what information companies have collected about you."
    },
    {
      title: "Location & Physical Safety",
      suggestion: "Disable location tracking for unnecessary apps. Use airplane mode in sensitive locations and consider using a VPN to mask your IP address and location."
    },
    {
      title: "Social & Reputation Management",
      suggestion: "Regularly audit your social media profiles and posts. Set up Google alerts for your name and consider using privacy-focused social platforms for sensitive communications."
    },
    {
      title: "Surveillance & Tracking",
      suggestion: "Use ad blockers, disable tracking cookies, and consider browsers like Firefox or Brave. Enable 'Do Not Track' settings and use private browsing modes when needed."
    },
    {
      title: "Transparency & Corporate Trust",
      suggestion: "Read privacy policies of services you use. Choose services from companies with strong privacy commitments and avoid platforms with poor transparency records."
    },
    {
      title: "Legal & Advanced Privacy",
      suggestion: "Stay informed about privacy laws in your jurisdiction. Consider using encrypted messaging apps like Signal and learn about your data rights under GDPR or similar regulations."
    }
  ];

  const riskDetails = getRiskDetails(reportData.score);
  const RiskIcon = riskDetails.icon;
  const completionPercentage = Math.round((reportData.questionsAnswered / reportData.totalQuestions) * 100);
  const privacyCategories = getPrivacyCategories();

  const handleRetakeAssessment = () => {
    // Reset data for demo purposes
    setReportData({
      score: Math.floor(Math.random() * 100),
      questionsAnswered: Math.floor(Math.random() * 25) + 1,
      totalQuestions: 25,
      riskLevel: "Recalculating..."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <ShieldIcon />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">
            Privacy Assessment Report
          </h1>
          <p className="text-blue-700 text-lg">
            Your comprehensive digital privacy analysis
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white text-center mb-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Your Privacy Score</h2>
          <div className="text-5xl sm:text-6xl font-bold mb-2">{reportData.score}</div>
          <p className="text-blue-100 text-lg">out of 100</p>
          
          {/* Progress Ring Visual */}
          <div className="flex justify-center mt-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="white"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - reportData.score / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-sm sm:text-base">
                  {reportData.score}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Level Card */}
        <div className={`${riskDetails.bgColor} ${riskDetails.borderColor} border-l-4 rounded-xl p-6 mb-8 shadow-sm`}>
          <div className="flex items-center mb-4">
            <RiskIcon className={`w-8 h-8 ${riskDetails.color} mr-3`} />
            <div>
              <h3 className="text-xl font-bold text-blue-900">Risk Assessment</h3>
              <p className={`text-lg font-semibold ${riskDetails.color}`}>
                {riskDetails.level}
              </p>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-8 text-center">
            Personalized Recommendations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {privacyCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-200">
                <h4 className="text-lg font-bold text-blue-900 mb-3">
                  {category.title}
                </h4>
                <p className="text-blue-700 leading-relaxed text-sm">
                  {category.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stay Updated Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 sm:p-8 border border-blue-200 mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">
            Stay Privacy-Protected
          </h3>
          <p className="text-blue-700 mb-6 leading-relaxed">
            Privacy threats evolve constantly. New data breaches, updated privacy policies, and emerging tracking technologies mean your privacy score can change. Regular reassessment ensures you stay ahead of new risks and maintain optimal protection.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Monthly Check-ups</h4>
              <p className="text-blue-700 text-sm">
                Reassess your privacy posture as new threats emerge
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Updated Insights</h4>
              <p className="text-blue-700 text-sm">
                Get fresh recommendations based on latest privacy research
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Track Progress</h4>
              <p className="text-blue-700 text-sm">
                Monitor improvements and maintain your privacy gains
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleRetakeAssessment}
            className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <RotateIcon />
            Retake Assessment
          </button>
          
          <button className="flex items-center justify-center px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200">
            <HomeIcon />
            Back to Dashboard
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-6">
          <p className="text-blue-600 text-sm">
            Privacy Shield Assessment • Protecting Your Digital Identity
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyReport;