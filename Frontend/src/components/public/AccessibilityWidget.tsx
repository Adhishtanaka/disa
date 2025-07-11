import React, { useState, useEffect, useRef } from 'react';

// Accessibility features and their default state
const defaultState = {
  textSize: 0,
  grayscale: false,
  'high-contrast': false,
  'negative-contrast': false,
  'links-underline': false,
  'voice-reader': false,
};

type AccessibilityState = typeof defaultState;

const textSizePercent = (size: number) => 100 + size * 5; // Increased increment for better usability

const featureList = [
  { key: 'grayscale', icon: '⚫', title: 'Grayscale', desc: 'Remove colors for better focus' },
  { key: 'high-contrast', icon: '🎨', title: 'High Contrast', desc: 'Increase contrast for visibility' },
  { key: 'negative-contrast', icon: '🌙', title: 'Negative Contrast', desc: 'Invert colors for eye comfort' },
  { key: 'links-underline', icon: '🔗', title: 'Underline Links', desc: 'Show all links clearly' },
  { key: 'voice-reader', icon: '🔊', title: 'Text Reader', desc: 'Click text to hear it spoken' },
];

const textSizeClasses = [
  '',
  'text-[105%] leading-relaxed',
  'text-[110%] leading-relaxed',
  'text-[115%] leading-relaxed',
  'text-[120%] leading-loose',
  'text-[125%] leading-loose',
  'text-[130%] leading-loose',
  'text-[135%] leading-loose',
];

const featureClassMap: Record<string, string> = {
  grayscale: 'grayscale',
  'high-contrast': 'contrast-150 brightness-110',
  'negative-contrast': 'invert',
  'links-underline': 'links-underline',
  'voice-reader': '',
};

const LOCAL_STORAGE_KEY = 'accessibility-state';

export const AccessibilityWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<AccessibilityState>({ ...defaultState });
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Load state from localStorage - using in-memory storage for Claude
  useEffect(() => {
    // In Claude environment, we'll use in-memory storage
    const saved = sessionStorage?.getItem?.(LOCAL_STORAGE_KEY);
    if (saved) {
      setState({ ...defaultState, ...JSON.parse(saved) });
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    sessionStorage?.setItem?.(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Apply classes to <body>
  useEffect(() => {
    const body = document.body;
    textSizeClasses.forEach((_, i) => body.classList.remove(`accessibility-text-size-${i}`));
    Object.keys(featureClassMap).forEach((key) => {
      const classes = featureClassMap[key].split(' ');
      classes.forEach((cls) => cls && body.classList.remove(cls));
    });
    if (state.textSize > 0) {
      body.classList.add(`accessibility-text-size-${state.textSize}`);
    }
    Object.entries(state).forEach(([key, enabled]) => {
      if (key !== 'textSize' && enabled && featureClassMap[key]) {
        featureClassMap[key].split(' ').forEach((cls) => cls && body.classList.add(cls));
      }
    });
  }, [state]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !toggleBtnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const toggleFeature = (key: keyof AccessibilityState) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
    setOpen(false); // Close menu after toggling a feature
  };

  const resetAll = () => {
    setState({ ...defaultState });
    sessionStorage?.removeItem?.(LOCAL_STORAGE_KEY);
  };

  const handleVoiceClick = (e: MouseEvent) => {
    if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
    const text = (e.target as HTMLElement)?.innerText || '';
    if (text.trim().length === 0) return;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  };

  useEffect(() => {
    if (!state['voice-reader']) {
      document.body.removeEventListener('click', handleVoiceClick, true);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      return;
    }
    document.body.addEventListener('click', handleVoiceClick, true);
    return () => {
      document.body.removeEventListener('click', handleVoiceClick, true);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [state['voice-reader']]);

  const hasActiveFeatures = state.textSize > 0 || Object.entries(state).some(([key, value]) => key !== 'textSize' && value);

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[999999] font-sans">
        {/* Toggle Button - Improved Design */}
        <button
          ref={toggleBtnRef}
          aria-label={open ? "Close accessibility menu" : "Open accessibility menu"}
          aria-expanded={open}
          className={`
            relative group w-12 h-12 rounded-xl shadow-lg 
            flex items-center justify-center text-xl 
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-4 focus:ring-black
            bg-white text-black hover:bg-gray-100 hover:scale-105 hover:shadow-xl
            ${hasActiveFeatures ? 'ring-2 ring-black' : ''}
          `}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-2xl text-black">♿</span>
          {hasActiveFeatures && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full border-2 border-white"></div>
          )}
        </button>

        {/* Menu - Completely Redesigned */}
        {open && (
          <div
            ref={menuRef}
            className="fixed left-6 bottom-[104px] bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 max-h-96 overflow-hidden animate-slide-in z-[999999]"
            role="dialog"
            aria-label="Accessibility settings"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>♿</span>
                  Accessibility
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/80 hover:text-white text-xl leading-none p-1"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Text Size Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  Text Size
                </h4>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">A</span>
                    <div className="flex-1 relative">
                      <input
                        type="range"
                        min={0}
                        max={7}
                        value={state.textSize}
                        onChange={(e) => setState((prev) => ({ ...prev, textSize: Number(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        aria-label="Text size adjustment"
                      />
                    </div>
                    <span className="text-lg font-medium text-gray-600">A</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-semibold min-w-[3rem] text-center">
                      {textSizePercent(state.textSize)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  Features
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {featureList.map((feature) => (
                    <div
                      key={feature.key}
                      className={`
                        rounded-xl border-2 transition-all duration-200 cursor-pointer
                        ${state[feature.key as keyof AccessibilityState]
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                        }
                      `}
                      onClick={() => toggleFeature(feature.key as keyof AccessibilityState)}
                    >
                      <div className="p-3 flex items-center gap-3">
                        <span className="text-xl w-8 text-center text-black">{feature.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm">{feature.title}</div>
                          <div className="text-xs text-gray-500 truncate">{feature.desc}</div>
                        </div>
                        <div className="flex-shrink-0">
                          <div
                            className={`
                              w-12 h-6 rounded-full transition-all duration-200 relative
                              ${state[feature.key as keyof AccessibilityState]
                                ? 'bg-black'
                                : 'bg-gray-200'
                              }
                            `}
                          >
                            <div
                              className={`
                                absolute top-0.5 w-5 h-5 bg-white border border-black rounded-full shadow-sm transition-all duration-200
                                ${state[feature.key as keyof AccessibilityState]
                                  ? 'left-6'
                                  : 'left-0.5'
                                }
                              `}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voice Reader Controls */}
              {state['voice-reader'] && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-800 font-medium">🔊 Click any text to hear it</span>
                    <button
                      className="bg-amber-200 hover:bg-amber-300 text-amber-800 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                      onClick={() => window.speechSynthesis?.cancel?.()}
                    >
                      Stop
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4">
              <button
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                onClick={resetAll}
              >
                <span>🔄</span>
                Reset All Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
};

export default AccessibilityWidget;