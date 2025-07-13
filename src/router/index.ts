import { Component, ComponentProps } from '../core/Component';
import { createSignal, effect } from '../core/reactivity';

export interface RouteConfig {
  path: string;
  component: (props: any) => HTMLElement | DocumentFragment | string;
  exact?: boolean;
  children?: RouteConfig[];
}

export interface RouterContext {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

// Global router state
const [currentPath, setCurrentPath] = createSignal(window.location.pathname);
const [params, setParams] = createSignal<Record<string, string>>({});

// Router class
export class Router extends Component<{ routes: RouteConfig[]; children?: Component[] }> {
  private currentRoute: RouteConfig | null = null;

  onMount(): void {
    // Listen for browser navigation
    window.addEventListener('popstate', this.handlePopState);
    
    // Set up effect to handle route changes
    this.createEffect(() => {
      const path = currentPath();
      this.updateRoute(path);
    });
  }

  onDestroy(): void {
    window.removeEventListener('popstate', this.handlePopState);
  }

  private handlePopState = (event: PopStateEvent) => {
    setCurrentPath(window.location.pathname);
  };

  private updateRoute(path: string): void {
    const route = this.findRoute(path, this.props.routes);
    if (route !== this.currentRoute) {
      this.currentRoute = route;
      this.setState({ currentRoute: route });
    }
  }

  private findRoute(path: string, routes: RouteConfig[]): RouteConfig | null {
    for (const route of routes) {
      if (this.matchRoute(path, route)) {
        return route;
      }
      if (route.children) {
        const childRoute = this.findRoute(path, route.children);
        if (childRoute) {
          return childRoute;
        }
      }
    }
    return null;
  }

  private matchRoute(path: string, route: RouteConfig): boolean {
    if (route.exact) {
      return path === route.path;
    }
    
    // Simple path matching with params
    const routeParts = route.path.split('/');
    const pathParts = path.split('/');
    
    if (routeParts.length !== pathParts.length) {
      return false;
    }
    
    const newParams: Record<string, string> = {};
    
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];
      
      if (routePart.startsWith(':')) {
        // Parameter
        const paramName = routePart.slice(1);
        newParams[paramName] = pathPart;
      } else if (routePart !== pathPart) {
        return false;
      }
    }
    
    setParams(newParams);
    return true;
  }

  render(): HTMLElement | DocumentFragment | string {
    if (!this.currentRoute) {
      return document.createElement('div'); // 404 or default
    }

    const ComponentClass = this.currentRoute.component;
    return ComponentClass({ ...this.props, params: params() });
  }
}

// Route component
export class Route extends Component<RouteConfig> {
  render(): HTMLElement | DocumentFragment | string {
    // Routes are handled by the Router component
    return document.createElement('div');
  }
}

// Link component
export class Link extends Component<{ to: string; children: string | Component; className?: string }> {
  private handleClick = (event: Event) => {
    event.preventDefault();
    navigate(this.props.to);
  };

  render(): HTMLElement {
    const link = document.createElement('a');
    link.href = this.props.to;
    link.addEventListener('click', this.handleClick);
    
    if (this.props.className) {
      link.className = this.props.className;
    }

    if (typeof this.props.children === 'string') {
      link.textContent = this.props.children;
    } else {
      const rendered = this.props.children.render();
      if (typeof rendered === 'string') {
        link.textContent = rendered;
      } else if (rendered instanceof DocumentFragment) {
        link.appendChild(rendered);
      } else {
        link.appendChild(rendered);
      }
    }

    return link;
  }
}

// Navigation function
export function navigate(path: string): void {
  window.history.pushState({}, '', path);
  setCurrentPath(path);
}

// Router hook
export function useRouter(): RouterContext {
  return {
    currentPath: currentPath(),
    navigate,
    params: params()
  };
} 