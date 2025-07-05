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
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import EmergencyRequestComponent from '../../components/user/emergencyRequest';
import ResourceMap from '../../components/private/ResourceMap';

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

export const DisasterDetailsUserPage: React.FC = () => {
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

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Emergency Header Card */}
                        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl hover:bg-gray-800/40 transition-all duration-300 hover:border-gray-600/50 hover:shadow-blue-500/10">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="text-5xl drop-shadow-lg">{emergencyType.icon}</div>
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                                            {emergencyType.name}
                                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 animate-gradient text-xl">
                                                Emergency Response
                                            </span>
                                        </h1>
                                    </div>
                                </div>
                               
                            </div>

                           
                        </div>

                        {/* Tabs */}
                        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl hover:bg-gray-800/40 transition-all duration-300 hover:border-gray-600/50">
                            <div className="flex space-x-1 border-b border-gray-700/50 px-6">
                                {tabs.map((tab, index) => (
                                    <button
                                        key={tab.name}
                                        onClick={() => setSelectedTab(index)}
                                        className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 ${selectedTab === index
                                                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                                                : 'border-transparent text-gray-300 hover:text-gray-100 hover:border-gray-500/50 hover:bg-gray-700/30'
                                            }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span>{tab.name}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="p-8">
                                {/* Overview Tab */}
                                {selectedTab === 0 && (
                                    <div className="space-y-6">
                                        {imageUrl && (
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Visual Evidence
                                                </h3>
                                                {!imageError ? (
                                                    <div className="rounded-xl overflow-hidden bg-gray-900/50 border border-gray-600/50 cursor-pointer hover:border-gray-500/50 transition-all duration-300 shadow-lg hover:shadow-xl" onClick={() => setIsImageModalOpen(true)}>
                                                        <img
                                                            src={imageUrl}
                                                            alt="Disaster evidence"
                                                            className="w-full h-auto max-h-[400px] object-cover hover:opacity-90 transition-opacity"
                                                            onError={() => setImageError(true)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-600/50 flex items-center justify-center">
                                                        <div className="text-center text-gray-400">
                                                            <div className="text-3xl mb-2">📷</div>
                                                            <div>Image unavailable</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {disaster.citizen_survival_guide && (
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    Emergency Survival Guide
                                                </h3>
                                                <Disclosure defaultOpen={false}>
                                                    {({ open }) => (
                                                        <>
                                                            <DisclosureButton className="flex w-full justify-between rounded-xl bg-blue-500/20 border border-blue-500/30 px-6 py-4 text-left text-sm font-medium text-blue-300 hover:bg-blue-500/30 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 transition-all duration-300 backdrop-blur-sm">
                                                                <span>View Emergency Survival Guide</span>
                                                                <ChevronDownIcon
                                                                    className={`${open ? 'transform rotate-180' : ''
                                                                        } w-5 h-5 text-blue-400 transition-transform duration-300`}
                                                                />
                                                            </DisclosureButton>
                                                            <DisclosurePanel className="px-6 pb-4 pt-6 text-sm text-gray-300">
                                                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                                                                    <div className="prose prose-blue max-w-none prose-invert">
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

                                {/* Location Tab */}
                                {selectedTab === 1 && (
                                        <div className="space-y-6">
                                            {/* Resource Map and List */}
                                            <ResourceMap
                                                disasterId={disaster.disaster_id}
                                                disasterLocation={{ latitude: disaster.latitude, longitude: disaster.longitude }}
                                                role="user"
                                            />
                                        </div>
                                    
                                )}

                                {/* Actions Tab */}
                                {selectedTab === 2 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                Request Emergency Assistance
                                            </h3>
                                            {disasterId && <EmergencyRequestComponent disasterId={disasterId} />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Emergency Status */}
                        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl hover:bg-gray-800/40 transition-all duration-300 hover:border-gray-600/50">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Emergency Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl border border-gray-600/30">
                                    <span className="text-sm font-medium text-gray-300">Priority Level</span>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${urgencyLevel.color.replace('text-', 'text-').replace('bg-', 'bg-').replace('bg-', 'border-').replace('50', '500/30')}`}>
                                        {urgencyLevel.text}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl border border-gray-600/30">
                                    <span className="text-sm font-medium text-gray-300">Status</span>
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full ${statusType.color} mr-2`}></div>
                                        <span className="text-sm font-medium text-white">{statusType.text}</span>
                                    </div>
                                </div>
                                {disaster.submitted_time && (
                                    <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl border border-gray-600/30">
                                        <span className="text-sm font-medium text-gray-300">Reported</span>
                                        <span className="text-sm text-white">{formatTimeAgo(disaster.submitted_time)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl hover:bg-gray-800/40 transition-all duration-300 hover:border-gray-600/50">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <Link
                                    to={`/private/disaster/${disasterId}/communicationhub`}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-600/50 bg-gray-900/50 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800/70 hover:border-gray-500/50 hover:text-white transition-all duration-200 backdrop-blur-sm"
                                >
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    Communication Hub
                                </Link>
                                <button
                                    onClick={handleShare}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-600/50 bg-gray-900/50 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800/70 hover:border-gray-500/50 hover:text-white transition-all duration-200 backdrop-blur-sm"
                                >
                                    <ShareIcon className="w-4 h-4 mr-2" />
                                    Share Alert
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-600/50 bg-gray-900/50 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800/70 hover:border-gray-500/50 hover:text-white transition-all duration-200 backdrop-blur-sm"
                                >
                                    <PrinterIcon className="w-4 h-4 mr-2" />
                                    Print Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <Dialog open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
                
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="mx-auto max-w-4xl w-full bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl">
                        <div className="relative">
                            <button
                                onClick={() => setIsImageModalOpen(false)}
                                className="absolute top-4 right-4 z-10 p-3 bg-black/70 text-white rounded-full hover:bg-black/80 transition-all duration-200 border border-gray-600/50"
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