# Blaze: A Fast and Easy-to-Use UI Library

**Blaze** is a modern UI library that combines the simplicity of React with the performance of Svelte and the reactivity of SolidJS. It's designed to be fast, easy to learn, and powerful enough for any project.

> 🚧 This project is currently being uploaded. A dedicated domain and team details will be added soon.

---

## Key Features
- **Reactive State Management**: Components automatically update when state changes—no need for manual reconciliation.
- **Simplified API**: Fewer concepts to learn, with intuitive state and effect handling.
- **Built-in Routing and State Management**: No need for additional libraries like React Router or Redux.
- **High Performance**: Optimized for speed and small bundle size using compile-time optimizations.
- **Excellent Developer Tools**: Hot reloading, time travel debugging, and visual component tree inspection.
- **TypeScript Support**: First-class support for type-safe development.

---

## Installation
Install Blaze using npm or yarn:

```bash
npm install blaze-ui
````

Or with yarn:

```bash
yarn add blaze-ui
```

---

## Quick Start

Here's a simple example to get you started:

```jsx
import { Component, state } from 'blaze-ui';

const App = () => {
  const [count, setCount] = state(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
};

render(<App />, document.getElementById('root'));
```

* `state` is used for reactive state management.
* Components automatically re-render when state changes.
* No need for hooks like `useState` or `useEffect`.

---

## Documentation

> Full documentation will be available soon. 

---

## Why Choose Blaze?

* **Faster Than React**: Reactive updates and compile-time optimizations ensure lightning-fast performance.
* **Easier Than React**: Simplified API and built-in features reduce the learning curve and setup time.
* **Future-Proof**: Designed with modern web development in mind, Blaze is ready for the next generation of applications.

---

## Contributing

Contributions are welcome and appreciated. Contribution guidelines will be published as development progresses.

---

## License

Blaze is licensed under the MIT License. See `LICENSE` for more information.

---

## Credits

* Inspired by React, Svelte, SolidJS, and other modern UI libraries.
* Project initialization by the creator; team details coming soon.
