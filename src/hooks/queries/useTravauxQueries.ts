import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Travail } from '../../types';
import { TravauxService } from '../../lib/api/services/travauxService';

// Query keys for React Query
export const travailKeys = {
  all: ['travaux'] as const,
  lists: () => [...travailKeys.all, 'list'] as const,
  list: (filters: string) => [...travailKeys.lists(), { filters }] as const,
  details: () => [...travailKeys.all, 'detail'] as const,
  detail: (id: string) => [...travailKeys.details(), id] as const,
  stats: () => [...travailKeys.all, 'stats'] as const,
};

// Hook to get all travaux with caching
export const useTravaux = () => {
  return useQuery({
    queryKey: travailKeys.lists(),
    queryFn: () => TravauxService.getTravaux(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get travaux by status
export const useTravauxByStatus = (status: Travail['statut']) => {
  return useQuery({
    queryKey: travailKeys.list(`status:${status}`),
    queryFn: () => TravauxService.getTravauxByStatus(status),
    staleTime: 2 * 60 * 1000,
  });
};

// Hook to get travaux by zone
export const useTravauxByZone = (zoneId: string) => {
  return useQuery({
    queryKey: travailKeys.list(`zone:${zoneId}`),
    queryFn: () => TravauxService.getTravauxByZone(zoneId),
    staleTime: 2 * 60 * 1000,
  });
};

// Hook to get a single travail
export const useTravail = (id: string) => {
  return useQuery({
    queryKey: travailKeys.detail(id),
    queryFn: () => TravauxService.getTravailById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes for individual items
  });
};

// Hook to get travail statistics
export const useTravauxStats = () => {
  return useQuery({
    queryKey: travailKeys.stats(),
    queryFn: () => TravauxService.getTravauxStats(),
    staleTime: 1 * 60 * 1000, // 1 minute for stats
  });
};

// Mutation hooks
export const useCreateTravail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (travail: Omit<Travail, 'id'>) => TravauxService.createTravail(travail),
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
    mutationFn: ({ id, ...updates }: { id: string } & Partial<Travail>) => 
      TravauxService.updateTravail(id, updates),
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
    mutationFn: (id: string) => TravauxService.deleteTravail(id),
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