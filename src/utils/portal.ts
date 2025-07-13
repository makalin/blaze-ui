import { Component } from '../core/Component';

export interface PortalProps {
  container?: Element | null;
  children: HTMLElement | DocumentFragment | string;
}

// Portal component
export class Portal extends Component<PortalProps> {
  private container: Element | null = null;

  onMount(): void {
    this.container = this.props.container || document.body;
  }

  render(): HTMLElement | DocumentFragment | string {
    if (!this.container) {
      return document.createElement('div');
    }

    // For portals, we return a placeholder element
    // The actual rendering happens in the renderer
    const placeholder = document.createElement('div');
    placeholder.setAttribute('data-portal', 'true');
    placeholder.style.display = 'none';
    return placeholder;
  }
}

// Create portal function
export function createPortal(
  children: HTMLElement | DocumentFragment | string,
  container?: Element | null
): Portal {
  return new Portal({ children, container });
}

// Portal manager
class PortalManager {
  private portals = new Map<Element, Element[]>();

  addPortal(container: Element, element: Element): void {
    if (!this.portals.has(container)) {
      this.portals.set(container, []);
    }
    this.portals.get(container)!.push(element);
    container.appendChild(element);
  }

  removePortal(container: Element, element: Element): void {
    const elements = this.portals.get(container);
    if (elements) {
      const index = elements.indexOf(element);
      if (index !== -1) {
        elements.splice(index, 1);
        container.removeChild(element);
      }
    }
  }

  clearPortals(container: Element): void {
    const elements = this.portals.get(container);
    if (elements) {
      elements.forEach(element => {
        container.removeChild(element);
      });
      this.portals.delete(container);
    }
  }
}

// Global portal manager instance
export const portalManager = new PortalManager(); 