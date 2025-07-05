import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowPathIcon, ExclamationTriangleIcon,DocumentTextIcon } from '@heroicons/react/24/outline';
import { appwriteService } from '../../services/appwrite';
import type { Disaster, DisasterStatus, UrgencyLevel } from '../../types/disaster';
import { WorldMap } from '../../components/private/WorldMap';

export const FirstRespondersDashboard = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDisasters = async () => {
    setLoading(true);
    setError(null);
    try {
      const disasterData = await appwriteService.getAllDisasters();
      setDisasters(disasterData as unknown as Disaster[]);
    } catch (err) {
      setDisasters([]);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Failed to fetch disasters: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasters();
  }, []);

  const filteredDisasters = disasters.filter(disaster => disaster.status === 'active');

  const getStatusColor = (status: DisasterStatus): string => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'archived': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getUrgencyColor = (urgency: UrgencyLevel): string => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section with Advanced UX */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-red-400/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-orange-400/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/3 left-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-ping"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-red-500/20 text-red-600 dark:text-red-300 rounded-full text-sm font-medium border border-red-500/30 transition-colors duration-300">
                🚨 First Responder Operations
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Emergency Response
              <span className="block bg-gradient-to-r from-red-500 to-red-700 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              Rapid response coordination for emergency situations. Access real-time disaster data, 
              deploy resources, and coordinate with response teams in critical scenarios
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={fetchDisasters}
                disabled={loading}
                className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <ArrowPathIcon className={`w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
                Refresh Status
              </button>
              <Link
                to="/fr/disaster/1"
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              >
                Emergency Details
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Statistics Card */}
          <div className="mb-12">
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-red-300/50 dark:hover:border-red-500/50">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100/50 dark:bg-red-500/20 group-hover:scale-110 transition-transform duration-300">
                  <DocumentTextIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{filteredDisasters.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Critical Situations</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                Requiring immediate response attention
              </div>
            </div>
          </div>

          {/* Enhanced World Map Section */}
          <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 mb-12 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-red-300/50 dark:hover:border-red-500/50">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Emergency Response Map</h2>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Real-time deployment of emergency response teams
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{filteredDisasters.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-500">Active Zones</div>
              </div>
            </div>
            {loading ? (
              <div className="h-96 bg-gray-100/50 dark:bg-gray-900/50 rounded-lg animate-pulse flex items-center justify-center transition-colors duration-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 mb-4">
                    <ArrowPathIcon className="w-6 h-6 text-red-600 dark:text-red-400 animate-spin" />
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Loading emergency map...</div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden">
                <WorldMap disasters={filteredDisasters} activeTab={"active"} />
              </div>
            )}
          </div>

          {/* Error Message with Enhanced UX */}
          {error && (
            <div className="group relative bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/50 rounded-xl p-6 mb-8 shadow-sm hover:bg-red-50/70 dark:hover:bg-red-900/30 transition-all duration-300">
              <div className="flex items-start">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 mr-4 group-hover:scale-110 transition-transform duration-300">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-1">System Alert</h3>
                  <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Emergency Response List */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-lg overflow-hidden hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
            <div className="border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Critical Situations</h2>
              <p className="text-gray-600 dark:text-gray-400">Emergency situations requiring immediate response</p>
            </div>
            <div className="p-8">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 animate-pulse bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-300">
                      <div className="flex items-start justify-between mb-6">
                        <div className="space-y-3">
                          <div className="h-5 bg-gray-300/50 dark:bg-gray-700/50 rounded w-48"></div>
                          <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-32"></div>
                        </div>
                        <div className="h-8 bg-gray-300/50 dark:bg-gray-700/50 rounded w-20"></div>
                      </div>
                      <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : filteredDisasters.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 mb-6">
                    <ExclamationTriangleIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">No critical situations</h3>
                  <p className="text-gray-600 dark:text-gray-400">All emergency situations are under control.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredDisasters.map((disaster) => (
                    <div
                      key={disaster.$id}
                      className="group relative border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-red-300/50 dark:hover:border-red-500/50"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                              {disaster.emergency_type} Emergency
                            </h3>
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${getUrgencyColor(disaster.urgency_level)}`}>
                              {disaster.urgency_level?.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed transition-colors duration-300">{disaster.situation}</p>
                          <div className="flex items-center gap-6 text-sm">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${getStatusColor(disaster.status)}`}>
                              {disaster.status.toUpperCase()}
                            </span>
                            <span className="text-gray-500 dark:text-gray-500">
                              📅 {new Date(disaster.submitted_time * 1000).toLocaleDateString()}
                            </span>
                            {disaster.latitude && disaster.longitude && (
                              <span className="text-gray-500 dark:text-gray-500">
                                📍 {disaster.latitude.toFixed(3)}, {disaster.longitude.toFixed(3)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="flex gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                        <Link
                          to={`/fr/disaster/${disaster.$id}/`}
                          className="group bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center"
                        >
                          <DocumentTextIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                          Emergency Response
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};