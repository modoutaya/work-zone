import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mocks
vi.mock('../../../store/travauxStore', () => ({
  useTravauxStore: vi.fn((selector) => {
    const mockAddTravail = vi.fn();
    const mockUpdateTravail = vi.fn();
    
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

vi.mock('../../../hooks/useValidation', () => ({
  useFormValidation: vi.fn(() => ({
    formData: {},
    errors: {},
    isValidating: false,
    updateField: vi.fn(),
    validateForm: vi.fn(),
    resetForm: vi.fn(),
  })),
}));

import { TravailForm } from '../TravailForm';

describe('TravailForm', () => {
  beforeEach(() => {
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

  it('appelle onCancel quand on clique sur Annuler', () => {
    const onCancel = vi.fn();
    render(<TravailForm onCancel={onCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    fireEvent.click(cancelButton);
    
    expect(onCancel).toHaveBeenCalled();
  });

  it('affiche le bouton de soumission avec le bon texte', () => {
    render(<TravailForm />);
    
    const submitButton = screen.getByRole('button', { name: /créer/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('affiche le bouton de modification pour un travail existant', () => {
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
      historique: [],
      entreprise: '',
      commentaires: '',
    };
    
    render(<TravailForm travail={travail} />);
    
    const submitButton = screen.getByRole('button', { name: /modifier/i });
    expect(submitButton).toBeInTheDocument();
  });
}); 