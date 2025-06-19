import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import AuthFormLayout from '../../components/AuthFormLayout/AuthFormLayout';
import FormField from '../../components/FormField/FormField';
import PasswordCriteria from '../../components/PasswordCriteria/PasswordCriteria';
import { useAuthForm, validationRules } from '../../hooks/useAuthForm';
import { useAuthSubmit } from '../../hooks/useAuthSubmit';
import { jwtUtils } from '../../../../shared/utils/helpers/jwtUtils';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Get token from URL parameters
  const token = searchParams.get('token');

  const {
    formData,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    validateAll,
    setError
  } = useAuthForm(
    { 
      newPassword: '', 
      confirmPassword: '' 
    },
    { 
      newPassword: validationRules.strongPassword,
      confirmPassword: [
        (value) => !value ? 'Please confirm your password' : '',
        (value) => value !== formData.newPassword ? 'Passwords do not match' : ''
      ]
    }
  );

  const {
    isLoading,
    message: successMessage,
    error: errorMessage,
    submitResetPassword
  } = useAuthSubmit('resetPassword');

  // ✅ Validate token on component mount
  useEffect(() => {
    if (!token) {
      console.error('❌ ResetPassword: No token provided');
      navigate('/forgot-password', { 
        state: { 
          error: 'Invalid reset link. Please request a new password reset.' 
        }
      });
      return;
    }

    try {
      // Decode token to get user info and expiry
      const decoded = jwtUtils.decode(token);
      if (decoded && decoded.payload) {
        const now = Math.floor(Date.now() / 1000);
        const isExpired = decoded.payload.exp < now;
        
        setTokenInfo({
          email: decoded.payload.sub,
          role: decoded.payload.role,
          id: decoded.payload.id,
          exp: decoded.payload.exp,
          iat: decoded.payload.iat,
          isExpired,
          timeRemaining: isExpired ? 0 : (decoded.payload.exp - now)
        });

        if (isExpired) {
          console.error('❌ ResetPassword: Token expired');
          navigate('/forgot-password', { 
            state: { 
              error: 'Reset link has expired. Please request a new password reset.',
              email: decoded.payload.sub
            }
          });
        } else {
          console.log('✅ ResetPassword: Valid token for:', decoded.payload.sub);
        }
      } else {
        throw new Error('Invalid token format');
      }
    } catch (error) {
      console.error('❌ ResetPassword: Token validation error:', error);
      navigate('/forgot-password', { 
        state: { 
          error: 'Invalid reset link. Please request a new password reset.' 
        }
      });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    if (!token) {
      setError('general', 'Invalid reset token');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('confirmPassword', 'Passwords do not match');
      return;
    }

    console.log('🔑 ResetPassword: Submitting password reset');

    try {
      await submitResetPassword({
        token,
        newPassword: formData.newPassword
      }, {
        onSuccess: (result, message) => {
          console.log('✅ ResetPassword: Success callback');
          setResetSuccess(true);
        }
      });
    } catch (error) {
      console.error('❌ ResetPassword: Submit error:', error);
      // Error handled in hook
    }
  };

  const handlePasswordFocus = () => setIsPasswordFocused(true);
  const handlePasswordBlur = (e) => {
    setIsPasswordFocused(false);
    handleBlur(e);
  };

  const handleConfirmFocus = () => setIsConfirmFocused(true);
  const handleConfirmBlur = (e) => {
    setIsConfirmFocused(false);
    handleBlur(e);
  };

  const showPasswordCriteria = isPasswordFocused || touched.newPassword || formData.newPassword;

  // ✅ Show success state if password was reset
  if (resetSuccess) {
    return (
      <div className="reset-password-success">
        <div className="success-container">
          <div className="success-icon">✅</div>
          
          <h1 className="success-title">Password Reset Successful!</h1>
          
          <div className="success-content">
            <p className="success-message">
              Your password has been successfully updated.
            </p>
            
            {tokenInfo && (
              <div className="account-info">
                <p>Account: <strong>{tokenInfo.email}</strong></p>
                <p>Role: <strong>{tokenInfo.role?.toUpperCase()}</strong></p>
              </div>
            )}
            
            <div className="next-steps">
              <p>You can now sign in with your new password.</p>
            </div>
            
            <div className="success-actions">
              <Link to="/login" className="login-btn">
                Sign In Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Show loading state while validating token
  if (!tokenInfo) {
    return (
      <div className="reset-password-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Validating reset link...</p>
        </div>
      </div>
    );
  }

  // ✅ Show form state
  const formFields = (
    <>
      <div className="token-info">
        <p className="reset-for">
          Resetting password for: <strong>{tokenInfo.email}</strong>
        </p>
        <p className="token-expiry">
          Link expires in: <strong>{Math.floor(tokenInfo.timeRemaining / 60)} minutes</strong>
        </p>
      </div>

      <FormField
        type="password"
        name="newPassword"
        label="New password"
        value={formData.newPassword}
        onChange={handleInputChange}
        onBlur={handlePasswordBlur}
        onFocus={handlePasswordFocus}
        placeholder="Enter your new password"
        error={errors.newPassword}
        disabled={isLoading}
        required
        showPasswordToggle
      >
        {{
          afterInput: (
            <PasswordCriteria 
              password={formData.newPassword} 
              show={showPasswordCriteria} 
            />
          )
        }}
      </FormField>

      <FormField
        type="password"
        name="confirmPassword"
        label="Confirm new password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        onBlur={handleConfirmBlur}
        onFocus={handleConfirmFocus}
        placeholder="Confirm your new password"
        error={errors.confirmPassword}
        disabled={isLoading}
        required
        showPasswordToggle
      />
    </>
  );

  const afterFormContent = (
    <div className="reset-password-info">
      <div className="info-box">
        <h4>🔒 Password Requirements</h4>
        <ul>
          <li>At least 8 characters long</li>
          <li>Must contain uppercase and lowercase letters</li>
          <li>Must contain at least one number</li>
          <li>Must contain at least one special character</li>
        </ul>
      </div>
    </div>
  );

  const footerContent = (
    <>
      <p className="auth-link-text">
        Remember your password? <Link to="/login" className="auth-link">SIGN IN</Link>
      </p>
      
      <p className="auth-link-text">
        Need a new reset link? <Link to="/forgot-password" className="auth-link">REQUEST NEW LINK</Link>
      </p>
    </>
  );

  return (
    <AuthFormLayout
      title="Create New Password"
      subtitle="Enter your new password below"
      onSubmit={handleSubmit}
      submitButtonText="Update Password"
      isLoading={isLoading}
      loadingText="Updating password..."
      successMessage={successMessage}
      errorMessage={errorMessage}
      afterForm={afterFormContent}
      footer={footerContent}
    >
      {formFields}
    </AuthFormLayout>
  );
};

export default ResetPassword;