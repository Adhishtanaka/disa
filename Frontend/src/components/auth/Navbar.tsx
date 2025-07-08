import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { authService } from '../../services/auth';
import { useTheme } from '../../contexts/ThemeContext';

const roleDashboardPath: Record<string, string> = {
  user: '/user',
  volunteer: '/vol',
  first_responder: '/fr',
  government: '/gov',
};

const getAvatarUrl = (name?: string) => {
  const initials = encodeURIComponent((name || 'U').split(' ').map(n => n[0]).join('').toUpperCase());
  return `https://ui-avatars.com/api/?name=${initials}&background=ffffff&color=111827&size=64&font-size=0.5`;
};

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [role, setRole] = useState(authService.getUserRole());
  const [userName, setUserName] = useState(authService.getUserName());
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(authService.isAuthenticated());
      setRole(authService.getUserRole());
      setUserName(authService.getUserName());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [isAuthenticated, role]);

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-3 items-center gap-4">
          {/* Left Side Navigation */}
          <div className="hidden md:flex items-center space-x-8 justify-start">
            {!isAuthenticated ? (
              <Link 
                to="/public" 
                className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 relative group py-1"
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span className="text-xs font-medium">Home</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ) : (
              <>   
                {role && (
                  <Link
                    to={roleDashboardPath[role] || '/public'}
                    className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-200 relative group py-1"
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    <span className="text-xs font-medium">Dashboard</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                {/* Role-specific navigation items */}
                {role === 'user' && (
                  <>
                    <div className="relative group">
                      <button className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-200 relative group py-1">
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                        <span className="text-xs font-medium">Emergency</span>
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div className="py-2">
                          <Link 
                            to="/user" 
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Report Emergency
                          </Link>
                          <Link 
                            to="/user" 
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Nearby Disasters
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Link 
                      to="/user/disaster/1" 
                      className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-200 relative group py-1"
                    >
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span className="text-xs font-medium">Disaster Details</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    
                  </>
                )}
                {role === 'volunteer' && (
                  <>
                    <Link 
                      to="/vol/disaster/1" 
                      className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-200 relative group py-1"
                    >
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span className="text-xs font-medium">Disaster Details</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link 
                      to="/vol/analytics" 
                      className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-200 relative group py-1"
                    >
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                      <span className="text-xs font-medium">Analytics</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}
                {role === 'first_responder' && (
                  <>
                    <Link 
                      to="/fr/disaster/1" 
                      className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-200 relative group py-1"
                    >
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span className="text-xs font-medium">Disaster Details</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link 
                      to="/fr/analytics" 
                      className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-200 relative group py-1"
                    >
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                      <span className="text-xs font-medium">Analytics</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}
                {role === 'government' && (
                  <>
                    <div className="relative group">
                      <button className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-200 relative group py-1">
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        <span className="text-xs font-medium">Management</span>
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div className="py-2">
                          <Link 
                            to="/gov/disaster/1" 
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Disaster Details
                          </Link>
                          <Link 
                            to="/gov" 
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            AI Metrics
                          </Link>
                          <Link 
                            to="/gov/analytics" 
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                            Analytics
                          </Link>
                          <Link 
                            to="/gov" 
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                            Add Resources
                          </Link>
                          <Link 
                            to="/gov" 
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Reports
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Link 
                      to="/gov/analytics" 
                      className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-200 relative group py-1"
                    >
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                      <span className="text-xs font-medium">Analytics</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}
                {/* Shared navigation for all authenticated users */}
                {isAuthenticated && (
                  <Link 
                    to="/private/disaster/1/communicationhub" 
                    className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-200 relative group py-1"
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <span className="text-xs font-medium">Communication</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Center Logo */}
          <div className="flex items-center justify-center">
            <Link 
              to="/public" 
              className="flex items-center gap-3 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            >
                <div className="w-10 h-10 flex items-center justify-center rounded-full shadow-lg overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Baminithiya Logo" 
                  className="w-10 h-10 object-cover rounded-full"
                />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs tracking-wide hidden lg:block">Disaster Management System</p>
                  <span className="text-2xl lg:text-3xl font-semibold text-left">Baminithiya</span>
                </div>
            </Link>
          </div>

          {/* Right Side Navigation */}
          <div className="hidden md:flex items-center space-x-4 justify-end">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => {
                    console.log('Theme toggle clicked! Current theme:', isDarkMode ? 'dark' : 'light');
                    toggleTheme();
                  }}
                  className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 relative group py-1" 
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? (
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                    </svg>
                  )}
                  <span className="text-xs font-medium">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <Link 
                  to="/auth/signin" 
                  className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 relative group py-1"
                >
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                  </svg>
                  <span className="text-xs font-medium">Sign In</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/auth/signup" 
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {role === 'user' && (
                  <Link 
                    to="/user" 
                    className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 relative group py-1"
                    title="Emergency Services"
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                    <span className="text-xs font-medium">Emergency</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                <Link 
                  to="/widgets/notifications"
                  className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 relative group py-1" 
                  title="Notifications"
                >
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 12a1 1 0 100-2 1 1 0 000 2z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="text-xs font-medium">Notifications</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/widgets/settings"
                  className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 relative group py-1" 
                  title="Settings"
                >
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span className="text-xs font-medium">Settings</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <button 
                  onClick={toggleTheme}
                  className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 relative group py-1" 
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? (
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                    </svg>
                  )}
                  <span className="text-xs font-medium">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <Link 
                  to="/private/user-profile" 
                  className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-200 relative group py-1"
                >
                  <div className="relative mb-1">
                    <img
                      src={getAvatarUrl(userName || 'U')}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-gray-600 group-hover:border-blue-500 transition-colors duration-200 shadow-lg"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <span className="text-xs font-medium truncate max-w-16">{userName || 'User'}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex justify-end">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg p-2 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
            {!isAuthenticated ? (
              <div className="py-2">
                <Link 
                  to="/public" 
                  className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                >
                  Home
                </Link>
                <button 
                  onClick={() => {
                    console.log('Theme toggle clicked in mobile menu! Current theme:', isDarkMode ? 'dark' : 'light');
                    toggleTheme();
                    setMenuOpen(false); // Close menu after toggle
                  }}
                  className="w-full flex items-center px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                    </svg>
                  )}
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
                <Link 
                  to="/auth/signin" 
                  className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <div className="px-6 py-3">
                  <Link 
                    to="/auth/signup" 
                    className="block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 text-center shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <Link 
                  to="/public" 
                  className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                >
                  Home
                </Link>
                {role && (
                  <Link
                    to={roleDashboardPath[role] || '/public'}
                    className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                )}
                {/* Role-specific mobile navigation */}
                {role === 'user' && (
                  <>
                    <div className="px-6 py-2">
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Emergency Services</div>
                      <Link 
                        to="/user" 
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center rounded-lg"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Report Emergency
                      </Link>
                      <Link 
                        to="/user" 
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center rounded-lg"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Nearby Disasters
                      </Link>
                    </div>
                    <Link 
                      to="/user/disaster/1" 
                      className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                    >
                      Disaster Details
                    </Link>
                    <Link 
                      to="/private/user-profile" 
                      className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                    >
                      My Profile
                    </Link>
                  </>
                )}
                {role === 'volunteer' && (
                  <>
                    <Link 
                      to="/vol/disaster/1" 
                      className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                    >
                      Disaster Details
                    </Link>
                    <Link 
                      to="/vol/analytics" 
                      className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                    >
                      Analytics
                    </Link>
                  </>
                )}
                {role === 'first_responder' && (
                  <>
                    <Link 
                      to="/fr/disaster/1" 
                      className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                    >
                      Disaster Details
                    </Link>
                    <Link 
                      to="/fr/analytics" 
                      className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                    >
                      Analytics
                    </Link>
                  </>
                )}
                {role === 'government' && (
                  <>
                    <div className="px-6 py-2">
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Management</div>
                      <Link 
                        to="/gov/disaster/1" 
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center rounded-lg"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Disaster Details
                      </Link>
                      <Link 
                        to="/gov" 
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center rounded-lg"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        AI Metrics
                      </Link>
                      <Link 
                        to="/gov" 
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center rounded-lg"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        Add Resources
                      </Link>
                      <Link 
                        to="/gov" 
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center rounded-lg"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Reports
                      </Link>
                    </div>
                    <Link 
                      to="/gov/analytics" 
                      className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                    >
                      Analytics
                    </Link>
                  </>
                )}
                {/* Shared navigation for all authenticated users */}
                {isAuthenticated && (
                  <Link 
                    to="/private/disaster/1/communicationhub" 
                    className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                  >
                    Communication Hub
                  </Link>
                )}
                <Link 
                  to="/private/user-profile" 
                  className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="relative">
                    <img
                      src={getAvatarUrl(userName || 'U')}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-gray-600 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  </div>
                  <span className="font-medium">{userName || 'User'}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;