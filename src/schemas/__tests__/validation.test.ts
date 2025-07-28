import { describe, it, expect } from 'vitest';
import { 
  ZoneSchema, 
  TravailSchema, 
  CreateTravailSchema,
  validateTravail,
  validateCreateTravail,
  validateDateRange,
  validateBudget
} from '../validation';

describe('Validation Schemas', () => {
  describe('ZoneSchema', () => {
    it('valide une zone correcte', () => {
      const validZone = {
        id: '1',
        nom: 'Paris',
        type: 'département' as const,
        code: '75',
        population: 2161000,
        superficie: 105,
      };

      const result = ZoneSchema.parse(validZone);
      expect(result).toEqual(validZone);
    });

    it('rejette une zone avec nom trop court', () => {
      const invalidZone = {
        id: '1',
        nom: 'P', // Trop court
        type: 'département' as const,
        code: '75',
      };

      expect(() => ZoneSchema.parse(invalidZone)).toThrow();
    });

    it('rejette un type de zone invalide', () => {
      const invalidZone = {
        id: '1',
        nom: 'Paris',
        type: 'invalid' as any,
        code: '75',
      };

      expect(() => ZoneSchema.parse(invalidZone)).toThrow();
    });
  });

  describe('TravailSchema', () => {
    const validTravail = {
      id: '1',
      titre: 'Test Travail',
      description: 'Description détaillée du travail de test',
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
      entreprise: 'Test Entreprise',
      commentaires: 'Commentaires de test',
    };

    it('valide un travail correct', () => {
      const result = TravailSchema.parse(validTravail);
      expect(result).toEqual(validTravail);
    });

    it('rejette un titre trop court', () => {
      const invalidTravail = {
        ...validTravail,
        titre: 'T', // Trop court
      };

      expect(() => TravailSchema.parse(invalidTravail)).toThrow();
    });

    it('rejette une description trop courte', () => {
      const invalidTravail = {
        ...validTravail,
        description: 'Court', // Trop court
      };

      expect(() => TravailSchema.parse(invalidTravail)).toThrow();
    });

    it('rejette un budget négatif', () => {
      const invalidTravail = {
        ...validTravail,
        budget: -1000,
      };

      expect(() => TravailSchema.parse(invalidTravail)).toThrow();
    });

    it('rejette une progression invalide', () => {
      const invalidTravail = {
        ...validTravail,
        progression: 150, // > 100
      };

      expect(() => TravailSchema.parse(invalidTravail)).toThrow();
    });

    it('rejette un format de date invalide', () => {
      const invalidTravail = {
        ...validTravail,
        dateDebut: 'invalid-date',
      };

      expect(() => TravailSchema.parse(invalidTravail)).toThrow();
    });

    it('rejette un type de travail invalide', () => {
      const invalidTravail = {
        ...validTravail,
        type: 'invalid' as any,
      };

      expect(() => TravailSchema.parse(invalidTravail)).toThrow();
    });

    it('rejette un statut invalide', () => {
      const invalidTravail = {
        ...validTravail,
        statut: 'invalid' as any,
      };

      expect(() => TravailSchema.parse(invalidTravail)).toThrow();
    });

    it('rejette une priorité invalide', () => {
      const invalidTravail = {
        ...validTravail,
        priorite: 'invalid' as any,
      };

      expect(() => TravailSchema.parse(invalidTravail)).toThrow();
    });
  });

  describe('CreateTravailSchema', () => {
    const validCreateTravail = {
      titre: 'Test Travail',
      description: 'Description détaillée du travail de test',
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
    };

    it('valide un travail de création correct', () => {
      const result = CreateTravailSchema.parse(validCreateTravail);
      expect(result).toEqual(validCreateTravail);
    });

    it('permet un ID optionnel', () => {
      const travailWithId = {
        ...validCreateTravail,
        id: 'optional-id',
      };

      const result = CreateTravailSchema.parse(travailWithId);
      expect(result).toEqual(travailWithId);
    });

    it('permet des champs optionnels', () => {
      const travailWithOptionals = {
        ...validCreateTravail,
        entreprise: 'Test Entreprise',
        commentaires: 'Commentaires de test',
      };

      const result = CreateTravailSchema.parse(travailWithOptionals);
      expect(result).toEqual(travailWithOptionals);
    });
  });

  describe('Validation Functions', () => {
    describe('validateTravail', () => {
      it('valide un travail correct', () => {
        const validTravail = {
          id: '1',
          titre: 'Test Travail',
          description: 'Description détaillée du travail de test',
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

        const result = validateTravail(validTravail);
        expect(result).toEqual(validTravail);
      });

      it('lance une erreur pour un travail invalide', () => {
        const invalidTravail = {
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
          budget: -1000,
          dateDebut: 'invalid-date',
          dateFin: 'invalid-date',
          progression: 150,
          responsable: '',
          historique: [],
        };

        expect(() => validateTravail(invalidTravail)).toThrow();
      });
    });

    describe('validateCreateTravail', () => {
      it('valide un travail de création correct', () => {
        const validCreateTravail = {
          titre: 'Test Travail',
          description: 'Description détaillée du travail de test',
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
        };

        const result = validateCreateTravail(validCreateTravail);
        expect(result).toEqual(validCreateTravail);
      });
    });

    describe('validateDateRange', () => {
      it('valide une plage de dates correcte', () => {
        expect(validateDateRange('2024-01-01', '2024-12-31')).toBe(true);
        expect(validateDateRange('2024-01-01', '2024-01-01')).toBe(true); // Même jour
      });

      it('rejette une plage de dates invalide', () => {
        expect(validateDateRange('2024-12-31', '2024-01-01')).toBe(false);
      });
    });

    describe('validateBudget', () => {
      it('valide un budget correct', () => {
        expect(validateBudget(0)).toBe(true);
        expect(validateBudget(100000)).toBe(true);
        expect(validateBudget(1000000000)).toBe(true); // Limite max
      });

      it('rejette un budget invalide', () => {
        expect(validateBudget(-1000)).toBe(false);
        expect(validateBudget(1000000001)).toBe(false); // Au-dessus de la limite
      });
    });
  });
}); 