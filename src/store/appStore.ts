import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types for application state
export interface AppState {
  // Navigation
  activeTab: string;
  selectedTravailId: string | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setActiveTab: (tab: string) => void;
  setSelectedTravailId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetNavigation: () => void;
  resetApp: () => void;
}

// Main application store
export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      activeTab: 'dashboard',
      selectedTravailId: null,
      isLoading: false,
      error: null,
      
      // Actions
      setActiveTab: (tab) => {
        set({ activeTab: tab });
        // Reset selected travail when changing tabs
        if (tab !== 'travaux') {
          set({ selectedTravailId: null });
        }
      },
      
      setSelectedTravailId: (id) => set({ selectedTravailId: id }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      resetNavigation: () => set({ 
        activeTab: 'dashboard', 
        selectedTravailId: null 
      }),
      
      resetApp: () => set({
        activeTab: 'dashboard',
        selectedTravailId: null,
        isLoading: false,
        error: null,
      }),
    }),
    { 
      name: 'app-store',
      enabled: import.meta.env.DEV
    }
  )
); 