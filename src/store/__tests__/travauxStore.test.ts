import { describe, it, expect, beforeEach } from 'vitest';
import { useTravauxStore } from '../travauxStore';

describe('TravauxStore', () => {
  beforeEach(() => {
    useTravauxStore.getState().setTravaux([]);
    useTravauxStore.getState().clearError();
  });

  it('should have initial state', () => {
    const state = useTravauxStore.getState();
    
    expect(state.travaux).toEqual([]);
    expect(state.selectedTravail).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should add travail', () => {
    const { addTravail } = useTravauxStore.getState();
    
    const newTravail = {
      titre: 'Test Travail',
      description: 'Description test',
      zoneId: 'zone-1',
      zone: {
        id: 'zone-1',
        nom: 'Test Zone',
        type: 'département' as const,
        code: 'TEST',
      },
      type: 'infrastructure' as const,
      statut: 'en_cours' as const,
      priorite: 'normale' as const,
      budget: 100000,
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      progression: 50,
      responsable: 'Test User',
      historique: [],
    };

    addTravail(newTravail);
    
    const state = useTravauxStore.getState();
    expect(state.travaux).toHaveLength(1);
    expect(state.travaux[0].titre).toBe('Test Travail');
    expect(state.travaux[0].id).toBeDefined();
  });

  it('should update travail', () => {
    const { addTravail, updateTravail } = useTravauxStore.getState();
    
    // Add travail first
    const newTravail = {
      titre: 'Test Travail',
      description: 'Description test',
      zoneId: 'zone-1',
      zone: {
        id: 'zone-1',
        nom: 'Test Zone',
        type: 'département' as const,
        code: 'TEST',
      },
      type: 'infrastructure' as const,
      statut: 'en_cours' as const,
      priorite: 'normale' as const,
      budget: 100000,
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      progression: 50,
      responsable: 'Test User',
      historique: [],
    };

    addTravail(newTravail);
    const travailId = useTravauxStore.getState().travaux[0].id;
    
    // Update travail
    const travailToUpdate = useTravauxStore.getState().travaux[0];
    updateTravail({
      ...travailToUpdate,
      progression: 75,
      statut: 'termine' as const,
    });
    
    const updatedTravail = useTravauxStore.getState().travaux[0];
    expect(updatedTravail.progression).toBe(75);
    expect(updatedTravail.statut).toBe('termine');
  });

  it('should delete travail', () => {
    const { addTravail, deleteTravail } = useTravauxStore.getState();
    
    // Add travail first
    const newTravail = {
      titre: 'Test Travail',
      description: 'Description test',
      zoneId: 'zone-1',
      zone: {
        id: 'zone-1',
        nom: 'Test Zone',
        type: 'département' as const,
        code: 'TEST',
      },
      type: 'infrastructure' as const,
      statut: 'en_cours' as const,
      priorite: 'normale' as const,
      budget: 100000,
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      progression: 50,
      responsable: 'Test User',
      historique: [],
    };

    addTravail(newTravail);
    const travailId = useTravauxStore.getState().travaux[0].id;
    
    // Delete travail
    deleteTravail(travailId);
    
    expect(useTravauxStore.getState().travaux).toHaveLength(0);
  });

  it('should get travail by id', () => {
    const { addTravail, getTravailById } = useTravauxStore.getState();
    
    // Add travail first
    const newTravail = {
      titre: 'Test Travail',
      description: 'Description test',
      zoneId: 'zone-1',
      zone: {
        id: 'zone-1',
        nom: 'Test Zone',
        type: 'département' as const,
        code: 'TEST',
      },
      type: 'infrastructure' as const,
      statut: 'en_cours' as const,
      priorite: 'normale' as const,
      budget: 100000,
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      progression: 50,
      responsable: 'Test User',
      historique: [],
    };

    addTravail(newTravail);
    const travailId = useTravauxStore.getState().travaux[0].id;
    
    const foundTravail = getTravailById(travailId);
    expect(foundTravail).toBeDefined();
    expect(foundTravail?.titre).toBe('Test Travail');
  });

  it('should select travail', () => {
    const { selectTravail } = useTravauxStore.getState();
    
    const mockTravail = {
      id: 'test-id',
      titre: 'Test Travail',
      description: 'Description test',
      zoneId: 'zone-1',
      zone: {
        id: 'zone-1',
        nom: 'Test Zone',
        type: 'département' as const,
        code: 'TEST',
      },
      type: 'infrastructure' as const,
      statut: 'en_cours' as const,
      priorite: 'normale' as const,
      budget: 100000,
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      progression: 50,
      responsable: 'Test User',
      historique: [],
    };

    selectTravail(mockTravail);
    expect(useTravauxStore.getState().selectedTravail).toEqual(mockTravail);
    
    selectTravail(null);
    expect(useTravauxStore.getState().selectedTravail).toBeNull();
  });

  it('should handle loading state', () => {
    const { setLoading } = useTravauxStore.getState();
    
    setLoading(true);
    expect(useTravauxStore.getState().loading).toBe(true);
    
    setLoading(false);
    expect(useTravauxStore.getState().loading).toBe(false);
  });

  it('should handle error state', () => {
    const { setError, clearError } = useTravauxStore.getState();
    
    setError('Test error');
    expect(useTravauxStore.getState().error).toBe('Test error');
    
    clearError();
    expect(useTravauxStore.getState().error).toBeNull();
  });
}); 