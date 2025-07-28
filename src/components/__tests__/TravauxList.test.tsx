import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/utils/test-utils';
import TravauxList from '../TravauxList';
import { useTravauxStore } from '../../store/travauxStore';
import { createMockTravail } from '../../test/utils/test-utils';

// Mock window.confirm
const mockConfirm = vi.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

describe('TravauxList', () => {
  beforeEach(() => {
    useTravauxStore.getState().setTravaux([]);
    useTravauxStore.getState().clearError();
    mockConfirm.mockClear();
  });

  it('should render empty state', () => {
    const mockOnSelectTravail = vi.fn();
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    expect(screen.getByText('Gestion des Travaux')).toBeInTheDocument();
    expect(screen.getByText('Nouveau Travail')).toBeInTheDocument();
    expect(screen.getByText('Aucun travail trouvé avec les filtres actuels')).toBeInTheDocument();
  });

  it('should render travaux list', () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1', responsable: 'User 1' }),
      createMockTravail({ id: '2', titre: 'Travail 2', responsable: 'User 2' }),
    ];

    useTravauxStore.getState().setTravaux(mockTravaux);
    const mockOnSelectTravail = vi.fn();
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    expect(screen.getByText('Travail 1')).toBeInTheDocument();
    expect(screen.getByText('Travail 2')).toBeInTheDocument();
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });

  it('should handle search functionality', () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Infrastructure Route', responsable: 'User 1' }),
      createMockTravail({ id: '2', titre: 'École Primaire', responsable: 'User 2' }),
    ];

    useTravauxStore.getState().setTravaux(mockTravaux);
    const mockOnSelectTravail = vi.fn();
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher...');
    fireEvent.change(searchInput, { target: { value: 'Infrastructure' } });
    
    expect(screen.getByText('Infrastructure Route')).toBeInTheDocument();
    expect(screen.queryByText('École Primaire')).not.toBeInTheDocument();
  });

  it('should handle status filter', () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1', statut: 'en_cours' }),
      createMockTravail({ id: '2', titre: 'Travail 2', statut: 'termine' }),
    ];

    useTravauxStore.getState().setTravaux(mockTravaux);
    const mockOnSelectTravail = vi.fn();
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    const statusSelect = screen.getByDisplayValue('Tous les statuts');
    fireEvent.change(statusSelect, { target: { value: 'en_cours' } });
    
    expect(screen.getByText('Travail 1')).toBeInTheDocument();
    expect(screen.queryByText('Travail 2')).not.toBeInTheDocument();
  });

  it('should handle type filter', () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1', type: 'infrastructure' }),
      createMockTravail({ id: '2', titre: 'Travail 2', type: 'education' }),
    ];

    useTravauxStore.getState().setTravaux(mockTravaux);
    const mockOnSelectTravail = vi.fn();
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    const typeSelect = screen.getByDisplayValue('Tous les types');
    fireEvent.change(typeSelect, { target: { value: 'infrastructure' } });
    
    expect(screen.getByText('Travail 1')).toBeInTheDocument();
    expect(screen.queryByText('Travail 2')).not.toBeInTheDocument();
  });

  it('should call onSelectTravail when clicking view button', () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1' }),
    ];

    useTravauxStore.getState().setTravaux(mockTravaux);
    const mockOnSelectTravail = vi.fn();
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    const viewButton = screen.getByLabelText('Voir le travail');
    fireEvent.click(viewButton);
    
    expect(mockOnSelectTravail).toHaveBeenCalledWith(mockTravaux[0]);
  });

  it('should handle delete travail with confirmation', () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1' }),
    ];

    useTravauxStore.getState().setTravaux(mockTravaux);
    mockConfirm.mockReturnValue(true);
    
    const mockOnSelectTravail = vi.fn();
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    const deleteButton = screen.getByLabelText('Supprimer le travail');
    fireEvent.click(deleteButton);
    
    expect(mockConfirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer ce travail ?');
    expect(useTravauxStore.getState().travaux).toHaveLength(0);
  });

  it('should not delete travail when user cancels', () => {
    const mockTravaux = [
      createMockTravail({ id: '1', titre: 'Travail 1' }),
    ];

    useTravauxStore.getState().setTravaux(mockTravaux);
    mockConfirm.mockReturnValue(false);
    
    const mockOnSelectTravail = vi.fn();
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    const deleteButton = screen.getByLabelText('Supprimer le travail');
    fireEvent.click(deleteButton);
    
    expect(useTravauxStore.getState().travaux).toHaveLength(1);
  });

  it('should show loading state', () => {
    useTravauxStore.getState().setLoading(true);
    const mockOnSelectTravail = vi.fn();
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show error state', () => {
    useTravauxStore.getState().setError('Test error message');
    useTravauxStore.getState().setLoading(false);
    const mockOnSelectTravail = vi.fn();
    render(<TravauxList onSelectTravail={mockOnSelectTravail} />);
    
    // Le composant ErrorMessage devrait afficher l'erreur
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });
}); 