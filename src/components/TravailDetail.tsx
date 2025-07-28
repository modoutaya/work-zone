import React from 'react';
import { ArrowLeft, Calendar, DollarSign, User, Building, MapPin, AlertCircle, Clock, CheckCircle, Pause } from 'lucide-react';
import { Travail } from '../types';

interface TravailDetailProps {
  travail: Travail;
  onBack: () => void;
}

const TravailDetail: React.FC<TravailDetailProps> = ({ travail, onBack }) => {
  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'planifie': return <Clock size={20} className="text-gray-500" />;
      case 'en_cours': return <AlertCircle size={20} className="text-orange-500" />;
      case 'suspendu': return <Pause size={20} className="text-red-500" />;
      case 'termine': return <CheckCircle size={20} className="text-green-500" />;
      default: return <Clock size={20} className="text-gray-500" />;
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
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-bold text-gray-800">Détails du Travail</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{travail.titre}</h3>
                <p className="text-gray-600 mt-2">{travail.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(travail.statut)}
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(travail.statut)}`}>
                  {travail.statut.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Zone</p>
                  <p className="font-medium">{travail.zone.nom} ({travail.zone.type})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{formatType(travail.type)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Responsable</p>
                  <p className="font-medium">{travail.responsable}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Entreprise</p>
                  <p className="font-medium">{travail.entreprise || 'Non assignée'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progression</span>
                <span className="text-sm font-bold text-gray-800">{travail.progression}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${travail.progression}%` }}
                />
              </div>
            </div>

            {travail.commentaires && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-medium text-blue-800 mb-2">Commentaires</h4>
                <p className="text-blue-700">{travail.commentaires}</p>
              </div>
            )}
          </div>

          {/* Historique */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Historique</h3>
            <div className="space-y-4">
              {travail.historique.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">{item.action}</h4>
                      <span className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <p className="text-sm text-gray-500 mt-2">Par {item.utilisateur}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informations latérales */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Financières</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Budget Total</p>
                  <p className="text-xl font-bold text-green-600">
                    {travail.budget.toLocaleString('fr-FR')}€
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Coût au km²</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {travail.zone.superficie ? Math.round(travail.budget / travail.zone.superficie).toLocaleString('fr-FR') : 'N/A'}€
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Calendrier</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Date de début</p>
                  <p className="font-medium">{new Date(travail.dateDebut).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Date de fin</p>
                  <p className="font-medium">{new Date(travail.dateFin).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Durée</p>
                  <p className="font-medium">
                    {Math.ceil((new Date(travail.dateFin).getTime() - new Date(travail.dateDebut).getTime()) / (1000 * 60 * 60 * 24))} jours
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Modifier le travail
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Marquer comme terminé
              </button>
              <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                Suspendre
              </button>
              <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                Générer rapport
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravailDetail;