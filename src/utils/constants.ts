export const STATUT_COLORS = {
  planifie: 'bg-gray-100 text-gray-800',
  en_cours: 'bg-orange-100 text-orange-800',
  suspendu: 'bg-red-100 text-red-800',
  termine: 'bg-green-100 text-green-800',
  annule: 'bg-gray-100 text-gray-800',
} as const;

export const PRIORITY_COLORS = {
  basse: 'bg-blue-100 text-blue-800',
  normale: 'bg-gray-100 text-gray-800',
  haute: 'bg-orange-100 text-orange-800',
  urgente: 'bg-red-100 text-red-800',
} as const;

export const TYPE_COLORS = {
  infrastructure: 'bg-purple-100 text-purple-800',
  transport: 'bg-blue-100 text-blue-800',
  energie: 'bg-yellow-100 text-yellow-800',
  eau: 'bg-cyan-100 text-cyan-800',
  education: 'bg-green-100 text-green-800',
  sante: 'bg-red-100 text-red-800',
} as const;

export const ZONE_TYPES = {
  département: 'Département',
  région: 'Région',
} as const;

export const TRAVAIL_TYPES = [
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'transport', label: 'Transport' },
  { value: 'energie', label: 'Énergie' },
  { value: 'eau', label: 'Eau' },
  { value: 'education', label: 'Éducation' },
  { value: 'sante', label: 'Santé' },
] as const;

export const TRAVAIL_STATUTS = [
  { value: 'planifie', label: 'Planifié' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'suspendu', label: 'Suspendu' },
  { value: 'termine', label: 'Terminé' },
  { value: 'annule', label: 'Annulé' },
] as const;

export const TRAVAIL_PRIORITIES = [
  { value: 'basse', label: 'Basse' },
  { value: 'normale', label: 'Normale' },
  { value: 'haute', label: 'Haute' },
  { value: 'urgente', label: 'Urgente' },
] as const;