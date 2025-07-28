import React, { useState } from 'react';
import { usePreloader } from '../hooks/usePreloader';

const LazyLoadingTest: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('');
  const { preloadMultiple, isPreloaded, preloadedComponents } = usePreloader();

  const components = [
    { name: 'dashboard', label: 'Dashboard' },
    { name: 'travaux', label: 'Travaux List' },
    { name: 'zones', label: 'Zones List' },
    { name: 'travail-detail', label: 'Travail Detail' },
  ];

  const handlePreload = (componentName: string) => {
    const importFn = () => {
      switch (componentName) {
        case 'dashboard':
          return import('./Dashboard');
        case 'travaux':
          return import('./TravauxList');
        case 'zones':
          return import('./ZonesList');
        case 'travail-detail':
          return import('./TravailDetail');
        default:
          return import('./Dashboard');
      }
    };

    preloadMultiple([{
      componentName,
      importFn,
      priority: 'high' as const,
    }]);
  };

  const handlePreloadAll = () => {
    const configs = components.map(comp => ({
      componentName: comp.name,
      importFn: () => {
        switch (comp.name) {
          case 'dashboard':
            return import('./Dashboard');
          case 'travaux':
            return import('./TravauxList');
          case 'zones':
            return import('./ZonesList');
          case 'travail-detail':
            return import('./TravailDetail');
          default:
            return import('./Dashboard');
        }
      },
      priority: 'medium' as const,
    }));
    preloadMultiple(configs);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Lazy Loading Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Component Status</h3>
          <div className="space-y-2">
            {components.map((comp) => (
              <div key={comp.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{comp.label}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  isPreloaded(comp.name) 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {isPreloaded(comp.name) ? 'Preloaded' : 'Not Loaded'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Actions</h3>
          <div className="space-y-3">
            <button
              onClick={handlePreloadAll}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Preload All Components
            </button>
            
            {components.map((comp) => (
              <button
                key={comp.name}
                onClick={() => handlePreload(comp.name)}
                disabled={isPreloaded(comp.name)}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preload {comp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Debug Info</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Preloaded Components:</strong> {preloadedComponents.join(', ') || 'None'}</p>
          <p><strong>Total Preloaded:</strong> {preloadedComponents.length}</p>
          <p><strong>Active Component:</strong> {activeComponent || 'None'}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Components are loaded only when needed (lazy loading)</li>
          <li>• Adjacent components are preloaded for better UX</li>
          <li>• Preloading uses priority queues (high/medium/low)</li>
          <li>• Components are cached after first load</li>
          <li>• Loading states show spinners during component load</li>
        </ul>
      </div>
    </div>
  );
};

export default LazyLoadingTest; 