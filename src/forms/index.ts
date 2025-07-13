import { createSignal, effect } from '../core/reactivity';

// Form field types
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';

// Validation rule
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

// Form field
export interface FormField {
  name: string;
  type: FieldType;
  value: any;
  label?: string;
  placeholder?: string;
  options?: Array<{ value: any; label: string }>;
  validation?: ValidationRule;
  error?: string;
  touched: boolean;
}

// Form state
export interface FormState {
  fields: Record<string, FormField>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// Form configuration
export interface FormConfig {
  initialValues?: Record<string, any>;
  validation?: Record<string, ValidationRule>;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  onValidate?: (values: Record<string, any>) => Record<string, string>;
}

// Create a form
export function createForm(config: FormConfig = {}) {
  const { initialValues = {}, validation = {}, onSubmit, onValidate } = config;
  
  // Form state
  const [fields, setFields] = createSignal<Record<string, FormField>>({});
  const [isValid, setIsValid] = createSignal(true);
  const [isDirty, setIsDirty] = createSignal(false);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  
  // Initialize fields
  const initializeFields = () => {
    const initialFields: Record<string, FormField> = {};
    
    Object.entries(initialValues).forEach(([name, value]) => {
      initialFields[name] = {
        name,
        type: 'text',
        value,
        touched: false,
        validation: validation[name]
      };
    });
    
    setFields(initialFields);
  };
  
  // Validate a single field
  const validateField = (field: FormField): string | null => {
    const { value, validation: rules } = field;
    
    if (!rules) return null;
    
    // Required validation
    if (rules.required && (!value || value === '')) {
      return 'This field is required';
    }
    
    if (value === '' || value == null) return null;
    
    // Length validation
    if (rules.minLength && String(value).length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`;
    }
    
    if (rules.maxLength && String(value).length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(String(value))) {
      return 'Invalid format';
    }
    
    // Number validation
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `Minimum value is ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return `Maximum value is ${rules.max}`;
      }
    }
    
    // Custom validation
    if (rules.custom) {
      return rules.custom(value);
    }
    
    return null;
  };
  
  // Validate all fields
  const validateForm = (): Record<string, string> => {
    const currentFields = fields();
    const newErrors: Record<string, string> = {};
    
    Object.values(currentFields).forEach(field => {
      const error = validateField(field);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    // Custom validation
    if (onValidate) {
      const values = getValues();
      const customErrors = onValidate(values);
      Object.assign(newErrors, customErrors);
    }
    
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    
    return newErrors;
  };
  
  // Get form values
  const getValues = (): Record<string, any> => {
    const currentFields = fields();
    const values: Record<string, any> = {};
    
    Object.values(currentFields).forEach(field => {
      values[field.name] = field.value;
    });
    
    return values;
  };
  
  // Set field value
  const setFieldValue = (name: string, value: any) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        touched: true
      }
    }));
    
    setIsDirty(true);
    
    // Validate field on change
    const updatedFields = { ...fields(), [name]: { ...fields()[name], value, touched: true } };
    const error = validateField(updatedFields[name]);
    
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  };
  
  // Set field touched
  const setFieldTouched = (name: string, touched = true) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched
      }
    }));
  };
  
  // Reset form
  const resetForm = () => {
    initializeFields();
    setIsDirty(false);
    setIsSubmitting(false);
    setErrors({});
    setIsValid(true);
  };
  
  // Submit form
  const submitForm = async () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    if (!onSubmit) return;
    
    setIsSubmitting(true);
    
    try {
      const values = getValues();
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Initialize form
  initializeFields();
  
  // Auto-validate on field changes
  effect(() => {
    const currentFields = fields();
    if (Object.keys(currentFields).length > 0) {
      validateForm();
    }
  });
  
  return {
    // State
    fields,
    isValid,
    isDirty,
    isSubmitting,
    errors,
    
    // Actions
    setFieldValue,
    setFieldTouched,
    getValues,
    validateForm,
    resetForm,
    submitForm
  };
}

// Form field component
export function createFormField(
  name: string,
  type: FieldType,
  options: {
    label?: string;
    placeholder?: string;
    options?: Array<{ value: any; label: string }>;
    validation?: ValidationRule;
  } = {}
) {
  const { label, placeholder, options: fieldOptions, validation } = options;
  
  const field: FormField = {
    name,
    type,
    value: type === 'checkbox' ? false : type === 'number' ? 0 : '',
    label,
    placeholder,
    options: fieldOptions,
    validation,
    touched: false
  };
  
  return field;
}

// Predefined validation rules
export const validationRules = {
  required: { required: true },
  email: { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value) return null;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email format';
    }
  },
  password: { 
    required: true, 
    minLength: 8,
    custom: (value: string) => {
      if (!value) return null;
      if (value.length < 8) return 'Password must be at least 8 characters';
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
      return null;
    }
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    custom: (value: string) => {
      if (!value) return null;
      return /^[\+]?[1-9][\d]{0,15}$/.test(value) ? null : 'Invalid phone number';
    }
  },
  url: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (!value) return null;
      try {
        new URL(value);
        return null;
      } catch {
        return 'Invalid URL';
      }
    }
  }
};

// Form utilities
export const formUtils = {
  // Debounce function for validation
  debounce: (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Format form data
  formatFormData: (values: Record<string, any>): FormData => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  },
  
  // Parse form data
  parseFormData: (formData: FormData): Record<string, any> => {
    const values: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }
    return values;
  }
}; 