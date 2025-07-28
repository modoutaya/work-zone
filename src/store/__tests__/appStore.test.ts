import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../appStore';

describe('AppStore', () => {
  beforeEach(() => {
    useAppStore.getState().resetApp();
  });

  it('should have initial state', () => {
    const state = useAppStore.getState();
    
    expect(state.activeTab).toBe('dashboard');
    expect(state.selectedTravailId).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set active tab', () => {
    const { setActiveTab } = useAppStore.getState();
    
    setActiveTab('travaux');
    
    expect(useAppStore.getState().activeTab).toBe('travaux');
  });

  it('should reset selected travail when changing to non-travaux tab', () => {
    const { setActiveTab, setSelectedTravailId } = useAppStore.getState();
    
    // Set initial state
    setSelectedTravailId('test-id');
    setActiveTab('travaux');
    
    // Change to dashboard
    setActiveTab('dashboard');
    
    expect(useAppStore.getState().selectedTravailId).toBeNull();
  });

  it('should keep selected travail when changing to travaux tab', () => {
    const { setActiveTab, setSelectedTravailId } = useAppStore.getState();
    
    setSelectedTravailId('test-id');
    setActiveTab('travaux');
    
    expect(useAppStore.getState().selectedTravailId).toBe('test-id');
  });

  it('should set loading state', () => {
    const { setLoading } = useAppStore.getState();
    
    setLoading(true);
    expect(useAppStore.getState().isLoading).toBe(true);
    
    setLoading(false);
    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('should set error state', () => {
    const { setError } = useAppStore.getState();
    
    setError('Test error');
    expect(useAppStore.getState().error).toBe('Test error');
    
    setError(null);
    expect(useAppStore.getState().error).toBeNull();
  });

  it('should reset navigation', () => {
    const { setActiveTab, setSelectedTravailId, resetNavigation } = useAppStore.getState();
    
    setActiveTab('travaux');
    setSelectedTravailId('test-id');
    
    resetNavigation();
    
    expect(useAppStore.getState().activeTab).toBe('dashboard');
    expect(useAppStore.getState().selectedTravailId).toBeNull();
  });

  it('should reset app completely', () => {
    const { setActiveTab, setSelectedTravailId, setLoading, setError, resetApp } = useAppStore.getState();
    
    setActiveTab('travaux');
    setSelectedTravailId('test-id');
    setLoading(true);
    setError('Test error');
    
    resetApp();
    
    const state = useAppStore.getState();
    expect(state.activeTab).toBe('dashboard');
    expect(state.selectedTravailId).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
}); 