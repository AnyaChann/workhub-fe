import React, { useState } from 'react';
import { authService } from '../../services';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testDatabaseUsers = async () => {
    setLoading(true);
    const testEmails = [
      'abc@gmail.com',
      'employer@test.com', 
      'candidate@test.com',
      'admin@test.com'
    ];
    
    let results = [];
    
    for (const email of testEmails) {
      try {
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', 'password');

        const response = await fetch('http://localhost:8080/workhub/api/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData
        });

        const result = await response.text();
        results.push(`📧 ${email}:\n   Status: ${response.status}\n   Response: ${result}`);
      } catch (error) {
        results.push(`📧 ${email}:\n   Error: ${error.message}`);
      }
    }

    setTestResult(results.join('\n\n'));
    setLoading(false);
  };

  const checkAllUsers = async () => {
    setLoading(true);
    try {
      // Try to get all users if endpoint exists
      const response = await fetch('http://localhost:8080/workhub/api/v1/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const users = await response.json();
        setTestResult(`📋 Users in database:\n${JSON.stringify(users, null, 2)}`);
      } else {
        setTestResult(`❌ Cannot get users: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult(`❌ Error getting users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuthServiceLogin = async () => {
    setLoading(true);
    try {
      const response = await authService.login({
        email: 'employer@test.com',
        password: 'password'
      });
      setTestResult(`✅ AuthService Login Success:\n${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ AuthService Login Failed:\n${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateUser = async () => {
    setLoading(true);
    try {
      // Test creating a user (if register endpoint exists)
      const userData = {
        fullname: 'Test User Created',
        email: 'newuser@test.com',
        password: 'password',
        role: 'CANDIDATE',
        phone: '+84999888777'
      };

      const response = await fetch('http://localhost:8080/workhub/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.text();
      setTestResult(`📝 Create User Test:\n   Status: ${response.status}\n   Response: ${result}`);
    } catch (error) {
      setTestResult(`❌ Create User Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #ccc', 
      margin: '1rem',
      borderRadius: '8px',
      background: '#f8f9fa'
    }}>
      <h3>🔍 Database & API Test</h3>
      <div style={{ 
        marginBottom: '1rem', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.5rem'
      }}>
        <button onClick={testDatabaseUsers} disabled={loading}>
          🧪 Test DB Users
        </button>
        <button onClick={checkAllUsers} disabled={loading}>
          📋 List All Users
        </button>
        <button onClick={testAuthServiceLogin} disabled={loading}>
          🔐 Test AuthService
        </button>
        <button onClick={testCreateUser} disabled={loading}>
          ➕ Test Create User
        </button>
      </div>
      
      <div style={{ 
        background: 'white', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '1rem'
      }}>
        <h4>Test Results:</h4>
        <pre style={{ 
          fontSize: '0.8rem',
          maxHeight: '400px',
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          margin: 0
        }}>
          {loading ? '⏳ Testing...' : testResult || '🚀 Click a button to start testing'}
        </pre>
      </div>

      <div style={{ 
        marginTop: '1rem',
        padding: '0.75rem',
        background: '#e3f2fd',
        borderRadius: '4px',
        fontSize: '0.85rem'
      }}>
        <strong>💡 Next Steps:</strong><br />
        1. Run the SQL script to create test users<br />
        2. Test with "Test DB Users" button<br />
        3. If users don't exist, check database connection<br />
        4. Mock login will work as fallback
      </div>
    </div>
  );
};

export default ApiTest;