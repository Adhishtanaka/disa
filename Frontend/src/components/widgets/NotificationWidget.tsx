import { 
  BellIcon, 
  BellAlertIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  FireIcon,
  CloudIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const NotificationWidget = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'emergency',
      title: 'Severe Weather Alert',
      message: 'Hurricane warning issued for coastal regions. Immediate evacuation recommended.',
      time: '2 minutes ago',
      icon: CloudIcon,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
      urgent: true,
      location: 'Miami, FL'
    },
    {
      id: 2,
      type: 'update',
      title: 'Disaster Response Update',
      message: 'Emergency shelters are now open. 15 locations available with capacity for 500 people.',
      time: '15 minutes ago',
      icon: ShieldCheckIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
      urgent: false,
      location: 'Regional'
    },
    {
      id: 3,
      type: 'info',
      title: 'Resource Deployment',
      message: 'Medical teams dispatched to affected areas. 3 rescue helicopters en route.',
      time: '1 hour ago',
      icon: UsersIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      urgent: false,
      location: 'Zone A'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Infrastructure Alert',
      message: 'Power outages reported in 3 districts. Repair crews are working to restore services.',
      time: '2 hours ago',
      icon: BoltIcon,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/20',
      urgent: false,
      location: 'Downtown'
    },
    {
      id: 5,
      type: 'fire',
      title: 'Wildfire Containment',
      message: 'Fire 85% contained. Evacuation orders lifted for eastern neighborhoods.',
      time: '3 hours ago',
      icon: FireIcon,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/20',
      urgent: false,
      location: 'Forest Hills'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const markAsRead = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return n.urgent;
    return n.type === filter;
  });

  const stats = [
    { number: notifications.length, label: 'Active Alerts', icon: BellIcon, color: 'text-blue-400' },
    { number: notifications.filter(n => n.urgent).length, label: 'Urgent', icon: ExclamationTriangleIcon, color: 'text-red-400' },
    { number: notifications.filter(n => n.type === 'emergency').length, label: 'Emergency', icon: BellAlertIcon, color: 'text-orange-400' },
    { number: '24/7', label: 'Monitoring', icon: ClockIcon, color: 'text-green-400' }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Notifications', count: notifications.length },
    { id: 'urgent', label: 'Urgent Only', count: notifications.filter(n => n.urgent).length },
    { id: 'emergency', label: 'Emergency', count: notifications.filter(n => n.type === 'emergency').length },
    { id: 'update', label: 'Updates', count: notifications.filter(n => n.type === 'update').length },
    { id: 'info', label: 'Information', count: notifications.filter(n => n.type === 'info').length }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-500/30 backdrop-blur-sm">
                🔔 Real-time Notifications
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight transition-colors duration-300">
              Notification Center
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                & Alert Management
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
              Stay informed with real-time emergency alerts, disaster updates, and critical information from official sources
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg hover:scale-105">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Controls */}
          <div className="bg-white dark:bg-gray-900 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 transition-all duration-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  Active Notifications
                </h2>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Filter and manage your emergency alerts and updates
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFilter(option.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      filter === option.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
                
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
                <BellIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No notifications</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {filter === 'all' ? 'You\'re all caught up! No new notifications at this time.' : `No ${filter} notifications found.`}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div key={notification.id} className={`group relative bg-white dark:bg-gray-900 backdrop-blur-sm border ${notification.borderColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${notification.urgent ? 'ring-2 ring-red-400/20 animate-pulse' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full ${notification.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <notification.icon className={`h-6 w-6 ${notification.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                              {notification.title}
                            </h3>
                            {notification.urgent && (
                              <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium border border-red-300 dark:border-red-700">
                                URGENT
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-4 w-4" />
                              {notification.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4" />
                              {notification.location}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="flex-shrink-0 p-2 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                          title="Mark as read"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Settings Section */}
          <div className="mt-12 bg-white dark:bg-gray-900 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-8 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Cog6ToothIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  Notification Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Customize your alert preferences and notification channels
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">Emergency Alerts</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Critical emergency notifications</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">Weather Updates</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Severe weather warnings</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">Resource Updates</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Emergency resource availability</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotificationWidget;
