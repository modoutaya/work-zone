import { useTravauxStore } from '../store/travauxStore';
import { Travail } from '../types';

// Hook to get works by status
export const useTravauxByStatus = (status: Travail['statut']) => {
  return useTravauxStore((state) => 
    state.travaux.filter(travail => travail.statut === status)
  );
};

// Hook to get works by zone
export const useTravauxByZone = (zoneId: string) => {
  return useTravauxStore((state) => 
    state.travaux.filter(travail => travail.zoneId === zoneId)
  );
};

// Hook to get works by type
export const useTravauxByType = (type: Travail['type']) => {
  return useTravauxStore((state) => 
    state.travaux.filter(travail => travail.type === type)
  );
};

// Hook to get a work by ID
export const useTravailById = (id: string) => {
  return useTravauxStore((state) => 
    state.travaux.find(travail => travail.id === id)
  );
}; 