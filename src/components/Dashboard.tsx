import React from 'react';
import { TrendingUp, Clock, CheckCircle, DollarSign, Activity, MapPin } from 'lucide-react';
import { useTravauxStore } from '../store/travauxStore';
import { formatCurrency, formatDate } from '../utils/formatters';
import ProgressBar from './ui/ProgressBar';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';

const Dashboard: React.FC = () => {
  const travaux = useTravauxStore((state) => state.travaux);
  const loading = useTravauxStore((state) => state.loading);
  const error = useTravauxStore((state) => state.error);
  
  const statistiques = React.useMemo(() => ({
    totalTravaux: travaux.length,
    travauxEnCours: travaux.filter((t: any) => t.statut === 'en_cours').length,
    travauxTermines: travaux.filter((t: any) => t.statut === 'termine').length,
    budgetTotal: travaux.reduce((sum: number, t: any) => sum + t.budget, 0),
    progressionMoyenne: travaux.length > 0 
      ? Math.round(travaux.reduce((sum: number, t: any) => sum + t.progression, 0) / travaux.length)
      : 0,
    zonesActives: new Set(travaux.map((t: any) => t.zoneId)).size,
  }), [travaux]);

  const travauxRecents = React.useMemo(() => travaux.slice(0, 3), [travaux]);

  const cards = [
    {
      title: 'Total Travaux',
      value: statistiques.totalTravaux,
      icon: Activity,
      color: 'bg-blue-500',
      change: '+2 ce mois'
    },
    {
      title: 'En Cours',
      value: statistiques.travauxEnCours,
      icon: Clock,
      color: 'bg-orange-500',
      change: '40% du total'
    },
    {
      title: 'Terminés',
      value: statistiques.travauxTermines,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+1 cette semaine'
    },
    {
      title: 'Budget Total',
      value: formatCurrency(statistiques.budgetTotal),
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+5% vs mois dernier'
    },
    {
      title: 'Progression Moy.',
      value: `${statistiques.progressionMoyenne}%`,
      icon: TrendingUp,
      color: 'bg-teal-500',
      change: '+3% cette semaine'
    },
    {
      title: 'Zones Actives',
      value: statistiques.zonesActives,
      icon: MapPin,
      color: 'bg-red-500',
      change: '62% des zones'
    }
  ];



  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <ErrorMessage message={error} className="mb-4" />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Tableau de Bord</h2>
        <div className="text-sm text-gray-600">
          Dernière mise à jour: {formatDate(new Date())}
        </div>
      </div>

      {/* Cards des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                  <p className="text-sm text-green-600 mt-1">{card.change}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphique de progression */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Progression des Travaux</h3>
        <div className="space-y-4">
          {travauxRecents.map((travail) => (
            <div key={travail.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{travail.titre}</h4>
                <p className="text-sm text-gray-600">{travail.zone.nom} • {travail.type}</p>
              </div>
              <ProgressBar value={travail.progression} className="w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Alertes Récentes</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-red-800">Travaux suspendus</p>
                <p className="text-sm text-red-600">Extension réseau eau potable - Nice</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-orange-800">Retard prévu</p>
                <p className="text-sm text-orange-600">Modernisation réseau électrique - Marseille</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-800">Travaux terminés</p>
                <p className="text-sm text-green-600">Réhabilitation centre hospitalier - Toulouse</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-800">Nouveau projet</p>
                <p className="text-sm text-blue-600">Construction école primaire - Lyon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;