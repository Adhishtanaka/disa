import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeTestComponent: React.FC = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [domClasses, setDomClasses] = useState('');

  useEffect(() => {
    // Check actual DOM classes
    setDomClasses(document.documentElement.className);
  }, [theme]);

  const handleToggle = () => {
    console.log('Toggle clicked! Current theme:', theme);
    toggleTheme();
    // Check DOM after a short delay
    setTimeout(() => {
      setDomClasses(document.documentElement.className);
      console.log('DOM classes after toggle:', document.documentElement.className);
    }, 100);
  };

  return (
    <div className="fixed top-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-w-xs">
      <div className="text-sm text-gray-900 dark:text-white mb-2">
        Current Theme: <strong>{theme}</strong>
      </div>
      <div className="text-sm text-gray-900 dark:text-white mb-2">
        Is Dark Mode: <strong>{isDarkMode.toString()}</strong>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        DOM Classes: <code>{domClasses}</code>
      </div>
      <button
        onClick={handleToggle}
        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors w-full"
      >
        Toggle Theme
      </button>
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
        This box should change color when you toggle.
      </div>
      
      {/* Visual test elements */}
      <div className="mt-3 space-y-2">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <div className="text-xs text-gray-900 dark:text-white">Test Element</div>
        </div>
        <div className="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded"></div>
      </div>
    </div>
  );
};
