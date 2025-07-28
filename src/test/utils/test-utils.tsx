import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '../../store/appStore';
import { useTravauxStore } from '../../store/travauxStore';

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

// Wrapper pour les tests avec les stores Zustand et React Query
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Utilitaires pour les stores
export const resetStores = () => {
  useAppStore.getState().resetApp();
  useTravauxStore.getState().setTravaux([]);
  useTravauxStore.getState().clearError();
};

export const createMockTravail = (overrides = {}) => ({
  id: '1',
  titre: 'Test Travail',
  description: 'Description de test',
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
  entreprise: '',
  commentaires: '',
  ...overrides,
});

export * from '@testing-library/react';
export { customRender as render }; 