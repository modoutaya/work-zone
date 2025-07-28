import React, { Suspense } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Travail } from '../../types';

interface TravauxListLazyProps {
  onSelectTravail: (travail: Travail) => void;
}

// Lazy load the TravauxList component
const TravauxList = React.lazy(() => import('../TravauxList'));

const TravauxListLazy: React.FC<TravauxListLazyProps> = ({ onSelectTravail }) => {
  return (
    <Suspense 
      fallback={
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <TravauxList onSelectTravail={onSelectTravail} />
    </Suspense>
  );
};

export default TravauxListLazy; 