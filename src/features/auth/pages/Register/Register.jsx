import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormLayout from '../../components/AuthFormLayout/AuthFormLayout';
import FormField from '../../components/FormField/FormField';
import PasswordCriteria from '../../components/PasswordCriteria/PasswordCriteria';
import { useAuthForm, validationRules } from '../../hooks/useAuthForm';
import { useAuthSubmit } from '../../hooks/useAuthSubmit';
import './Register.css';

const Register = () => {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const {
    formData,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    validateAll
  } = useAuthForm(
    { email: '', businessName: '', password: '' },
    { 
      email: validationRules.email, 
      businessName: validationRules.businessName,
      password: validationRules.strongPassword 
    }
  );

  const {
    isLoading,
    message: successMessage,
    error: errorMessage,
    submitRegister
  } = useAuthSubmit('register');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      await submitRegister({
        ...formData,
        role: 'RECRUITER' // Default role for business registration (maps to recruiter)
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handlePasswordFocus = () => setIsPasswordFocused(true);
  const handlePasswordBlur = (e) => {
    setIsPasswordFocused(false);
    handleBlur(e);
  };

  const showPasswordCriteria = isPasswordFocused || touched.password || formData.password;

  const formFields = (
    <>
      <FormField
        type="email"
        name="email"
        label="Email address"
        value={formData.email}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Enter your email"
        error={errors.email}
        disabled={isLoading}
        required
      />

      <FormField
        type="text"
        name="businessName"
        label="Business name"
        value={formData.businessName}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Enter your business name"
        error={errors.businessName}
        disabled={isLoading}
        required
      />

      <FormField
        type="password"
        name="password"
        label="Create password"
        value={formData.password}
        onChange={handleInputChange}
        onBlur={handlePasswordBlur}
        onFocus={handlePasswordFocus}
        placeholder="Enter password"
        error={errors.password}
        disabled={isLoading}
        required
        showPasswordToggle
      >
        {{
          afterInput: (
            <PasswordCriteria 
              password={formData.password} 
              show={showPasswordCriteria} 
            />
          )
        }}
      </FormField>
    </>
  );

  const afterFormContent = (
    <p className="terms-text">
      By creating an account, you're agreeing to our{' '}
      <Link to="/terms" className="auth-link">Terms of Use</Link> and{' '}
      <Link to="/privacy" className="auth-link">Privacy Policy</Link>
    </p>
  );

  const footerContent = (
    <p className="auth-link-text">
      Already have an account? <Link to="/login" className="auth-link">SIGN IN</Link>
    </p>
  );

  return (
    <AuthFormLayout
      title="Create your hiring account"
      onSubmit={handleSubmit}
      submitButtonText="CREATE ACCOUNT"
      isLoading={isLoading}
      loadingText="Creating account..."
      successMessage={successMessage}
      errorMessage={errorMessage}
      afterForm={afterFormContent}
      footer={footerContent}
    >
      {formFields}
    </AuthFormLayout>
  );
};

export default Register;