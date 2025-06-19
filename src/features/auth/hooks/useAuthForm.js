import { useState } from 'react';
import { authConfig } from '../config/authConfig';

export const useAuthForm = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear general error
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    return Object.keys(newErrors).length === 0;
  };

  const setFieldValue = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const setError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    formData,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    validateAll,
    setFieldValue,
    setError,
    clearErrors,
    setErrors
  };
};

// ✅ Updated validation rules
export const validationRules = {
  // ✅ Add fullname validation
  fullname: [
    (value) => !value ? 'Full name is required' : '',
    (value) => value.trim().length < 2 ? 'Full name must be at least 2 characters' : '',
    (value) => value.trim().length > 50 ? 'Full name must be less than 50 characters' : '',
    (value) => !/^[a-zA-ZÀ-ỹ\s'.-]+$/.test(value.trim()) ? 'Full name contains invalid characters' : ''
  ],
  
  email: [
    (value) => !value ? 'Email is required' : '',
    (value) => !authConfig.validation.email.pattern.test(value) ? authConfig.validation.email.message : ''
  ],
  
  password: [
    (value) => !value ? 'Password is required' : '',
    (value) => value.length < authConfig.validation.password.minLength ? authConfig.validation.password.message : ''
  ],
  
  businessName: [
    (value) => !value ? 'Business name is required' : '',
    (value) => value.length < 2 ? 'Business name must be at least 2 characters' : ''
  ],
  
  strongPassword: [
    (value) => !value ? 'Password is required' : '',
    (value) => value.length < authConfig.validation.strongPassword.minLength ? `Password must be at least ${authConfig.validation.strongPassword.minLength} characters` : '',
    (value) => authConfig.validation.strongPassword.requireNumber && !/\d/.test(value) ? 'Password must contain at least one number' : '',
    (value) => authConfig.validation.strongPassword.requireUppercase && !/[A-Z]/.test(value) ? 'Password must contain at least one uppercase letter' : '',
    (value) => authConfig.validation.strongPassword.requireLowercase && !/[a-z]/.test(value) ? 'Password must contain at least one lowercase letter' : '',
    (value) => authConfig.validation.strongPassword.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(value) ? 'Password must contain at least one special character' : ''
  ]
};