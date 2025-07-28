import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test/utils/test-utils';
import TravauxList from '../TravauxList';
import { createMockTravail, resetStores } from '../../test/utils/test-utils';
import { mockApi } from '../../lib/api/mock/mockApi';

// Mock confirm dialog
const mockConfirm = vi.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

describe('TravauxList', () => {
  const mockOnSelectTravail = vi.fn();

  beforeEach(() => {
    // Reset stores and mock API
    resetStores();
    mockApi.reset();
    mockConfirm.mockClear();
    mockOnSelectTravail.mockClear();
  });

  it('should render empty state', async () => {
    // Set empty data
    mockApi.setTravaux([]);
    
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    // Wait for React Query to resolve
    await waitFor(() => {
      expect(screen.getByText('Gestion des Travaux')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Nouveau Travail')).toBeInTheDocument();
    expect(screen.getByText('Aucun travail trouvé avec les filtres actuels')).toBeInTheDocument();
  });

  it('should render travaux list', async () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1', responsable: 'User 1' }),
      createMockTravail({ id: '2', titre: 'Travail 2', responsable: 'User 2' }),
    ];

    mockApi.setTravaux(mockTravaux);
    
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    // Wait for React Query to resolve
    await waitFor(() => {
      expect(screen.getByText('Gestion des Travaux')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Travail 1')).toBeInTheDocument();
    expect(screen.getByText('Travail 2')).toBeInTheDocument();
    expect(screen.getByText('User 1')).toBeInTheDocument();
  });

  it('should handle search functionality', async () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Infrastructure Route', type: 'infrastructure' }),
      createMockTravail({ id: '2', titre: 'Transport Bus', type: 'transport' }),
    ];

    mockApi.setTravaux(mockTravaux);
    
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    // Wait for React Query to resolve
    await waitFor(() => {
      expect(screen.getByText('Gestion des Travaux')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Rechercher...');
    fireEvent.change(searchInput, { target: { value: 'Infrastructure' } });
    
    expect(screen.getByText('Infrastructure Route')).toBeInTheDocument();
    expect(screen.queryByText('Transport Bus')).not.toBeInTheDocument();
  });

  it('should handle status filter', async () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1', statut: 'en_cours' }),
      createMockTravail({ id: '2', titre: 'Travail 2', statut: 'termine' }),
    ];

    mockApi.setTravaux(mockTravaux);
    
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    // Wait for React Query to resolve
    await waitFor(() => {
      expect(screen.getByText('Gestion des Travaux')).toBeInTheDocument();
    });
    
    // Both travaux should be visible initially
    expect(screen.getByText('Travail 1')).toBeInTheDocument();
    expect(screen.getByText('Travail 2')).toBeInTheDocument();
    
    const statusSelect = screen.getByDisplayValue('Tous les statuts');
    fireEvent.change(statusSelect, { target: { value: 'en_cours' } });
    
    // Should show only en_cours travaux
    expect(screen.getByText('Travail 1')).toBeInTheDocument();
    expect(screen.queryByText('Travail 2')).not.toBeInTheDocument();
  });

  it('should handle type filter', async () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1', type: 'infrastructure' }),
      createMockTravail({ id: '2', titre: 'Travail 2', type: 'transport' }),
    ];

    mockApi.setTravaux(mockTravaux);
    
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    // Wait for React Query to resolve
    await waitFor(() => {
      expect(screen.getByText('Gestion des Travaux')).toBeInTheDocument();
    });
    
    // Both travaux should be visible initially
    expect(screen.getByText('Travail 1')).toBeInTheDocument();
    expect(screen.getByText('Travail 2')).toBeInTheDocument();
    
    const typeSelect = screen.getByDisplayValue('Tous les types');
    fireEvent.change(typeSelect, { target: { value: 'infrastructure' } });
    
    // Should show only infrastructure travaux
    expect(screen.getByText('Travail 1')).toBeInTheDocument();
    expect(screen.queryByText('Travail 2')).not.toBeInTheDocument();
  });

  it('should call onSelectTravail when clicking view button', async () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1' }),
    ];

    mockApi.setTravaux(mockTravaux);
    
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    // Wait for React Query to resolve
    await waitFor(() => {
      expect(screen.getByText('Gestion des Travaux')).toBeInTheDocument();
    });
    
    const viewButton = screen.getByLabelText('Voir le travail');
    fireEvent.click(viewButton);
    
    expect(mockOnSelectTravail).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      titre: 'Travail 1',
    }));
  });

  it('should handle delete travail with confirmation', async () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1' }),
    ];

    mockApi.setTravaux(mockTravaux);
    mockConfirm.mockReturnValue(true); // User confirms deletion
    
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    // Wait for React Query to resolve
    await waitFor(() => {
      expect(screen.getByText('Gestion des Travaux')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByLabelText('Supprimer le travail');
    fireEvent.click(deleteButton);
    
    expect(mockConfirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer ce travail ?');
  });

  it.skip('should show confirmation dialog when deleting travail', async () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1' }),
    ];

    mockApi.setTravaux(mockTravaux);
    mockConfirm.mockReturnValue(false); // User cancels deletion
    
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    // Wait for React Query to resolve
    await waitFor(() => {
      expect(screen.getByText('Gestion des Travaux')).toBeInTheDocument();
    });
    
    // Wait for the travail to be visible
    await waitFor(() => {
      expect(screen.getByText('Travail 1')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByLabelText('Supprimer le travail');
    fireEvent.click(deleteButton);
    
    // Should show confirmation dialog
    expect(mockConfirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer ce travail ?');
  });

  it('should show error state', async () => {
    // Mock API to throw error
    mockApi.setShouldFail(true);
    
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });
}); 