import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { authService } from '../../services/auth';

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
    <nav className="w-full bg-gray-900 border-b border-gray-800 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1">
            {!isAuthenticated ? (
              <Link 
                to="/public" 
                className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ) : (
              <>
                <Link 
                  to="/public" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                {role && (
                  <Link
                    to={roleDashboardPath[role] || '/public'}
                    className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                {/* Role-specific navigation items */}
                {role === 'user' && (
                  <>
                    <div className="relative group">
                      <button className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group flex items-center">
                        Emergency Services
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      to="/private/user-profile" 
                      className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
                    >
                      My Profile
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}
                {role === 'volunteer' && (
                  <>
                    <Link 
                      to="/private/user-profile" 
                      className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
                    >
                      My Profile
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}
                {role === 'first_responder' && (
                  <>
                    <Link 
                      to="/private/user-profile" 
                      className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
                    >
                      My Profile
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}
                {role === 'government' && (
                  <>
                    <div className="relative group">
                      <button className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group flex items-center">
                        Management
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div className="py-2">
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
                      to="/private/user-profile" 
                      className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
                    >
                      My Profile
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}
                {/* Shared navigation for all authenticated users */}
                {isAuthenticated && (
                  <Link 
                    to="/private/disaster/1/communicationhub" 
                    className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
                  >
                    Communication Hub
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
              className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors duration-300"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">B</span>
              </div>
              <span className="text-2xl font-bold tracking-wide hidden sm:inline">Baminithiya</span>
            </Link>
          </div>

          {/* Right Side Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-end">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/auth/signin" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
                >
                  Sign In
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/auth/signup" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/private/user-profile" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                {role === 'user' && (
                  <Link 
                    to="/user" 
                    className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
                    title="Emergency Services"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                <button className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group" title="Notifications">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 12a1 1 0 100-2 1 1 0 000 2z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group" title="Settings">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <Link 
                  to="/private/user-profile" 
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  <div className="relative">
                    <img
                      src={getAvatarUrl(userName || 'U')}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border-2 border-gray-600 group-hover:border-blue-500 transition-colors duration-200 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <span className="font-medium hidden lg:inline">{userName || 'User'}</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg p-2 transition-colors duration-200"
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
                      to="/private/user-profile" 
                      className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                    >
                      My Profile
                    </Link>
                  </>
                )}
                {role === 'volunteer' && (
                  <Link 
                    to="/private/user-profile" 
                    className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                  >
                    My Profile
                  </Link>
                )}
                {role === 'first_responder' && (
                  <Link 
                    to="/private/user-profile" 
                    className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                  >
                    My Profile
                  </Link>
                )}
                {role === 'government' && (
                  <>
                    <div className="px-6 py-2">
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Management</div>
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
                      to="/private/user-profile" 
                      className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors duration-200"
                    >
                      My Profile
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