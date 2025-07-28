import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import { useTravauxStore } from '../../store/travauxStore';

// Wrapper pour les tests avec les stores Zustand
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Utilitaires pour les stores
export const resetStores = () => {
  useAppStore.getState().resetApp();
  useTravauxStore.getState().setTravaux([]);
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
  ...overrides,
});

export * from '@testing-library/react';
export { customRender as render }; 