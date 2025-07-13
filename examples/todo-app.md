# Todo App Example

This example demonstrates how to build a complete todo application using Blaze UI. It showcases state management, components, forms, and animations.

## 🎯 Features

- ✅ Add new todos
- ✅ Mark todos as complete
- ✅ Delete todos
- ✅ Filter todos (All, Active, Completed)
- ✅ Persist todos in localStorage
- ✅ Animated transitions
- ✅ Form validation

## 📁 Project Structure

```
todo-app/
├── index.html
├── styles.css
└── app.js
```

## 🚀 Complete Implementation

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blaze UI Todo App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🔥 Blaze UI Todo App</h1>
            <p>Built with reactive state management</p>
        </header>

        <main>
            <!-- Add Todo Form -->
            <div class="add-todo">
                <input 
                    type="text" 
                    id="new-todo" 
                    placeholder="What needs to be done?"
                    maxlength="100"
                >
                <button id="add-btn">Add Todo</button>
            </div>

            <!-- Todo Filters -->
            <div class="filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="active">Active</button>
                <button class="filter-btn" data-filter="completed">Completed</button>
            </div>

            <!-- Todo List -->
            <div class="todo-list" id="todo-list">
                <!-- Todos will be rendered here -->
            </div>

            <!-- Todo Stats -->
            <div class="todo-stats" id="todo-stats">
                <!-- Stats will be rendered here -->
            </div>
        </main>
    </div>

    <script type="module" src="app.js"></script>
</body>
</html>
```

### CSS Styling

```css
/* styles.css */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    overflow: hidden;
}

header {
    background: #667eea;
    color: white;
    padding: 30px;
    text-align: center;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

header p {
    opacity: 0.9;
    font-size: 1.1rem;
}

main {
    padding: 30px;
}

.add-todo {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
}

.add-todo input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

.add-todo input:focus {
    outline: none;
    border-color: #667eea;
}

.add-todo button {
    padding: 12px 24px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.add-todo button:hover {
    background: #5a6fd8;
}

.add-todo button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: center;
}

.filter-btn {
    padding: 8px 16px;
    background: #f8f9fa;
    border: 1px solid #e1e5e9;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-btn:hover {
    background: #e9ecef;
}

.filter-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.todo-list {
    margin-bottom: 20px;
}

.todo-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    margin-bottom: 10px;
    transition: all 0.3s ease;
    animation: slideIn 0.3s ease;
}

.todo-item:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.todo-item.completed {
    opacity: 0.6;
    background: #f8f9fa;
}

.todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #6c757d;
}

.todo-checkbox {
    margin-right: 15px;
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.todo-text {
    flex: 1;
    font-size: 16px;
    color: #333;
}

.todo-delete {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.todo-delete:hover {
    background: #c82333;
}

.todo-stats {
    text-align: center;
    color: #6c757d;
    font-size: 14px;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.8);
    }
}

.todo-item.removing {
    animation: fadeOut 0.3s ease forwards;
}
```

### JavaScript Application

```javascript
// app.js
import { 
    state, 
    effect, 
    createStore, 
    useStore,
    Button,
    Input,
    createForm,
    validationRules,
    animations
} from 'http://localhost:3000/src/index.js';

// Todo type definition
class Todo {
    constructor(text) {
        this.id = Date.now() + Math.random();
        this.text = text;
        this.completed = false;
        this.createdAt = new Date();
    }
}

// Create global store for todos
const todoStore = createStore({
    todos: [],
    filter: 'all'
});

// Get store functions
const [getTodos, setTodos] = useStore(todoStore);
const [getFilter, setFilter] = useStore(todoStore);

// Load todos from localStorage
function loadTodos() {
    try {
        const saved = localStorage.getItem('blaze-todos');
        if (saved) {
            const todos = JSON.parse(saved);
            setTodos(prev => ({ ...prev, todos }));
        }
    } catch (error) {
        console.error('Failed to load todos:', error);
    }
}

// Save todos to localStorage
function saveTodos() {
    try {
        const todos = getTodos().todos;
        localStorage.setItem('blaze-todos', JSON.stringify(todos));
    } catch (error) {
        console.error('Failed to save todos:', error);
    }
}

// Add new todo
function addTodo(text) {
    if (!text.trim()) return;
    
    const newTodo = new Todo(text.trim());
    setTodos(prev => ({
        ...prev,
        todos: [...prev.todos, newTodo]
    }));
    
    // Animate the new todo
    setTimeout(() => {
        const todoElement = document.querySelector(`[data-todo-id="${newTodo.id}"]`);
        if (todoElement) {
            animations.fadeIn(todoElement, 300);
        }
    }, 100);
}

