# Blaze UI: A Fast and Easy-to-Use UI Library

**Blaze UI** is a modern, lightweight UI library that combines the simplicity of React with the performance of Svelte and the reactivity of SolidJS. Built with TypeScript and designed for modern web applications.

![Blaze UI](https://img.shields.io/badge/Blaze-UI-667eea?style=for-the-badge&logo=fire&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## ✨ Key Features

- **⚡ Reactive State Management**: Automatic updates when state changes
- **🎯 Simplified API**: Fewer concepts to learn than React
- **🚀 High Performance**: Optimized for speed and small bundle size
- **🛠️ Built-in Components**: Button, Input, Modal, Card, Alert, Spinner
- **📝 TypeScript Support**: First-class TypeScript support
- **🎨 Animation System**: Built-in animations and transitions
- **📋 Form System**: Validation and form management
- **🌐 Routing**: Built-in client-side routing
- **🔧 Developer Tools**: Hot reloading and debugging tools
- **📦 Zero Dependencies**: No React or other heavy dependencies

---

## 🚀 Quick Start

### Installation

```bash
npm install blaze-ui
```

### Basic Usage

```jsx
import { state, effect, Button, Input } from 'blaze-ui';

// Create reactive state
const [count, setCount] = state(0);

// Create effect to update DOM
effect(() => {
  document.getElementById('counter').textContent = `Count: ${count()}`;
});

// Create components
const button = Button({
  children: 'Increment',
  onClick: () => setCount(count() + 1)
});

const input = Input({
  placeholder: 'Enter text...',
  onChange: (value) => console.log('Input:', value)
});
```

### Live Demos

- **🎮 Interactive Demo**: [http://localhost:3000/demo/working-test.html](http://localhost:3000/demo/working-test.html)
- **🧪 Simple Test**: [http://localhost:3000/demo/simple-test.html](http://localhost:3000/demo/simple-test.html)
- **🔧 Basic Test**: [http://localhost:3000/demo/basic-test.html](http://localhost:3000/demo/basic-test.html)

---

## 📚 Documentation

### Core Concepts

#### State Management

```jsx
import { state } from 'blaze-ui';

// Create reactive state
const [count, setCount] = state(0);

// Read state
console.log(count()); // 0

// Update state
setCount(5);
console.log(count()); // 5

// Update with function
setCount(prev => prev + 1);
console.log(count()); // 6
```

#### Effects

```jsx
import { state, effect } from 'blaze-ui';

const [name, setName] = state('John');

// Create effect that runs when dependencies change
effect(() => {
  document.title = `Hello, ${name()}!`;
});

// Effect will automatically run when name changes
setName('Jane'); // Title updates to "Hello, Jane!"
```

#### Components

```jsx
import { Button, Input, Card, Alert } from 'blaze-ui';

// Button component
const button = Button({
  children: 'Click me',
  variant: 'primary',
  onClick: () => alert('Clicked!')
});

// Input component
const input = Input({
  placeholder: 'Enter text...',
  onChange: (value) => console.log(value)
});

// Card component
const card = Card({
  title: 'My Card',
  children: 'Card content here'
});

// Alert component
const alert = Alert({
  type: 'success',
  message: 'Operation completed!',
  dismissible: true
});
```

### Advanced Features

#### Store Management

```jsx
import { createStore, useStore } from 'blaze-ui';

// Create global store
const userStore = createStore({
  name: 'John Doe',
  age: 30,
  preferences: { theme: 'light' }
});

// Use store in components
const [getUser, setUser] = useStore(userStore);

// Update store
setUser(prev => ({
  ...prev,
  age: 31
}));
```

#### Form System

```jsx
import { createForm, validationRules } from 'blaze-ui';

const form = createForm({
  initialValues: {
    email: '',
    password: ''
  },
  validation: {
    email: validationRules.required,
    password: [validationRules.required, validationRules.minLength(8)]
  },
  onSubmit: (values) => {
    console.log('Form submitted:', values);
  }
});
```

#### Animation System

```jsx
import { animations } from 'blaze-ui';

// Fade in animation
const element = document.getElementById('my-element');
const cancelAnimation = animations.fadeIn(element, 300);

// Cancel animation
cancelAnimation();
```

---

## 🛠️ Development

### Running the Development Server

```bash
npm run dev
```

The development server will start at `http://localhost:3000/`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Project Structure

```
blaze-ui/
├── src/
│   ├── core/           # Core reactive system
│   ├── components/     # UI components
│   ├── forms/          # Form system
│   ├── animation/      # Animation system
│   ├── router/         # Routing
│   ├── store/          # State management
│   ├── devtools/       # Developer tools
│   └── utils/          # Utilities
├── demo/               # Demo applications
├── tests/              # Test files
└── examples/           # Example applications
```

---

## 🎯 Why Choose Blaze UI?

### vs React
- **Smaller bundle size** - No React runtime
- **Simpler API** - Fewer concepts to learn
- **Better performance** - Direct DOM manipulation
- **No JSX transformation** - Pure JavaScript

### vs Svelte
- **Familiar API** - React-like patterns
- **No build step required** - Works in browser
- **TypeScript support** - Better type safety

### vs SolidJS
- **Easier learning curve** - Simpler concepts
- **Built-in components** - Ready to use
- **Form system** - Validation included

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Make your changes
6. Run tests: `npm run test`
7. Submit a pull request

---

## 📄 License

Blaze UI is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Inspired by React, Svelte, and SolidJS
- Built with TypeScript and Vite
- Community-driven development

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/blaze-ui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/blaze-ui/discussions)

---

**Made with ❤️ by the Blaze UI team**
