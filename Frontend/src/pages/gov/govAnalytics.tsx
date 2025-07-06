import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { appwriteService } from '../../services/appwrite';

// Chart color schemes
const COLORS = {
  blue: ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a'],
  red: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b'],
  green: ['#10b981', '#059669', '#047857', '#065f46'],
  purple: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'],
  orange: ['#f59e0b', '#d97706', '#b45309', '#92400e'],
  mixed: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16']
};

const GovAnalytics: React.FC = () => {
  const [disasters, setDisasters] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const disastersData = await appwriteService.getAllDisasters();
        setDisasters(disastersData || []);
        
        // Fetch tasks and resources for all disasters
        const allTasks: any[] = [];
        const allResources: any[] = [];
        
        if (disastersData && disastersData.length > 0) {
          await Promise.all(
            disastersData.map(async (disaster: any) => {
              try {
                const t = await appwriteService.getTasksByDisasterId(disaster.$id);
                allTasks.push(...t);
              } catch { /* ignore */ }
              try {
                const r = await appwriteService.getResourcesByDisasterId(disaster.$id);
                allResources.push(...r);
              } catch { /* ignore */ }
            })
          );
        }
        
        setTasks(allTasks);
        setResources(allResources);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate analytics data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalResources = resources.length;

  // Disaster Types Data
  const disasterTypeData = disasters.reduce((acc: any[], disaster) => {
    const type = disaster.emergency_type || 'Unknown';
    const existing = acc.find(item => item.name === type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, []);

  // Urgency Data
  const urgencyData = disasters.reduce((acc: any[], disaster) => {
    const urgency = disaster.urgency_level || 'Unknown';
    const existing = acc.find(item => item.name === urgency);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ 
        name: urgency, 
        value: 1,
        fill: urgency === 'high' ? '#ef4444' : urgency === 'medium' ? '#f59e0b' : '#10b981'
      });
    }
    return acc;
  }, []);

  // Task Status Data
  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#f59e0b' },
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#ef4444' },
    { name: 'Assigned', value: tasks.filter(t => t.status === 'assigned').length, color: '#3b82f6' }
  ];

  // Resource Data
  const resourceData = resources.reduce((acc: any[], resource) => {
    const type = resource.type || 'Unknown';
    const existing = acc.find(item => item.name === type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, []);

  // Time Series Data (sample data)
  const timeSeriesData = [
    { month: 'Jul', disasters: 12, tasks: 45, resources: 28 },
    { month: 'Aug', disasters: 15, tasks: 52, resources: 35 },
    { month: 'Sep', disasters: 8, tasks: 38, resources: 42 },
    { month: 'Oct', disasters: 20, tasks: 67, resources: 48 },
    { month: 'Nov', disasters: 18, tasks: 58, resources: 55 },
    { month: 'Dec', disasters: 25, tasks: 78, resources: 62 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300/50 dark:bg-gray-600/50 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300/50 dark:bg-gray-600/50 rounded-lg"></div>
              <div className="h-96 bg-gray-300/50 dark:bg-gray-600/50 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 dark:bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl animate-float-reverse"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
            <Link to="/gov" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Government Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Analytics</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100/50 dark:bg-blue-500/20 mb-6">
                <ChartBarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Analytics Dashboard
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                Advanced data visualization and statistical insights for strategic decision making
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Error Message */}
          {error && (
            <div className="mb-8 group relative bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/50 rounded-xl p-6 shadow-sm hover:bg-red-50/70 dark:hover:bg-red-900/30 transition-all duration-300">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 mr-4">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-1">Data Loading Error</h3>
                  <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 text-center hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Task Completion Rate</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Operational Efficiency</div>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 text-center hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                {disasters.filter((d: any) => d.urgency_level === 'high').length}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">High Priority</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Critical Situations</div>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 text-center hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {Math.round((totalResources / Math.max(disasters.length, 1)) * 10) / 10}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Resources per Disaster</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Resource Allocation</div>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 text-center hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {disasters.filter((d: any) => d.status === 'active').length + disasters.filter((d: any) => d.status === 'pending').length}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Active Operations</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Current Workload</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Disaster Types Distribution - Pie Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Disaster Types Distribution</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Breakdown by emergency type</p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={disasterTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {disasterTypeData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.mixed[index % COLORS.mixed.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Urgency Levels - Radial Bar Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Urgency Levels</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Priority distribution</p>
                </div>
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={urgencyData}>
                    <RadialBar
                      label={{ position: 'insideStart', fill: '#fff' }}
                      background
                      dataKey="value"
                      fill="#8884d8"
                    />
                    <Tooltip />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Task Status Distribution - Bar Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Task Status Overview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current task distribution</p>
                </div>
                <UserGroupIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resources Distribution - Pie Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Resource Allocation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available resources by type</p>
                </div>
                <MapIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resourceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {resourceData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.purple[index % COLORS.purple.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Time Series Analytics */}
          <div className="grid grid-cols-1 gap-8 mb-12">
            
            {/* Trend Analysis - Area Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">6-Month Trend Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Historical data trends for disasters, tasks, and resources</p>
                </div>
                <ClockIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="disasters"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Disasters"
                    />
                    <Area
                      type="monotone"
                      dataKey="tasks"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Tasks"
                    />
                    <Area
                      type="monotone"
                      dataKey="resources"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Resources"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Metrics - Line Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Performance Metrics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly performance indicators and response efficiency</p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="disasters"
                      stroke="#ef4444"
                      strokeWidth={3}
                      name="Active Disasters"
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tasks"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Completed Tasks"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="resources"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Deployed Resources"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default GovAnalytics;