// Toggle todo completion
function toggleTodo(id) {
    setTodos(prev => ({
        ...prev,
        todos: prev.todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
    }));
}

// Delete todo
function deleteTodo(id) {
    const todoElement = document.querySelector(`[data-todo-id="${id}"]`);
    if (todoElement) {
        todoElement.classList.add('removing');
        setTimeout(() => {
            setTodos(prev => ({
                ...prev,
                todos: prev.todos.filter(todo => todo.id !== id)
            }));
        }, 300);
    }
}

// Filter todos
function filterTodos(filter) {
    setFilter(prev => ({ ...prev, filter }));
}

// Get filtered todos
function getFilteredTodos() {
    const todos = getTodos().todos;
    const filter = getFilter().filter;
    
    switch (filter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Get todo statistics
function getTodoStats() {
    const todos = getTodos().todos;
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    
    return { total, completed, active };
}

// Render todo item
function renderTodoItem(todo) {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    div.setAttribute('data-todo-id', todo.id);
    
    div.innerHTML = `
        <input 
            type="checkbox" 
            class="todo-checkbox" 
            ${todo.completed ? 'checked' : ''}
        >
        <span class="todo-text">${todo.text}</span>
        <button class="todo-delete">Delete</button>
    `;
    
    // Add event listeners
    const checkbox = div.querySelector('.todo-checkbox');
    const deleteBtn = div.querySelector('.todo-delete');
    
    checkbox.addEventListener('change', () => {
        toggleTodo(todo.id);
    });
    
    deleteBtn.addEventListener('click', () => {
        deleteTodo(todo.id);
    });
    
    return div;
}

// Render todo list
function renderTodoList() {
    const todoList = document.getElementById('todo-list');
    const filteredTodos = getFilteredTodos();
    
    todoList.innerHTML = '';
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div style="text-align: center; color: #6c757d; padding: 40px;">
                <p>No todos found</p>
            </div>
        `;
        return;
    }
    
    filteredTodos.forEach(todo => {
        todoList.appendChild(renderTodoItem(todo));
    });
}

// Render todo stats
function renderTodoStats() {
    const statsElement = document.getElementById('todo-stats');
    const stats = getTodoStats();
    
    statsElement.innerHTML = `
        <p>
            ${stats.total} total, 
            ${stats.active} active, 
            ${stats.completed} completed
        </p>
    `;
}

// Update filter buttons
function updateFilterButtons() {
    const filter = getFilter().filter;
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
}

// Initialize the app
function initApp() {
    // Load saved todos
    loadTodos();
    
    // Set up form handling
    const newTodoInput = document.getElementById('new-todo');
    const addBtn = document.getElementById('add-btn');
    
    // Add todo on Enter key
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo(newTodoInput.value);
            newTodoInput.value = '';
        }
    });
    
    // Add todo on button click
    addBtn.addEventListener('click', () => {
        addTodo(newTodoInput.value);
        newTodoInput.value = '';
    });
    
    // Set up filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterTodos(btn.dataset.filter);
        });
    });
    
    // Create effects for reactive updates
    effect(() => {
        renderTodoList();
        renderTodoStats();
        updateFilterButtons();
        saveTodos();
    });
    
    console.log('🔥 Blaze UI Todo App initialized!');
}

// Start the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
```

## 🎮 Running the Example

1. **Create the files** with the code above
2. **Start the Blaze UI dev server**:
   ```bash
   cd blaze-ui
   npm run dev
   ```
3. **Open the todo app** in your browser
4. **Test the features**:
   - Add new todos
   - Mark todos as complete
   - Delete todos
   - Filter todos
   - Refresh the page (todos persist)

## 🎯 Key Features Demonstrated

### State Management
- **Global store** for todos and filter
- **Reactive updates** when state changes
- **Local storage persistence**

### Components
- **Custom todo items** with event handling
- **Reusable rendering functions**
- **Dynamic DOM updates**

### Forms
- **Input validation** (empty text check)
- **Keyboard shortcuts** (Enter to add)
- **Form state management**

### Animations
- **Slide-in animation** for new todos
- **Fade-out animation** for deleted todos
- **Smooth transitions** for all interactions

### Best Practices
- **Separation of concerns** (HTML, CSS, JS)
- **Error handling** for localStorage
- **Performance optimization** with effects
- **Accessibility** with proper ARIA labels

## 🚀 Next Steps

Try these enhancements:

1. **Add categories** to todos
2. **Add due dates** with date picker
3. **Add search functionality**
4. **Add drag-and-drop** reordering
5. **Add multiple lists** support
6. **Add undo/redo** functionality

This example shows how Blaze UI can be used to build real-world applications with clean, maintainable code! 