import { render, state, effect, createStore, useStore } from '../src/index';

// Simple Counter Component
function Counter() {
  const [count, setCount] = state(0);
  
  const counterDiv = document.createElement('div');
  counterDiv.className = 'demo-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Counter Example';
  
  const display = document.createElement('div');
  display.className = 'counter';
  
  const incrementBtn = document.createElement('button');
  incrementBtn.textContent = 'Increment';
  incrementBtn.onclick = () => setCount(count() + 1);
  
  const decrementBtn = document.createElement('button');
  decrementBtn.textContent = 'Decrement';
  decrementBtn.onclick = () => setCount(count() - 1);
  
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.onclick = () => setCount(0);
  
  // Reactive effect to update display
  effect(() => {
    display.textContent = `Count: ${count()}`;
  });
  
  counterDiv.appendChild(title);
  counterDiv.appendChild(display);
  counterDiv.appendChild(incrementBtn);
  counterDiv.appendChild(decrementBtn);
  counterDiv.appendChild(resetBtn);
  
  return counterDiv;
}

// Todo List Component
function TodoList() {
  const [todos, setTodos] = state<Array<{ id: number; text: string; completed: boolean }>>([]);
  const [newTodo, setNewTodo] = state('');
  
  const todoDiv = document.createElement('div');
  todoDiv.className = 'demo-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Todo List Example';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Add a new todo...';
  input.value = newTodo();
  
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Todo';
  
  const todoList = document.createElement('div');
  
  // Reactive effects
  effect(() => {
    input.value = newTodo();
  });
  
  effect(() => {
    todoList.innerHTML = '';
    todos().forEach(todo => {
      const todoItem = document.createElement('div');
      todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.onchange = () => {
        setTodos(todos().map(t => 
          t.id === todo.id ? { ...t, completed: checkbox.checked } : t
        ));
      };
      
      const text = document.createElement('span');
      text.textContent = todo.text;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => {
        setTodos(todos().filter(t => t.id !== todo.id));
      };
      
      todoItem.appendChild(checkbox);
      todoItem.appendChild(text);
      todoItem.appendChild(deleteBtn);
      todoList.appendChild(todoItem);
    });
  });
  
  addBtn.onclick = () => {
    if (newTodo().trim()) {
      setTodos([...todos(), {
        id: Date.now(),
        text: newTodo().trim(),
        completed: false
      }]);
      setNewTodo('');
    }
  };
  
  input.oninput = (e) => {
    setNewTodo((e.target as HTMLInputElement).value);
  };
  
  todoDiv.appendChild(title);
  todoDiv.appendChild(input);
  todoDiv.appendChild(addBtn);
  todoDiv.appendChild(todoList);
  
  return todoDiv;
}

// Store Example
function StoreExample() {
  // Create a global store
  const userStore = createStore({
    name: 'John Doe',
    age: 30,
    preferences: {
      theme: 'light',
      language: 'en'
    }
  });
  
  const [getUser, setUser] = useStore(userStore);
  
  const storeDiv = document.createElement('div');
  storeDiv.className = 'demo-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Store Example';
  
  const userInfo = document.createElement('div');
  
  const updateNameBtn = document.createElement('button');
  updateNameBtn.textContent = 'Update Name';
  updateNameBtn.onclick = () => {
    setUser(prev => ({
      ...prev,
      name: `User ${Math.floor(Math.random() * 1000)}`
    }));
  };
  
  const updateAgeBtn = document.createElement('button');
  updateAgeBtn.textContent = 'Update Age';
  updateAgeBtn.onclick = () => {
    setUser(prev => ({
      ...prev,
      age: Math.floor(Math.random() * 50) + 18
    }));
  };
  
  const toggleThemeBtn = document.createElement('button');
  toggleThemeBtn.textContent = 'Toggle Theme';
  toggleThemeBtn.onclick = () => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: prev.preferences.theme === 'light' ? 'dark' : 'light'
      }
    }));
  };
  
  // Reactive effect to update user info
  effect(() => {
    const user = getUser();
    userInfo.innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Age:</strong> ${user.age}</p>
      <p><strong>Theme:</strong> ${user.preferences.theme}</p>
      <p><strong>Language:</strong> ${user.preferences.language}</p>
    `;
  });
  
  storeDiv.appendChild(title);
  storeDiv.appendChild(userInfo);
  storeDiv.appendChild(updateNameBtn);
  storeDiv.appendChild(updateAgeBtn);
  storeDiv.appendChild(toggleThemeBtn);
  
  return storeDiv;
}

// Main App Component
function App() {
  const appDiv = document.createElement('div');
  
  // Navigation
  const nav = document.createElement('div');
  nav.className = 'nav';
  
  const counterLink = document.createElement('a');
  counterLink.href = '#counter';
  counterLink.textContent = 'Counter';
  counterLink.onclick = (e) => {
    e.preventDefault();
    showSection('counter');
  };
  
  const todoLink = document.createElement('a');
  todoLink.href = '#todo';
  todoLink.textContent = 'Todo List';
  todoLink.onclick = (e) => {
    e.preventDefault();
    showSection('todo');
  };
  
  const storeLink = document.createElement('a');
  storeLink.href = '#store';
  storeLink.textContent = 'Store';
  storeLink.onclick = (e) => {
    e.preventDefault();
    showSection('store');
  };
  
  nav.appendChild(counterLink);
  nav.appendChild(todoLink);
  nav.appendChild(storeLink);
  
  // Content area
  const content = document.createElement('div');
  content.id = 'content';
  
  appDiv.appendChild(nav);
  appDiv.appendChild(content);
  
  // Navigation function
  function showSection(section: string) {
    // Update active nav link
    nav.querySelectorAll('a').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = nav.querySelector(`a[href="#${section}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
    
    // Show section
    content.innerHTML = '';
    let sectionComponent;
    
    switch (section) {
      case 'counter':
        sectionComponent = Counter();
        break;
      case 'todo':
        sectionComponent = TodoList();
        break;
      case 'store':
        sectionComponent = StoreExample();
        break;
      default:
        sectionComponent = Counter();
    }
    
    content.appendChild(sectionComponent);
  }
  
  // Show counter by default
  showSection('counter');
  
  return appDiv;
}

// Render the app
const appContainer = document.getElementById('app');
if (appContainer) {
  const app = App();
  appContainer.appendChild(app);
} 