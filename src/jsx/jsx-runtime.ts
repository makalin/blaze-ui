import { Component, ComponentType } from '../core/Component';
import { createSignal, effect } from '../core/reactivity';

// JSX Runtime for Blaze UI
export namespace JSX {
  export interface Element {
    type: string | ComponentType;
    props: Record<string, any>;
    children: (Element | string | number | boolean | null | undefined)[];
  }

  export interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// JSX Factory function
export function jsx(
  type: string | ((props: any) => HTMLElement | DocumentFragment | string),
  props: Record<string, any> = {},
  ...children: (JSX.Element | string | number | boolean | null | undefined)[]
): HTMLElement | DocumentFragment | string {
  
  // Handle functional components
  if (typeof type === 'function' && !(type.prototype instanceof Component)) {
    return type({ ...props, children });
  }
  
  // Handle class components - for now, only support functional components
  if (typeof type === 'function' && type.prototype instanceof Component) {
    throw new Error('Class components are not supported in JSX yet');
  }
  
  // Handle HTML elements
  if (typeof type === 'string') {
    return createHTMLElement(type, props, children);
  }
  
  throw new Error(`Invalid JSX element type: ${type}`);
}

// Create HTML element with props and children
function createHTMLElement(
  tagName: string,
  props: Record<string, any> = {},
  children: (JSX.Element | string | number | boolean | null | undefined)[]
): HTMLElement {
  const element = document.createElement(tagName);
  
  // Handle props
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'children') return; // Skip children prop
    
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
    } else if (key === 'ref' && typeof value === 'object') {
      // Ref
      value.current = element;
    } else if (key === 'dangerouslySetInnerHTML' && value?.__html) {
      // Inner HTML
      element.innerHTML = value.__html;
    } else {
      // Regular attribute
      element.setAttribute(key, value);
    }
  });
  
  // Handle children
  children.forEach(child => {
    if (child == null || child === false || child === undefined) {
      return; // Skip null, undefined, false
    }
    
    if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
      element.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof HTMLElement || child instanceof DocumentFragment) {
      element.appendChild(child);
    } else if (typeof child === 'object' && 'type' in child) {
      // JSX Element
      const rendered = jsx(child.type, child.props, ...child.children);
      if (typeof rendered === 'string') {
        element.appendChild(document.createTextNode(rendered));
      } else {
        element.appendChild(rendered);
      }
    }
  });
  
  return element;
}

// JSX Fragment
export function jsxs(
  type: string | ComponentType,
  props: Record<string, any> = {},
  ...children: (JSX.Element | string | number | boolean | null | undefined)[]
): HTMLElement | DocumentFragment | string {
  return jsx(type, props, ...children);
}

// Fragment component
export function Fragment(props: { children: any[] }): DocumentFragment {
  const fragment = document.createDocumentFragment();
  
  if (props.children) {
    props.children.forEach(child => {
      if (child == null || child === false || child === undefined) {
        return;
      }
      
      if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
        fragment.appendChild(document.createTextNode(String(child)));
      } else if (child instanceof HTMLElement || child instanceof DocumentFragment) {
        fragment.appendChild(child);
      }
    });
  }
  
  return fragment;
}

// Conditional rendering
export function If({ condition, children }: { condition: boolean; children: any }): HTMLElement | DocumentFragment | string | null {
  return condition ? children : null;
}

// List rendering
export function For<T>({ each, children }: { each: T[]; children: (item: T, index: number) => any }): DocumentFragment {
  const fragment = document.createDocumentFragment();
  
  each.forEach((item, index) => {
    const child = children(item, index);
    if (child instanceof HTMLElement || child instanceof DocumentFragment) {
      fragment.appendChild(child);
    } else if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
      fragment.appendChild(document.createTextNode(String(child)));
    }
  });
  
  return fragment;
}

// Switch component
export function Switch({ children }: { children: any[] }): HTMLElement | DocumentFragment | string | null {
  for (const child of children) {
    if (child && typeof child === 'object' && 'when' in child && child.when) {
      return child.children;
    }
  }
  return null;
}

// Case component for Switch
export function Case({ when, children }: { when: boolean; children: any }): { when: boolean; children: any } {
  return { when, children };
}

// Default case for Switch
export function Default({ children }: { children: any }): { when: boolean; children: any } {
  return { when: true, children };
} 