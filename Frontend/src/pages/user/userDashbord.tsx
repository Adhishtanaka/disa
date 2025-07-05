import React from 'react';
import { AddDisasterComponent } from '../../components/user/emergencyReport';
import { NearbyDisastersComponent } from '../../components/user/nearbyDisasters';

const UserDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern animate-pulse"></div>
      </div>
      
      {/* Floating Gradient Orbs with Animation */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-reverse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute top-1/3 left-10 w-2 h-2 bg-green-400/30 rounded-full animate-ping"></div>
      
      <div className="relative w-full max-w-4xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30 backdrop-blur-sm shadow-lg">
              <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              User Dashboard
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Emergency Response
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient">
              Control Center
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Report emergencies and stay informed about disasters in your area
          </p>
        </div>
        
        <div className="w-full max-w-2xl mx-auto">
          <AddDisasterComponent />
        </div>
        <div className="w-full max-w-2xl mx-auto">
          <NearbyDisastersComponent />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
