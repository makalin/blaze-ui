import { effect } from './reactivity';

export interface ComponentProps {
  [key: string]: any;
}

export interface ComponentState {
  [key: string]: any;
}

export abstract class Component<P extends ComponentProps = ComponentProps, S extends ComponentState = ComponentState> {
  public props: P;
  public state: S;
  private _mounted = false;
  private _destroyed = false;
  private _effects: (() => void)[] = [];

  constructor(props: P) {
    this.props = props;
    this.state = {} as S;
  }

  // Lifecycle methods
  protected onMount(): void {}
  protected onUpdate(): void {}
  protected onDestroy(): void {}

  // State management
  protected setState<K extends keyof S>(newState: Pick<S, K> | S | ((prevState: S) => S)): void {
    if (this._destroyed) return;

    const oldState = { ...this.state };
    
    if (typeof newState === 'function') {
      this.state = { ...this.state, ...(newState as (prevState: S) => S)(this.state) };
    } else {
      this.state = { ...this.state, ...newState };
    }

    if (this._mounted) {
      this.onUpdate();
      this._triggerUpdate();
    }
  }

  // Effect management
  protected createEffect(fn: () => void | (() => void)): void {
    if (this._destroyed) return;
    
    const cleanup = effect(fn);
    this._effects.push(cleanup);
  }

  // Mount the component
  public mount(): void {
    if (this._mounted || this._destroyed) return;
    
    this._mounted = true;
    this.onMount();
  }

  // Destroy the component
  public destroy(): void {
    if (this._destroyed) return;
    
    this._destroyed = true;
    this._mounted = false;
    
    // Clean up effects
    this._effects.forEach(cleanup => cleanup());
    this._effects = [];
    
    this.onDestroy();
  }

  // Update props
  public updateProps(newProps: P): void {
    if (this._destroyed) return;
    
    this.props = newProps;
    if (this._mounted) {
      this.onUpdate();
      this._triggerUpdate();
    }
  }

  // Abstract render method
  public abstract render(): HTMLElement | DocumentFragment | string;

  // Internal update trigger
  private _triggerUpdate(): void {
    // This will be overridden by the renderer
  }

  // Getter for mounted state
  public get isMounted(): boolean {
    return this._mounted;
  }

  // Getter for destroyed state
  public get isDestroyed(): boolean {
    return this._destroyed;
  }
}

// Functional component type
export type FunctionalComponent<P = ComponentProps> = (props: P) => HTMLElement | DocumentFragment | string;

// Component type union
export type ComponentType<P = ComponentProps> = typeof Component | FunctionalComponent<P>; 