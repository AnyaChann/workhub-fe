import React from 'react';
import './PasswordCriteria.css';

const PasswordCriteria = ({ password = '', show = false }) => {
  if (!show) return null;

  const criteria = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const criteriaItems = [
    { key: 'minLength', text: '8 characters minimum' },
    { key: 'hasNumber', text: 'One number' },
    { key: 'hasUppercase', text: 'One uppercase letter' },
    { key: 'hasLowercase', text: 'One lowercase letter' },
    { key: 'hasSpecial', text: 'One special character' }
  ];

  return (
    <div className="password-criteria">
      {criteriaItems.map(({ key, text }) => (
        <div
          key={key}
          className={`criteria-item ${criteria[key] ? 'valid' : 'invalid'}`}
        >
          <span className="criteria-icon">
            {criteria[key] ? '✓' : '○'}
          </span>
          {text}
        </div>
      ))}
    </div>
  );
};

export default PasswordCriteria;