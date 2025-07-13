# Contributing to Blaze UI

Thank you for your interest in contributing to Blaze UI! This guide will help you get started with contributing to the project.

## 🤝 How to Contribute

We welcome contributions of all kinds:

- 🐛 **Bug reports** - Help us fix issues
- 💡 **Feature requests** - Suggest new features
- 📝 **Documentation** - Improve our docs
- 🔧 **Code contributions** - Submit pull requests
- 🧪 **Testing** - Help test features
- 🌟 **Examples** - Create example applications

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/makalin/blaze-ui.git
   cd blaze-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Main page: http://localhost:3000/
   - Working test: http://localhost:3000/demo/working-test.html
   - Simple test: http://localhost:3000/demo/simple-test.html

## 📁 Project Structure

```
blaze-ui/
├── src/                    # Source code
│   ├── core/              # Core reactive system
│   │   ├── reactivity.ts  # State management
│   │   ├── Component.ts   # Base component class
│   │   └── renderer.ts    # DOM rendering
│   ├── components/        # UI components
│   ├── forms/            # Form system
│   ├── animation/        # Animation system
│   ├── router/           # Routing
│   ├── store/            # State management
│   ├── devtools/         # Developer tools
│   └── utils/            # Utilities
├── demo/                 # Demo applications
├── docs/                 # Documentation
├── tests/                # Test files
├── examples/             # Example applications
└── package.json          # Project configuration
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- tests/reactivity.test.ts
```

### Writing Tests

Tests should be written in TypeScript and use Vitest. Example:

```typescript
import { describe, it, expect } from 'vitest';
import { state, effect } from '../src/core/reactivity';

describe('State Management', () => {
  it('should create state with initial value', () => {
    const [count, setCount] = state(0);
    expect(count()).toBe(0);
  });

  it('should update state', () => {
    const [count, setCount] = state(0);
    setCount(5);
    expect(count()).toBe(5);
  });
});
```

## 📝 Code Style

### TypeScript

- Use TypeScript for all new code
- Provide proper type annotations
- Use interfaces for object shapes
- Prefer `const` over `let` when possible

### Code Formatting

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:
```
feat(components): add new Button component
fix(core): resolve infinite loop in effects
docs(api): update state management documentation
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Try to reproduce the bug in the latest version
3. Check the browser console for errors

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g. Chrome 91]
- OS: [e.g. macOS 12.0]
- Blaze UI version: [e.g. 1.0.0]

## Additional Information
Screenshots, console logs, etc.
```

## 💡 Feature Requests

### Before Requesting

1. Check if the feature already exists
2. Consider if it fits the project's scope
3. Think about the implementation approach

### Feature Request Template

```markdown
## Feature Description
Brief description of the feature

## Use Case
Why this feature would be useful

## Proposed Implementation
How you think it could be implemented

## Alternatives Considered
Other approaches you've considered

## Additional Information
Any other relevant details
```

## 🔧 Pull Requests

### Before Submitting

1. **Fork and clone** the repository
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Run tests** to ensure everything works
7. **Commit your changes** with proper commit messages

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] No breaking changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on multiple browsers
4. **Documentation** review
5. **Final approval** and merge

## 📚 Documentation

### Writing Documentation

- Use clear, concise language
- Include code examples
- Follow the existing style
- Test all code examples

### Documentation Structure

```
docs/
├── getting-started/     # Tutorials and guides
├── core/               # Core feature docs
├── components/         # Component docs
├── advanced/           # Advanced features
├── api/                # API reference
├── guides/             # Best practices
└── examples/           # Example applications
```

## 🎯 Development Guidelines

### Core Principles

1. **Simplicity** - Keep the API simple and intuitive
2. **Performance** - Optimize for speed and small bundle size
3. **Type Safety** - Provide excellent TypeScript support
4. **Developer Experience** - Great tooling and debugging

### Code Quality

- Write clean, readable code
- Add comments for complex logic
- Follow established patterns
- Consider edge cases
- Write comprehensive tests

### Performance

- Minimize bundle size
- Optimize for runtime performance
- Use efficient algorithms
- Avoid memory leaks

## 🆘 Getting Help

### Questions and Discussion

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bugs and feature requests
- **Documentation**: Check the docs first

### Community Guidelines

- Be respectful and inclusive
- Help others learn
- Share knowledge and examples
- Follow the code of conduct

## 📄 License

By contributing to Blaze UI, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project documentation
- Community acknowledgments

---

Thank you for contributing to Blaze UI! Your help makes the project better for everyone. 🚀 