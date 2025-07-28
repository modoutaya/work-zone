import { Travail } from '../../../types';
import { mockApi } from '../mock/mockApi';

// API endpoints
const TRAVAUX_ENDPOINTS = {
  list: '/travaux',
  detail: (id: string) => `/travaux/${id}`,
  create: '/travaux',
  update: (id: string) => `/travaux/${id}`,
  delete: (id: string) => `/travaux/${id}`,
  stats: '/travaux/stats',
  byStatus: (status: string) => `/travaux/status/${status}`,
  byZone: (zoneId: string) => `/travaux/zone/${zoneId}`,
  byType: (type: string) => `/travaux/type/${type}`,
};

// Types for API responses
export interface TravauxListResponse {
  data: Travail[];
  total: number;
  page: number;
  limit: number;
}

export interface TravauxStatsResponse {
  totalTravaux: number;
  travauxEnCours: number;
  travauxTermines: number;
  budgetTotal: number;
  progressionMoyenne: number;
  zonesActives: number;
}

// Travaux API Service
export class TravauxService {
  // Get all travaux with optional filters
  static async getTravaux(params?: {
    page?: number;
    limit?: number;
    status?: string;
    zoneId?: string;
    type?: string;
    search?: string;
  }): Promise<TravauxListResponse> {
    return mockApi.getTravaux(params);
  }

  // Get a single travail by ID
  static async getTravailById(id: string): Promise<Travail> {
    return mockApi.getTravailById(id);
  }

  // Create a new travail
  static async createTravail(travail: Omit<Travail, 'id'>): Promise<Travail> {
    return mockApi.createTravail(travail);
  }

  // Update an existing travail
  static async updateTravail(id: string, updates: Partial<Travail>): Promise<Travail> {
    return mockApi.updateTravail(id, updates);
  }

  // Delete a travail
  static async deleteTravail(id: string): Promise<void> {
    return mockApi.deleteTravail(id);
  }

  // Get travaux statistics
  static async getTravauxStats(): Promise<TravauxStatsResponse> {
    return mockApi.getTravauxStats();
  }

  // Get travaux by status
  static async getTravauxByStatus(status: string): Promise<Travail[]> {
    return mockApi.getTravauxByStatus(status);
  }

  // Get travaux by zone
  static async getTravauxByZone(zoneId: string): Promise<Travail[]> {
    return mockApi.getTravauxByZone(zoneId);
  }

  // Get travaux by type
  static async getTravauxByType(type: string): Promise<Travail[]> {
    return mockApi.getTravauxByType(type);
  }
} 