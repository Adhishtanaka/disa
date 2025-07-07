import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  MapIcon,
  TruckIcon,
  DocumentTextIcon
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

  // Resource deployment data for analytics
  const resourceDeploymentData = [
    { resource: 'Emergency Vehicles', deployed: 28, available: 12, total: 40 },
    { resource: 'Medical Units', deployed: 22, available: 8, total: 30 },
    { resource: 'Rescue Teams', deployed: 45, available: 15, total: 60 },
    { resource: 'Support Staff', deployed: 89, available: 31, total: 120 },
  ];

  // Incident type analysis data
  const incidentTypeAnalysis = [
    { type: 'Fire', count: 52, avgResponseTime: 6.8, severity: 'high' },
    { type: 'Medical', count: 89, avgResponseTime: 5.2, severity: 'medium' },
    { type: 'Accident', count: 41, avgResponseTime: 8.7, severity: 'high' },
    { type: 'Rescue', count: 28, avgResponseTime: 11.9, severity: 'high' },
    { type: 'Natural', count: 15, avgResponseTime: 14.8, severity: 'critical' },
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
      {/* Hero Section with Advanced UX */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/3 left-10 w-2 h-2 bg-green-400/30 rounded-full animate-ping"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-500/30 transition-colors duration-300">
                📊 Government Analytics
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Strategic Analytics
              <span className="block bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              Comprehensive data insights and performance metrics for strategic emergency response 
              operations. Monitor efficiency, track resources, and analyze response patterns
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <ChartBarIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Refresh Analytics
              </button>
              <Link
                to="/gov"
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              >
                Back to Dashboard
              </Link>
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

          {/* Enhanced Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100/50 dark:bg-blue-500/20">
                  <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Completion</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Task Efficiency</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Operational Performance</div>
              <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%`}}></div>
              </div>
            </div>
            
            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100/50 dark:bg-red-500/20">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {disasters.filter((d: any) => d.urgency_level === 'high').length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Active</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">High Priority</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Critical Situations</div>
              <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
            
            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100/50 dark:bg-green-500/20">
                  <MapIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {Math.round((totalResources / Math.max(disasters.length, 1)) * 10) / 10}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Per Disaster</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Resource Ratio</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Allocation Efficiency</div>
              <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '88%'}}></div>
              </div>
            </div>
            
            <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100/50 dark:bg-purple-500/20">
                  <UserGroupIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {disasters.filter((d: any) => d.status === 'active').length + disasters.filter((d: any) => d.status === 'pending').length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Active</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Operations</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Currently Active</div>
              <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '68%'}}></div>
              </div>
            </div>
          </div>

          {/* Enhanced Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Disaster Types - Pie Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Disaster Types
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Breakdown by emergency type</p>
                </div>
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

            {/* Urgency Levels - Radial Bar Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
                    Urgency Levels
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Priority distribution</p>
                </div>
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
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Task Status Distribution - Bar Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <UserGroupIcon className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    Task Status Overview
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current task distribution</p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
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
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <MapIcon className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Resource Allocation
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available resources by type</p>
                </div>
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
          </div>

          {/* Enhanced Time Series Analytics */}
          <div className="grid grid-cols-1 gap-8 mb-12">
            
            {/* Trend Analysis - Area Chart */}
            <div className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <ClockIcon className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
                    6-Month Trend Analysis
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Historical data trends for disasters, tasks, and resources</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Disasters</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tasks</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Resources</span>
                  </div>
                </div>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
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
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <ChartBarIcon className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
                    Performance Metrics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Monthly performance indicators and response efficiency</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Disasters</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Deployed Resources</span>
                  </div>
                </div>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
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

          {/* Resource Deployment Analytics */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 mb-12 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <TruckIcon className="w-6 h-6 mr-3 text-orange-600 dark:text-orange-400" />
                  Resource Deployment Status
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Real-time allocation of government emergency resources</p>
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
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-8 mb-12 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
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

export default GovAnalytics;
