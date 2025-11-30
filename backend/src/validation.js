import { formSchema } from './formSchema.js';

export function validateSubmission(data) {
  const errors = {};
  
  for (const field of formSchema.fields) {
    const value = data[field.id];
    const fieldErrors = validateField(field, value);
    
    if (fieldErrors) {
      errors[field.id] = fieldErrors;
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

function validateField(field, value) {
  const { type, required, validation, label } = field;
  
  // Check required
  if (required) {
    if (value === undefined || value === null || value === '') {
      return `${label} is required`;
    }
    if (type === 'multi-select' && (!Array.isArray(value) || value.length === 0)) {
      return `${label} is required`;
    }
    if (type === 'switch' && value !== true) {
      return `${label} must be accepted`;
    }
  }
  
  // Skip further validation if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  // Type-specific validation
  switch (type) {
    case 'text':
    case 'textarea':
      return validateText(value, validation, label);
    
    case 'number':
      return validateNumber(value, validation, label);
    
    case 'select':
      return validateSelect(value, field.options, label);
    
    case 'multi-select':
      return validateMultiSelect(value, field.options, validation, label);
    
    case 'date':
      return validateDate(value, validation, label);
    
    case 'switch':
      if (typeof value !== 'boolean') {
        return `${label} must be a boolean`;
      }
      return null;
    
    default:
      return null;
  }
}

function validateText(value, validation, label) {
  if (typeof value !== 'string') {
    return `${label} must be a string`;
  }
  
  if (!validation) return null;
  
  if (validation.minLength && value.length < validation.minLength) {
    return `${label} must be at least ${validation.minLength} characters`;
  }
  
  if (validation.maxLength && value.length > validation.maxLength) {
    return `${label} must be at most ${validation.maxLength} characters`;
  }
  
  if (validation.regex) {
    const regex = new RegExp(validation.regex);
    if (!regex.test(value)) {
      return validation.regexMessage || `${label} format is invalid`;
    }
  }
  
  return null;
}

function validateNumber(value, validation, label) {
  const num = Number(value);
  
  if (isNaN(num)) {
    return `${label} must be a valid number`;
  }
  
  if (!validation) return null;
  
  if (validation.min !== undefined && num < validation.min) {
    return `${label} must be at least ${validation.min}`;
  }
  
  if (validation.max !== undefined && num > validation.max) {
    return `${label} must be at most ${validation.max}`;
  }
  
  return null;
}

function validateSelect(value, options, label) {
  const validValues = options.map(opt => opt.value);
  
  if (!validValues.includes(value)) {
    return `${label} must be a valid option`;
  }
  
  return null;
}

function validateMultiSelect(value, options, validation, label) {
  if (!Array.isArray(value)) {
    return `${label} must be an array`;
  }
  
  const validValues = options.map(opt => opt.value);
  
  for (const v of value) {
    if (!validValues.includes(v)) {
      return `${label} contains invalid option: ${v}`;
    }
  }
  
  if (!validation) return null;
  
  if (validation.minSelected && value.length < validation.minSelected) {
    return `${label} must have at least ${validation.minSelected} selected`;
  }
  
  if (validation.maxSelected && value.length > validation.maxSelected) {
    return `${label} must have at most ${validation.maxSelected} selected`;
  }
  
  return null;
}

function validateDate(value, validation, label) {
  const date = new Date(value);
  
  if (isNaN(date.getTime())) {
    return `${label} must be a valid date`;
  }
  
  if (!validation) return null;
  
  if (validation.minDate === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return `${label} must be today or later`;
    }
  } else if (validation.minDate) {
    const minDate = new Date(validation.minDate);
    if (date < minDate) {
      return `${label} must be on or after ${validation.minDate}`;
    }
  }
  
  return null;
}
