import React, { Suspense } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

// Lazy load the ZonesList component
const ZonesList = React.lazy(() => import('../ZonesList'));

const ZonesListLazy: React.FC = () => {
  return (
    <Suspense 
      fallback={
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ZonesList />
    </Suspense>
  );
};

export default ZonesListLazy; 