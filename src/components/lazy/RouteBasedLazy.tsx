import React, { Suspense, useState, useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface LazyComponentProps {
  importFn: () => Promise<any>;
  fallback?: React.ReactNode;
  retryCount?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  preload?: boolean;
}

interface LazyComponentState {
  Component: React.ComponentType<any> | null;
  error: Error | null;
  retries: number;
}

const RouteBasedLazy: React.FC<LazyComponentProps> = ({
  importFn,
  fallback = <LoadingSpinner />,
  retryCount = 3,
  retryDelay = 1000,
  onError,
  preload = false,
}) => {
  const [state, setState] = useState<LazyComponentState>({
    Component: null,
    error: null,
    retries: 0,
  });

  const loadComponent = async (retryAttempt = 0): Promise<void> => {
    try {
      const module = await importFn();
      const Component = module.default || module;
      
      setState({
        Component,
        error: null,
        retries: retryAttempt,
      });
    } catch (error) {
      console.warn(`Failed to load component (attempt ${retryAttempt + 1}):`, error);
      
      if (retryAttempt < retryCount) {
        // Retry with exponential backoff
        const delay = retryDelay * Math.pow(2, retryAttempt);
        setTimeout(() => loadComponent(retryAttempt + 1), delay);
      } else {
        const errorObj = error instanceof Error ? error : new Error('Failed to load component');
        setState(prev => ({
          ...prev,
          error: errorObj,
          retries: retryAttempt,
        }));
        onError?.(errorObj);
      }
    }
  };

  useEffect(() => {
    if (!state.Component && !state.error) {
      loadComponent();
    }
  }, []);

  // Preload component if requested
  useEffect(() => {
    if (preload && !state.Component && !state.error) {
      loadComponent();
    }
  }, [preload]);

  if (state.error) {
    return (
      <div className="p-4">
        <ErrorMessage 
          message={`Failed to load component after ${state.retries} attempts: ${state.error.message}`}
          onDismiss={() => {
            setState(prev => ({ ...prev, error: null }));
            loadComponent();
          }}
        />
      </div>
    );
  }

  if (!state.Component) {
    return <>{fallback}</>;
  }

  return (
    <Suspense fallback={fallback}>
      <state.Component />
    </Suspense>
  );
};

export default RouteBasedLazy; 