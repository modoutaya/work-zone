# Architecture Zustand - Gestion d'État Global

## Vue d'ensemble

Ce projet utilise **Zustand** comme solution de gestion d'état global, remplaçant l'utilisation de `useState` local pour une meilleure scalabilité et maintenabilité.

## Structure des Stores

### 1. AppStore (`src/store/appStore.ts`)
Gère l'état global de l'application :
- **Navigation** : `activeTab`, `selectedTravailId`
- **UI State** : `isLoading`, `error`
- **Actions** : `setActiveTab`, `setSelectedTravailId`, `setLoading`, `setError`

### 2. TravauxStore (`src/store/travauxStore.ts`)
Gère l'état des travaux :
- **Data** : `travaux`, `selectedTravail`
- **UI State** : `loading`, `error`
- **Actions** : CRUD operations, computed values
- **Computed** : `getTravauxByStatus`, `getTravauxByZone`, `getTravauxByType`

## Hooks Personnalisés (`src/hooks/useApp.ts`)

### useNavigation()
```typescript
const { activeTab, selectedTravailId, setActiveTab, setSelectedTravailId } = useNavigation();
```

### useUI()
```typescript
const { isLoading, error, setLoading, setError } = useUI();
```

### useTravaux()
```typescript
const { travaux, loading, error, addTravail, updateTravail, deleteTravail } = useTravaux();
```

### useTravauxStats()
```typescript
const { totalTravaux, travauxEnCours, budgetTotal, progressionMoyenne } = useTravauxStats();
```

## Avantages de cette Architecture

### ✅ **Performance**
- Sélecteurs optimisés pour éviter les re-renders inutiles
- Computed values mémorisées
- Bundle size minimal (~2.5kb)

### ✅ **Developer Experience**
- TypeScript natif avec inférence de types
- DevTools intégrées (en développement)
- API simple et intuitive

### ✅ **Maintenabilité**
- Séparation claire des responsabilités
- Hooks personnalisés pour l'abstraction
- Code prévisible et testable

### ✅ **Scalabilité**
- Stores modulaires
- Facile d'ajouter de nouveaux stores
- Migration progressive possible

## Migration depuis useState

### Avant (useState local)
```typescript
const [activeTab, setActiveTab] = useState('dashboard');
const [selectedTravailId, setSelectedTravailId] = useState<string | null>(null);
```

### Après (Zustand global)
```typescript
const { activeTab, selectedTravailId, setActiveTab, setSelectedTravailId } = useNavigation();
```

## Bonnes Pratiques

### 1. **Sélecteurs Optimisés**
```typescript
// ✅ Bon - Sélecteur spécifique
const { travaux } = useTravaux();

// ❌ Éviter - Sélecteur trop large
const store = useTravauxStore();
```

### 2. **Actions Typées**
```typescript
// ✅ Bon - Action typée
addTravail: (travail: Omit<Travail, 'id'>) => void

// ❌ Éviter - Action non typée
addTravail: (travail: any) => void
```

### 3. **Gestion d'Erreurs**
```typescript
// ✅ Bon - Gestion d'erreur centralisée
try {
  setTravaux(newTravaux);
} catch (err) {
  setError('Erreur lors de la mise à jour');
}
```

## DevTools

En mode développement, les stores sont visibles dans les Redux DevTools avec les noms :
- `app-store` pour AppStore
- `travaux-store` pour TravauxStore

## Tests

### Test d'un Store
```typescript
import { renderHook, act } from '@testing-library/react';
import { useTravaux } from '../hooks/useApp';

test('should add travail', () => {
  const { result } = renderHook(() => useTravaux());
  
  act(() => {
    result.current.addTravail(mockTravail);
  });
  
  expect(result.current.travaux).toHaveLength(1);
});
```

## Prochaines Étapes

1. **Tests** : Ajouter des tests unitaires pour les stores
2. **Persistance** : Implémenter la persistance avec `zustand/middleware`
3. **Optimisation** : Ajouter `shallow` pour les comparaisons d'objets
4. **Validation** : Intégrer Zod pour la validation des données 