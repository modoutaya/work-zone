import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TravailForm } from '../TravailForm';

// Mock du store
const mockAddTravail = vi.fn();
const mockUpdateTravail = vi.fn();

vi.mock('../../../store/travauxStore', () => ({
  useTravauxStore: vi.fn((selector) => {
    if (selector) {
      return selector({
        addTravail: mockAddTravail,
        updateTravail: mockUpdateTravail,
      });
    }
    return {
      addTravail: mockAddTravail,
      updateTravail: mockUpdateTravail,
      getState: () => ({
        addTravail: mockAddTravail,
        updateTravail: mockUpdateTravail,
        setTravaux: vi.fn(),
      }),
    };
  }),
}));

describe('TravailForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('rend le formulaire vide pour la création', () => {
    render(<TravailForm />);
    
    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/statut/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priorité/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/responsable/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date de début/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date de fin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/progression/i)).toBeInTheDocument();
  });

  it('affiche les erreurs de validation pour les champs requis', async () => {
    render(<TravailForm />);
    
    // Soumettre le formulaire vide
    const submitButton = screen.getByRole('button', { name: /créer/i });
    fireEvent.click(submitButton);
    
    // Vérifier que les erreurs s'affichent
    await waitFor(() => {
      expect(screen.getAllByText(/Invalid input: expected string, received undefined/i)).toHaveLength(6);
    });
  });

  it('valide les champs requis', async () => {
    render(<TravailForm />);
    
    const submitButton = screen.getByRole('button', { name: /créer/i });
    fireEvent.click(submitButton);
    
    // Vérifier que le formulaire ne soumet pas sans validation
    expect(mockAddTravail).not.toHaveBeenCalled();
  });

  it('soumet le formulaire avec des données valides', async () => {
    const onSuccess = vi.fn();
    render(<TravailForm onSuccess={onSuccess} />);
    
    // Remplir le formulaire avec des données valides
    fireEvent.change(screen.getByLabelText(/titre/i), { 
      target: { value: 'Test Travail' } 
    });
    fireEvent.change(screen.getByLabelText(/description/i), { 
      target: { value: 'Description détaillée du travail de test' } 
    });
    fireEvent.change(screen.getByLabelText(/zone/i), { 
      target: { value: '1' } 
    });
    fireEvent.change(screen.getByLabelText(/type/i), { 
      target: { value: 'infrastructure' } 
    });
    fireEvent.change(screen.getByLabelText(/statut/i), { 
      target: { value: 'planifie' } 
    });
    fireEvent.change(screen.getByLabelText(/priorité/i), { 
      target: { value: 'normale' } 
    });
    fireEvent.change(screen.getByLabelText(/budget/i), { 
      target: { value: '100000' } 
    });
    fireEvent.change(screen.getByLabelText(/responsable/i), { 
      target: { value: 'Test User' } 
    });
    fireEvent.change(screen.getByLabelText(/date de début/i), { 
      target: { value: '2024-01-01' } 
    });
    fireEvent.change(screen.getByLabelText(/date de fin/i), { 
      target: { value: '2024-12-31' } 
    });
    fireEvent.change(screen.getByLabelText(/progression/i), { 
      target: { value: '50' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /créer/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockAddTravail).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('pré-remplit le formulaire pour la modification', () => {
    const travail = {
      id: '1',
      titre: 'Travail existant',
      description: 'Description du travail existant',
      zoneId: '1',
      zone: {
        id: '1',
        nom: 'Paris',
        type: 'département' as const,
        code: '75',
      },
      type: 'infrastructure' as const,
      statut: 'en_cours' as const,
      priorite: 'normale' as const,
      budget: 100000,
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      progression: 50,
      responsable: 'Test User',
    };
    
    render(<TravailForm travail={travail} />);
    
    expect(screen.getByDisplayValue('Travail existant')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Description du travail existant')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50')).toBeInTheDocument();
  });

  it('appelle onCancel quand on clique sur Annuler', () => {
    const onCancel = vi.fn();
    render(<TravailForm onCancel={onCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    fireEvent.click(cancelButton);
    
    expect(onCancel).toHaveBeenCalled();
  });
}); 