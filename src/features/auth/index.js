// Auth feature exports

// Services
export { default as authService } from './services/authService';
export { default as mockAuthService } from './services/mockAuthService';

// Config
export { default as authConfig } from './config/authConfig';

// Hooks
export { useAuthForm, validationRules } from './useAuthForm';
export { useAuthSubmit } from './useAuthSubmit';

// Components
export { default as AuthLayout } from './AuthLayout/AuthLayout';
export { default as AuthFormLayout } from './AuthFormLayout/AuthFormLayout';
export { default as AuthRedirectHandler } from './AuthRedirectHandler/AuthRedirectHandler';
export { default as FormField } from './FormField/FormField';
export { default as MessageBanner } from './MessageBanner/MessageBanner';
export { default as PasswordCriteria } from './PasswordCriteria/PasswordCriteria';
export { default as QuickCredentials } from './QuickCredentials/QuickCredentials';

// Utils
export * from './utils/authHelpers';