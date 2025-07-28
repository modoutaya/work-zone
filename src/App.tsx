import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TravauxList from './components/TravauxList';
import TravailDetail from './components/TravailDetail';
import ZonesList from './components/ZonesList';
import { useTravaux } from './hooks/useTravaux';
import { Travail } from './types';

function App() {
  const { getTravailById } = useTravaux();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTravailId, setSelectedTravailId] = useState<string | null>(null);

  const handleSelectTravail = (travail: Travail) => {
    setSelectedTravailId(travail.id);
  };

  const handleBackToList = () => {
    setSelectedTravailId(null);
  };

  const selectedTravail = selectedTravailId ? getTravailById(selectedTravailId) : null;

  const renderContent = () => {
    if (selectedTravail) {
      return <TravailDetail travail={selectedTravail} onBack={handleBackToList} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'travaux':
        return <TravauxList onSelectTravail={handleSelectTravail} />;
      case 'zones':
        return <ZonesList />;
      case 'statistiques':
        return <Dashboard />;
      case 'utilisateurs':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Gestion des Utilisateurs</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Module de gestion des utilisateurs en développement</p>
            </div>
          </div>
        );
      case 'parametres':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Paramètres</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Paramètres de l'application en développement</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;