import { useState, useMemo } from 'react';
import { travaux as mockTravaux } from '../data/mockData';
import { Travail } from '../types';

interface UseTravaux {
  travaux: Travail[];
  loading: boolean;
  error: string | null;
  addTravail: (travail: Omit<Travail, 'id'>) => void;
  updateTravail: (id: string, updates: Partial<Travail>) => void;
  deleteTravail: (id: string) => void;
  getTravailById: (id: string) => Travail | undefined;
}

export function useTravaux(): UseTravaux {
  const [travaux, setTravaux] = useState<Travail[]>(mockTravaux);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTravail = (newTravail: Omit<Travail, 'id'>) => {
    try {
      const travail: Travail = {
        ...newTravail,
        id: Date.now().toString(),
      };
      setTravaux(prev => [...prev, travail]);
    } catch (err) {
      setError('Erreur lors de l\'ajout du travail');
      console.error('Error adding travail:', err);
    }
  };

  const updateTravail = (id: string, updates: Partial<Travail>) => {
    try {
      setTravaux(prev => 
        prev.map(travail => 
          travail.id === id ? { ...travail, ...updates } : travail
        )
      );
    } catch (err) {
      setError('Erreur lors de la mise à jour du travail');
      console.error('Error updating travail:', err);
    }
  };

  const deleteTravail = (id: string) => {
    try {
      setTravaux(prev => prev.filter(travail => travail.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du travail');
      console.error('Error deleting travail:', err);
    }
  };

  const getTravailById = useMemo(() => {
    return (id: string) => travaux.find(travail => travail.id === id);
  }, [travaux]);

  return {
    travaux,
    loading,
    error,
    addTravail,
    updateTravail,
    deleteTravail,
    getTravailById,
  };
}