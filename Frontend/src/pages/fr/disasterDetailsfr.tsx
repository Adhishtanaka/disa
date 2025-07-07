import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { appwriteService } from '../../services/appwrite';
import {
    BookOpenIcon,
    EyeIcon,
    ShareIcon,
    PrinterIcon,
    ChevronDownIcon,
    XMarkIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    RadioIcon,
    TruckIcon,
    ShieldCheckIcon,
    HeartIcon,
    UsersIcon,
    DocumentTextIcon,
    ArrowPathIcon,
    ChartBarIcon,
    MapIcon,
    FireIcon,
    ClockIcon as TimeIcon,
    CheckBadgeIcon
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
    fire: { icon: '🔥', name: 'Fire Emergency', accent: 'red', bgColor: 'bg-red-50 dark:bg-red-900/20', textColor: 'text-red-700 dark:text-red-300', borderColor: 'border-red-200 dark:border-red-700' },
    flood: { icon: '🌊', name: 'Flood Alert', accent: 'blue', bgColor: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-700 dark:text-blue-300', borderColor: 'border-blue-200 dark:border-blue-700' },
    earthquake: { icon: '🌍', name: 'Earthquake', accent: 'yellow', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', textColor: 'text-yellow-700 dark:text-yellow-300', borderColor: 'border-yellow-200 dark:border-yellow-700' },
    storm: { icon: '⛈️', name: 'Storm Warning', accent: 'purple', bgColor: 'bg-purple-50 dark:bg-purple-900/20', textColor: 'text-purple-700 dark:text-purple-300', borderColor: 'border-purple-200 dark:border-purple-700' },
    default: { icon: '⚠️', name: 'Emergency Alert', accent: 'gray', bgColor: 'bg-gray-50 dark:bg-gray-800', textColor: 'text-gray-700 dark:text-gray-300', borderColor: 'border-gray-200 dark:border-gray-700' }
};

const UrgencyLevels = {
    high: { text: 'Critical', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-700', icon: ExclamationTriangleIcon },
    medium: { text: 'High', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-700', icon: ClockIcon },
    low: { text: 'Moderate', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700', icon: CheckCircleIcon },
    default: { text: 'Unknown', color: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700', icon: ExclamationTriangleIcon }
};

const StatusTypes = {
    active: { text: 'Active Response', color: 'bg-red-500 dark:bg-red-600', pulse: true },
    monitoring: { text: 'Under Monitoring', color: 'bg-orange-500 dark:bg-orange-600', pulse: false },
    resolved: { text: 'Resolved', color: 'bg-green-500 dark:bg-green-600', pulse: false },
    default: { text: 'Unknown Status', color: 'bg-gray-500 dark:bg-gray-600', pulse: false }
};

export const DisasterDetailsFr: React.FC = () => {
    const { disasterId } = useParams<{ disasterId: string }>();
    const [disaster, setDisaster] = useState<DisasterDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    

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
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse space-y-6">
                        {/* Header skeleton */}
                        <div className="bg-gray-200 dark:bg-gray-800 rounded-xl h-32"></div>
                        
                        {/* Content grid skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-gray-200 dark:bg-gray-800 rounded-xl h-96"></div>
                                <div className="bg-gray-200 dark:bg-gray-800 rounded-xl h-64"></div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-gray-200 dark:bg-gray-800 rounded-xl h-48"></div>
                                <div className="bg-gray-200 dark:bg-gray-800 rounded-xl h-32"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !disaster) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {error ? 'Error Loading Disaster' : 'Disaster Not Found'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error || 'The requested disaster information could not be found.'}
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                        >
                            <ArrowPathIcon className="w-5 h-5 mr-2" />
                            Try Again
                        </button>
                        <Link
                            to="/fr"
                            className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const emergencyType = EmergencyTypes[disaster.emergency_type?.toLowerCase() as keyof typeof EmergencyTypes] || EmergencyTypes.default;
    const urgencyLevel = UrgencyLevels[disaster.urgency_level?.toLowerCase() as keyof typeof UrgencyLevels] || UrgencyLevels.default;
    const statusType = StatusTypes[disaster.status?.toLowerCase() as keyof typeof StatusTypes] || StatusTypes.default;
    const imageUrl = disaster.image || disaster.image_url;

    const tabs = [
        { name: 'Situation Overview', icon: EyeIcon, description: 'Current status and details' },
        { name: 'Resource Deployment', icon: TruckIcon, description: 'Equipment and personnel' },
        { name: 'Response Actions', icon: ShieldCheckIcon, description: 'Emergency operations' },
        { name: 'Communications', icon: RadioIcon, description: 'Coordination hub' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header Banner */}
            <div className={`relative ${emergencyType.bgColor} ${emergencyType.borderColor} border-b transition-colors duration-300`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-grid-pattern"></div>
                </div>
                
                {/* Animated Elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-red-400/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce delay-1000"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                            <div className="relative">
                                <div className="text-6xl filter drop-shadow-lg">{emergencyType.icon}</div>
                                {statusType.pulse && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-gray-900"></div>
                                )}
                            </div>
                            <div>
                                <h1 className={`text-4xl font-bold ${emergencyType.textColor} mb-2 tracking-tight`}>
                                    {emergencyType.name}
                                </h1>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Emergency ID: {disaster.disaster_id}
                                    </span>
                                    {disaster.submitted_time && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <ClockIcon className="w-4 h-4 mr-1" />
                                            {formatTimeAgo(disaster.submitted_time)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Quick Status Cards */}
                        <div className="flex space-x-3">
                            <div className={`flex items-center px-4 py-2 rounded-lg ${urgencyLevel.color} transition-all duration-300 hover:scale-105`}>
                                <urgencyLevel.icon className="w-5 h-5 mr-2" />
                                <span className="font-semibold">{urgencyLevel.text}</span>
                            </div>
                            <div className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className={`w-3 h-3 rounded-full ${statusType.color} mr-2 ${statusType.pulse ? 'animate-pulse' : ''}`}></div>
                                <span className="font-medium text-gray-900 dark:text-white">{statusType.text}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Emergency Response Dashboard */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white flex items-center">
                                        <ShieldCheckIcon className="w-6 h-6 mr-2" />
                                        First Responder Operations Center
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-red-100">ACTIVE RESPONSE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex space-x-1 px-6">
                                    {tabs.map((tab, index) => (
                                        <button
                                            key={tab.name}
                                            onClick={() => setSelectedTab(index)}
                                            className={`group flex items-center space-x-3 px-6 py-4 text-sm font-medium border-b-3 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 ${selectedTab === index
                                                    ? 'border-red-500 text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 shadow-sm'
                                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            <tab.icon className={`w-5 h-5 transition-transform duration-300 ${selectedTab === index ? 'scale-110' : 'group-hover:scale-105'}`} />
                                            <div className="text-left">
                                                <div>{tab.name}</div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">{tab.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8">
                                {/* Situation Overview Tab */}
                                {selectedTab === 0 && (
                                    <div className="space-y-8">
                                        {/* Critical Information Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">HIGH</div>
                                                        <div className="text-sm text-red-500 dark:text-red-400">Risk Level</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-red-700 dark:text-red-300">
                                                    Immediate response required
                                                </div>
                                            </div>
                                            
                                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <UsersIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
                                                        <div className="text-sm text-blue-500 dark:text-blue-400">Teams Deployed</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                                    Active response units
                                                </div>
                                            </div>
                                            
                                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <HeartIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">47</div>
                                                        <div className="text-sm text-green-500 dark:text-green-400">Lives Saved</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-green-700 dark:text-green-300">
                                                    Successful rescues
                                                </div>
                                            </div>
                                        </div>

                                        {/* Visual Evidence */}
                                        {imageUrl && (
                                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                    <EyeIcon className="w-5 h-5 mr-2" />
                                                    Visual Evidence & Assessment
                                                </h3>
                                                {!imageError ? (
                                                    <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 cursor-pointer group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl" onClick={() => setIsImageModalOpen(true)}>
                                                        <img
                                                            src={imageUrl}
                                                            alt="Disaster evidence"
                                                            className="w-full h-auto max-h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                                                            onError={() => setImageError(true)}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                                                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Click to enlarge</span>
                                                                </div>
                                                                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                                                                    <EyeIcon className="w-4 h-4 text-gray-900 dark:text-white" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                                        <div className="text-center text-gray-500 dark:text-gray-400">
                                                            <div className="text-3xl mb-2">📷</div>
                                                            <div>Visual evidence unavailable</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Emergency Survival Guide */}
                                        {disaster.citizen_survival_guide && (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                    <BookOpenIcon className="w-5 h-5 mr-2" />
                                                    Emergency Response Protocol
                                                </h3>
                                                <Disclosure defaultOpen={false}>
                                                    {({ open }) => (
                                                        <>
                                                            <DisclosureButton className="flex w-full justify-between rounded-xl bg-blue-100 dark:bg-blue-800/50 px-6 py-4 text-left font-medium text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 transition-all duration-300">
                                                                <span className="flex items-center">
                                                                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                                                                    View Emergency Response Guidelines
                                                                </span>
                                                                <ChevronDownIcon
                                                                    className={`${open ? 'transform rotate-180' : ''
                                                                        } w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-300`}
                                                                />
                                                            </DisclosureButton>
                                                            <DisclosurePanel className="px-6 pb-4 pt-6">
                                                                <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
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

                                {/* Resource Deployment Tab */}
                                {selectedTab === 1 && (
                                    <div className="space-y-8">
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                <TruckIcon className="w-5 h-5 mr-2" />
                                                Resource & Equipment Deployment
                                            </h3>
                                            <div className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                                                Real-time view of deployed resources and available equipment
                                            </div>
                                        </div>                        <ResourceMap
                            disasterId={disaster.disaster_id}
                            disasterLocation={{ 
                                latitude: disaster.latitude || 0, 
                                longitude: disaster.longitude || 0 
                            }}
                            role="public"
                        />
                                    </div>
                                )}

                                {/* Response Actions Tab */}
                                {selectedTab === 2 && (
                                    <div className="space-y-8">
                                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                                Emergency Response Operations
                                            </h3>
                                            <div className="text-sm text-green-700 dark:text-green-300 mb-4">
                                                Active response tasks and operational coordination
                                            </div>
                                        </div>
                                        <TaskList disasterId={disaster.disaster_id} role="fr" />
                                    </div>
                                )}

                                {/* Communications Tab */}
                                {selectedTab === 3 && (
                                    <div className="space-y-8">
                                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                <RadioIcon className="w-5 h-5 mr-2" />
                                                Emergency Communications Hub
                                            </h3>
                                            <div className="text-sm text-purple-700 dark:text-purple-300 mb-6">
                                                Coordinate with other first responders and emergency services
                                            </div>
                                            <Link
                                                to={`/private/disaster/${disasterId}/communicationhub`}
                                                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                            >
                                                <RadioIcon className="w-5 h-5 mr-2" />
                                                Access Communication Hub
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Emergency Status Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <div className={`px-6 py-4 ${emergencyType.bgColor} border-b ${emergencyType.borderColor}`}>
                                <h3 className={`text-lg font-semibold ${emergencyType.textColor} flex items-center`}>
                                    <div className="text-2xl mr-2">{emergencyType.icon}</div>
                                    Emergency Status
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority Level</span>
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${urgencyLevel.color}`}>
                                        {urgencyLevel.text}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Status</span>
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full ${statusType.color} mr-2 ${statusType.pulse ? 'animate-pulse' : ''}`}></div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{statusType.text}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Emergency ID</span>
                                    <span className="text-sm text-gray-900 dark:text-white font-mono">{disaster.disaster_id}</span>
                                </div>
                                {disaster.submitted_time && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reported</span>
                                        <span className="text-sm text-gray-900 dark:text-white font-medium">{formatTimeAgo(disaster.submitted_time)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-2">
                                    <ShieldCheckIcon className="w-4 h-4 text-white" />
                                </div>
                                First Responder Actions
                            </h3>
                            <div className="space-y-3">
                                <Link
                                    to={`/private/disaster/${disasterId}/communicationhub`}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:border-red-300 dark:hover:border-red-600 group"
                                >
                                    <RadioIcon className="w-4 h-4 mr-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200" />
                                    Communication Hub
                                </Link>
                                <button
                                    onClick={handleShare}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:border-green-300 dark:hover:border-green-600 group"
                                >
                                    <ShareIcon className="w-4 h-4 mr-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200" />
                                    Share Alert
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-600 group"
                                >
                                    <PrinterIcon className="w-4 h-4 mr-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200" />
                                    Print Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <Dialog open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" aria-hidden="true" />
                
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="mx-auto max-w-5xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 scale-95 data-[open]:scale-100">
                        <div className="relative">
                            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                                <span className="text-white text-sm font-medium">Emergency Evidence</span>
                            </div>
                            <button
                                onClick={() => setIsImageModalOpen(false)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-200 transform hover:scale-110"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                            <img
                                src={imageUrl}
                                alt="Disaster evidence"
                                className="w-full h-auto max-h-[85vh] object-contain"
                            />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
};