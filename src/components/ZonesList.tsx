import React, { useState } from 'react';
import { Search, MapPin, Users, Ruler, Plus, Eye, Edit } from 'lucide-react';
import { zones } from '../data/mockData';
import { useTravaux } from '../hooks/useApp';

import { formatNumber, formatCurrency } from '../utils/formatters';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';

const ZonesList: React.FC = () => {
  const { travaux, loading, error } = useTravaux();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || zone.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getZoneStats = (zoneId: string) => {
    const zoneTravaux = travaux.filter(t => t.zoneId === zoneId);
    return {
      totalTravaux: zoneTravaux.length,
      enCours: zoneTravaux.filter(t => t.statut === 'en_cours').length,
      termines: zoneTravaux.filter(t => t.statut === 'termine').length,
      budget: zoneTravaux.reduce((sum, t) => sum + t.budget, 0)
    };
  };

  return (
    <div className="p-6 space-y-6">
      {error && (
        <ErrorMessage message={error} className="mb-4" />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Gestion des Zones</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
          <Plus size={20} />
          Nouvelle Zone
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="département">Département</option>
            <option value="région">Région</option>
          </select>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Total: {filteredZones.length} zones</span>
          </div>
        </div>
      </div>

      {/* Grille des zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredZones.map((zone) => {
          const stats = getZoneStats(zone.id);
          return (
            <div key={zone.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{zone.nom}</h3>
                    <p className="text-sm text-gray-600">Code: {zone.code}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  zone.type === 'département' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {zone.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {zone.population && (
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Population</p>
                      <p className="text-sm font-medium">{formatNumber(zone.population)}</p>
                    </div>
                  </div>
                )}
                {zone.superficie && (
                  <div className="flex items-center gap-2">
                    <Ruler size={16} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Superficie</p>
                      <p className="text-sm font-medium">{zone.superficie} km²</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-800 mb-3">Travaux en cours</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{stats.totalTravaux}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-600">{stats.enCours}</p>
                    <p className="text-xs text-gray-600">En cours</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{stats.termines}</p>
                    <p className="text-xs text-gray-600">Terminés</p>
                  </div>
                </div>
                
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-600">Budget total</p>
                  <p className="text-lg font-bold text-purple-600">
                    {formatCurrency(stats.budget)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-2">
                  <Eye size={16} />
                  Voir
                </button>
                <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Modifier
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredZones.length === 0 && (
        <div className="text-center py-12">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Aucune zone trouvée avec les filtres actuels</p>
        </div>
      )}
    </div>
  );
};

export default ZonesList;