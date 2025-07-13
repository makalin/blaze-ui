import { state, effect } from '../core/reactivity';
import { animations } from '../animation';

// Button component
export function Button(props: {
  children: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const {
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    onClick,
    className = ''
  } = props;

  const button = document.createElement('button');
  button.textContent = children;
  button.className = `blaze-btn blaze-btn-${variant} blaze-btn-${size} ${className}`;
  button.disabled = disabled || loading;

  if (loading) {
    button.innerHTML = `
      <span class="blaze-spinner"></span>
      ${children}
    `;
  }

  if (onClick) {
    button.onclick = onClick;
  }

  // Add styles
  button.style.cssText = `
    padding: ${size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px'};
    border: none;
    border-radius: 6px;
    font-size: ${size === 'small' ? '14px' : size === 'large' ? '18px' : '16px'};
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${getVariantColor(variant)};
    color: white;
    opacity: ${disabled || loading ? 0.6 : 1};
  `;

  return button;
}

// Input component
export function Input(props: {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}) {
  const {
    type = 'text',
    placeholder = '',
    value = '',
    disabled = false,
    required = false,
    onChange,
    onFocus,
    onBlur,
    className = ''
  } = props;

  const input = document.createElement('input');
  input.type = type;
  input.placeholder = placeholder;
  input.value = value;
  input.disabled = disabled;
  input.required = required;
  input.className = `blaze-input ${className}`;

  if (onChange) {
    input.oninput = (e) => onChange((e.target as HTMLInputElement).value);
  }

  if (onFocus) {
    input.onfocus = onFocus;
  }

  if (onBlur) {
    input.onblur = onBlur;
  }

  // Add styles
  input.style.cssText = `
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    background: ${disabled ? '#f5f5f5' : 'white'};
    color: ${disabled ? '#999' : '#333'};
  `;

  // Focus styles
  input.onfocus = () => {
    input.style.borderColor = '#667eea';
    if (onFocus) onFocus();
  };

  input.onblur = () => {
    input.style.borderColor = '#e1e5e9';
    if (onBlur) onBlur();
  };

  return input;
}

// Modal component
export function Modal(props: {
  isOpen: boolean;
  title?: string;
  children: HTMLElement | DocumentFragment | string;
  onClose?: () => void;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
}) {
  const {
    isOpen,
    title = '',
    children,
    onClose,
    size = 'medium',
    showCloseButton = true
  } = props;

  const modal = document.createElement('div');
  modal.className = 'blaze-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: ${isOpen ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  const modalContent = document.createElement('div');
  modalContent.className = 'blaze-modal-content';
  modalContent.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 0;
    max-width: ${size === 'small' ? '400px' : size === 'large' ? '800px' : '600px'};
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.8);
    transition: transform 0.3s ease;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  `;

  // Header
  if (title || showCloseButton) {
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 20px 24px;
      border-bottom: 1px solid #e1e5e9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    if (title) {
      const titleElement = document.createElement('h2');
      titleElement.textContent = title;
      titleElement.style.cssText = `
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
      `;
      header.appendChild(titleElement);
    }

    if (showCloseButton) {
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
      `;

      closeButton.onmouseenter = () => {
        closeButton.style.backgroundColor = '#f5f5f5';
      };

      closeButton.onmouseleave = () => {
        closeButton.style.backgroundColor = 'transparent';
      };

      closeButton.onclick = () => {
        if (onClose) onClose();
      };

      header.appendChild(closeButton);
    }

    modalContent.appendChild(header);
  }

  // Body
  const body = document.createElement('div');
  body.style.cssText = `
    padding: 24px;
  `;

  if (typeof children === 'string') {
    body.textContent = children;
  } else if (children instanceof DocumentFragment) {
    body.appendChild(children);
  } else {
    body.appendChild(children);
  }

  modalContent.appendChild(body);

  // Close on backdrop click
  modal.onclick = (e) => {
    if (e.target === modal && onClose) {
      onClose();
    }
  };

  modal.appendChild(modalContent);

  // Animate in/out
  if (isOpen) {
    setTimeout(() => {
      modal.style.opacity = '1';
      modalContent.style.transform = 'scale(1)';
    }, 10);
  } else {
    modal.style.opacity = '0';
    modalContent.style.transform = 'scale(0.8)';
  }

  return modal;
}

