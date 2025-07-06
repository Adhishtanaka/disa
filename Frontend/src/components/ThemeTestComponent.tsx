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
    <div className="fixed top-4 right-4 z-50 p-4 bg-red-100 dark:bg-green-100 border-4 border-red-500 dark:border-green-500 rounded-lg shadow-lg max-w-xs">
      <div className="text-sm text-red-900 dark:text-green-900 mb-2 font-bold">
        Current Theme: <strong>{theme}</strong>
      </div>
      <div className="text-sm text-red-900 dark:text-green-900 mb-2 font-bold">
        Is Dark Mode: <strong>{isDarkMode.toString()}</strong>
      </div>
      <div className="text-xs text-red-700 dark:text-green-700 mb-2">
        DOM Classes: <code>{domClasses}</code>
      </div>
      <button
        onClick={handleToggle}
        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors w-full"
      >
        Toggle Theme
      </button>
      <div className="mt-2 text-xs text-red-700 dark:text-green-700">
        This box should change color when you toggle.
      </div>
      
      {/* Visual test elements */}
      <div className="mt-3 space-y-2">
        <div className="p-2 bg-red-200 dark:bg-green-200 rounded">
          <div className="text-xs text-red-900 dark:text-green-900">Test Element</div>
        </div>
        <div className="w-full h-2 bg-red-400 dark:bg-green-400 rounded"></div>
      </div>
    </div>
  );
};
