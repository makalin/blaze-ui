// Simple reactive state management system
type Subscriber = () => void;

class Signal<T> {
  private value: T;
  private subscribers = new Set<Subscriber>();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T | ((prev: T) => T)): void {
    const oldValue = this.value;
    this.value = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(oldValue)
      : newValue;
    
    if (this.value !== oldValue) {
      this.notify();
    }
  }

  private notify(): void {
    this.subscribers.forEach(subscriber => subscriber());
  }

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
}

// Public API
export function createSignal<T>(initialValue: T): [() => T, (value: T | ((prev: T) => T)) => void] {
  const signal = new Signal(initialValue);
  return [() => signal.get(), (value) => signal.set(value)];
}

export function state<T>(initialValue: T): [() => T, (value: T | ((prev: T) => T)) => void] {
  return createSignal(initialValue);
}

export function effect(fn: () => void | (() => void)): () => void {
  // Simple effect that just runs once
  const result = fn();
  return typeof result === 'function' ? result : () => {};
}

export function memo<T>(fn: () => T): () => T {
  let cached: T | null = null;
  let dirty = true;
  
  return () => {
    if (dirty) {
      cached = fn();
      dirty = false;
    }
    return cached!;
  };
}

// Batch updates for performance
let batchQueue: (() => void)[] = [];
let isBatching = false;

export function batch(fn: () => void): void {
  if (isBatching) {
    fn();
    return;
  }

  isBatching = true;
  batchQueue = [];
  
  try {
    fn();
  } finally {
    isBatching = false;
    const queue = batchQueue;
    batchQueue = [];
    queue.forEach(update => update());
  }
}

export function scheduleUpdate(update: () => void): void {
  if (isBatching) {
    batchQueue.push(update);
  } else {
    update();
  }
} 