import { z } from 'zod';

// Schéma pour Zone
export const ZoneSchema = z.object({
  id: z.string().min(1, 'ID de zone requis'),
  nom: z.string().min(2, 'Nom de zone doit contenir au moins 2 caractères'),
  type: z.enum(['département', 'région']),
  code: z.string().min(2, 'Code de zone doit contenir au moins 2 caractères'),
  population: z.number().optional(),
  superficie: z.number().optional(),
});

// Schéma pour Travail
export const TravailSchema = z.object({
  id: z.string().min(1, 'ID de travail requis'),
  titre: z.string().min(3, 'Titre doit contenir au moins 3 caractères').max(100, 'Titre trop long'),
  description: z.string().min(10, 'Description doit contenir au moins 10 caractères').max(500, 'Description trop longue'),
  zoneId: z.string().min(1, 'ID de zone requis'),
  zone: ZoneSchema,
  type: z.enum(['infrastructure', 'transport', 'energie', 'eau', 'education', 'sante']),
  statut: z.enum(['planifie', 'en_cours', 'suspendu', 'termine', 'annule']),
  priorite: z.enum(['basse', 'normale', 'haute', 'urgente']),
  budget: z.number().min(0, 'Budget doit être positif'),
  dateDebut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  dateFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  progression: z.number().min(0, 'Progression doit être entre 0 et 100').max(100, 'Progression doit être entre 0 et 100'),
  responsable: z.string().min(2, 'Responsable doit contenir au moins 2 caractères'),
  historique: z.array(z.object({
    id: z.string(),
    date: z.string(),
    action: z.string(),
    description: z.string(),
    utilisateur: z.string(),
  })).default([]),
  entreprise: z.string().optional(),
  commentaires: z.string().optional(),
});

// Schéma pour la création d'un nouveau travail (sans ID et historique)
export const CreateTravailSchema = z.object({
  id: z.string().optional(), // Optionnel pour la création
  titre: z.string().min(3, 'Titre doit contenir au moins 3 caractères').max(100, 'Titre trop long'),
  description: z.string().min(10, 'Description doit contenir au moins 10 caractères').max(500, 'Description trop longue'),
  zoneId: z.string().min(1, 'ID de zone requis'),
  zone: ZoneSchema.optional(), // Optionnel pour la création
  type: z.enum(['infrastructure', 'transport', 'energie', 'eau', 'education', 'sante']),
  statut: z.enum(['planifie', 'en_cours', 'suspendu', 'termine', 'annule']),
  priorite: z.enum(['basse', 'normale', 'haute', 'urgente']),
  budget: z.number().min(0, 'Budget doit être positif'),
  dateDebut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  dateFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  progression: z.number().min(0, 'Progression doit être entre 0 et 100').max(100, 'Progression doit être entre 0 et 100'),
  responsable: z.string().min(2, 'Responsable doit contenir au moins 2 caractères'),
  entreprise: z.string().optional(),
  commentaires: z.string().optional(),
});

// Schéma pour la mise à jour d'un travail
export const UpdateTravailSchema = TravailSchema.partial().extend({
  id: z.string().min(1, 'ID de travail requis'),
});

// Schéma pour les filtres de recherche
export const TravauxFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  statusFilter: z.enum(['planifie', 'en_cours', 'suspendu', 'termine', 'annule']).optional(),
  typeFilter: z.enum(['infrastructure', 'transport', 'energie', 'eau', 'education', 'sante']).optional(),
  zoneFilter: z.string().optional(),
  dateDebut: z.string().optional(),
  dateFin: z.string().optional(),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
});

// Schéma pour les statistiques
export const StatistiquesSchema = z.object({
  totalTravaux: z.number().min(0),
  travauxEnCours: z.number().min(0),
  travauxTermines: z.number().min(0),
  budgetTotal: z.number().min(0),
  progressionMoyenne: z.number().min(0).max(100),
  zonesActives: z.number().min(0),
});

// Schéma pour la pagination
export const PaginationSchema = z.object({
  page: z.number().min(1, 'Page doit être supérieure à 0'),
  limit: z.number().min(1, 'Limite doit être supérieure à 0').max(100, 'Limite maximale de 100'),
  total: z.number().min(0),
  totalPages: z.number().min(0),
});

// Schéma pour les paramètres de tri
export const SortSchema = z.object({
  field: z.string().min(1, 'Champ de tri requis'),
  direction: z.enum(['asc', 'desc']),
});

// Types TypeScript dérivés des schémas
export type Zone = z.infer<typeof ZoneSchema>;
export type Travail = z.infer<typeof TravailSchema>;
export type CreateTravail = z.infer<typeof CreateTravailSchema>;
export type UpdateTravail = z.infer<typeof UpdateTravailSchema>;
export type TravauxFilters = z.infer<typeof TravauxFiltersSchema>;
export type Statistiques = z.infer<typeof StatistiquesSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type Sort = z.infer<typeof SortSchema>;

// Fonctions utilitaires de validation
export const validateTravail = (data: unknown): Travail => {
  return TravailSchema.parse(data);
};

export const validateCreateTravail = (data: unknown): CreateTravail => {
  return CreateTravailSchema.parse(data);
};

export const validateUpdateTravail = (data: unknown): UpdateTravail => {
  return UpdateTravailSchema.parse(data);
};

export const validateFilters = (data: unknown): TravauxFilters => {
  return TravauxFiltersSchema.parse(data);
};

// Fonction pour valider les dates
export const validateDateRange = (dateDebut: string, dateFin: string): boolean => {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  return debut <= fin;
};

// Fonction pour valider le budget
export const validateBudget = (budget: number): boolean => {
  return budget >= 0 && budget <= 1000000000; // 1 milliard max
}; 