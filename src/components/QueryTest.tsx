import React from 'react';
import { useTravaux, useCreateTravail, useUpdateTravail, useDeleteTravail } from '../hooks/queries/useTravauxQueries';
import { Travail } from '../types';

const QueryTest: React.FC = () => {
  const { data: travaux, isLoading, error } = useTravaux();
  const createTravail = useCreateTravail();
  const updateTravail = useUpdateTravail();
  const deleteTravail = useDeleteTravail();

  const handleCreate = () => {
    const newTravail = {
      titre: 'Test Travail React Query',
      description: 'Travail créé via React Query',
      zoneId: '1',
      zone: {
        id: '1',
        nom: 'Paris',
        type: 'département' as const,
        code: '75',
      },
      type: 'infrastructure' as const,
      statut: 'planifie' as const,
      priorite: 'normale' as const,
      budget: 50000,
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      progression: 0,
      responsable: 'Test User',
      historique: [],
      entreprise: '',
      commentaires: '',
    };

    createTravail.mutate(newTravail);
  };

  const handleUpdate = (travail: Travail) => {
    const updatedTravail = {
      ...travail,
      progression: Math.min(travail.progression + 10, 100),
    };
    updateTravail.mutate(updatedTravail);
  };

  const handleDelete = (id: string) => {
    deleteTravail.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">React Query Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={handleCreate}
          disabled={createTravail.isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {createTravail.isPending ? 'Creating...' : 'Create Test Travail'}
        </button>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Travaux ({travaux?.length || 0})</h3>
          {travaux?.map((travail) => (
            <div key={travail.id} className="border p-4 rounded space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{travail.titre}</h4>
                <div className="space-x-2">
                  <button
                    onClick={() => handleUpdate(travail)}
                    disabled={updateTravail.isPending}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(travail.id)}
                    disabled={deleteTravail.isPending}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{travail.description}</p>
              <div className="text-sm">
                <span className="font-medium">Progression:</span> {travail.progression}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryTest; 