# Quick Start Tutorial

This tutorial will guide you through building your first Blaze UI application. You'll learn the core concepts and build a simple counter app.

## Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- Node.js installed on your system
- A code editor (VS Code recommended)

## Step 1: Create a New Project

First, let's create a new directory and set up a basic HTML file:

```bash
mkdir my-blaze-app
cd my-blaze-app
```

Create an `index.html` file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Blaze App</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .counter {
            text-align: center;
            font-size: 3rem;
            margin: 20px 0;
            color: #667eea;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px;
        }
        button:hover {
            background: #5a6fd8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>My First Blaze App</h1>
        <div class="counter" id="counter">Count: 0</div>
        <div style="text-align: center;">
            <button id="increment">Increment</button>
            <button id="decrement">Decrement</button>
            <button id="reset">Reset</button>
        </div>
    </div>
    
    <script type="module">
        // We'll add Blaze UI code here
    </script>
</body>
</html>
```

## Step 2: Install Blaze UI

For this tutorial, we'll use the development version. In a real project, you would install via npm:

```bash
npm install blaze-ui
```

## Step 3: Add Blaze UI Code

Replace the script section with:

```javascript
<script type="module">
    // Import Blaze UI functions
    const { state, effect, Button } = await import('http://localhost:3000/src/index.js');
    
    // Create reactive state
    const [count, setCount] = state(0);
    
    // Create effect to update DOM
    effect(() => {
        const counterElement = document.getElementById('counter');
        counterElement.textContent = `Count: ${count()}`;
    });
    
    // Add event listeners
    document.getElementById('increment').addEventListener('click', () => {
        setCount(count() + 1);
    });
    
    document.getElementById('decrement').addEventListener('click', () => {
        setCount(count() - 1);
    });
    
    document.getElementById('reset').addEventListener('click', () => {
        setCount(0);
    });
    
    console.log('Blaze UI app loaded!');
</script>
```

## Step 4: Run the Development Server

Start the Blaze UI development server:

```bash
# In the blaze-ui directory
npm run dev
```

Then open your HTML file in a browser. You should see a working counter app!

## Understanding the Code

### State Management

```javascript
const [count, setCount] = state(0);
```

- `state(0)` creates a reactive state with initial value `0`
- Returns a tuple: `[getter, setter]`
- `count()` gets the current value
- `setCount(newValue)` updates the value

### Effects

```javascript
effect(() => {
    const counterElement = document.getElementById('counter');
    counterElement.textContent = `Count: ${count()}`;
});
```

- Effects run when dependencies change
- In this case, when `count()` changes, the DOM updates automatically
- This creates reactive UI updates

## Next Steps

Now that you have a basic app working, try these enhancements:

1. **Add more state**: Create a second counter
2. **Use components**: Replace buttons with Blaze UI Button components
3. **Add validation**: Prevent negative numbers
4. **Add animations**: Use the animation system

## Common Issues

### Import Error
If you get an import error, make sure:
- The development server is running on `http://localhost:3000`
- You're using the correct import path

### State Not Updating
If the counter doesn't update:
- Check that you're calling `setCount()` correctly
- Verify the effect is reading from `count()`

## What You've Learned

- ✅ How to create reactive state
- ✅ How to use effects for DOM updates
- ✅ How to handle user interactions
- ✅ Basic Blaze UI concepts

Ready for more? Check out the [State Management](../core/state-management.md) guide to learn advanced patterns! 