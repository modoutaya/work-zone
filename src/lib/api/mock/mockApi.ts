import { Travail } from '../../../types';
import { travaux as mockTravaux } from '../../../data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random errors (5% chance)
const shouldFail = () => Math.random() < 0.05;

// Mock API class
export class MockApi {
  private travaux = [...mockTravaux];
  private shouldFailFlag = false;

  // Test control methods
  setTravaux(travaux: Travail[]) {
    this.travaux = [...travaux];
  }

  setShouldFail(shouldFail: boolean) {
    this.shouldFailFlag = shouldFail;
  }

  reset() {
    this.travaux = [...mockTravaux];
    this.shouldFailFlag = false;
  }

  // Get all travaux
  async getTravaux(params?: {
    page?: number;
    limit?: number;
    status?: string;
    zoneId?: string;
    type?: string;
    search?: string;
  }): Promise<{ data: Travail[]; total: number; page: number; limit: number }> {
    await delay(300 + Math.random() * 200); // 300-500ms

    if (this.shouldFailFlag) {
      throw new Error('Failed to fetch travaux');
    }

    let filteredTravaux = [...this.travaux];

    // Apply filters
    if (params?.status) {
      filteredTravaux = filteredTravaux.filter(t => t.statut === params.status);
    }

    if (params?.zoneId) {
      filteredTravaux = filteredTravaux.filter(t => t.zoneId === params.zoneId);
    }

    if (params?.type) {
      filteredTravaux = filteredTravaux.filter(t => t.type === params.type);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredTravaux = filteredTravaux.filter(t => 
        t.titre.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTravaux = filteredTravaux.slice(start, end);

    return {
      data: paginatedTravaux,
      total: filteredTravaux.length,
      page,
      limit,
    };
  }

  // Get single travail
  async getTravailById(id: string): Promise<Travail> {
    await delay(200 + Math.random() * 100); // 200-300ms

    if (this.shouldFailFlag) {
      throw new Error('Failed to fetch travail');
    }

    const travail = this.travaux.find(t => t.id === id);
    if (!travail) {
      throw new Error('Travail not found');
    }

    return travail;
  }

  // Create travail
  async createTravail(travail: Omit<Travail, 'id'>): Promise<Travail> {
    await delay(500 + Math.random() * 300); // 500-800ms

    if (this.shouldFailFlag) {
      throw new Error('Failed to create travail');
    }

    const newTravail: Travail = {
      ...travail,
      id: Date.now().toString(),
      historique: [],
      entreprise: travail.entreprise || '',
      commentaires: travail.commentaires || '',
    };

    this.travaux.push(newTravail);
    return newTravail;
  }

  // Update travail
  async updateTravail(id: string, updates: Partial<Travail>): Promise<Travail> {
    await delay(400 + Math.random() * 200); // 400-600ms

    if (this.shouldFailFlag) {
      throw new Error('Failed to update travail');
    }

    const index = this.travaux.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Travail not found');
    }

    this.travaux[index] = { ...this.travaux[index], ...updates };
    return this.travaux[index];
  }

  // Delete travail
  async deleteTravail(id: string): Promise<void> {
    await delay(300 + Math.random() * 200); // 300-500ms

    if (this.shouldFailFlag) {
      throw new Error('Failed to delete travail');
    }

    const index = this.travaux.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Travail not found');
    }

    this.travaux.splice(index, 1);
  }

  // Get travaux statistics
  async getTravauxStats(): Promise<{
    totalTravaux: number;
    travauxEnCours: number;
    travauxTermines: number;
    budgetTotal: number;
    progressionMoyenne: number;
    zonesActives: number;
  }> {
    await delay(200 + Math.random() * 100); // 200-300ms

    if (shouldFail()) {
      throw new Error('Failed to fetch statistics');
    }

    const totalTravaux = this.travaux.length;
    const travauxEnCours = this.travaux.filter(t => t.statut === 'en_cours').length;
    const travauxTermines = this.travaux.filter(t => t.statut === 'termine').length;
    const budgetTotal = this.travaux.reduce((sum, t) => sum + t.budget, 0);
    const progressionMoyenne = totalTravaux > 0 
      ? Math.round(this.travaux.reduce((sum, t) => sum + t.progression, 0) / totalTravaux)
      : 0;
    const zonesActives = new Set(this.travaux.map(t => t.zoneId)).size;

    return {
      totalTravaux,
      travauxEnCours,
      travauxTermines,
      budgetTotal,
      progressionMoyenne,
      zonesActives,
    };
  }

  // Get travaux by status
  async getTravauxByStatus(status: string): Promise<Travail[]> {
    await delay(250 + Math.random() * 150); // 250-400ms

    if (shouldFail()) {
      throw new Error('Failed to fetch travaux by status');
    }

    return this.travaux.filter(t => t.statut === status);
  }

  // Get travaux by zone
  async getTravauxByZone(zoneId: string): Promise<Travail[]> {
    await delay(250 + Math.random() * 150); // 250-400ms

    if (shouldFail()) {
      throw new Error('Failed to fetch travaux by zone');
    }

    return this.travaux.filter(t => t.zoneId === zoneId);
  }

  // Get travaux by type
  async getTravauxByType(type: string): Promise<Travail[]> {
    await delay(250 + Math.random() * 150); // 250-400ms

    if (shouldFail()) {
      throw new Error('Failed to fetch travaux by type');
    }

    return this.travaux.filter(t => t.type === type);
  }

  // Reset mock data (for testing)
  resetData(): void {
    this.travaux = [...mockTravaux];
  }
}

// Export singleton instance for tests
export const mockApi = new MockApi(); 