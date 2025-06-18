import React, { useState } from 'react';
import './FormField.css';

const FormField = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled = false,
  required = false,
  autoComplete,
  showPasswordToggle = false,
  children, // For additional content like criteria or links
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPasswordToggle 
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className={`form-group ${className}`}>
      <div className="form-label-row">
        <label htmlFor={name} className="form-label">{label}</label>
        {children && children.labelExtra}
      </div>
      
      <div className={`form-input-container ${type === 'password' && showPasswordToggle ? 'password-container' : ''}`}>
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`form-input ${error ? 'error' : ''}`}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
        />
        
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="password-toggle"
            disabled={disabled}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
      
      {error && <span className="error-message">{error}</span>}
      
      {children && children.afterInput}
    </div>
  );
};

export default FormField;