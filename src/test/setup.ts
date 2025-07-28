import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock des modules externes
vi.mock('zustand/middleware', () => ({
  devtools: (fn: any) => fn,
}));

// Mock de localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Disable lazy loading for tests by making React.lazy return the component directly
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: (importFn: () => Promise<any>) => {
      // Return a component that immediately renders the imported component
      return importFn().then(module => module.default);
    },
  };
}); 