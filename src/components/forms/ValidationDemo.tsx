import React, { useState } from 'react';
import { TravailForm } from './TravailForm';
import { validateTravail } from '../../schemas/validation';

export const ValidationDemo: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [validationResult, setValidationResult] = useState<string>('');

  const testValidation = () => {
    const testData = {
      id: '1',
      titre: 'Test',
      description: 'Description de test',
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
    };

    try {
      const validatedData = validateTravail(testData);
      setValidationResult(`✅ Validation réussie: ${JSON.stringify(validatedData, null, 2)}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setValidationResult(`❌ Erreur de validation: ${errorMessage}`);
    }
  };

  const testInvalidData = () => {
    const invalidData = {
      id: '',
      titre: 'T', // Trop court
      description: 'Court', // Trop court
      zoneId: '',
      zone: {
        id: '',
        nom: '',
        type: 'invalid' as any,
        code: '',
      },
      type: 'invalid' as any,
      statut: 'invalid' as any,
      priorite: 'invalid' as any,
      budget: -1000, // Négatif
      dateDebut: 'invalid-date',
      dateFin: 'invalid-date',
      progression: 150, // > 100
      responsable: '',
      historique: [],
    };

    try {
      validateTravail(invalidData);
      setValidationResult('❌ La validation aurait dû échouer');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setValidationResult(`✅ Erreurs détectées correctement: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Démonstration Validation Zod
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tests de validation */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Tests de Validation
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={testValidation}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Tester Validation Valide
              </button>
              
              <button
                onClick={testInvalidData}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Tester Données Invalides
              </button>
              
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {showForm ? 'Masquer' : 'Afficher'} Formulaire
              </button>
            </div>

            {validationResult && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Résultat:</h3>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {validationResult}
                </pre>
              </div>
            )}
          </div>

          {/* Informations sur Zod */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              Avantages de Zod
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>✅ <strong>Type Safety:</strong> Validation et inférence de types</li>
              <li>✅ <strong>Runtime Validation:</strong> Validation des données à l'exécution</li>
              <li>✅ <strong>Error Messages:</strong> Messages d'erreur personnalisables</li>
              <li>✅ <strong>Schema Composition:</strong> Réutilisation et composition des schémas</li>
              <li>✅ <strong>Transformations:</strong> Transformation automatique des données</li>
              <li>✅ <strong>Performance:</strong> Validation rapide et efficace</li>
            </ul>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Formulaire avec Validation
          </h2>
          
          {showForm ? (
            <TravailForm
              onSuccess={() => {
                setValidationResult('✅ Travail créé avec succès !');
              }}
              onCancel={() => {
                setShowForm(false);
                setValidationResult('❌ Création annulée');
              }}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              Cliquez sur "Afficher Formulaire" pour tester la validation en temps réel
            </div>
          )}
        </div>
      </div>

      {/* Exemples de schémas */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Exemples de Schémas Zod
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Validation de Base</h3>
            <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Validation de chaîne
z.string().min(3, "Trop court")
  .max(100, "Trop long")

// Validation de nombre
z.number().min(0, "Doit être positif")
  .max(100, "Doit être ≤ 100")

// Validation d'énumération
z.enum(['actif', 'inactif'])
  .default('actif')`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Validation Complexe</h3>
            <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Validation d'objet
z.object({
  email: z.string().email(),
  age: z.number().min(18),
  preferences: z.array(z.string())
})

// Validation conditionnelle
z.object({
  type: z.enum(['user', 'admin']),
  permissions: z.array(z.string())
    .optional()
    .refine(val => {
      return val !== undefined || type === 'admin'
    })`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}; 