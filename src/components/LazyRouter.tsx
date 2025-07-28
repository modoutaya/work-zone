import React, { useEffect } from 'react';
import DashboardLazy from './lazy/DashboardLazy';
import TravauxListLazy from './lazy/TravauxListLazy';
import TravailDetailLazy from './lazy/TravailDetailLazy';
import ZonesListLazy from './lazy/ZonesListLazy';
import { Travail } from '../types';
import { usePreloader } from '../hooks/usePreloader';

interface LazyRouterProps {
  activeTab: string;
  selectedTravailId: string | null;
  onSelectTravail: (travail: Travail) => void;
  onBackToList: () => void;
  currentSelectedTravail: Travail | null;
}

const LazyRouter: React.FC<LazyRouterProps> = ({
  activeTab,
  selectedTravailId,
  onSelectTravail,
  onBackToList,
  currentSelectedTravail,
}) => {
  const { preloadMultiple, isPreloaded } = usePreloader();

  // Preload components when tab changes
  useEffect(() => {
    const preloadConfigs = [];

    // Preload current tab with high priority
    preloadConfigs.push({
      componentName: activeTab,
      importFn: () => {
        switch (activeTab) {
          case 'dashboard':
            return import('./Dashboard');
          case 'travaux':
            return import('./TravauxList');
          case 'zones':
            return import('./ZonesList');
          default:
            return import('./Dashboard');
        }
      },
      priority: 'high' as const,
    });

    // Preload adjacent tabs with medium priority
    if (activeTab === 'dashboard') {
      preloadConfigs.push({
        componentName: 'travaux',
        importFn: () => import('./TravauxList'),
        priority: 'medium' as const,
      });
    } else if (activeTab === 'travaux') {
      preloadConfigs.push(
        {
          componentName: 'dashboard',
          importFn: () => import('./Dashboard'),
          priority: 'medium' as const,
        },
        {
          componentName: 'zones',
          importFn: () => import('./ZonesList'),
          priority: 'medium' as const,
        }
      );
    } else if (activeTab === 'zones') {
      preloadConfigs.push({
        componentName: 'travaux',
        importFn: () => import('./TravauxList'),
        priority: 'medium' as const,
      });
    }

    preloadMultiple(preloadConfigs);
  }, [activeTab, preloadMultiple]);

  // Preload TravailDetail when a travail is selected
  useEffect(() => {
    if (selectedTravailId && !isPreloaded('travail-detail')) {
      preloadMultiple([{
        componentName: 'travail-detail',
        importFn: () => import('./TravailDetail'),
        priority: 'high' as const,
      }]);
    }
  }, [selectedTravailId, isPreloaded, preloadMultiple]);

  const renderContent = () => {
    // Show travail detail if selected
    if (currentSelectedTravail) {
      return (
        <TravailDetailLazy 
          travail={currentSelectedTravail} 
          onBack={onBackToList} 
        />
      );
    }

    // Show tab content based on activeTab
    switch (activeTab) {
      case 'dashboard':
        return <DashboardLazy />;
      case 'travaux':
        return <TravauxListLazy onSelectTravail={onSelectTravail} />;
      case 'zones':
        return <ZonesListLazy />;
      case 'lazy-test':
        return React.createElement(React.lazy(() => import('./LazyLoadingTest')));
      case 'performance':
        return React.createElement(React.lazy(() => import('./PerformanceMonitor')));
      default:
        return <DashboardLazy />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default LazyRouter; 