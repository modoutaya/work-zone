import { useAppStore } from '../store/appStore';
import { useTravauxStore } from '../store/travauxStore';

// Hook pour l'état de navigation
export const useNavigation = () => {
  const activeTab = useAppStore((state) => state.activeTab);
  const selectedTravailId = useAppStore((state) => state.selectedTravailId);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setSelectedTravailId = useAppStore((state) => state.setSelectedTravailId);
  const resetNavigation = useAppStore((state) => state.resetNavigation);

  return {
    activeTab,
    selectedTravailId,
    setActiveTab,
    setSelectedTravailId,
    resetNavigation,
  };
};

// Hook pour l'état UI global
export const useUI = () => {
  const isLoading = useAppStore((state) => state.isLoading);
  const error = useAppStore((state) => state.error);
  const setLoading = useAppStore((state) => state.setLoading);
  const setError = useAppStore((state) => state.setError);

  return {
    isLoading,
    error,
    setLoading,
    setError,
  };
};

// Hook pour les travaux - sélecteurs atomiques
export const useTravaux = () => {
  const travaux = useTravauxStore((state) => state.travaux);
  const loading = useTravauxStore((state) => state.loading);
  const error = useTravauxStore((state) => state.error);
  const addTravail = useTravauxStore((state) => state.addTravail);
  const updateTravail = useTravauxStore((state) => state.updateTravail);
  const deleteTravail = useTravauxStore((state) => state.deleteTravail);
  const selectTravail = useTravauxStore((state) => state.selectTravail);
  const getTravailById = useTravauxStore((state) => state.getTravailById);
  const clearError = useTravauxStore((state) => state.clearError);

  return {
    travaux,
    loading,
    error,
    addTravail,
    updateTravail,
    deleteTravail,
    selectTravail,
    getTravailById,
    clearError,
  };
};

 