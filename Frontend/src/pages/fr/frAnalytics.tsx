import { useState, useEffect } from 'react';
import { 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  TruckIcon,
  HeartIcon,
  ShieldCheckIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { appwriteService } from '../../services/appwrite';
import type { Disaster } from '../../types/disaster';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

export const FirstResponderAnalytics = () => {
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


  // Analytics Data Generation
  const responseTimeData = [
    { time: '00:00', avgResponse: 8, targetResponse: 10 },
    { time: '04:00', avgResponse: 6, targetResponse: 10 },
    { time: '08:00', avgResponse: 12, targetResponse: 10 },
    { time: '12:00', avgResponse: 15, targetResponse: 10 },
    { time: '16:00', avgResponse: 18, targetResponse: 10 },
    { time: '20:00', avgResponse: 14, targetResponse: 10 },
  ];

  const emergencyTypeData = disasters.reduce((acc, disaster) => {
    const type = disaster.emergency_type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(emergencyTypeData).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
    color: type === 'fire' ? '#ef4444' : type === 'flood' ? '#3b82f6' : type === 'earthquake' ? '#f59e0b' : '#8b5cf6'
  }));

  const urgencyDistribution = disasters.reduce((acc, disaster) => {
    const urgency = disaster.urgency_level || 'unknown';
    acc[urgency] = (acc[urgency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const urgencyBarData = Object.entries(urgencyDistribution).map(([urgency, count]) => ({
    urgency: urgency.toUpperCase(),
    count,
    color: urgency === 'high' ? '#ef4444' : urgency === 'medium' ? '#f59e0b' : '#10b981'
  }));

  const weeklyResponseData = [
    { day: 'Mon', responses: 23, rescued: 18, deployed: 12 },
    { day: 'Tue', responses: 31, rescued: 25, deployed: 16 },
    { day: 'Wed', responses: 18, rescued: 14, deployed: 8 },
    { day: 'Thu', responses: 27, rescued: 22, deployed: 14 },
    { day: 'Fri', responses: 35, rescued: 28, deployed: 18 },
    { day: 'Sat', responses: 42, rescued: 34, deployed: 22 },
    { day: 'Sun', responses: 28, rescued: 23, deployed: 15 },
  ];

  const resourceDeploymentData = [
    { resource: 'Ambulances', deployed: 24, available: 8, total: 32 },
    { resource: 'Fire Trucks', deployed: 18, available: 6, total: 24 },
    { resource: 'Rescue Teams', deployed: 35, available: 12, total: 47 },
    { resource: 'Medical Staff', deployed: 67, available: 23, total: 90 },
  ];

  const monthlyTrendData = [
    { month: 'Jan', responses: 145, efficiency: 85, satisfaction: 92 },
    { month: 'Feb', responses: 128, efficiency: 88, satisfaction: 89 },
    { month: 'Mar', responses: 167, efficiency: 82, satisfaction: 94 },
    { month: 'Apr', responses: 189, efficiency: 90, satisfaction: 91 },
    { month: 'May', responses: 203, efficiency: 87, satisfaction: 93 },
    { month: 'Jun', responses: 176, efficiency: 91, satisfaction: 95 },
  ];

  const incidentTypeAnalysis = [
    { type: 'Fire', count: 45, avgResponseTime: 7.2, severity: 'high' },
    { type: 'Medical', count: 78, avgResponseTime: 5.8, severity: 'medium' },
    { type: 'Accident', count: 34, avgResponseTime: 9.1, severity: 'high' },
    { type: 'Rescue', count: 23, avgResponseTime: 12.5, severity: 'high' },
    { type: 'Natural', count: 12, avgResponseTime: 15.3, severity: 'critical' },
  ];

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
                📊 Emergency Response Analytics
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Response Analytics
              <span className="block bg-gradient-to-r from-red-500 to-red-700 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              Comprehensive data insights and performance metrics for emergency response operations. 
              Monitor efficiency, track resources, and analyze response patterns in real-time
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={fetchDisasters}
                disabled={loading}
                className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <ArrowPathIcon className={`w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
                Refresh Analytics
              </button>
              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Analytics Content */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Error Message */}
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

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {/* Response Time Metrics */}
            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100/50 dark:bg-blue-500/20">
                  <ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">8.5</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Minutes</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Avg Response Time</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Target: 10 min</div>
              <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>

            {/* Teams Deployed */}
            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100/50 dark:bg-purple-500/20">
                  <UserGroupIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">47</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Active</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Response Teams</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">12 available</div>
              <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '80%'}}></div>
              </div>
            </div>

            {/* Lives Saved */}
            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100/50 dark:bg-green-500/20">
                  <HeartIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">234</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">This Week</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Lives Saved</div>
              <div className="text-xs text-green-500 dark:text-green-400">+12% from last week</div>
              <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
            </div>

            {/* Resource Utilization */}
            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100/50 dark:bg-orange-500/20">
                  <TruckIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">78%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Deployed</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Resource Usage</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Optimal range</div>
              <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>
          </div>

          {/* Advanced Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Response Time Analytics */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Response Time Analysis
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">24-hour response performance</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Area type="monotone" dataKey="avgResponse" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="targetResponse" stroke="#EF4444" fill="transparent" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Emergency Type Distribution */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
                    Emergency Distribution
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Types of emergencies handled</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Urgency Level Analytics */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                    Urgency Analysis
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Priority distribution of cases</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={urgencyBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="urgency" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Response Trends */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <CalendarDaysIcon className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Weekly Performance
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Response trends over the week</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyResponseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="responses" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} />
                    <Line type="monotone" dataKey="rescued" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                    <Line type="monotone" dataKey="deployed" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Monthly Trends Analysis */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 mb-12 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <ChartBarIcon className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400" />
                  Monthly Performance Trends
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Long-term analysis of response efficiency and satisfaction</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="responses" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="efficiency" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="satisfaction" stackId="3" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resource Deployment Analytics */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 mb-12 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <TruckIcon className="w-6 h-6 mr-3 text-orange-600 dark:text-orange-400" />
                  Resource Deployment Status
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Real-time allocation of emergency resources</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Deployed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resourceDeploymentData.map((resource, index) => (
                <div key={index} className="bg-white/30 dark:bg-gray-800/30 rounded-xl p-6 border border-gray-200/30 dark:border-gray-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{resource.resource}</h4>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{resource.total}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Deployed</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">{resource.deployed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">{resource.available}</span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-red-500 h-3 rounded-full transition-all duration-500" 
                        style={{width: `${(resource.deployed / resource.total) * 100}%`}}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {Math.round((resource.deployed / resource.total) * 100)}% utilization
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Type Analysis */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <DocumentTextIcon className="w-6 h-6 mr-3 text-emerald-600 dark:text-emerald-400" />
                  Incident Type Performance Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Detailed breakdown of response efficiency by incident type</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Incident Type</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">Count</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">Avg Response Time</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">Severity</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentTypeAnalysis.map((incident, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">{incident.type}</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                          {incident.count}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-gray-900 dark:text-white font-medium">{incident.avgResponseTime} min</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          incident.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                          incident.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        }`}>
                          {incident.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              incident.avgResponseTime < 8 ? 'bg-green-500' :
                              incident.avgResponseTime < 12 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{width: `${Math.max(20, 100 - (incident.avgResponseTime * 5))}%`}}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
