import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeftIcon, ClockIcon, MapPinIcon, ExclamationTriangleIcon, DocumentTextIcon, UserGroupIcon, CheckCircleIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';
import { appwriteService } from '../../services/appwrite';
import ResourceMap from '../../components/private/ResourceMap';
import TaskList from '../../components/private/tasksList';
import type { Disaster } from '../../types/disaster';

export const DisasterDetailsGovPage = () => {
  const { id } = useParams<{ id: string }>();
  const [disaster, setDisaster] = useState<Disaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  useEffect(() => {
    const fetchDisaster = async () => {
      if (!id) {
        setError('Invalid disaster ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await appwriteService.getDisasterById(id);
        setDisaster(data as unknown as Disaster);
        
        // Try to get image URL if disaster has image
        if (data && data.image && typeof data.image === 'string') {
          try {
            setImageUrl(data.image);
          } catch (imgError) {
            console.error('Failed to load image:', imgError);
            setImageError(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch disaster:', err);
        setError('Failed to load disaster details');
      } finally {
        setLoading(false);
      }
    };

    fetchDisaster();
  }, [id]);

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp * 1000);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'resolved': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'archived': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'low': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleArchive = async () => {
    if (!disaster) return;
    
    try {
      // Update the disaster status to archived
      setDisaster({ ...disaster, status: 'archived' });
      setIsArchiveModalOpen(false);
      // In a real app, you would call an API here to update the status
      console.log('Disaster archived:', disaster.disaster_id);
    } catch (err) {
      console.error('Failed to archive disaster:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="fixed top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-400/5 rounded-full blur-3xl animate-pulse-slow"></div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-8 shadow-2xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300/50 dark:bg-gray-600/50 rounded-lg w-1/3"></div>
              <div className="h-4 bg-gray-300/50 dark:bg-gray-600/50 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300/50 dark:bg-gray-600/50 rounded w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300/50 dark:bg-gray-600/50 rounded"></div>
                <div className="h-4 bg-gray-300/50 dark:bg-gray-600/50 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300/50 dark:bg-gray-600/50 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !disaster) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="fixed top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-reverse"></div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-8 shadow-2xl text-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || 'Disaster Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The disaster you're looking for could not be loaded.
            </p>
            <Link
              to="/gov/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 0, label: 'Overview', icon: DocumentTextIcon },
    { id: 1, label: 'Resource Map', icon: MapPinIcon },
    { id: 2, label: 'Tasks', icon: UserGroupIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float-slow"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-reverse"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-400/5 rounded-full blur-3xl animate-pulse-slow"></div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-6 shadow-2xl mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Link
                to="/gov/dashboard"
                className="inline-flex items-center justify-center w-12 h-12 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                aria-label="Back to dashboard"
              >
                <ArrowLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {disaster.emergency_type} Emergency
                </h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(disaster.status)}`}>
                    {disaster.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full font-medium ${getUrgencyColor(disaster.urgency_level)}`}>
                    {disaster.urgency_level.toUpperCase()} PRIORITY
                  </span>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {disaster.location}
                  </div>
                </div>
              </div>
            </div>
            {disaster.status !== 'archived' && (
              <button
                onClick={() => setIsArchiveModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <ArchiveBoxIcon className="w-4 h-4 mr-2" />
                Archive
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-2 shadow-2xl mb-8">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-8 shadow-2xl">
              {selectedTab === 0 && (
                <div className="space-y-8">
                  {/* Situation Description */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Situation Description
                    </h3>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{disaster.situation}</p>
                    </div>
                  </div>

                  {/* Image Display */}
                  {imageUrl && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Disaster Image
                      </h3>
                      <div className="relative">
                        {!imageError ? (
                          <div className="group rounded-xl overflow-hidden bg-gray-100/50 dark:bg-gray-700/20 border border-gray-300/30 dark:border-gray-600/30 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                               onClick={() => setIsImageModalOpen(true)}>
                            <img
                              src={imageUrl}
                              alt="Disaster scene"
                              className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={() => setImageError(true)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium text-gray-900 dark:text-white">
                                Click to enlarge
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-96 bg-gray-100/50 dark:bg-gray-700/20 border border-gray-300/30 dark:border-gray-600/30 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                              <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 dark:text-gray-400">Failed to load image</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Government Report - Only show if available */}
                  {disaster.situation && disaster.situation.includes('Report:') && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Additional Information
                      </h3>
                      <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-6">
                        <div className="prose prose-blue dark:prose-invert max-w-none">
                          <ReactMarkdown>{disaster.situation.split('Report:')[1] || disaster.situation}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 1 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Resource Distribution Map
                  </h3>
                  <div className="bg-gray-100/30 dark:bg-gray-700/20 rounded-xl overflow-hidden border border-gray-300/30 dark:border-gray-600/30 shadow-lg">
                    <ResourceMap
                      disasterId={disaster.disaster_id}
                      disasterLocation={{ latitude: disaster.latitude, longitude: disaster.longitude }}
                    />
                  </div>
                </div>
              )}

              {selectedTab === 2 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Active Tasks
                  </h3>
                  <div className="bg-gray-100/30 dark:bg-gray-700/20 rounded-xl p-6 border border-gray-300/30 dark:border-gray-600/30 backdrop-blur-sm shadow-lg">
                    <TaskList disasterId={disaster.disaster_id} role="gov" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Emergency Timeline */}
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-gray-400/40 dark:hover:border-gray-600/40 group">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-500/30 transition-colors duration-300">
                  <ClockIcon className="w-4 h-4 text-blue-500" />
                </div>
                Emergency Timeline
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group/item">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:shadow-blue-500/25 transition-all duration-300 group-hover/item:scale-110">
                    <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-300">Report Submitted</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{formatDateTime(disaster.submitted_time)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">{formatTimeAgo(disaster.submitted_time)}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group/item">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:shadow-green-500/25 transition-all duration-300 group-hover/item:scale-110">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors duration-300">Status Updated</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Current: {disaster.status.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Statistics */}
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-gray-400/40 dark:hover:border-gray-600/40 group">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-500/30 transition-colors duration-300">
                  <DocumentTextIcon className="w-4 h-4 text-green-500" />
                </div>
                Quick Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg border border-gray-200/30 dark:border-gray-600/30 hover:bg-gray-100/50 dark:hover:bg-gray-600/30 transition-all duration-300">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Priority Level</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${getUrgencyColor(disaster.urgency_level)}`}>
                    {disaster.urgency_level.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg border border-gray-200/30 dark:border-gray-600/30 hover:bg-gray-100/50 dark:hover:bg-gray-600/30 transition-all duration-300">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {disaster.location}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg border border-gray-200/30 dark:border-gray-600/30 hover:bg-gray-100/50 dark:hover:bg-gray-600/30 transition-all duration-300">
                  <span className="text-sm text-gray-600 dark:text-gray-400">People Count</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {disaster.people_count}
                  </span>
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-gray-400/40 dark:hover:border-gray-600/40 group">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-500/30 transition-colors duration-300">
                  <MapPinIcon className="w-4 h-4 text-purple-500" />
                </div>
                Coordinates
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg border border-gray-200/30 dark:border-gray-600/30">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Latitude</div>
                  <div className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                    {disaster.latitude}°
                  </div>
                </div>
                <div className="p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg border border-gray-200/30 dark:border-gray-600/30">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Longitude</div>
                  <div className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                    {disaster.longitude}°
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors duration-300"
            >
              ×
            </button>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Disaster scene - enlarged"
                className="w-full h-full object-contain"
              />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Archive Confirmation Modal */}
      <Dialog open={isArchiveModalOpen} onClose={() => setIsArchiveModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-6 shadow-2xl max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4">
                <ArchiveBoxIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                  Archive Disaster
                </Dialog.Title>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action will mark the disaster as archived.
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to archive "{disaster?.emergency_type} Emergency"? This will change its status to archived and it will no longer appear in active disaster lists.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleArchive}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Archive Disaster
              </button>
              <button
                onClick={() => setIsArchiveModalOpen(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white px-4 py-2 rounded-xl font-medium transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default DisasterDetailsGovPage;
