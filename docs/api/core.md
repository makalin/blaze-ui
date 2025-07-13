# Core API Reference

This document provides a complete reference for Blaze UI's core functions and APIs.

## State Management

### `state<T>(initialValue: T): [() => T, (value: T | ((prev: T) => T)) => void]`

Creates a reactive state that automatically triggers updates when changed.

**Parameters:**
- `initialValue: T` - The initial value for the state

**Returns:**
- A tuple containing:
  - `getter: () => T` - Function to get the current value
  - `setter: (value: T | ((prev: T) => T)) => void` - Function to update the value

**Example:**
```javascript
import { state } from 'blaze-ui';

const [count, setCount] = state(0);

// Get current value
console.log(count()); // 0

// Set new value
setCount(5);
console.log(count()); // 5

// Update with function
setCount(prev => prev + 1);
console.log(count()); // 6
```

### `createSignal<T>(initialValue: T): [() => T, (value: T | ((prev: T) => T)) => void]`

Alias for `state()`. Creates a reactive signal.

**Example:**
```javascript
import { createSignal } from 'blaze-ui';

const [name, setName] = createSignal('John');
```

## Effects and Reactivity

### `effect(fn: () => void | (() => void)): () => void`

Creates a reactive effect that runs when dependencies change.

**Parameters:**
- `fn: () => void | (() => void)` - Function to execute. Can return a cleanup function.

**Returns:**
- `() => void` - Cleanup function to dispose of the effect

**Example:**
```javascript
import { state, effect } from 'blaze-ui';

const [count, setCount] = state(0);

// Create effect
const cleanup = effect(() => {
  console.log(`Count is now: ${count()}`);
  
  // Return cleanup function (optional)
  return () => {
    console.log('Effect cleanup');
  };
});

// Update state - effect will run
setCount(5);

// Clean up effect
cleanup();
```

### `memo<T>(fn: () => T): () => T`

Creates a memoized value that only recalculates when dependencies change.

**Parameters:**
- `fn: () => T` - Function that returns the memoized value

**Returns:**
- `() => T` - Function that returns the memoized value

**Example:**
```javascript
import { state, memo } from 'blaze-ui';

const [count, setCount] = state(0);

const doubled = memo(() => count() * 2);

console.log(doubled()); // 0
setCount(5);
console.log(doubled()); // 10
```

## Batch Updates

### `batch(fn: () => void): void`

Batches multiple state updates into a single update cycle for better performance.

**Parameters:**
- `fn: () => void` - Function containing state updates to batch

**Example:**
```javascript
import { state, batch } from 'blaze-ui';

const [count, setCount] = state(0);
const [name, setName] = state('John');

// Batch multiple updates
batch(() => {
  setCount(5);
  setName('Jane');
  // Only one update cycle will be triggered
});
```

### `scheduleUpdate(update: () => void): void`

Schedules an update to run in the next update cycle.

**Parameters:**
- `update: () => void` - Function to schedule for execution

**Example:**
```javascript
import { scheduleUpdate } from 'blaze-ui';

scheduleUpdate(() => {
  console.log('This will run in the next update cycle');
});
```

## Store Management

### `createStore<T>(initialValue: T): Store<T>`

Creates a global store for state management across components.

**Parameters:**
- `initialValue: T` - Initial value for the store

**Returns:**
- `Store<T>` - Store object

**Example:**
```javascript
import { createStore } from 'blaze-ui';

const userStore = createStore({
  name: 'John Doe',
  age: 30,
  preferences: { theme: 'light' }
});
```

### `useStore<T>(store: Store<T>): [() => T, (value: T | ((prev: T) => T)) => void]`

Hook to use a store in components.

**Parameters:**
- `store: Store<T>` - Store to use

**Returns:**
- Tuple with getter and setter functions

**Example:**
```javascript
import { createStore, useStore } from 'blaze-ui';

const userStore = createStore({ name: 'John', age: 30 });
const [getUser, setUser] = useStore(userStore);

// Get store value
console.log(getUser()); // { name: 'John', age: 30 }

// Update store
setUser(prev => ({ ...prev, age: 31 }));
```

## Type Definitions

### `Store<T>`

Type for a store object.

```typescript
interface Store<T> {
  get(): T;
  set(value: T | ((prev: T) => T)): void;
  subscribe(callback: () => void): () => void;
}
```

### `Signal<T>`

Type for a signal object.

```typescript
interface Signal<T> {
  get(): T;
  set(value: T | ((prev: T) => T)): void;
  subscribe(callback: () => void): () => void;
}
```

## Error Handling

All core functions include error handling:

```javascript
import { state, effect } from 'blaze-ui';

try {
  const [count, setCount] = state(0);
  
  effect(() => {
    // This will be caught
    throw new Error('Effect error');
  });
} catch (error) {
  console.error('Blaze UI error:', error);
}
```

## Performance Tips

1. **Use batch updates** for multiple state changes
2. **Memoize expensive calculations** with `memo()`
3. **Clean up effects** to prevent memory leaks
4. **Avoid creating effects in loops** - create them once

## Best Practices

1. **Always call state getters as functions**: `count()` not `count`
2. **Use cleanup functions** in effects when needed
3. **Prefer function updates** for state that depends on previous values
4. **Keep effects focused** on a single responsibility

## Migration from React

| React | Blaze UI |
|-------|----------|
| `useState(0)` | `state(0)` |
| `useEffect(() => {}, [])` | `effect(() => {})` |
| `useMemo(() => value, [])` | `memo(() => value)` |
| `useContext()` | `useStore()` |

For more examples, see the [Examples](../examples/) section. 