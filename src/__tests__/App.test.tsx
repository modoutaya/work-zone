import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/utils/test-utils';
import App from '../App';
import { resetStores } from '../test/utils/test-utils';
import { mockApi } from '../lib/api/mock/mockApi';

describe('App Integration', () => {
  beforeEach(() => {
    resetStores();
    mockApi.reset();
  });

  it('should render app with dashboard by default', async () => {
    render(<App />);
    
    expect(screen.getByText('Suivi Travaux')).toBeInTheDocument();
    
    // Wait for lazy loaded dashboard to appear
    await waitFor(() => {
      expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText('Gestion des zones')).toBeInTheDocument();
  });

  it('should navigate between tabs', async () => {
    render(<App />);
    
    // Wait for initial dashboard to load
    await waitFor(() => {
      expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click on Travaux tab
    const travauxTab = screen.getByText('Travaux');
    fireEvent.click(travauxTab);
    
    // Wait for TravauxList to load
    await waitFor(() => {
      expect(screen.getByText('Gestion des Travaux')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click on Zones tab
    const zonesTab = screen.getByText('Zones');
    fireEvent.click(zonesTab);
    
    // Wait for ZonesList to load
    await waitFor(() => {
      expect(screen.getByText('Gestion des Zones')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click back on Dashboard
    const dashboardTab = screen.getByText('Tableau de bord');
    fireEvent.click(dashboardTab);
    
    // Wait for Dashboard to load again
    await waitFor(() => {
      expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show loading state when store is loading', async () => {
    render(<App />);
    
    // Initially should show loading
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show error state when store has error', async () => {
    // Mock API to throw error
    mockApi.setShouldFail(true);
    
    render(<App />);
    
    // Wait for error to appear after lazy loading
    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
}); 