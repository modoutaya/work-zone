import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useTravaux, useDeleteTravail } from '../hooks/queries/useTravauxQueries';
import { Travail } from '../types';
import StatusBadge from './ui/StatusBadge';
import PriorityBadge from './ui/PriorityBadge';
import ProgressBar from './ui/ProgressBar';
import ErrorMessage from './ui/ErrorMessage';
import LoadingSpinner from './ui/LoadingSpinner';
import { formatCurrency, formatType } from '../utils/formatters';
import { TRAVAIL_TYPES, TRAVAIL_STATUTS } from '../utils/constants';

interface TravauxListProps {
  onSelectTravail: (travail: Travail) => void;
}

const TravauxList: React.FC<TravauxListProps> = ({ onSelectTravail }) => {
  const { data: travauxData, isLoading, error } = useTravaux();
  const travaux = travauxData?.data || [];
  const deleteTravailMutation = useDeleteTravail();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce travail ?')) {
      deleteTravailMutation.mutate(id);
    }
  };

  const filteredTravaux = travaux.filter((travail: any) => {
    const matchesSearch = travail.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         travail.zone.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || travail.statut === statusFilter;
    const matchesType = !typeFilter || travail.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <ErrorMessage message={error?.message || 'Une erreur est survenue'} className="mb-4" />
      )}

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
            {TRAVAIL_STATUTS.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            {TRAVAIL_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
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
                    <StatusBadge status={travail.statut} />
                  </td>
                  <td className="py-4 px-6">
                    <PriorityBadge priority={travail.priorite} />
                  </td>
                  <td className="py-4 px-6">
                    <ProgressBar value={travail.progression} className="w-24" />
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-800">{formatCurrency(travail.budget)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onSelectTravail(travail)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        aria-label="Voir le travail"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        aria-label="Modifier le travail"
                      >
                        <Edit size={16} />
                      </button>
                     <button 
                       onClick={() => handleDelete(travail.id)}
                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                       aria-label="Supprimer le travail"
                     >
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