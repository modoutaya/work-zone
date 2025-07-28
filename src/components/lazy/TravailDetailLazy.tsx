import React, { Suspense } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Travail } from '../../types';

interface TravailDetailLazyProps {
  travail: Travail;
  onBack: () => void;
}

// Lazy load the TravailDetail component
const TravailDetail = React.lazy(() => import('../TravailDetail'));

const TravailDetailLazy: React.FC<TravailDetailLazyProps> = ({ travail, onBack }) => {
  return (
    <Suspense 
      fallback={
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <TravailDetail travail={travail} onBack={onBack} />
    </Suspense>
  );
};

export default TravailDetailLazy; 