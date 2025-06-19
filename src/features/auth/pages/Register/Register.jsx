import React, { useState, useEffect, navigate } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthFormLayout from '../../components/AuthFormLayout/AuthFormLayout';
import FormField from '../../components/FormField/FormField';
import PasswordCriteria from '../../components/PasswordCriteria/PasswordCriteria';
import { useAuthForm, validationRules } from '../../hooks/useAuthForm';
import { useAuthSubmit } from '../../hooks/useAuthSubmit';
import RegistrationSuccess from '../../components/RegistrationSuccess/RegistrationSuccess';
import './Register.css';

const Register = () => {
  const location = useLocation();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null);

  // ✅ Determine registration type from route
  const isRecruiterRegistration = location.pathname.includes('/recruiter') ||
    location.pathname === '/register' ||
    location.pathname === '/register/';
  const isCandidateRegistration = location.pathname.includes('/candidate');

  const registrationType = isRecruiterRegistration ? 'recruiter' :
    isCandidateRegistration ? 'candidate' : 'recruiter'; // default

  const {
    formData,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    validateAll
  } = useAuthForm(
    {
      fullname: '',
      email: '',
      password: ''
    },
    {
      fullname: validationRules.fullname,
      email: validationRules.email,
      password: validationRules.strongPassword
    }
  );

  const {
    isLoading,
    message: successMessage,
    error: errorMessage,
    submitRegister
  } = useAuthSubmit(registrationType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      const result = await submitRegister({
        fullname: formData.fullname.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: '',
        avatar: '',
        registrationType
      }, {
        onSuccess: (result, message) => {
          console.log('✅ Registration success callback:', result);
          setRegistrationResult(result);
        }
      });
    } catch (error) {
      console.error(`❌ Register: ${registrationType} submit error:`, error);
    }
  };

  if (registrationResult) {
    return (
      <RegistrationSuccess
        type={registrationType}
        autoLogin={registrationResult.autoLogin}
        email={formData.email}
        onRedirect={() => {
          const dashboardPath = registrationType === 'recruiter'
            ? '/recruiter/dashboard'
            : '/candidate/dashboard';
          navigate(dashboardPath, { replace: true });
        }}
      />
    );
  }

  const handlePasswordFocus = () => setIsPasswordFocused(true);
  const handlePasswordBlur = (e) => {
    setIsPasswordFocused(false);
    handleBlur(e);
  };

  const showPasswordCriteria = isPasswordFocused || touched.password || formData.password;

  // ✅ Dynamic content based on registration type
  const getContent = () => {
    if (registrationType === 'candidate') {
      return {
        title: "Create your candidate account",
        subtitle: "Join thousands of professionals finding their dream job",
        emailLabel: "Email address",
        emailPlaceholder: "Enter your email address",
        emailHelpText: "We'll use this to send you job opportunities",
        buttonText: "CREATE CANDIDATE ACCOUNT",
        verificationText: "After registration, you'll need to verify your email address before applying to jobs.",
        footerText: "Already have a candidate account?",
        loginLink: "/login/candidate"
      };
    } else {
      return {
        title: "Create your recruiter account",
        subtitle: "Join thousands of recruiters finding top talent",
        emailLabel: "Work email address",
        emailPlaceholder: "Enter your work email",
        emailHelpText: "We'll use this to verify your recruiter account",
        buttonText: "CREATE RECRUITER ACCOUNT",
        verificationText: "After registration, you'll need to verify your email address before accessing your recruiter dashboard.",
        footerText: "Already have a recruiter account?",
        loginLink: "/login"
      };
    }
  };

  const content = getContent();

  const formFields = (
    <>
      <FormField
        type="text"
        name="fullname"
        label="Full name"
        value={formData.fullname}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Enter your full name"
        error={errors.fullname}
        disabled={isLoading}
        required
        helpText="Your full name as you'd like it to appear on your profile"
      />

      <FormField
        type="email"
        name="email"
        label={content.emailLabel}
        value={formData.email}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={content.emailPlaceholder}
        error={errors.email}
        disabled={isLoading}
        required
        helpText={content.emailHelpText}
      />

      <FormField
        type="password"
        name="password"
        label="Create password"
        value={formData.password}
        onChange={handleInputChange}
        onBlur={handlePasswordBlur}
        onFocus={handlePasswordFocus}
        placeholder="Create a strong password"
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
    <>
      <div className="registration-info">
        <p className="info-text">
          📧 <strong>Account Verification Required</strong><br />
          {content.verificationText}
        </p>
      </div>

      <p className="terms-text">
        By creating a {registrationType} account, you're agreeing to our{' '}
        <Link to="/terms" className="auth-link">Terms of Use</Link> and{' '}
        <Link to="/privacy" className="auth-link">Privacy Policy</Link>
      </p>
    </>
  );

  const footerContent = (
    <>
      <p className="auth-link-text">
        {content.footerText} <Link to={content.loginLink} className="auth-link">SIGN IN</Link>
      </p>

      {/* ✅ Switch registration type link */}
      <p className="auth-link-text switch-type">
        {registrationType === 'recruiter' ? (
          <>Looking for a job? <Link to="/register/candidate" className="auth-link">Register as Candidate</Link></>
        ) : (
          <>Looking to hire? <Link to="/register" className="auth-link">Register as Recruiter</Link></>
        )}
      </p>
    </>
  );

  return (
    <AuthFormLayout
      title={content.title}
      subtitle={content.subtitle}
      onSubmit={handleSubmit}
      submitButtonText={content.buttonText}
      isLoading={isLoading}
      loadingText="Creating your account..."
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