import { useState, useEffect, useCallback } from 'react';

interface PreloadConfig {
  componentName: string;
  importFn: () => Promise<any>;
  priority?: 'high' | 'medium' | 'low';
}

export const usePreloader = () => {
  const [preloadedComponents, setPreloadedComponents] = useState<Set<string>>(new Set());
  const [preloadingQueue, setPreloadingQueue] = useState<PreloadConfig[]>([]);

  const preloadComponent = useCallback(async (config: PreloadConfig) => {
    const { componentName, importFn } = config;
    
    if (preloadedComponents.has(componentName)) {
      return;
    }

    try {
      await importFn();
      setPreloadedComponents(prev => new Set([...prev, componentName]));
    } catch (error) {
      console.warn(`Failed to preload ${componentName}:`, error);
    }
  }, [preloadedComponents]);

  const addToPreloadQueue = useCallback((config: PreloadConfig) => {
    setPreloadingQueue(prev => [...prev, config]);
  }, []);

  // Process preload queue
  useEffect(() => {
    if (preloadingQueue.length === 0) return;

    const processQueue = async () => {
      // Sort by priority
      const sortedQueue = [...preloadingQueue].sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium']);
      });

      for (const config of sortedQueue) {
        await preloadComponent(config);
      }

      setPreloadingQueue([]);
    };

    processQueue();
  }, [preloadingQueue, preloadComponent]);

  const preloadMultiple = useCallback((configs: PreloadConfig[]) => {
    configs.forEach(config => addToPreloadQueue(config));
  }, [addToPreloadQueue]);

  const isPreloaded = useCallback((componentName: string) => {
    return preloadedComponents.has(componentName);
  }, [preloadedComponents]);

  return {
    preloadComponent,
    preloadMultiple,
    addToPreloadQueue,
    isPreloaded,
    preloadedComponents: Array.from(preloadedComponents),
  };
}; 