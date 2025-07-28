import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../test/utils/test-utils';
import App from '../App';
import { useAppStore } from '../store/appStore';
import { useTravauxStore } from '../store/travauxStore';

describe('App Integration', () => {
  beforeEach(() => {
    useAppStore.getState().resetApp();
    useTravauxStore.getState().setTravaux([]);
  });

  it('should render app with dashboard by default', () => {
    render(<App />);
    
    expect(screen.getByText('Suivi Travaux')).toBeInTheDocument();
    expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
    expect(screen.getByText('Gestion des zones')).toBeInTheDocument();
  });

  it('should navigate between tabs', () => {
    render(<App />);
    
    // Click on Travaux tab
    const travauxTab = screen.getByText('Travaux');
    fireEvent.click(travauxTab);
    
    expect(screen.getByText('Gestion des Travaux')).toBeInTheDocument();
    
    // Click on Zones tab
    const zonesTab = screen.getByText('Zones');
    fireEvent.click(zonesTab);
    
    expect(screen.getByText('Gestion des Zones')).toBeInTheDocument();
    
    // Click back on Dashboard
    const dashboardTab = screen.getByText('Tableau de bord');
    fireEvent.click(dashboardTab);
    
    expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
  });

  it('should show loading state when store is loading', () => {
    useTravauxStore.getState().setLoading(true);
    render(<App />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show error state when store has error', () => {
    useTravauxStore.getState().setError('Test error');
    useTravauxStore.getState().setLoading(false);
    render(<App />);
    
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
}); 