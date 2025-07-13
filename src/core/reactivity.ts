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

class Effect {
  private cleanup: (() => void) | null = null;
  private isRunning = false;
  private signals = new Set<Signal<any>>();

  constructor(private fn: () => void | (() => void)) {}

  run(): void {
    if (this.isRunning) return;

    // Clear previous subscriptions
    this.signals.forEach(signal => {
      signal.subscribe(() => {}); // Remove old subscription
    });
    this.signals.clear();

    if (this.cleanup) {
      this.cleanup();
    }

    this.isRunning = true;
    
    try {
      const result = this.fn();
      this.cleanup = typeof result === 'function' ? result : null;
    } finally {
      this.isRunning = false;
    }
  }

  dispose(): void {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
    this.signals.clear();
  }

  track(signal: Signal<any>): void {
    this.signals.add(signal);
    signal.subscribe(() => this.run());
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
  const effect = new Effect(fn);
  
  // Create a wrapper that tracks signal access
  const trackedFn = () => {
    // This is a simplified version - in a real implementation,
    // we'd need to track which signals are accessed during execution
    return fn();
  };
  
  effect.run();
  return () => effect.dispose();
}

// Simple memo implementation
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