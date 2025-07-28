import { Zone, Travail, Statistiques } from '../types';

export const zones: Zone[] = [
  { id: '1', nom: 'Paris', type: 'département', code: '75', population: 2161000, superficie: 105 },
  { id: '2', nom: 'Lyon', type: 'département', code: '69', population: 516092, superficie: 48 },
  { id: '3', nom: 'Marseille', type: 'département', code: '13', population: 868277, superficie: 241 },
  { id: '4', nom: 'Toulouse', type: 'département', code: '31', population: 479553, superficie: 118 },
  { id: '5', nom: 'Nice', type: 'département', code: '06', population: 342295, superficie: 72 },
  { id: '6', nom: 'Île-de-France', type: 'région', code: 'IDF', population: 12262544, superficie: 12012 },
  { id: '7', nom: 'Auvergne-Rhône-Alpes', type: 'région', code: 'ARA', population: 8032377, superficie: 69711 },
  { id: '8', nom: 'Nouvelle-Aquitaine', type: 'région', code: 'NA', population: 6010289, superficie: 84036 },
];

export const travaux: Travail[] = [
  {
    id: '1',
    titre: 'Rénovation du réseau routier A6',
    description: 'Réfection complète de la chaussée et mise aux normes des équipements de sécurité',
    zoneId: '1',
    zone: zones[0],
    type: 'transport',
    statut: 'en_cours',
    priorite: 'haute',
    budget: 2500000,
    dateDebut: '2024-01-15',
    dateFin: '2024-06-30',
    progression: 65,
    responsable: 'Jean Dupont',
    entreprise: 'BTP Services',
    commentaires: 'Travaux en avance sur le planning',
    historique: [
      { id: '1', date: '2024-01-15', action: 'Démarrage', description: 'Début des travaux', utilisateur: 'Jean Dupont' },
      { id: '2', date: '2024-02-20', action: 'Avancement', description: 'Première phase terminée', utilisateur: 'Jean Dupont' }
    ]
  },
  {
    id: '2',
    titre: 'Construction école primaire',
    description: 'Nouvelle école primaire de 12 classes avec équipements modernes',
    zoneId: '2',
    zone: zones[1],
    type: 'education',
    statut: 'planifie',
    priorite: 'normale',
    budget: 1800000,
    dateDebut: '2024-03-01',
    dateFin: '2024-12-15',
    progression: 0,
    responsable: 'Marie Martin',
    entreprise: 'Constructions Modernes',
    historique: [
      { id: '3', date: '2024-01-10', action: 'Planification', description: 'Projet approuvé', utilisateur: 'Marie Martin' }
    ]
  },
  {
    id: '3',
    titre: 'Modernisation réseau électrique',
    description: 'Remplacement des transformateurs et mise aux normes du réseau',
    zoneId: '3',
    zone: zones[2],
    type: 'energie',
    statut: 'en_cours',
    priorite: 'urgente',
    budget: 3200000,
    dateDebut: '2024-02-01',
    dateFin: '2024-08-31',
    progression: 45,
    responsable: 'Pierre Moreau',
    entreprise: 'Électricité Plus',
    historique: [
      { id: '4', date: '2024-02-01', action: 'Démarrage', description: 'Début des travaux', utilisateur: 'Pierre Moreau' }
    ]
  },
  {
    id: '4',
    titre: 'Réhabilitation centre hospitalier',
    description: 'Rénovation du service urgences et création d\'un nouveau bloc opératoire',
    zoneId: '4',
    zone: zones[3],
    type: 'sante',
    statut: 'termine',
    priorite: 'haute',
    budget: 4500000,
    dateDebut: '2023-06-01',
    dateFin: '2024-01-31',
    progression: 100,
    responsable: 'Sophie Durand',
    entreprise: 'Médical Construct',
    historique: [
      { id: '5', date: '2023-06-01', action: 'Démarrage', description: 'Début des travaux', utilisateur: 'Sophie Durand' },
      { id: '6', date: '2024-01-31', action: 'Terminé', description: 'Travaux terminés', utilisateur: 'Sophie Durand' }
    ]
  },
  {
    id: '5',
    titre: 'Extension réseau eau potable',
    description: 'Extension du réseau d\'eau potable vers les nouvelles zones résidentielles',
    zoneId: '5',
    zone: zones[4],
    type: 'eau',
    statut: 'suspendu',
    priorite: 'basse',
    budget: 950000,
    dateDebut: '2024-04-01',
    dateFin: '2024-10-31',
    progression: 25,
    responsable: 'Luc Bernard',
    entreprise: 'Aqua Tech',
    commentaires: 'Travaux suspendus en attente de financement',
    historique: [
      { id: '7', date: '2024-04-01', action: 'Démarrage', description: 'Début des travaux', utilisateur: 'Luc Bernard' },
      { id: '8', date: '2024-04-15', action: 'Suspension', description: 'Travaux suspendus', utilisateur: 'Luc Bernard' }
    ]
  }
];

export const statistiques: Statistiques = {
  totalTravaux: 5,
  travauxEnCours: 2,
  travauxTermines: 1,
  budgetTotal: 12950000,
  progressionMoyenne: 47,
  zonesActives: 5
};