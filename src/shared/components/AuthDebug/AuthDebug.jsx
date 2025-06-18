// filepath: d:\Semester4\workHub\workhub-fe\src\shared\components\AuthDebug/AuthDebug.jsx
import React from 'react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { jwtUtils } from '../../utils/helpers/jwtUtils';

const AuthDebug = () => {
  const auth = useAuth();
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');

  const tokenInfo = token ? jwtUtils.getTokenInfo(token) : null;

  return (
    <div style={{ 
      padding: '1rem', 
      background: '#f8f9fa', 
      border: '1px solid #dee2e6',
      margin: '1rem 0',
      borderRadius: '4px',
      fontSize: '0.875rem'
    }}>
      <h4>🔍 Auth Debug Info</h4>
      
      <div style={{ marginBottom: '1rem' }}>
        <h5>AuthContext State:</h5>
        <pre style={{ background: '#fff', padding: '0.5rem', overflow: 'auto' }}>
          {JSON.stringify({
            hasUser: !!auth.user,
            userRole: auth.userRole,
            userId: auth.userId,
            userEmail: auth.userEmail,
            loading: auth.loading,
            authChecked: auth.authChecked,
            // isAuthenticated: auth.isAuthenticated(),
            isReady: auth.isReady
          }, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h5>Local Storage:</h5>
        <pre style={{ background: '#fff', padding: '0.5rem', overflow: 'auto' }}>
          {JSON.stringify({
            hasToken: !!token,
            tokenLength: token?.length,
            hasUser: !!userStr,
            userValid: userStr && userStr !== 'undefined'
          }, null, 2)}
        </pre>
      </div>

      {tokenInfo && (
        <div style={{ marginBottom: '1rem' }}>
          <h5>JWT Token Info:</h5>
          <pre style={{ background: '#fff', padding: '0.5rem', overflow: 'auto' }}>
            {JSON.stringify(tokenInfo, null, 2)}
          </pre>
        </div>
      )}

      {userStr && userStr !== 'undefined' && (
        <div>
          <h5>Stored User Data:</h5>
          <pre style={{ background: '#fff', padding: '0.5rem', overflow: 'auto' }}>
            {userStr}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthDebug;