// Developer tools for Blaze UI

// Developer Tools for Blaze UI
export class BlazeDevTools {
  private isOpen = false;
  private panel: HTMLElement | null = null;
  private signals: Map<any, { name: string; value: any; subscribers: number }> = new Map();
  private components: Map<any, { name: string; props: any; state: any }> = new Map();
  private performance: { renders: number; time: number } = {
    renders: 0,
    time: 0
  };

  constructor() {
    this.init();
  }

  private init() {
    // Create dev tools button
    const button = document.createElement('div');
    button.innerHTML = '🔥';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s ease;
    `;

    button.onmouseenter = () => {
      button.style.transform = 'scale(1.1)';
    };

    button.onmouseleave = () => {
      button.style.transform = 'scale(1)';
    };

    button.onclick = () => {
      this.togglePanel();
    };

    document.body.appendChild(button);

    // Start performance monitoring
    this.startPerformanceMonitoring();
  }

  private togglePanel() {
    if (this.isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  private openPanel() {
    if (this.panel) return;

    this.panel = document.createElement('div');
    this.panel.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100vh;
      background: #1a1a1a;
      color: #fff;
      z-index: 9999;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 12px;
      overflow-y: auto;
      border-left: 1px solid #333;
    `;

    this.panel.innerHTML = `
      <div style="padding: 16px; border-bottom: 1px solid #333;">
        <h2 style="margin: 0 0 16px 0; color: #667eea;">🔥 Blaze DevTools</h2>
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <button id="signals-tab" style="padding: 8px 16px; background: #667eea; border: none; color: white; border-radius: 4px; cursor: pointer;">Signals</button>
          <button id="components-tab" style="padding: 8px 16px; background: #333; border: none; color: white; border-radius: 4px; cursor: pointer;">Components</button>
          <button id="performance-tab" style="padding: 8px 16px; background: #333; border: none; color: white; border-radius: 4px; cursor: pointer;">Performance</button>
        </div>
        <button id="close-devtools" style="position: absolute; top: 16px; right: 16px; background: none; border: none; color: #fff; font-size: 18px; cursor: pointer;">×</button>
      </div>
      <div id="devtools-content" style="padding: 16px;">
        ${this.renderSignalsTab()}
      </div>
    `;

    // Add event listeners
    this.panel.querySelector('#signals-tab')?.addEventListener('click', () => {
      this.showTab('signals');
    });

    this.panel.querySelector('#components-tab')?.addEventListener('click', () => {
      this.showTab('components');
    });

    this.panel.querySelector('#performance-tab')?.addEventListener('click', () => {
      this.showTab('performance');
    });

    this.panel.querySelector('#close-devtools')?.addEventListener('click', () => {
      this.closePanel();
    });

    document.body.appendChild(this.panel);
    this.isOpen = true;
  }

  private closePanel() {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
      this.isOpen = false;
    }
  }

  private showTab(tab: string) {
    const content = this.panel?.querySelector('#devtools-content');
    if (!content) return;

    // Update tab buttons
    this.panel?.querySelectorAll('button[id$="-tab"]').forEach(btn => {
      (btn as HTMLElement).style.background = '#333';
    });
    (this.panel?.querySelector(`#${tab}-tab`) as HTMLElement)?.style.setProperty('background', '#667eea');

    // Update content
    switch (tab) {
      case 'signals':
        content.innerHTML = this.renderSignalsTab();
        break;
      case 'components':
        content.innerHTML = this.renderComponentsTab();
        break;
      case 'performance':
        content.innerHTML = this.renderPerformanceTab();
        break;
    }
  }

  private renderSignalsTab(): string {
    const signalsHtml = Array.from(this.signals.entries())
      .map(([signal, info]) => `
        <div style="margin-bottom: 12px; padding: 12px; background: #2a2a2a; border-radius: 4px;">
          <div style="font-weight: bold; color: #667eea; margin-bottom: 4px;">${info.name}</div>
          <div style="color: #ccc; margin-bottom: 4px;">Value: ${JSON.stringify(info.value)}</div>
          <div style="color: #888; font-size: 11px;">Subscribers: ${info.subscribers}</div>
        </div>
      `)
      .join('');

    return `
      <h3 style="margin: 0 0 16px 0;">Reactive Signals</h3>
      ${signalsHtml || '<div style="color: #888;">No signals tracked</div>'}
    `;
  }

  private renderComponentsTab(): string {
    const componentsHtml = Array.from(this.components.entries())
      .map(([component, info]) => `
        <div style="margin-bottom: 12px; padding: 12px; background: #2a2a2a; border-radius: 4px;">
          <div style="font-weight: bold; color: #667eea; margin-bottom: 4px;">${info.name}</div>
          <div style="color: #ccc; margin-bottom: 4px;">
            <strong>Props:</strong> ${JSON.stringify(info.props, null, 2)}
          </div>
          <div style="color: #ccc;">
            <strong>State:</strong> ${JSON.stringify(info.state, null, 2)}
          </div>
        </div>
      `)
      .join('');

    return `
      <h3 style="margin: 0 0 16px 0;">Components</h3>
      ${componentsHtml || '<div style="color: #888;">No components tracked</div>'}
    `;
  }

  private renderPerformanceTab(): string {
    return `
      <h3 style="margin: 0 0 16px 0;">Performance</h3>
      <div style="margin-bottom: 12px; padding: 12px; background: #2a2a2a; border-radius: 4px;">
        <div style="color: #ccc; margin-bottom: 4px;">Renders: ${this.performance.renders}</div>
        <div style="color: #ccc;">Time: ${this.performance.time.toFixed(2)}ms</div>
      </div>
      <button id="reset-performance" style="padding: 8px 16px; background: #dc3545; border: none; color: white; border-radius: 4px; cursor: pointer;">Reset</button>
    `;
  }

  // Track a signal
  trackSignal(signal: any, name: string) {
    this.signals.set(signal, {
      name,
      value: signal.get ? signal.get() : signal,
      subscribers: 0
    });
  }

  // Track a component
  trackComponent(component: any, name: string, props: any, state: any) {
    this.components.set(component, {
      name,
      props,
      state
    });
  }

  // Update performance metrics
  updatePerformance(metric: 'renders' | 'time', value: number) {
    this.performance[metric] = value;
  }

  private startPerformanceMonitoring() {
    let startTime = performance.now();
    let renderCount = 0;

    // Monitor renders
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string) {
      renderCount++;
      const element = originalCreateElement.call(this, tagName);
      return element;
    };

    // Update metrics every second
    setInterval(() => {
      const currentTime = performance.now();
      this.updatePerformance('time', currentTime - startTime);
      this.updatePerformance('renders', renderCount);
      
      // Reset counters
      renderCount = 0;
      startTime = currentTime;
    }, 1000);
  }
}

// Global dev tools instance
let devTools: BlazeDevTools | null = null;

// Initialize dev tools
export function initDevTools() {
  if (typeof window !== 'undefined' && !devTools) {
    try {
      devTools = new BlazeDevTools();
      console.log('🔥 Blaze DevTools initialized');
    } catch (error) {
      console.warn('Failed to initialize Blaze DevTools:', error);
    }
  }
  return devTools;
}

// Get dev tools instance
export function getDevTools(): BlazeDevTools | null {
  return devTools;
}

// Auto-initialize in development (disabled for now to prevent issues)
// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
//   initDevTools();
// }

// Component Inspector
export class ComponentInspector {
  private highlightedElement: HTMLElement | null = null;
  private overlay: HTMLElement | null = null;

  constructor() {
    this.createOverlay();
  }

  private createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9998;
    `;
    document.body.appendChild(this.overlay);
  }

  highlightElement(element: HTMLElement, info: string) {
    if (this.highlightedElement) {
      this.highlightedElement.style.outline = '';
    }

    this.highlightedElement = element;
    element.style.outline = '2px solid #667eea';
    element.style.outlineOffset = '2px';

    // Show info tooltip
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      background: #1a1a1a;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      pointer-events: auto;
      z-index: 10000;
      max-width: 300px;
      word-wrap: break-word;
    `;
    tooltip.textContent = info;

    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.bottom + 10}px`;

    this.overlay?.appendChild(tooltip);

    // Remove tooltip after 3 seconds
    setTimeout(() => {
      tooltip.remove();
    }, 3000);
  }

  clearHighlight() {
    if (this.highlightedElement) {
      this.highlightedElement.style.outline = '';
      this.highlightedElement = null;
    }
  }
}

// State Debugger
export class StateDebugger {
  private states: Map<string, any> = new Map();
  private history: Array<{ timestamp: number; state: string; value: any }> = [];

  setState(name: string, value: any) {
    this.states.set(name, value);
    this.history.push({
      timestamp: Date.now(),
      state: name,
      value: JSON.parse(JSON.stringify(value)) // Deep clone
    });

    // Keep only last 100 entries
    if (this.history.length > 100) {
      this.history.shift();
    }
  }

  getState(name: string): any {
    return this.states.get(name);
  }

  getHistory(): Array<{ timestamp: number; state: string; value: any }> {
    return [...this.history];
  }

  getStateHistory(name: string): Array<{ timestamp: number; value: any }> {
    return this.history
      .filter(entry => entry.state === name)
      .map(entry => ({ timestamp: entry.timestamp, value: entry.value }));
  }

  timeTravel(name: string, timestamp: number) {
    const entry = this.history.find(e => e.state === name && e.timestamp === timestamp);
    if (entry) {
      this.states.set(name, entry.value);
      return entry.value;
    }
    return null;
  }
}

// Performance Monitor
export class PerformanceMonitor {
  private metrics: {
    renders: number;
    signals: number;
    memory: number;
    fps: number;
  } = {
    renders: 0,
    signals: 0,
    memory: 0,
    fps: 0
  };

  private frameCount = 0;
  private lastTime = performance.now();

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    // Monitor FPS
    const measureFPS = () => {
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - this.lastTime >= 1000) {
        this.metrics.fps = this.frameCount;
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);

    // Monitor memory usage
    setInterval(() => {
      if ('memory' in performance) {
        this.metrics.memory = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
      }
    }, 1000);
  }

  incrementMetric(metric: keyof typeof this.metrics) {
    this.metrics[metric]++;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  resetMetrics() {
    this.metrics = {
      renders: 0,
      signals: 0,
      memory: 0,
      fps: 0
    };
  }
} 