import { state, effect } from '../src/core/reactivity';

// Simple counter example
function createCounter() {
  const [count, setCount] = state(0);
  
  // Create DOM elements
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';
  
  const title = document.createElement('h2');
  title.textContent = 'Blaze UI Counter';
  
  const display = document.createElement('div');
  display.style.fontSize = '24px';
  display.style.margin = '20px 0';
  display.style.fontWeight = 'bold';
  
  const incrementBtn = document.createElement('button');
  incrementBtn.textContent = 'Increment';
  incrementBtn.style.padding = '10px 20px';
  incrementBtn.style.margin = '5px';
  incrementBtn.style.fontSize = '16px';
  
  const decrementBtn = document.createElement('button');
  decrementBtn.textContent = 'Decrement';
  decrementBtn.style.padding = '10px 20px';
  decrementBtn.style.margin = '5px';
  decrementBtn.style.fontSize = '16px';
  
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.style.padding = '10px 20px';
  resetBtn.style.margin = '5px';
  resetBtn.style.fontSize = '16px';
  
  // Set up event listeners
  incrementBtn.onclick = () => setCount(count() + 1);
  decrementBtn.onclick = () => setCount(count() - 1);
  resetBtn.onclick = () => setCount(0);
  
  // Reactive effect to update display
  effect(() => {
    display.textContent = `Count: ${count()}`;
    display.style.color = count() > 0 ? 'green' : count() < 0 ? 'red' : 'black';
  });
  
  // Assemble the component
  container.appendChild(title);
  container.appendChild(display);
  container.appendChild(incrementBtn);
  container.appendChild(decrementBtn);
  container.appendChild(resetBtn);
  
  return container;
}

// Export for use in other files
export { createCounter };

// Auto-run if this file is loaded directly
if (typeof window !== 'undefined') {
  const counter = createCounter();
  document.body.appendChild(counter);
} 