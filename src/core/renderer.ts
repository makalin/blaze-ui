import { Component, ComponentType, FunctionalComponent, ComponentProps } from './Component';
import { effect, scheduleUpdate } from './reactivity';

export interface RenderOptions {
  container?: Element;
  replace?: boolean;
}

class Renderer {
  private componentInstances = new WeakMap<Element, Component>();
  private updateQueue: (() => void)[] = [];
  private isUpdating = false;

  // Render a component into the DOM
  render<P extends ComponentProps>(
    component: ComponentType<P>,
    props: P,
    container: Element,
    options: RenderOptions = {}
  ): Element {
    const { replace = false } = options;

    // Clear container if replacing
    if (replace) {
      container.innerHTML = '';
    }

    // Create component instance
    let instance: Component;
    if (typeof component === 'function' && !(component.prototype instanceof Component)) {
      // Functional component
      instance = new FunctionalComponentWrapper(component as FunctionalComponent<P>, props);
    } else {
      // Class component - we need to handle this differently since Component is abstract
      throw new Error('Class components must extend Component class');
    }

    // Render the component
    const rendered = this.renderComponent(instance);
    
    // Append to container
    if (typeof rendered === 'string') {
      container.innerHTML = rendered;
    } else if (rendered instanceof DocumentFragment) {
      container.appendChild(rendered);
    } else {
      container.appendChild(rendered);
    }

    // Store instance reference
    this.componentInstances.set(container, instance);

    // Mount the component
    instance.mount();

    return container;
  }

  // Render a component and return the DOM element
  private renderComponent(component: Component): HTMLElement | DocumentFragment | string {
    return component.render();
  }

  // Update a component
  update<P extends ComponentProps>(component: Component<P>, newProps: P): void {
    component.updateProps(newProps);
  }

  // Destroy a component
  destroy(container: Element): void {
    const instance = this.componentInstances.get(container);
    if (instance) {
      instance.destroy();
      this.componentInstances.delete(container);
    }
  }

  // Schedule an update
  scheduleUpdate(update: () => void): void {
    scheduleUpdate(() => {
      this.updateQueue.push(update);
      this.processUpdateQueue();
    });
  }

  // Process the update queue
  private processUpdateQueue(): void {
    if (this.isUpdating) return;

    this.isUpdating = true;
    
    try {
      while (this.updateQueue.length > 0) {
        const update = this.updateQueue.shift();
        if (update) {
          update();
        }
      }
    } finally {
      this.isUpdating = false;
    }
  }
}

// Wrapper for functional components
class FunctionalComponentWrapper<P extends ComponentProps> extends Component<P> {
  private renderFn: FunctionalComponent<P>;

  constructor(renderFn: FunctionalComponent<P>, props: P) {
    super(props);
    this.renderFn = renderFn;
  }

  render(): HTMLElement | DocumentFragment | string {
    return this.renderFn(this.props);
  }
}

// Global renderer instance
const renderer = new Renderer();

// Public API
export function render<P extends ComponentProps>(
  component: ComponentType<P>,
  props: P,
  container: Element | string,
  options?: RenderOptions
): Element {
  const targetContainer = typeof container === 'string' 
    ? document.querySelector(container) 
    : container;
  
  if (!targetContainer) {
    throw new Error(`Container not found: ${container}`);
  }

  return renderer.render(component, props, targetContainer, options);
}

export function createRoot(container: Element | string) {
  const targetContainer = typeof container === 'string' 
    ? document.querySelector(container) 
    : container;
  
  if (!targetContainer) {
    throw new Error(`Container not found: ${container}`);
  }

  return {
    render<P extends ComponentProps>(component: ComponentType<P>, props: P) {
      return renderer.render(component, props, targetContainer, { replace: true });
    },
    unmount() {
      renderer.destroy(targetContainer);
    }
  };
}

// DOM creation helpers
export function createElement(
  tag: string,
  props: Record<string, any> = {},
  ...children: (string | HTMLElement | DocumentFragment)[]
): HTMLElement {
  const element = document.createElement(tag);
  
  // Set properties
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      // Event listener
      const eventName = key.toLowerCase().slice(2);
      element.addEventListener(eventName, value);
    } else if (key === 'className') {
      // Class name
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      // Style object
      Object.assign(element.style, value);
    } else {
      // Regular attribute
      element.setAttribute(key, value);
    }
  });

  // Append children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}

// JSX factory function
export function jsx(
  type: string | ComponentType,
  props: Record<string, any> = {},
  ...children: any[]
): HTMLElement | DocumentFragment | string {
  if (typeof type === 'string') {
    return createElement(type, props, ...children);
  } else {
    // Component - handle functional components only for now
    if (typeof type === 'function' && !(type.prototype instanceof Component)) {
      return (type as FunctionalComponent)(props);
    } else {
      throw new Error('Class components must extend Component class');
    }
  }
} 