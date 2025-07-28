import React, { Suspense } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

// Lazy load the Dashboard component
const Dashboard = React.lazy(() => import('../Dashboard'));

const DashboardLazy: React.FC = () => {
  return (
    <Suspense 
      fallback={
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <Dashboard />
    </Suspense>
  );
};

export default DashboardLazy; 