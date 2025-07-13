import { 
  state, 
  effect, 
  createStore, 
  useStore,
  Button,
  Input,
  Modal,
  Card,
  Alert,
  Spinner,
  createForm,
  validationRules,
  animations,
  initDevTools
} from '../src/index';

// Initialize dev tools
initDevTools();

// Advanced Demo Component
function AdvancedDemo() {
  const [currentTab, setCurrentTab] = state('components');
  const [showModal, setShowModal] = state(false);
  const [alerts, setAlerts] = state<Array<{ id: number; type: 'info' | 'success' | 'warning' | 'error'; message: string }>>([]);

  // Create a form
  const form = createForm({
    initialValues: {
      name: '',
      email: '',
      message: ''
    },
    validation: {
      name: validationRules.required,
      email: validationRules.email,
      message: { required: true, minLength: 10 }
    },
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
      addAlert('success', 'Form submitted successfully!');
      setShowModal(false);
    }
  });

  const [getFields, setFields] = useStore(form.fields);
  const [getIsValid, setIsValid] = useStore(form.isValid);
  const [getErrors, setErrors] = useStore(form.errors);

  // Create a global store
  const userStore = createStore({
    name: 'John Doe',
    preferences: {
      theme: 'light',
      notifications: true
    }
  });

  const [getUser, setUser] = useStore(userStore);

  // Add alert function
  function addAlert(type: 'info' | 'success' | 'warning' | 'error', message: string) {
    const id = Date.now();
    setAlerts([...alerts(), { id, type, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setAlerts(alerts().filter(alert => alert.id !== id));
    }, 5000);
  }

  // Create main container
  const container = document.createElement('div');
  container.style.cssText = `
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    text-align: center;
    margin-bottom: 40px;
  `;

  const title = document.createElement('h1');
  title.textContent = '🔥 Blaze UI Advanced Demo';
  title.style.cssText = `
    color: #333;
    margin-bottom: 10px;
  `;

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Showcasing all the advanced features and tools';
  subtitle.style.cssText = `
    color: #666;
    font-size: 18px;
  `;

  header.appendChild(title);
  header.appendChild(subtitle);

  // Navigation
  const nav = document.createElement('div');
  nav.style.cssText = `
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    justify-content: center;
  `;

  const tabs = [
    { id: 'components', label: 'Components' },
    { id: 'forms', label: 'Forms' },
    { id: 'animations', label: 'Animations' },
    { id: 'store', label: 'State Management' },
    { id: 'devtools', label: 'Dev Tools' }
  ];

  tabs.forEach(tab => {
    const button = Button({
      children: tab.label,
      variant: currentTab() === tab.id ? 'primary' : 'secondary',
      onClick: () => setCurrentTab(tab.id)
    });
    nav.appendChild(button);
  });

  // Content area
  const content = document.createElement('div');
  content.id = 'content';

  // Reactive effect to update content
  effect(() => {
    content.innerHTML = '';
    
    switch (currentTab()) {
      case 'components':
        content.appendChild(renderComponentsTab());
        break;
      case 'forms':
        content.appendChild(renderFormsTab());
        break;
      case 'animations':
        content.appendChild(renderAnimationsTab());
        break;
      case 'store':
        content.appendChild(renderStoreTab());
        break;
      case 'devtools':
        content.appendChild(renderDevToolsTab());
        break;
    }
  });

  // Alerts container
  const alertsContainer = document.createElement('div');
  alertsContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    max-width: 400px;
  `;

  effect(() => {
    alertsContainer.innerHTML = '';
    alerts().forEach(alert => {
      const alertElement = Alert({
        type: alert.type,
        message: alert.message,
        dismissible: true,
        onDismiss: () => {
          setAlerts(alerts().filter(a => a.id !== alert.id));
        }
      });
      alertsContainer.appendChild(alertElement);
    });
  });

  // Modal
  const modal = Modal({
    isOpen: showModal(),
    title: 'Contact Form',
    children: renderContactForm(),
    onClose: () => setShowModal(false),
    size: 'medium'
  });

  // Assemble the component
  container.appendChild(header);
  container.appendChild(nav);
  container.appendChild(content);
  container.appendChild(alertsContainer);
  container.appendChild(modal);

  return container;

  // Tab render functions
  function renderComponentsTab() {
    const tab = document.createElement('div');
    tab.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    `;

    // Buttons showcase
    const buttonsCard = Card({
      title: 'Buttons',
      children: document.createElement('div')
    });
    const buttonsContainer = buttonsCard.querySelector('div');
    if (buttonsContainer) {
      buttonsContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      `;
      
      ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].forEach(variant => {
        buttonsContainer.appendChild(Button({
          children: variant.charAt(0).toUpperCase() + variant.slice(1),
          variant: variant as any,
          onClick: () => addAlert('info', `${variant} button clicked!`)
        }));
      });
    }

    // Inputs showcase
    const inputsCard = Card({
      title: 'Inputs',
      children: document.createElement('div')
    });
    const inputsContainer = inputsCard.querySelector('div');
    if (inputsContainer) {
      inputsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      
      inputsContainer.appendChild(Input({
        placeholder: 'Text input',
        onChange: (value) => console.log('Text input:', value)
      }));
      
      inputsContainer.appendChild(Input({
        type: 'email',
        placeholder: 'Email input',
        onChange: (value) => console.log('Email input:', value)
      }));
      
      inputsContainer.appendChild(Input({
        type: 'password',
        placeholder: 'Password input',
        onChange: (value) => console.log('Password input:', value)
      }));
    }

    // Spinner showcase
    const spinnerCard = Card({
      title: 'Spinners',
      children: document.createElement('div')
    });
    const spinnerContainer = spinnerCard.querySelector('div');
    if (spinnerContainer) {
      spinnerContainer.style.cssText = `
        display: flex;
        gap: 20px;
        align-items: center;
      `;
      
      spinnerContainer.appendChild(Spinner({ size: 'small' }));
      spinnerContainer.appendChild(Spinner({ size: 'medium' }));
      spinnerContainer.appendChild(Spinner({ size: 'large' }));
    }

    // Action buttons
    const actionsCard = Card({
      title: 'Actions',
      children: document.createElement('div')
    });
    const actionsContainer = actionsCard.querySelector('div');
    if (actionsContainer) {
      actionsContainer.style.cssText = `
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      `;
      
      actionsContainer.appendChild(Button({
        children: 'Show Modal',
        onClick: () => setShowModal(true)
      }));
      
      actionsContainer.appendChild(Button({
        children: 'Add Alert',
        onClick: () => addAlert('info', 'This is an info alert!')
      }));
      
      actionsContainer.appendChild(Button({
        children: 'Success Alert',
        variant: 'success',
        onClick: () => addAlert('success', 'Operation completed successfully!')
      }));
      
      actionsContainer.appendChild(Button({
        children: 'Warning Alert',
        variant: 'warning',
        onClick: () => addAlert('warning', 'Please be careful!')
      }));
      
      actionsContainer.appendChild(Button({
        children: 'Error Alert',
        variant: 'danger',
        onClick: () => addAlert('error', 'Something went wrong!')
      }));
    }

    tab.appendChild(buttonsCard);
    tab.appendChild(inputsCard);
    tab.appendChild(spinnerCard);
    tab.appendChild(actionsCard);

    return tab;
  }

  function renderFormsTab() {
    const tab = document.createElement('div');
    tab.style.cssText = `
      max-width: 600px;
      margin: 0 auto;
    `;

    const formCard = Card({
      title: 'Contact Form',
      children: renderContactForm()
    });

    tab.appendChild(formCard);
    return tab;
  }

  function renderContactForm() {
    const form = document.createElement('div');
    form.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 16px;
    `;

    const fields = getFields();
    const errors = getErrors();

    // Name field
    const nameGroup = document.createElement('div');
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name *';
    nameLabel.style.cssText = `
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
    `;
    
    const nameInput = Input({
      value: fields.name?.value || '',
      onChange: (value) => form.setFieldValue('name', value),
      onBlur: () => form.setFieldTouched('name')
    });

    if (errors.name && fields.name?.touched) {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = errors.name;
      errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 4px;
      `;
      nameGroup.appendChild(errorDiv);
    }

    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    // Email field
    const emailGroup = document.createElement('div');
    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email *';
    emailLabel.style.cssText = `
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
    `;
    
    const emailInput = Input({
      type: 'email',
      value: fields.email?.value || '',
      onChange: (value) => form.setFieldValue('email', value),
      onBlur: () => form.setFieldTouched('email')
    });

    if (errors.email && fields.email?.touched) {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = errors.email;
      errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 4px;
      `;
      emailGroup.appendChild(errorDiv);
    }

    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(emailInput);

    // Message field
    const messageGroup = document.createElement('div');
    const messageLabel = document.createElement('label');
    messageLabel.textContent = 'Message *';
    messageLabel.style.cssText = `
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
    `;
    
    const messageTextarea = document.createElement('textarea');
    messageTextarea.value = fields.message?.value || '';
    messageTextarea.placeholder = 'Enter your message...';
    messageTextarea.style.cssText = `
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.2s ease;
      width: 100%;
      box-sizing: border-box;
      min-height: 100px;
      resize: vertical;
    `;
    messageTextarea.oninput = (e) => form.setFieldValue('message', (e.target as HTMLTextAreaElement).value);
    messageTextarea.onblur = () => form.setFieldTouched('message');

    if (errors.message && fields.message?.touched) {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = errors.message;
      errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 4px;
      `;
      messageGroup.appendChild(errorDiv);
    }

    messageGroup.appendChild(messageLabel);
    messageGroup.appendChild(messageTextarea);

    // Submit button
    const submitButton = Button({
      children: 'Submit',
      onClick: () => form.submitForm(),
      disabled: !getIsValid()
    });

    form.appendChild(nameGroup);
    form.appendChild(emailGroup);
    form.appendChild(messageGroup);
    form.appendChild(submitButton);

    return form;
  }

  function renderAnimationsTab() {
    const tab = document.createElement('div');
    tab.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    `;

    // Animation showcase
    const animationCard = Card({
      title: 'Animation Examples',
      children: document.createElement('div')
    });
    const animationContainer = animationCard.querySelector('div');
    if (animationContainer) {
      animationContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 16px;
      `;

      const animatedBox = document.createElement('div');
      animatedBox.style.cssText = `
        width: 100px;
        height: 100px;
        background: #667eea;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
      `;

      const controls = document.createElement('div');
      controls.style.cssText = `
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      `;

      controls.appendChild(Button({
        children: 'Fade In',
        onClick: () => animations.fadeIn(animatedBox, 1000)
      }));

      controls.appendChild(Button({
        children: 'Fade Out',
        onClick: () => animations.fadeOut(animatedBox, 1000)
      }));

      controls.appendChild(Button({
        children: 'Slide In',
        onClick: () => animations.slideIn(animatedBox, 'left', 1000)
      }));

      controls.appendChild(Button({
        children: 'Scale',
        onClick: () => animations.scale(animatedBox, 0, 1, 1000)
      }));

      controls.appendChild(Button({
        children: 'Rotate',
        onClick: () => animations.rotate(animatedBox, 0, 360, 2000)
      }));

      animationContainer.appendChild(animatedBox);
      animationContainer.appendChild(controls);
    }

    tab.appendChild(animationCard);
    return tab;
  }

  function renderStoreTab() {
    const tab = document.createElement('div');
    tab.style.cssText = `
      max-width: 600px;
      margin: 0 auto;
    `;

    const storeCard = Card({
      title: 'Global State Management',
      children: document.createElement('div')
    });
    const storeContainer = storeCard.querySelector('div');
    if (storeContainer) {
      storeContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 16px;
      `;

      // Display current state
      const stateDisplay = document.createElement('div');
      stateDisplay.style.cssText = `
        background: #f8f9fa;
        padding: 16px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 14px;
      `;

      effect(() => {
        const user = getUser();
        stateDisplay.textContent = JSON.stringify(user, null, 2);
      });

      // Controls
      const controls = document.createElement('div');
      controls.style.cssText = `
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      `;

      controls.appendChild(Button({
        children: 'Update Name',
        onClick: () => {
          setUser(prev => ({
            ...prev,
            name: `User ${Math.floor(Math.random() * 1000)}`
          }));
        }
      }));

      controls.appendChild(Button({
        children: 'Toggle Theme',
        onClick: () => {
          setUser(prev => ({
            ...prev,
            preferences: {
              ...prev.preferences,
              theme: prev.preferences.theme === 'light' ? 'dark' : 'light'
            }
          }));
        }
      }));

      controls.appendChild(Button({
        children: 'Toggle Notifications',
        onClick: () => {
          setUser(prev => ({
            ...prev,
            preferences: {
              ...prev.preferences,
              notifications: !prev.preferences.notifications
            }
          }));
        }
      }));

      storeContainer.appendChild(stateDisplay);
      storeContainer.appendChild(controls);
    }

    tab.appendChild(storeCard);
    return tab;
  }

  function renderDevToolsTab() {
    const tab = document.createElement('div');
    tab.style.cssText = `
      max-width: 600px;
      margin: 0 auto;
    `;

    const devToolsCard = Card({
      title: 'Developer Tools',
      children: document.createElement('div')
    });
    const devToolsContainer = devToolsCard.querySelector('div');
    if (devToolsContainer) {
      devToolsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 16px;
      `;

      const info = document.createElement('div');
      info.style.cssText = `
        background: #e3f2fd;
        padding: 16px;
        border-radius: 6px;
        border-left: 4px solid #2196f3;
      `;

      info.innerHTML = `
        <h4 style="margin: 0 0 8px 0; color: #1976d2;">Developer Tools Available</h4>
        <p style="margin: 0; color: #1976d2;">
          Look for the 🔥 button in the bottom-right corner of the screen to open the Blaze DevTools panel.
          The panel includes:
        </p>
        <ul style="margin: 8px 0 0 0; color: #1976d2;">
          <li>Signal tracking and debugging</li>
          <li>Component inspection</li>
          <li>Performance monitoring</li>
          <li>State time-travel debugging</li>
        </ul>
      `;

      const controls = document.createElement('div');
      controls.style.cssText = `
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      `;

      controls.appendChild(Button({
        children: 'Add Test Signal',
        onClick: () => {
          const [testSignal, setTestSignal] = state(Math.random());
          addAlert('info', `Test signal created with value: ${testSignal()}`);
        }
      }));

      controls.appendChild(Button({
        children: 'Trigger Effect',
        onClick: () => {
          effect(() => {
            console.log('Test effect triggered');
          });
          addAlert('info', 'Test effect created');
        }
      }));

      devToolsContainer.appendChild(info);
      devToolsContainer.appendChild(controls);
    }

    tab.appendChild(devToolsCard);
    return tab;
  }
}

// Auto-run the demo
if (typeof window !== 'undefined') {
  const demo = AdvancedDemo();
  document.body.appendChild(demo);
} 