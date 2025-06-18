import React, { useState } from 'react';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Test với đúng backend SecurityConfig path
  const testBackendSecurityConfig = async () => {
    setLoading(true);
    setTestResult('Testing backend SecurityConfig paths...');
    
    try {
      // ✅ Test exact path từ SecurityConfig: /workhub/api/v1/recruiter/login
      const url = 'http://localhost:8080/workhub/api/v1/recruiter/login?email=bachct504%40gmail.com&password=123456789';
      
      console.log('🧪 Testing SecurityConfig path:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: '' // Empty body như curl
      });

      const responseText = await response.text();
      
      setTestResult(`
🧪 SecurityConfig Path Test:
   URL: ${url}
   Status: ${response.status} ${getStatusExplanation(response.status)}
   Status Text: ${response.statusText}
   Response: ${responseText}
   
🔍 Analysis:
   Expected: 200 (success), 400 (bad request), or 401 (unauthorized)
   Actual: ${response.status}
   Security: ${response.status === 403 ? '❌ Still blocked by Spring Security' : '✅ Passed security filter'}
      `);

      console.log('📊 SecurityConfig test result:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
        analysis: response.status === 403 ? 'Still blocked' : 'Passed security'
      });

    } catch (error) {
      setTestResult(`❌ SecurityConfig Test Error: ${error.message}`);
      console.error('🚨 SecurityConfig test error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Test all backend permitAll paths
  const testAllPermittedPaths = async () => {
    setLoading(true);
    setTestResult('Testing all permitted paths from SecurityConfig...');
    
    // Exact paths từ backend SecurityConfig
    const permittedPaths = [
      '/workhub/api/v1/recruiter/login',
      '/workhub/api/v1/candidate/login',
      '/workhub/api/v1/admin/login',
      '/workhub/api/v1/recruiter/register',
      '/workhub/api/v1/candidate/register',
      '/workhub/api/v1/activate',
      '/workhub/api/v1/reset-password',
      '/workhub/api/v1/forgot-password',
    ];
    
    const results = [];
    
    for (const path of permittedPaths) {
      try {
        const url = `http://localhost:8080${path}?test=true`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Accept': '*/*' },
          body: ''
        });
        
        const status = response.status;
        const analysis = status === 403 ? '❌ Blocked' : status === 404 ? '⚠️ Not found' : '✅ Permitted';
        
        results.push(`${analysis} ${path}: ${status}`);
        
      } catch (error) {
        results.push(`❌ ${path}: ${error.message}`);
      }
    }
    
    setTestResult(`🔍 Backend SecurityConfig Permitted Paths Test:\n${results.join('\n')}`);
    setLoading(false);
  };

  const getStatusExplanation = (status) => {
    switch (status) {
      case 200: return '(Success - Login worked!)';
      case 400: return '(Bad Request - Invalid credentials format)';
      case 401: return '(Unauthorized - Wrong credentials)';
      case 403: return '(Forbidden - Blocked by Spring Security)';
      case 404: return '(Not Found - Endpoint not mapped)';
      case 500: return '(Server Error - Backend issue)';
      default: return '';
    }
  };

  return (
    <div style={{ 
      padding: '1rem', 
      border: '2px solid #27ae60', 
      margin: '1rem',
      borderRadius: '8px',
      background: '#f8fff8'
    }}>
      <h3 style={{ color: '#27ae60', marginBottom: '1rem' }}>
        ✅ Backend SecurityConfig Analysis - /workhub/api/v1 paths
      </h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={testBackendSecurityConfig}
          disabled={loading}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '0.5rem',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Testing...' : '🎯 Test Backend SecurityConfig Path'}
        </button>
        
        <button 
          onClick={testAllPermittedPaths}
          disabled={loading}
          style={{ 
            padding: '0.5rem 1rem',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          🔍 Test All Permitted Paths
        </button>
      </div>

      {testResult && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          border: '1px solid #dee2e6',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          {testResult}
        </div>
      )}
      
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
        <p><strong>Backend SecurityConfig Analysis:</strong></p>
        <ul>
          <li>✅ SecurityConfig permits: <code>/workhub/api/v1/recruiter/login</code></li>
          <li>✅ Frontend using: <code>http://localhost:8080/workhub/api/v1</code></li>
          <li>🔧 Expected behavior: Status 200, 400, or 401 (not 403)</li>
          <li>🎯 If still 403: Check if filters are interfering</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTest;