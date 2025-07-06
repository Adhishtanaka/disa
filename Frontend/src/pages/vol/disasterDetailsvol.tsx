import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate} from 'react-router';
import { appwriteService } from '../../services/appwrite';
import {
    MapPinIcon,
    UserIcon,
    BookOpenIcon,
    EyeIcon,
    ShareIcon,
    PrinterIcon,
    ChevronDownIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { Disclosure, DisclosureButton, DisclosurePanel, Dialog, DialogPanel } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';
import 'leaflet/dist/leaflet.css';
import ResourceMap from '../../components/private/ResourceMap';
import TaskList from '../../components/private/tasksList';

interface DisasterDocument {
    $id: string;
    disaster_id: string;
    emergency_type?: string;
    urgency_level?: string;
    status?: string;
    submitted_time?: number;
    latitude?: number;
    longitude?: number;
    image_url?: string;
    citizen_survival_guide?: string;
    image?: string;
    [key: string]: unknown;
}

const EmergencyTypes = {
    fire: { icon: '🔥', name: 'Fire Emergency', accent: 'red' },
    flood: { icon: '🌊', name: 'Flood Alert', accent: 'blue' },
    earthquake: { icon: '🌍', name: 'Earthquake', accent: 'red' },
    storm: { icon: '⛈️', name: 'Storm Warning', accent: 'blue' },
    default: { icon: '⚠️', name: 'Emergency Alert', accent: 'red' }
};

const UrgencyLevels = {
    high: { text: 'Critical', color: 'text-red-600 bg-red-50' },
    medium: { text: 'High', color: 'text-orange-600 bg-orange-50' },
    low: { text: 'Moderate', color: 'text-green-600 bg-green-50' },
    default: { text: 'Unknown', color: 'text-gray-600 bg-gray-50' }
};

const StatusTypes = {
    active: { text: 'Active', color: 'bg-red-600' },
    monitoring: { text: 'Monitoring', color: 'bg-orange-500' },
    resolved: { text: 'Resolved', color: 'bg-green-600' },
    default: { text: 'Unknown', color: 'bg-gray-500' }
};

export const DisasterDetailsVol: React.FC = () => {
    const { disasterId } = useParams<{ disasterId: string }>();
    const [disaster, setDisaster] = useState<DisasterDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchDisasterDetails = async () => {
            if (!disasterId) {
                setError('No disaster ID provided');
                setLoading(false);
                return;
            }

            try {
                const data = await appwriteService.getDisasterById(disasterId);
                if (!data) {
                    setError('Disaster not found');
                    return;
                }
                setDisaster(data);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError('Failed to load disaster details: ' + errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchDisasterDetails();
    }, [disasterId]);

    const formatTimeAgo = (timestamp: number) => {
        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp;

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${disaster?.emergency_type} Emergency Alert`,
                text: `Emergency Alert: ${disaster?.emergency_type} - ${disaster?.disaster_id}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <></>
        );
    }

    if (error || !disaster) {
        navigate('/user');
        return null;
    }

    const emergencyType = EmergencyTypes[disaster.emergency_type?.toLowerCase() as keyof typeof EmergencyTypes] || EmergencyTypes.default;
    const urgencyLevel = UrgencyLevels[disaster.urgency_level?.toLowerCase() as keyof typeof UrgencyLevels] || UrgencyLevels.default;
    const statusType = StatusTypes[disaster.status?.toLowerCase() as keyof typeof StatusTypes] || StatusTypes.default;
    const imageUrl = disaster.image || disaster.image_url;

    const tabs = [
        { name: 'Overview', icon: EyeIcon },
        { name: 'Resources', icon: MapPinIcon },
        { name: 'Actions', icon: BookOpenIcon },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Hero Section with Advanced UX */}
            <section className="relative py-16 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-grid-pattern"></div>
                </div>
                
                {/* Gradient Orbs */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-reverse"></div>
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 right-20 w-4 h-4 bg-red-400/30 rounded-full animate-bounce"></div>
                <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-400/30 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute top-1/3 left-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-ping"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Enhanced Header */}
                    <div className="text-center mb-8">
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-red-500/20 text-red-600 dark:text-red-300 rounded-full text-sm font-medium border border-red-500/30 transition-colors duration-300">
                                {emergencyType.icon} {emergencyType.name}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                            Emergency Response
                            <span className="block bg-gradient-to-r from-red-500 to-red-700 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
                                Mission Details
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                            Comprehensive disaster information and volunteer coordination for effective emergency response
                        </p>
                        
                        {/* Status indicators */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${urgencyLevel.color} dark:bg-opacity-20 border border-current border-opacity-30`}>
                                Priority: {urgencyLevel.text}
                            </div>
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                                <div className={`w-2 h-2 rounded-full ${statusType.color} mr-2`}></div>
                                Status: {statusType.text}
                            </div>
                            {disaster.submitted_time && (
                                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                                    Reported: {formatTimeAgo(disaster.submitted_time)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tabs */}
                        <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-lg overflow-hidden hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] hover:border-blue-300/50 dark:hover:border-blue-500/50">
                            <div className="flex space-x-1 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30 px-6">
                                {tabs.map((tab, index) => (
                                    <button
                                        key={tab.name}
                                        onClick={() => setSelectedTab(index)}
                                        className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium border-b-2 transition-all duration-300 ${selectedTab === index
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        <span>{tab.name}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
                                {/* Overview Tab */}
                                {selectedTab === 0 && (
                                    <div className="space-y-6">
                                        {imageUrl && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Visual Evidence</h3>
                                                {!imageError ? (
                                                    <div className="group relative rounded-xl overflow-hidden bg-gray-100/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" onClick={() => setIsImageModalOpen(true)}>
                                                        <img
                                                            src={imageUrl}
                                                            alt="Disaster evidence"
                                                            className="w-full h-auto max-h-[400px] object-cover group-hover:opacity-90 transition-opacity duration-300"
                                                            onError={() => setImageError(true)}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-300/50 dark:border-gray-600/50 flex items-center justify-center backdrop-blur-sm transition-colors duration-300">
                                                        <div className="text-center text-gray-500 dark:text-gray-400">
                                                            <div className="text-3xl mb-2">📷</div>
                                                            <div>Image unavailable</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {disaster.citizen_survival_guide && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Emergency Survival Guide</h3>
                                                <Disclosure defaultOpen={false}>
                                                    {({ open }) => (
                                                        <>
                                                            <DisclosureButton className="flex w-full justify-between rounded-xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm px-6 py-4 text-left text-sm font-medium text-blue-900 dark:text-blue-300 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 transition-all duration-300 border border-blue-200/50 dark:border-blue-500/30">
                                                                <span>View Emergency Survival Guide</span>
                                                                <ChevronDownIcon
                                                                    className={`${open ? 'transform rotate-180' : ''
                                                                        } w-5 h-5 text-blue-500 dark:text-blue-400 transition-transform duration-300`}
                                                                />
                                                            </DisclosureButton>
                                                            <DisclosurePanel className="px-6 pb-4 pt-6 text-sm text-gray-700 dark:text-gray-300">
                                                                <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                                                                    <div className="prose prose-blue dark:prose-invert max-w-none">
                                                                        <ReactMarkdown>{disaster.citizen_survival_guide}</ReactMarkdown>
                                                                    </div>
                                                                </div>
                                                            </DisclosurePanel>
                                                        </>
                                                    )}
                                                </Disclosure>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Location & Data Tab */}
                                {selectedTab === 1 && (
                                    <div className="space-y-6">
                                        {/* Resource Map and List */}
                                        <div className="rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                                            <ResourceMap
                                                disasterId={disaster.disaster_id}
                                                disasterLocation={{ 
                                                    latitude: disaster.latitude || 0, 
                                                    longitude: disaster.longitude || 0 
                                                }}
                                                role="public"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Tasks Tab */}
                                {selectedTab === 2 && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Tasks</h3>
                                        <div className="rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                                            <TaskList disasterId={disaster.disaster_id} role="vol" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Emergency Status */}
                        <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-red-300/50 dark:hover:border-red-500/50">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Emergency Status</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Priority Level</span>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${urgencyLevel.color} dark:bg-opacity-20 border border-current border-opacity-30 transition-all duration-300`}>
                                        {urgencyLevel.text}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Status</span>
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full ${statusType.color} mr-2 animate-pulse`}></div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">{statusType.text}</span>
                                    </div>
                                </div>
                                {disaster.submitted_time && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Reported</span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">{formatTimeAgo(disaster.submitted_time)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300/50 dark:hover:border-blue-500/50">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    to={`/private/disaster/${disasterId}/communicationhub`}
                                    className="group w-full flex items-center justify-center px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300/50 dark:hover:border-blue-500/50"
                                >
                                    <UserIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                    Communication Hub
                                </Link>
                                <button
                                    onClick={handleShare}
                                    className="group w-full flex items-center justify-center px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-green-300/50 dark:hover:border-green-500/50"
                                >
                                    <ShareIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                    Share Alert
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="group w-full flex items-center justify-center px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-purple-300/50 dark:hover:border-purple-500/50"
                                >
                                    <PrinterIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                    Print Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </section>

            {/* Image Modal */}
            <Dialog open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
                
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="mx-auto max-w-4xl w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                        <div className="relative">
                            <button
                                onClick={() => setIsImageModalOpen(false)}
                                className="absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                            <img
                                src={imageUrl}
                                alt="Disaster evidence"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
                            />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
};