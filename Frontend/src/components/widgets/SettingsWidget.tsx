import { 
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  MapPinIcon,
  UserCircleIcon,
  KeyIcon,
  PaintBrushIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const SettingsWidget = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    emergency: true,
    weather: true,
    updates: false,
    marketing: false
  });
  const [privacy, setPrivacy] = useState({
    locationSharing: true,
    dataCollection: false,
    analytics: true
  });

  const stats = [
    { number: '5', label: 'Active Settings', icon: Cog6ToothIcon, color: 'text-blue-400' },
    { number: '24/7', label: 'Protection', icon: ShieldCheckIcon, color: 'text-green-400' },
    { number: 'Secure', label: 'Data Handling', icon: KeyIcon, color: 'text-purple-400' },
    { number: 'Real-time', label: 'Updates', icon: ClockIcon, color: 'text-orange-400' }
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
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-500/30 backdrop-blur-sm">
                ⚙️ System Configuration
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight transition-colors duration-300">
              Settings & Preferences
              <span className="block bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                Control Center
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
              Customize your disaster management experience with personalized settings for notifications, privacy, and system preferences
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
          
          {/* Settings Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Notification Preferences */}
            <div className="bg-white dark:bg-gray-900 backdrop-blur-sm border border-blue-400/20 rounded-xl p-8 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <BellIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    Notification Preferences
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                    Customize how you receive alerts and updates
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Emergency Alerts</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Critical emergency notifications</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.emergency}
                    onChange={(e) => setNotifications({...notifications, emergency: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Weather Updates</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Severe weather warnings and forecasts</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.weather}
                    onChange={(e) => setNotifications({...notifications, weather: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">System Updates</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Non-critical system information</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.updates}
                    onChange={(e) => setNotifications({...notifications, updates: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white dark:bg-gray-900 backdrop-blur-sm border border-green-400/20 rounded-xl p-8 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    Privacy & Security
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                    Control your data and security settings
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Location Sharing</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Share location for emergency services</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={privacy.locationSharing}
                    onChange={(e) => setPrivacy({...privacy, locationSharing: e.target.checked})}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Data Collection</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Allow anonymous usage data collection</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={privacy.dataCollection}
                    onChange={(e) => setPrivacy({...privacy, dataCollection: e.target.checked})}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Analytics</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Help improve our services</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={privacy.analytics}
                    onChange={(e) => setPrivacy({...privacy, analytics: e.target.checked})}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Appearance & Display */}
            <div className="bg-white dark:bg-gray-900 backdrop-blur-sm border border-purple-400/20 rounded-xl p-8 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <PaintBrushIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    Appearance & Display
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                    Customize the look and feel of your interface
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark themes</div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Language</div>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>English (US)</option>
                    <option>Spanish (ES)</option>
                    <option>French (FR)</option>
                    <option>German (DE)</option>
                  </select>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Time Zone</div>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC-6 (Central Time)</option>
                    <option>UTC-7 (Mountain Time)</option>
                    <option>UTC-8 (Pacific Time)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Services */}
            <div className="bg-white dark:bg-gray-900 backdrop-blur-sm border border-orange-400/20 rounded-xl p-8 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <MapPinIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    Location Services
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                    Manage location-based features and alerts
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Emergency Location</div>
                  <input 
                    type="text" 
                    placeholder="Enter your address"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Alert Radius</div>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>5 miles</option>
                    <option>10 miles</option>
                    <option>25 miles</option>
                    <option>50 miles</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Auto-detect Location</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Use GPS for precise location</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-orange-600 focus:ring-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Account Management Section */}
          <div className="mt-8 bg-white dark:bg-gray-900 backdrop-blur-sm border border-gray-400/20 rounded-xl p-8 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700">
                <UserCircleIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  Account Management
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                  Update your profile and account information
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Enter your phone number"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emergency Contact</label>
                <input 
                  type="tel" 
                  placeholder="Emergency contact number"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Save Changes
              </button>
              <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-all duration-200">
                Cancel
              </button>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="mt-8 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-xl p-8 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100 transition-colors duration-300">
                  Emergency Contacts
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm transition-colors duration-300">
                  Quick access to emergency services and important contacts
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">911</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Emergency Services</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">311</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Non-Emergency</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">211</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Community Services</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsWidget;
