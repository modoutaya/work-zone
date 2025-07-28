# Zustand Architecture - Global State Management

## Overview

This project uses **Zustand** as a global state management solution, replacing local `useState` usage for better scalability and maintainability.

## Store Structure

### 1. AppStore (`src/store/appStore.ts`)
Manages global application state:
- **Navigation** : `activeTab`, `selectedTravailId`
- **UI State** : `isLoading`, `error`
- **Actions** : `setActiveTab`, `setSelectedTravailId`, `setLoading`, `setError`

### 2. TravauxStore (`src/store/travauxStore.ts`)
Manages work state:
- **Data** : `travaux`, `selectedTravail`
- **UI State** : `loading`, `error`
- **Actions** : CRUD operations, computed values
- **Computed** : `getTravauxByStatus`, `getTravauxByZone`, `getTravauxByType`

## Custom Hooks (`src/hooks/useApp.ts`)

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

## Benefits of this Architecture

### ✅ **Performance**
- Optimized selectors to avoid unnecessary re-renders
- Memoized computed values
- Minimal bundle size (~2.5kb)

### ✅ **Developer Experience**
- Native TypeScript with type inference
- Integrated DevTools (in development)
- Simple and intuitive API

### ✅ **Maintainability**
- Clear separation of responsibilities
- Custom hooks for abstraction
- Predictable and testable code

### ✅ **Scalability**
- Modular stores
- Easy to add new stores
- Progressive migration possible

## Migration from useState

### Before (local useState)
```typescript
const [activeTab, setActiveTab] = useState('dashboard');
const [selectedTravailId, setSelectedTravailId] = useState<string | null>(null);
```

### After (global Zustand)
```typescript
const { activeTab, selectedTravailId, setActiveTab, setSelectedTravailId } = useNavigation();
```

## Best Practices

### 1. **Optimized Selectors**
```typescript
// ✅ Good - Specific selector
const { travaux } = useTravaux();

// ❌ Avoid - Too broad selector
const store = useTravauxStore();
```

### 2. **Typed Actions**
```typescript
// ✅ Good - Typed action
addTravail: (travail: Omit<Travail, 'id'>) => void

// ❌ Avoid - Untyped action
addTravail: (travail: any) => void
```

### 3. **Error Handling**
```typescript
// ✅ Good - Centralized error handling
try {
  setTravaux(newTravaux);
} catch (err) {
  setError('Error updating data');
}
```

## DevTools

In development mode, stores are visible in Redux DevTools with names:
- `app-store` for AppStore
- `travaux-store` for TravauxStore

## Testing

### Testing a Store
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

## Next Steps

1. **Tests** : Add unit tests for stores
2. **Persistence** : Implement persistence with `zustand/middleware`
3. **Optimization** : Add `shallow` for object comparisons
4. **Validation** : Integrate Zod for data validation 