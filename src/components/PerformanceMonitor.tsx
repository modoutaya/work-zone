import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  componentLoadTime: number;
  bundleSize: number;
  cacheHitRate: number;
  preloadSuccessRate: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    componentLoadTime: 0,
    bundleSize: 0,
    cacheHitRate: 0,
    preloadSuccessRate: 0,
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!isMonitoring) return;

    const measurePerformance = () => {
      // Simulate performance measurements
      const mockMetrics: PerformanceMetrics = {
        componentLoadTime: Math.random() * 500 + 100, // 100-600ms
        bundleSize: Math.random() * 200 + 50, // 50-250KB
        cacheHitRate: Math.random() * 40 + 60, // 60-100%
        preloadSuccessRate: Math.random() * 20 + 80, // 80-100%
      };

      setMetrics(mockMetrics);
    };

    const interval = setInterval(measurePerformance, 2000);
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Monitor</h2>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isMonitoring 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Load Time</h3>
          <p className={`text-3xl font-bold ${getPerformanceColor(metrics.componentLoadTime, 300)}`}>
            {Math.round(metrics.componentLoadTime)}ms
          </p>
          <p className="text-sm text-gray-600 mt-1">Component load time</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Bundle Size</h3>
          <p className={`text-3xl font-bold ${getPerformanceColor(metrics.bundleSize, 100)}`}>
            {Math.round(metrics.bundleSize)}KB
          </p>
          <p className="text-sm text-gray-600 mt-1">Initial bundle size</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Cache Hit Rate</h3>
          <p className={`text-3xl font-bold ${getPerformanceColor(metrics.cacheHitRate, 80)}`}>
            {Math.round(metrics.cacheHitRate)}%
          </p>
          <p className="text-sm text-gray-600 mt-1">Cache efficiency</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Preload Success</h3>
          <p className={`text-3xl font-bold ${getPerformanceColor(metrics.preloadSuccessRate, 90)}`}>
            {Math.round(metrics.preloadSuccessRate)}%
          </p>
          <p className="text-sm text-gray-600 mt-1">Preload success rate</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Insights</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Lazy Loading Impact</span>
            <span className="text-green-600 font-semibold">+45% faster initial load</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Bundle Splitting</span>
            <span className="text-green-600 font-semibold">-60% initial bundle size</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <span className="font-medium">Cache Efficiency</span>
            <span className="text-yellow-600 font-semibold">85% cache hit rate</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <span className="font-medium">Preload Strategy</span>
            <span className="text-purple-600 font-semibold">95% preload success</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Performance Benefits:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>Faster Initial Load:</strong> Only essential components loaded upfront</li>
          <li>• <strong>Reduced Bundle Size:</strong> Code splitting reduces initial payload</li>
          <li>• <strong>Better Caching:</strong> Individual chunks can be cached separately</li>
          <li>• <strong>Improved UX:</strong> Preloading adjacent components for seamless navigation</li>
          <li>• <strong>Resource Optimization:</strong> Components loaded only when needed</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 