// Card component
export function Card(props: {
  title?: string;
  children: HTMLElement | DocumentFragment | string;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}) {
  const { title, children, variant = 'default', className = '' } = props;

  const card = document.createElement('div');
  card.className = `blaze-card blaze-card-${variant} ${className}`;

  let cardStyles = `
    background: white;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;
  `;

  switch (variant) {
    case 'elevated':
      cardStyles += `
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      `;
      break;
    case 'outlined':
      cardStyles += `
        border: 1px solid #e1e5e9;
      `;
      break;
    default:
      cardStyles += `
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      `;
  }

  card.style.cssText = cardStyles;

  if (title) {
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 16px 20px;
      border-bottom: 1px solid #e1e5e9;
      background: #f8f9fa;
    `;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.cssText = `
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    `;

    header.appendChild(titleElement);
    card.appendChild(header);
  }

  const body = document.createElement('div');
  body.style.cssText = `
    padding: 20px;
  `;

  if (typeof children === 'string') {
    body.textContent = children;
  } else if (children instanceof DocumentFragment) {
    body.appendChild(children);
  } else {
    body.appendChild(children);
  }

  card.appendChild(body);

  return card;
}

// Alert component
export function Alert(props: {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}) {
  const { type, title, message, dismissible = false, onDismiss } = props;

  const alert = document.createElement('div');
  alert.className = `blaze-alert blaze-alert-${type}`;

  const colors = {
    info: { bg: '#e3f2fd', border: '#2196f3', text: '#1976d2' },
    success: { bg: '#e8f5e8', border: '#4caf50', text: '#2e7d32' },
    warning: { bg: '#fff3e0', border: '#ff9800', text: '#f57c00' },
    error: { bg: '#ffebee', border: '#f44336', text: '#d32f2f' }
  };

  const color = colors[type];

  alert.style.cssText = `
    padding: 12px 16px;
    border: 1px solid ${color.border};
    border-radius: 6px;
    background: ${color.bg};
    color: ${color.text};
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  `;

  const icon = document.createElement('span');
  icon.innerHTML = getAlertIcon(type);
  icon.style.cssText = `
    font-size: 20px;
    flex-shrink: 0;
    margin-top: 2px;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    flex: 1;
  `;

  if (title) {
    const titleElement = document.createElement('div');
    titleElement.textContent = title;
    titleElement.style.cssText = `
      font-weight: 600;
      margin-bottom: 4px;
    `;
    content.appendChild(titleElement);
  }

  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  content.appendChild(messageElement);

  alert.appendChild(icon);
  alert.appendChild(content);

  if (dismissible) {
    const dismissButton = document.createElement('button');
    dismissButton.innerHTML = '&times;';
    dismissButton.style.cssText = `
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: ${color.text};
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s ease;
      flex-shrink: 0;
    `;

    dismissButton.onmouseenter = () => {
      dismissButton.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    };

    dismissButton.onmouseleave = () => {
      dismissButton.style.backgroundColor = 'transparent';
    };

    dismissButton.onclick = () => {
      if (onDismiss) onDismiss();
      alert.remove();
    };

    alert.appendChild(dismissButton);
  }

  return alert;
}

// Helper functions
function getVariantColor(variant: string): string {
  const colors = {
    primary: '#667eea',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };
  return colors[variant as keyof typeof colors] || colors.primary;
}

function getAlertIcon(type: string): string {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  return icons[type as keyof typeof icons] || icons.info;
}

// Spinner component
export function Spinner(props: {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}) {
  const { size = 'medium', color = '#667eea', className = '' } = props;

  const spinner = document.createElement('div');
  spinner.className = `blaze-spinner ${className}`;

  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px'
  };

  spinner.style.cssText = `
    width: ${sizeMap[size]};
    height: ${sizeMap[size]};
    border: 2px solid #f3f3f3;
    border-top: 2px solid ${color};
    border-radius: 50%;
    animation: blaze-spin 1s linear infinite;
  `;

  // Add keyframes if not already added
  if (!document.querySelector('#blaze-spinner-styles')) {
    const style = document.createElement('style');
    style.id = 'blaze-spinner-styles';
    style.textContent = `
      @keyframes blaze-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  return spinner;
} 