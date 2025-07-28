import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTravauxStore } from '../../store/travauxStore';
import { Travail } from '../../types';

// Query keys for React Query
export const travailKeys = {
  all: ['travaux'] as const,
  lists: () => [...travailKeys.all, 'list'] as const,
  list: (filters: string) => [...travailKeys.lists(), { filters }] as const,
  details: () => [...travailKeys.all, 'detail'] as const,
  detail: (id: string) => [...travailKeys.details(), id] as const,
  stats: () => [...travailKeys.all, 'stats'] as const,
};

// Mock API functions (replace with real API calls)
const mockApi = {
  getTravaux: async (): Promise<Travail[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return useTravauxStore.getState().travaux;
  },

  getTravailById: async (id: string): Promise<Travail | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return useTravauxStore.getState().getTravailById(id);
  },

  createTravail: async (travail: Omit<Travail, 'id'>): Promise<Travail> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newTravail: Travail = {
      ...travail,
      id: Date.now().toString(),
      historique: [],
      entreprise: travail.entreprise || '',
      commentaires: travail.commentaires || '',
    };
    useTravauxStore.getState().addTravail(newTravail);
    return newTravail;
  },

  updateTravail: async (travail: Travail): Promise<Travail> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    useTravauxStore.getState().updateTravail(travail);
    return travail;
  },

  deleteTravail: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    useTravauxStore.getState().deleteTravail(id);
  },
};

// Hook to get all travaux with caching
export const useTravaux = () => {
  return useQuery({
    queryKey: travailKeys.lists(),
    queryFn: mockApi.getTravaux,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get travaux by status
export const useTravauxByStatus = (status: Travail['statut']) => {
  return useQuery({
    queryKey: travailKeys.list(`status:${status}`),
    queryFn: async () => {
      const travaux = await mockApi.getTravaux();
      return travaux.filter(travail => travail.statut === status);
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Hook to get travaux by zone
export const useTravauxByZone = (zoneId: string) => {
  return useQuery({
    queryKey: travailKeys.list(`zone:${zoneId}`),
    queryFn: async () => {
      const travaux = await mockApi.getTravaux();
      return travaux.filter(travail => travail.zoneId === zoneId);
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Hook to get a single travail
export const useTravail = (id: string) => {
  return useQuery({
    queryKey: travailKeys.detail(id),
    queryFn: () => mockApi.getTravailById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes for individual items
  });
};

// Hook to get travail statistics
export const useTravauxStats = () => {
  return useQuery({
    queryKey: travailKeys.stats(),
    queryFn: async () => {
      const travaux = await mockApi.getTravaux();
      return {
        totalTravaux: travaux.length,
        travauxEnCours: travaux.filter(t => t.statut === 'en_cours').length,
        travauxTermines: travaux.filter(t => t.statut === 'termine').length,
        budgetTotal: travaux.reduce((sum, t) => sum + t.budget, 0),
        progressionMoyenne: travaux.length > 0 
          ? Math.round(travaux.reduce((sum, t) => sum + t.progression, 0) / travaux.length)
          : 0,
        zonesActives: new Set(travaux.map(t => t.zoneId)).size,
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute for stats
  });
};

// Mutation hooks
export const useCreateTravail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.createTravail,
    onSuccess: (newTravail) => {
      // Invalidate and refetch travaux list
      queryClient.invalidateQueries({ queryKey: travailKeys.lists() });
      queryClient.invalidateQueries({ queryKey: travailKeys.stats() });
      
      // Add to cache immediately
      queryClient.setQueryData(travailKeys.detail(newTravail.id), newTravail);
    },
    onError: (error) => {
      console.error('Error creating travail:', error);
    },
  });
};

export const useUpdateTravail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.updateTravail,
    onSuccess: (updatedTravail) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: travailKeys.lists() });
      queryClient.invalidateQueries({ queryKey: travailKeys.stats() });
      
      // Update cache immediately
      queryClient.setQueryData(travailKeys.detail(updatedTravail.id), updatedTravail);
    },
    onError: (error) => {
      console.error('Error updating travail:', error);
    },
  });
};

export const useDeleteTravail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.deleteTravail,
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: travailKeys.lists() });
      queryClient.invalidateQueries({ queryKey: travailKeys.stats() });
      
      // Remove from cache
      queryClient.removeQueries({ queryKey: travailKeys.detail(deletedId) });
    },
    onError: (error) => {
      console.error('Error deleting travail:', error);
    },
  });
}; 