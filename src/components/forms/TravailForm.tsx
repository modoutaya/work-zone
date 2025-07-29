import React from 'react';
import { useFormValidation } from '../../hooks/useValidation';
import { CreateTravailSchema, type CreateTravail } from '../../schemas/validation';
import { useTravauxStore } from '../../store/travauxStore';
import { sanitizeInput, sanitizeObject } from '../../utils/security';
import type { Travail } from '../../types';

interface TravailFormProps {
  travail?: Travail;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TravailForm: React.FC<TravailFormProps> = ({ 
  travail, 
  onSuccess, 
  onCancel 
}) => {
  const {
    formData,
    errors,
    isValidating,
    updateField,
    validateForm,
    resetForm,
  } = useFormValidation(CreateTravailSchema);

  const addTravail = useTravauxStore((state) => state.addTravail);
  const updateTravail = useTravauxStore((state) => state.updateTravail);

  React.useEffect(() => {
    if (travail) {
      // Pré-remplir le formulaire si on modifie un travail existant
      Object.entries(travail).forEach(([key, value]) => {
        updateField(key as keyof CreateTravail, value);
      });
    }
  }, [travail, updateField]);

  const handleInputChange = (field: keyof CreateTravail, value: string | number) => {
    // Sanitize string inputs
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    updateField(field, sanitizedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = validateForm();
    
    if (result.isValid && result.data) {
      try {
        // Sanitize all data before submission
        const sanitizedData = sanitizeObject(result.data);
        
        if (travail?.id) {
          // Create complete Travail object for updateTravail
          const updatedTravail: Travail = {
            ...travail,
            ...sanitizedData,
            id: travail.id,
            historique: travail.historique || [],
            zone: travail.zone,
          };
          await updateTravail(updatedTravail);
        } else {
          const newTravailData = {
            titre: sanitizedData.titre,
            description: sanitizedData.description,
            zoneId: sanitizedData.zoneId,
            zone: {
              id: sanitizedData.zoneId,
              nom: 'Zone par défaut',
              type: 'département' as const,
              code: sanitizedData.zoneId,
            },
            type: sanitizedData.type,
            statut: sanitizedData.statut,
            priorite: sanitizedData.priorite,
            budget: sanitizedData.budget,
            dateDebut: sanitizedData.dateDebut,
            dateFin: sanitizedData.dateFin,
            progression: sanitizedData.progression,
            responsable: sanitizedData.responsable,
            historique: [],
            entreprise: sanitizedData.entreprise || '',
            commentaires: sanitizedData.commentaires || '',
          };
          await addTravail(newTravailData);
        }
        
        resetForm();
        onSuccess?.();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Titre */}
        <div className="md:col-span-2">
          <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-2">
            Titre *
          </label>
          <input
            type="text"
            id="titre"
            value={formData.titre || ''}
            onChange={(e) => handleInputChange('titre', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.titre ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Titre du travail"
            maxLength={100}
            required
          />
          {errors.titre && (
            <p className="mt-1 text-sm text-red-600">{errors.titre}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Description détaillée du travail"
            maxLength={500}
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Zone */}
        <div>
          <label htmlFor="zoneId" className="block text-sm font-medium text-gray-700 mb-2">
            Zone *
          </label>
          <select
            id="zoneId"
            value={formData.zoneId || ''}
            onChange={(e) => handleInputChange('zoneId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.zoneId ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Sélectionner une zone</option>
            <option value="1">Paris (75)</option>
            <option value="2">Lyon (69)</option>
            <option value="3">Marseille (13)</option>
          </select>
          {errors.zoneId && (
            <p className="mt-1 text-sm text-red-600">{errors.zoneId}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            id="type"
            value={formData.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Sélectionner un type</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="transport">Transport</option>
            <option value="energie">Énergie</option>
            <option value="eau">Eau</option>
            <option value="education">Éducation</option>
            <option value="sante">Santé</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>

        {/* Statut */}
        <div>
          <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-2">
            Statut *
          </label>
          <select
            id="statut"
            value={formData.statut || ''}
            onChange={(e) => handleInputChange('statut', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.statut ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Sélectionner un statut</option>
            <option value="planifie">Planifié</option>
            <option value="en_cours">En cours</option>
            <option value="suspendu">Suspendu</option>
            <option value="termine">Terminé</option>
            <option value="annule">Annulé</option>
          </select>
          {errors.statut && (
            <p className="mt-1 text-sm text-red-600">{errors.statut}</p>
          )}
        </div>

        {/* Priorité */}
        <div>
          <label htmlFor="priorite" className="block text-sm font-medium text-gray-700 mb-2">
            Priorité *
          </label>
          <select
            id="priorite"
            value={formData.priorite || ''}
            onChange={(e) => handleInputChange('priorite', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.priorite ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Sélectionner une priorité</option>
            <option value="basse">Basse</option>
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
            <option value="urgente">Urgente</option>
          </select>
          {errors.priorite && (
            <p className="mt-1 text-sm text-red-600">{errors.priorite}</p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Budget (€) *
          </label>
          <input
            type="number"
            id="budget"
            min="0"
            step="1000"
            value={formData.budget || ''}
            onChange={(e) => handleInputChange('budget', Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.budget ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
            required
          />
          {errors.budget && (
            <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
          )}
        </div>

        {/* Responsable */}
        <div>
          <label htmlFor="responsable" className="block text-sm font-medium text-gray-700 mb-2">
            Responsable *
          </label>
          <input
            type="text"
            id="responsable"
            value={formData.responsable || ''}
            onChange={(e) => handleInputChange('responsable', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.responsable ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nom du responsable"
            maxLength={50}
            required
          />
          {errors.responsable && (
            <p className="mt-1 text-sm text-red-600">{errors.responsable}</p>
          )}
        </div>

        {/* Date de début */}
        <div>
          <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700 mb-2">
            Date de début *
          </label>
          <input
            type="date"
            id="dateDebut"
            value={formData.dateDebut || ''}
            onChange={(e) => handleInputChange('dateDebut', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dateDebut ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.dateDebut && (
            <p className="mt-1 text-sm text-red-600">{errors.dateDebut}</p>
          )}
        </div>

        {/* Date de fin */}
        <div>
          <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700 mb-2">
            Date de fin *
          </label>
          <input
            type="date"
            id="dateFin"
            value={formData.dateFin || ''}
            onChange={(e) => handleInputChange('dateFin', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dateFin ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.dateFin && (
            <p className="mt-1 text-sm text-red-600">{errors.dateFin}</p>
          )}
        </div>

        {/* Progression */}
        <div>
          <label htmlFor="progression" className="block text-sm font-medium text-gray-700 mb-2">
            Progression (%) *
          </label>
          <input
            type="number"
            id="progression"
            min="0"
            max="100"
            step="5"
            value={formData.progression || ''}
            onChange={(e) => handleInputChange('progression', Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.progression ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
            required
          />
          {errors.progression && (
            <p className="mt-1 text-sm text-red-600">{errors.progression}</p>
          )}
        </div>
      </div>

      {/* Erreur générale */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Boutons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isValidating}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? 'Validation...' : (travail?.id ? 'Modifier' : 'Créer')}
        </button>
      </div>
    </form>
  );
}; 