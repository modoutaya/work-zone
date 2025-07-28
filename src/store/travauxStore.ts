import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { travaux as mockTravaux } from '../data/mockData';
import { Travail } from '../types';
import { validateTravail, validateCreateTravail } from '../schemas/validation';

// Types pour l'état des travaux
export interface TravauxState {
  // Data
  travaux: Travail[];
  selectedTravail: Travail | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Actions
  setTravaux: (travaux: Travail[]) => void;
  addTravail: (travail: Omit<Travail, 'id'>) => void;
  updateTravail: (updates: Travail) => void;
  deleteTravail: (id: string) => void;
  selectTravail: (travail: Travail | null) => void;
  getTravailById: (id: string) => Travail | undefined;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  

}

// Store pour la gestion des travaux
export const useTravauxStore = create<TravauxState>()(
  devtools(
    (set, get) => ({
      // État initial
      travaux: mockTravaux,
      selectedTravail: null,
      loading: false,
      error: null,
      
      // Actions de données
      setTravaux: (travaux) => set({ travaux }),
      
      addTravail: (newTravail) => {
        try {
          // Validation avec Zod
          const validatedTravail = validateCreateTravail(newTravail);
          
          const travail: Travail = {
            ...validatedTravail,
            id: Date.now().toString(),
            historique: [],
            entreprise: validatedTravail.entreprise || '',
            commentaires: validatedTravail.commentaires || '',
          };
          
          set((state) => ({ 
            travaux: [...state.travaux, travail],
            error: null 
          }));
        } catch (err: any) {
          const errorMessage = err?.message || 'Erreur lors de l\'ajout du travail';
          set({ error: errorMessage });
          console.error('Error adding travail:', err);
        }
      },
      
      updateTravail: (updates) => {
        try {
          // Validation avec Zod
          const validatedUpdates = validateTravail(updates);
          
          set((state) => ({
            travaux: state.travaux.map(travail => 
              travail.id === validatedUpdates.id ? { ...travail, ...validatedUpdates } : travail
            ),
            error: null
          }));
        } catch (err: any) {
          const errorMessage = err?.message || 'Erreur lors de la mise à jour du travail';
          set({ error: errorMessage });
          console.error('Error updating travail:', err);
        }
      },
      
      deleteTravail: (id) => {
        try {
          set((state) => ({
            travaux: state.travaux.filter(travail => travail.id !== id),
            error: null
          }));
        } catch (err) {
          set({ error: 'Erreur lors de la suppression du travail' });
          console.error('Error deleting travail:', err);
        }
      },
      
      selectTravail: (travail) => set({ selectedTravail: travail }),
      
      getTravailById: (id) => {
        const state = get();
        return state.travaux.find(travail => travail.id === id);
      },
      
      // Actions UI
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
    }),
    { 
      name: 'travaux-store',
      enabled: import.meta.env.DEV
    }
  )
); 