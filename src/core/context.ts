import { Component, ComponentProps } from './Component';

export interface Context<T> {
  defaultValue: T;
  Provider: (value: T) => void;
  Consumer: () => T;
}

export interface ContextProvider<T> {
  value: T;
  children: Component[];
}

// Global context registry
const contextRegistry = new Map<Context<any>, any>();

// Current context stack for nested providers
let contextStack: Array<{ context: Context<any>; value: any }> = [];

export function createContext<T>(defaultValue: T): Context<T> {
  const context: Context<T> = {
    defaultValue,
    Provider: (value: T) => {
      contextStack.push({ context, value });
      contextRegistry.set(context, value);
    },
    Consumer: () => {
      return contextRegistry.get(context) ?? defaultValue;
    }
  };

  return context;
}

export function useContext<T>(context: Context<T>): T {
  return context.Consumer();
}

// Simple context provider function
export function provideContext<T>(context: Context<T>, value: T): void {
  context.Provider(value);
}

// Simple context consumer function
export function consumeContext<T>(context: Context<T>): T {
  return context.Consumer();
} 