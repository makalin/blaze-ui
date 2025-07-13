// Component types
export type ComponentType<P = any> = (props: P) => HTMLElement | DocumentFragment | string;
export type ComponentProps = Record<string, any>;

// JSX types
export type JSXElement = HTMLElement | DocumentFragment | string;
export type JSXNode = HTMLElement | DocumentFragment | string | number | boolean | null | undefined;

// Event types
export type EventHandler<T = any> = (event: T) => void;
export type MouseEventHandler = EventHandler<MouseEvent>;
export type KeyboardEventHandler = EventHandler<KeyboardEvent>;
export type ChangeEventHandler = EventHandler<Event>;

// Ref types
export interface Ref<T> {
  current: T | null;
}

export interface RefObject<T> {
  readonly current: T | null;
}

export interface MutableRefObject<T> {
  current: T;
}

// Context types
export interface Context<T> {
  defaultValue: T;
  Provider: (value: T) => void;
  Consumer: () => T;
}

// Router types
export interface RouteConfig {
  path: string;
  component: ComponentType;
  exact?: boolean;
  children?: RouteConfig[];
}

export interface RouterContext {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

// Store types
export interface Store<T> {
  get: () => T;
  set: (value: T | ((prev: T) => T)) => void;
  subscribe: (callback: (value: T) => void) => () => void;
}

// Portal types
export interface PortalProps {
  container?: Element | null;
  children: JSXNode;
} 