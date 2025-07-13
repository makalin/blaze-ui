import { createSignal, effect } from '../core/reactivity';

export interface Store<T> {
  get: () => T;
  set: (value: T | ((prev: T) => T)) => void;
  subscribe: (callback: (value: T) => void) => () => void;
}

// Create a store
export function createStore<T>(initialValue: T): Store<T> {
  const [getValue, setValue] = createSignal(initialValue);
  const subscribers = new Set<(value: T) => void>();

  const store: Store<T> = {
    get: getValue,
    set: (value: T | ((prev: T) => T)) => {
      setValue(value);
      const currentValue = getValue();
      subscribers.forEach(callback => callback(currentValue));
    },
    subscribe: (callback: (value: T) => void) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    }
  };

  return store;
}

// Global store registry
const stores = new Map<string, Store<any>>();

// Create a named store
export function createNamedStore<T>(name: string, initialValue: T): Store<T> {
  if (stores.has(name)) {
    throw new Error(`Store with name "${name}" already exists`);
  }

  const store = createStore(initialValue);
  stores.set(name, store);
  return store;
}

// Get a store by name
export function getStore<T>(name: string): Store<T> | undefined {
  return stores.get(name);
}

// Use a store (hook-like function)
export function useStore<T>(store: Store<T>): [() => T, (value: T | ((prev: T) => T)) => void] {
  return [store.get, store.set];
}

// Use a named store
export function useNamedStore<T>(name: string): [() => T, (value: T | ((prev: T) => T)) => void] {
  const store = getStore<T>(name);
  if (!store) {
    throw new Error(`Store with name "${name}" not found`);
  }
  return useStore(store);
}

// Store actions (for more complex state updates)
export function createActions<T, A extends Record<string, (...args: any[]) => void>>(
  store: Store<T>,
  actions: (store: Store<T>) => A
): A {
  return actions(store);
}

// Store selectors (for derived state)
export function createSelector<T, R>(
  store: Store<T>,
  selector: (state: T) => R
): Store<R> {
  const [getSelected, setSelected] = createSignal(selector(store.get()));

  effect(() => {
    const newValue = selector(store.get());
    setSelected(newValue);
  });

  return {
    get: getSelected,
    set: () => {
      throw new Error('Cannot set value on a selector');
    },
    subscribe: (callback: (value: R) => void) => {
      const unsubscribe = store.subscribe(() => {
        callback(selector(store.get()));
      });
      return unsubscribe;
    }
  };
}

// Store middleware (for logging, persistence, etc.)
export function createMiddleware<T>(
  store: Store<T>,
  middleware: (store: Store<T>) => Store<T>
): Store<T> {
  return middleware(store);
}

// Example middleware: logging
export function withLogging<T>(store: Store<T>): Store<T> {
  return {
    get: store.get,
    set: (value: T | ((prev: T) => T)) => {
      const prevValue = store.get();
      store.set(value);
      const newValue = store.get();
      console.log(`Store updated:`, { prevValue, newValue });
    },
    subscribe: store.subscribe
  };
}

// Example middleware: persistence
export function withPersistence<T>(
  store: Store<T>,
  key: string,
  storage: Storage = localStorage
): Store<T> {
  // Load initial value from storage
  const saved = storage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      store.set(parsed);
    } catch (error) {
      console.warn('Failed to load persisted store value:', error);
    }
  }

  // Save to storage on changes
  const originalSet = store.set;
  store.set = (value: T | ((prev: T) => T)) => {
    originalSet(value);
    try {
      storage.setItem(key, JSON.stringify(store.get()));
    } catch (error) {
      console.warn('Failed to persist store value:', error);
    }
  };

  return store;
} 