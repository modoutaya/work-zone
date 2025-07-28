export interface Zone {
  id: string;
  nom: string;
  type: 'département' | 'région';
  code: string;
  population?: number;
  superficie?: number;
}

export interface Travail {
  id: string;
  titre: string;
  description: string;
  zoneId: string;
  zone: Zone;
  type: 'infrastructure' | 'transport' | 'energie' | 'eau' | 'education' | 'sante';
  statut: 'planifie' | 'en_cours' | 'suspendu' | 'termine' | 'annule';
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  budget: number;
  dateDebut: string;
  dateFin: string;
  progression: number;
  responsable: string;
  entreprise?: string;
  commentaires?: string;
  historique: HistoriqueItem[];
}

export interface HistoriqueItem {
  id: string;
  date: string;
  action: string;
  description: string;
  utilisateur: string;
}

export interface Statistiques {
  totalTravaux: number;
  travauxEnCours: number;
  travauxTermines: number;
  budgetTotal: number;
  progressionMoyenne: number;
  zonesActives: number;
}