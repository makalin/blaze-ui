import { createSignal } from '../core/reactivity';

export interface Ref<T> {
  current: T | null;
}

export interface RefObject<T> {
  readonly current: T | null;
}

export interface MutableRefObject<T> {
  current: T;
}

// Create a ref
export function createRef<T>(initialValue: T | null = null): MutableRefObject<T | null> {
  return { current: initialValue };
}

// Forward ref (for functional components)
export function forwardRef<T, P extends Record<string, any>>(
  render: (props: P, ref: Ref<T>) => HTMLElement | DocumentFragment | string
) {
  return (props: P & { ref?: Ref<T> }) => {
    return render(props, props.ref || { current: null });
  };
}

// Callback ref
export function useCallbackRef<T>(
  callback: (element: T | null) => void
): Ref<T> {
  return {
    get current() {
      return null;
    },
    set current(element: T | null) {
      callback(element);
    }
  };
}

// Imperative handle
export function useImperativeHandle<T, R extends T>(
  ref: Ref<T> | null,
  init: () => R,
  deps?: any[]
): void {
  if (ref) {
    ref.current = init();
  }
} 