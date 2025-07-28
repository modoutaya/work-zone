import React from 'react';
import Sidebar from './components/Sidebar';
import LazyRouter from './components/LazyRouter';
import { useAppStore } from './store/appStore';
import { useTravauxStore } from './store/travauxStore';
import { Travail } from './types';

function App() {
  const activeTab = useAppStore((state) => state.activeTab);
  const selectedTravailId = useAppStore((state) => state.selectedTravailId);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setSelectedTravailId = useAppStore((state) => state.setSelectedTravailId);
  
  const getTravailById = useTravauxStore((state) => state.getTravailById);
  const selectTravail = useTravauxStore((state) => state.selectTravail);

  const handleSelectTravail = (travail: Travail) => {
    setSelectedTravailId(travail.id);
    selectTravail(travail);
  };

  const handleBackToList = () => {
    setSelectedTravailId(null);
    selectTravail(null);
  };

  const currentSelectedTravail = selectedTravailId ? getTravailById(selectedTravailId) || null : null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <LazyRouter
          activeTab={activeTab}
          selectedTravailId={selectedTravailId}
          onSelectTravail={handleSelectTravail}
          onBackToList={handleBackToList}
          currentSelectedTravail={currentSelectedTravail}
        />
      </main>
    </div>
  );
}

export default App;