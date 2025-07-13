import { describe, it, expect, beforeEach } from 'vitest';
import { createSignal, state, effect, memo } from '../src/core/reactivity';

describe('Reactivity System', () => {
  beforeEach(() => {
    // Reset any global state if needed
  });

  describe('createSignal', () => {
    it('should create a signal with initial value', () => {
      const [getValue, setValue] = createSignal(42);
      expect(getValue()).toBe(42);
    });

    it('should update signal value', () => {
      const [getValue, setValue] = createSignal(0);
      setValue(100);
      expect(getValue()).toBe(100);
    });

    it('should update signal with function', () => {
      const [getValue, setValue] = createSignal(10);
      setValue(prev => prev * 2);
      expect(getValue()).toBe(20);
    });
  });

  describe('state', () => {
    it('should work as alias for createSignal', () => {
      const [getValue, setValue] = state('hello');
      expect(getValue()).toBe('hello');
      setValue('world');
      expect(getValue()).toBe('world');
    });
  });

  describe('effect', () => {
    it('should run effect immediately', () => {
      let runs = 0;
      effect(() => {
        runs++;
      });
      expect(runs).toBe(1);
    });

    it('should re-run effect when dependencies change', () => {
      const [getValue, setValue] = createSignal(0);
      let runs = 0;
      
      effect(() => {
        getValue();
        runs++;
      });
      
      expect(runs).toBe(1);
      setValue(1);
      expect(runs).toBe(2);
    });

    it('should return cleanup function', () => {
      let cleanupCalled = false;
      const cleanup = effect(() => {
        return () => {
          cleanupCalled = true;
        };
      });
      
      cleanup();
      expect(cleanupCalled).toBe(true);
    });
  });

  describe('memo', () => {
    it('should memoize computed values', () => {
      const [getValue, setValue] = createSignal(5);
      let computations = 0;
      
      const getDoubled = memo(() => {
        computations++;
        return getValue() * 2;
      });
      
      expect(getDoubled()).toBe(10);
      expect(computations).toBe(1);
      
      // Should use cached value
      expect(getDoubled()).toBe(10);
      expect(computations).toBe(1);
      
      // Should recompute when dependency changes
      setValue(10);
      expect(getDoubled()).toBe(20);
      expect(computations).toBe(2);
    });
  });
}); 