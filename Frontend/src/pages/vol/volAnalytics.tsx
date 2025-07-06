import { useState, useEffect } from 'react';
import { 
  ArrowPathIcon, 
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  CheckCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { appwriteService } from '../../services/appwrite';
import type { Disaster } from '../../types/disaster';
import type { TaskDocument } from '../../services/appwrite';

export const VolAnalytics = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [tasks, setTasks] = useState<TaskDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all disasters, then all tasks for volunteer stats
  const fetchStats = async (disasterList: Disaster[]) => {
    try {
      const allTasks: TaskDocument[] = [];
      await Promise.all(
        disasterList.map(async (dis) => {
          try {
            const t = await appwriteService.getTasksByDisasterId(dis.$id);
            allTasks.push(...t);
          } catch (err) {
            console.error(`Error fetching tasks for disaster ${dis.$id}:`, err);
          }
        })
      );
      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchDisasters = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appwriteService.getAllDisasters();
      setDisasters(data as unknown as Disaster[]);
      await fetchStats(data as unknown as Disaster[]);
    } catch (err) {
      setError('Failed to load volunteer analytics. Please try again.');
      console.error('Error fetching disasters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasters();
  }, []);

  // Filter active disasters
  const filteredDisasters = disasters.filter(disaster => 
    disaster.status === 'active'
  );

  // Analytics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const activeVolunteers = Math.floor(Math.random() * 250) + 150; // Simulated data
  const totalHours = Math.floor(Math.random() * 10000) + 5000; // Simulated data
  const peopleHelped = Math.floor(Math.random() * 50000) + 25000; // Simulated data

  // Chart data
  const missionChartData = [
    { name: 'Flood', value: disasters.filter(d => d.emergency_type === 'flood').length, color: '#3b82f6' },
    { name: 'Fire', value: disasters.filter(d => d.emergency_type === 'fire').length, color: '#ef4444' },
    { name: 'Earthquake', value: disasters.filter(d => d.emergency_type === 'earthquake').length, color: '#f59e0b' },
    { name: 'Storm', value: disasters.filter(d => d.emergency_type === 'storm').length, color: '#10b981' },
    { name: 'Other', value: disasters.filter(d => !['flood', 'fire', 'earthquake', 'storm'].includes(d.emergency_type)).length, color: '#8b5cf6' }
  ].filter(item => item.value > 0);

  const volunteerTaskData = [
    { name: 'Search & Rescue', value: Math.floor(totalTasks * 0.3), color: '#ef4444' },
    { name: 'Medical Aid', value: Math.floor(totalTasks * 0.25), color: '#10b981' },
    { name: 'Supply Distribution', value: Math.floor(totalTasks * 0.2), color: '#3b82f6' },
    { name: 'Communication', value: Math.floor(totalTasks * 0.15), color: '#f59e0b' },
    { name: 'Logistics', value: Math.floor(totalTasks * 0.1), color: '#8b5cf6' }
  ];

  const volunteerActivityData = [
    { month: 'Jun', missions: 45, volunteers: 120, hours: 890 },
    { month: 'Jul', missions: 52, volunteers: 135, hours: 1020 },
    { month: 'Aug', missions: 38, volunteers: 108, hours: 760 },
    { month: 'Sep', missions: 61, volunteers: 142, hours: 1180 },
    { month: 'Oct', missions: 49, volunteers: 128, hours: 945 },
    { month: 'Nov', missions: 55, volunteers: 155, hours: 1150 }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-green-400/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-400/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/3 left-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-ping"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-green-500/20 text-green-600 dark:text-green-300 rounded-full text-sm font-medium border border-green-500/30 transition-colors duration-300">
                📊 Volunteer Analytics Hub
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Impact Analytics
              <span className="block bg-gradient-to-r from-green-500 to-green-700 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                & Performance Metrics
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              Track your volunteer contributions, measure community impact, and analyze response effectiveness across all disaster relief operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={fetchDisasters}
                disabled={loading}
                className="group bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <ArrowPathIcon className={`w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
                Refresh Analytics
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Volunteer Analytics Dashboard */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Message */}
          {error && (
            <div className="group relative bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/50 rounded-xl p-6 mb-8 shadow-sm hover:bg-red-50/70 dark:hover:bg-red-900/30 transition-all duration-300">
              <div className="flex items-start">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-1">Connection Error</h3>
                  <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-green-300/50 dark:hover:border-green-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100/50 dark:bg-green-500/20 group-hover:scale-110 transition-transform duration-300">
                  <DocumentTextIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{filteredDisasters.length}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Active Missions</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Available opportunities
              </div>
            </div>

            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-blue-300/50 dark:hover:border-blue-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100/50 dark:bg-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <UserGroupIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{activeVolunteers}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Active Volunteers</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Community members helping
              </div>
            </div>
            
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-purple-300/50 dark:hover:border-purple-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100/50 dark:bg-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{totalHours.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Hours Contributed</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Total volunteer time
              </div>
            </div>

            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-yellow-300/50 dark:hover:border-yellow-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100/50 dark:bg-yellow-500/20 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{completedTasks}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Tasks Completed</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Missions accomplished
              </div>
            </div>

            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-red-300/50 dark:hover:border-red-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100/50 dark:bg-red-500/20 group-hover:scale-110 transition-transform duration-300">
                  <HeartIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">{peopleHelped.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">People Helped</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Lives positively impacted
              </div>
            </div>

            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-indigo-300/50 dark:hover:border-indigo-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100/50 dark:bg-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  <MapPinIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">{disasters.length}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Areas Served</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Disaster zones covered
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Mission Types Distribution - Pie Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mission Types</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Volunteer opportunities by disaster type</p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={missionChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {missionChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Task Overview - Bar Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Task Overview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Distribution of volunteer tasks by category</p>
                </div>
                <DocumentTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volunteerTaskData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {volunteerTaskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Volunteer Activity Trend - Area Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Activity Trends</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">6-month volunteer engagement patterns</p>
                </div>
                <ClockIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volunteerActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="missions"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Missions"
                    />
                    <Area
                      type="monotone"
                      dataKey="volunteers"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Volunteers"
                    />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                      name="Hours"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 text-center hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Mission Success Rate</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Community Impact</div>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 text-center hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {Math.round(totalHours / Math.max(activeVolunteers, 1))}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Avg Hours per Volunteer</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Individual Contribution</div>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 text-center hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {disasters.filter(d => d.urgency_level === 'high').length}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">High Priority</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Urgent Missions</div>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 text-center hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                {Math.round(peopleHelped / Math.max(activeVolunteers, 1))}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">People Helped per Volunteer</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Personal Impact</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
