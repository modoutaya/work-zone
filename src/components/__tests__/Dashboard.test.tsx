import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils/test-utils';
import Dashboard from '../Dashboard';
import { createMockTravail, resetStores } from '../../test/utils/test-utils';
import { mockApi } from '../../lib/api/mock/mockApi';

describe('Dashboard', () => {
  beforeEach(() => {
    // Reset stores and mock API
    resetStores();
    mockApi.reset();
  });

  it('should render dashboard with empty state', async () => {
    // Set empty data for this test
    mockApi.setTravaux([]);
    
    render(<Dashboard />);
    
    // Wait for React Query to resolve
    await waitFor(() => {
      expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Total Travaux')).toBeInTheDocument();
    // Vérifier qu'il y a au moins un élément avec "0"
    expect(screen.getAllByText('0')).toHaveLength(4); // Total, En cours, Terminés, Zones
  });

  it('should render dashboard with travaux data', async () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1', progression: 50 }),
      createMockTravail({ id: '2', titre: 'Travail 2', progression: 75 }),
      createMockTravail({ id: '3', titre: 'Travail 3', progression: 100, statut: 'termine' }),
    ];

    // Mock the API response
    mockApi.setTravaux(mockTravaux);

    render(<Dashboard />);
    
    // Wait for React Query to resolve
    await waitFor(() => {
      expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
    });
    
    // Vérifier les statistiques - il peut y avoir plusieurs éléments avec les mêmes valeurs
    expect(screen.getAllByText('3')).toHaveLength(1); // Total travaux
    expect(screen.getAllByText('1')).toHaveLength(2); // Travaux terminés - peut être multiple
    expect(screen.getAllByText('2')).toHaveLength(1); // Travaux en cours
  });

  it('should show loading state', async () => {
    render(<Dashboard />);
    
    // Initially should show loading
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
    });
  });

  it('should show error state', async () => {
    // Mock API to throw error
    mockApi.setShouldFail(true);

    render(<Dashboard />);
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });

  it('should calculate statistics correctly', async () => {
    const mockTravaux = [
      createMockTravail({ id: '1', budget: 100000, progression: 50, statut: 'en_cours' }),
      createMockTravail({ id: '2', budget: 200000, progression: 75, statut: 'en_cours' }),
      createMockTravail({ id: '3', budget: 150000, progression: 100, statut: 'termine' }),
    ];

    // Mock the API response
    mockApi.setTravaux(mockTravaux);

    render(<Dashboard />);
    
    // Wait for React Query to resolve
    await waitFor(() => {
      expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
    });
    
    // Vérifier les statistiques calculées - il peut y avoir plusieurs éléments avec les mêmes valeurs
    expect(screen.getAllByText('3')).toHaveLength(1); // Total travaux
    expect(screen.getAllByText('2')).toHaveLength(1); // Travaux en cours
    expect(screen.getAllByText('1')).toHaveLength(2); // Travaux terminés - peut être multiple
    // Le format de la monnaie peut varier selon la locale
    expect(screen.getByText(/450.*000.*€/)).toBeInTheDocument(); // Budget total
  });
}); 