import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { travaux as mockTravaux } from '../data/mockData';
import { Travail } from '../types';
import { validateTravail, validateCreateTravail } from '../schemas/validation';

// Types for work state
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

// Store for work management
export const useTravauxStore = create<TravauxState>()(
  devtools(
    (set, get) => ({
      // Initial state
      travaux: mockTravaux,
      selectedTravail: null,
      loading: false,
      error: null,
      
      // Data actions
      setTravaux: (travaux) => set({ travaux }),
      
      addTravail: (newTravail) => {
        try {
          // Validation with Zod
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
          const errorMessage = err?.message || 'Error adding work';
          set({ error: errorMessage });
          console.error('Error adding travail:', err);
        }
      },
      
      updateTravail: (updates) => {
        try {
          // Validation with Zod
          const validatedUpdates = validateTravail(updates);
          
          set((state) => ({
            travaux: state.travaux.map(travail => 
              travail.id === validatedUpdates.id ? { ...travail, ...validatedUpdates } : travail
            ),
            error: null
          }));
        } catch (err: any) {
          const errorMessage = err?.message || 'Error updating work';
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
          set({ error: 'Error deleting work' });
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