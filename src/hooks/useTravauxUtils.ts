import { useTravauxStore } from '../store/travauxStore';
import { Travail } from '../types';

// Hook pour obtenir les travaux par statut
export const useTravauxByStatus = (status: Travail['statut']) => {
  return useTravauxStore((state) => 
    state.travaux.filter(travail => travail.statut === status)
  );
};

// Hook pour obtenir les travaux par zone
export const useTravauxByZone = (zoneId: string) => {
  return useTravauxStore((state) => 
    state.travaux.filter(travail => travail.zoneId === zoneId)
  );
};

// Hook pour obtenir les travaux par type
export const useTravauxByType = (type: Travail['type']) => {
  return useTravauxStore((state) => 
    state.travaux.filter(travail => travail.type === type)
  );
};

// Hook pour obtenir un travail par ID
export const useTravailById = (id: string) => {
  return useTravauxStore((state) => 
    state.travaux.find(travail => travail.id === id)
  );
}; 