import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, Clock, CheckCircle, AlertCircle, Pause } from 'lucide-react';
import { travaux } from '../data/mockData';
import { Travail } from '../types';

interface TravauxListProps {
  onSelectTravail: (travail: Travail) => void;
}

const TravauxList: React.FC<TravauxListProps> = ({ onSelectTravail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredTravaux = travaux.filter(travail => {
    const matchesSearch = travail.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         travail.zone.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || travail.statut === statusFilter;
    const matchesType = !typeFilter || travail.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'planifie': return <Clock size={16} className="text-gray-500" />;
      case 'en_cours': return <AlertCircle size={16} className="text-orange-500" />;
      case 'suspendu': return <Pause size={16} className="text-red-500" />;
      case 'termine': return <CheckCircle size={16} className="text-green-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'planifie': return 'bg-gray-100 text-gray-800';
      case 'en_cours': return 'bg-orange-100 text-orange-800';
      case 'suspendu': return 'bg-red-100 text-red-800';
      case 'termine': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'basse': return 'bg-blue-100 text-blue-800';
      case 'normale': return 'bg-gray-100 text-gray-800';
      case 'haute': return 'bg-orange-100 text-orange-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatType = (type: string) => {
    const types = {
      'infrastructure': 'Infrastructure',
      'transport': 'Transport',
      'energie': 'Énergie',
      'eau': 'Eau',
      'education': 'Éducation',
      'sante': 'Santé'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Gestion des Travaux</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
          <Plus size={20} />
          Nouveau Travail
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="planifie">Planifié</option>
            <option value="en_cours">En cours</option>
            <option value="suspendu">Suspendu</option>
            <option value="termine">Terminé</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="transport">Transport</option>
            <option value="energie">Énergie</option>
            <option value="eau">Eau</option>
            <option value="education">Éducation</option>
            <option value="sante">Santé</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Filter size={20} />
            Filtres avancés
          </button>
        </div>
      </div>

      {/* Liste des travaux */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Travail</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Zone</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Statut</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Priorité</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Progression</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Budget</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTravaux.map((travail) => (
                <tr key={travail.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div>
                      <h4 className="font-medium text-gray-800">{travail.titre}</h4>
                      <p className="text-sm text-gray-600">{travail.responsable}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800">{travail.zone.nom}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {travail.zone.type}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-800">{formatType(travail.type)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(travail.statut)}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(travail.statut)}`}>
                        {travail.statut.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(travail.priorite)}`}>
                      {travail.priorite}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${travail.progression}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{travail.progression}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-800">
                      {(travail.budget / 1000).toLocaleString('fr-FR')}k€
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onSelectTravail(travail)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTravaux.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun travail trouvé avec les filtres actuels</p>
        </div>
      )}
    </div>
  );
};

export default TravauxList;