import React, { useState, useEffect, useRef } from 'react';
import { authService } from '../../../features/auth/services/authService';
import { useAuth } from '../../../core/contexts/AuthContext';
import './AuthTestPanel.css';

const AuthTestPanel = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [authMonitor, setAuthMonitor] = useState({});
  
  // ✅ Draggable state
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(true);
  
  const panelRef = useRef(null);
  const headerRef = useRef(null);

  const { isAuthenticated, userRole, user } = useAuth();

  // ✅ Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('authTestPanelPosition');
    const savedMinimized = localStorage.getItem('authTestPanelMinimized');
    const savedVisible = localStorage.getItem('authTestPanelVisible');
    
    if (savedPosition) {
      try {
        const pos = JSON.parse(savedPosition);
        setPosition(pos);
      } catch (e) {
        console.warn('Failed to parse saved position');
      }
    }
    
    if (savedMinimized !== null) {
      setIsMinimized(savedMinimized === 'true');
    }
    
    if (savedVisible !== null) {
      setIsVisible(savedVisible === 'true');
    }
  }, []);

  // ✅ Save position to localStorage
  useEffect(() => {
    localStorage.setItem('authTestPanelPosition', JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    localStorage.setItem('authTestPanelMinimized', isMinimized.toString());
  }, [isMinimized]);

  useEffect(() => {
    localStorage.setItem('authTestPanelVisible', isVisible.toString());
  }, [isVisible]);

  // ✅ Mouse event handlers for dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('.toggle-btn') || e.target.closest('.minimize-btn')) {
      return; // Don't drag when clicking buttons
    }
    
    setIsDragging(true);
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // ✅ Keep panel within viewport bounds
    const maxX = window.innerWidth - (isMinimized ? 200 : 450);
    const maxY = window.innerHeight - 60;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ✅ Global mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, dragOffset]);

  // ✅ Real-time AuthService monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const authState = authService.getAuthState();
      const token = authService.getCurrentToken();
      const currentUser = authService.getCurrentUser();

      setAuthMonitor({
        serviceAuth: authState.isAuthenticated,
        contextAuth: isAuthenticated,
        serviceUser: !!currentUser,
        contextUser: !!user,
        token: !!token,
        tokenLength: token?.length || 0,
        serviceRole: currentUser?.role,
        contextRole: userRole,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, userRole]);

  // ✅ Double-click to minimize/maximize
  const handleDoubleClick = () => {
    setIsMinimized(!isMinimized);
  };

  // ✅ Toggle panel visibility
  const toggleVisibility = () => {
    if (!isVisible) {
      setIsVisible(true);
      setIsMinimized(false);
    } else {
      setIsVisible(false);
    }
  };

  // ✅ Minimize/maximize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // ... existing test functions remain the same ...
  const addTestResult = (testName, result) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: {
        ...result,
        timestamp: new Date().toLocaleTimeString()
      }
    }));
  };

  const testLogin = async (credentials) => {
    setIsLoading(true);
    try {
      const loginCredentials = {
        email: credentials.email,
        password: credentials.password
      };

      console.log('🧪 Testing login with:', {
        email: loginCredentials.email,
        password: '[HIDDEN]',
        expectedRole: credentials.role
      });

      const result = await authService.login(loginCredentials);

      addTestResult(`login-${credentials.role}`, {
        success: true,
        data: result,
        message: 'Login successful'
      });
    } catch (error) {
      addTestResult(`login-${credentials.role}`, {
        success: false,
        error: error.message,
        message: 'Login failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testRegister = async (userData, type) => {
    setIsLoading(true);
    try {
      const result = type === 'candidate'
        ? await authService.registerCandidate(userData)
        : await authService.registerRecruiter(userData);

      addTestResult(`register-${type}`, {
        success: true,
        data: result,
        message: 'Registration successful'
      });
    } catch (error) {
      addTestResult(`register-${type}`, {
        success: false,
        error: error.message,
        message: 'Registration failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testForgotPassword = async (email) => {
    setIsLoading(true);
    try {
      const result = await authService.forgotPassword(email);
      addTestResult('forgot-password', {
        success: true,
        data: result,
        message: 'Forgot password email sent'
      });
    } catch (error) {
      addTestResult('forgot-password', {
        success: false,
        error: error.message,
        message: 'Forgot password failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testResetPassword = async (token, newPassword) => {
    setIsLoading(true);
    try {
      const result = await authService.resetPassword(token, newPassword);
      addTestResult('reset-password', {
        success: true,
        data: result,
        message: 'Password reset successful'
      });
    } catch (error) {
      addTestResult('reset-password', {
        success: false,
        error: error.message,
        message: 'Password reset failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testAuthStates = () => {
    const tests = {
      'get-auth-state': authService.getAuthState(),
      'get-current-user': authService.getCurrentUser(),
      'get-current-token': !!authService.getCurrentToken(),
      'is-authenticated': authService.isAuthenticated(),
      'get-user-role': authService.getUserRole(),
      'context-sync': {
        contextAuth: isAuthenticated,
        serviceAuth: authService.isAuthenticated(),
        contextUser: !!user,
        serviceUser: !!authService.getCurrentUser(),
        synced: isAuthenticated === authService.isAuthenticated()
      }
    };

    Object.entries(tests).forEach(([name, result]) => {
      addTestResult(name, {
        success: true,
        data: result,
        message: 'State check completed'
      });
    });
  };

  const clearResults = () => {
    setTestResults({});
  };

  const logout = async () => {
    try {
      await authService.logout();
      addTestResult('logout', {
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      addTestResult('logout', {
        success: false,
        error: error.message,
        message: 'Logout failed'
      });
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      ref={panelRef}
      className={`auth-test-panel ${!isVisible ? 'hidden' : ''} ${isMinimized ? 'minimized' : 'expanded'} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: 'fixed'
      }}
    >
      <div 
        ref={headerRef}
        className="test-panel-header"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="header-left">
          <button
            className="toggle-btn"
            onClick={toggleVisibility}
            title={isVisible ? 'Hide Panel' : 'Show Panel'}
          >
            {!isVisible ? '🔧' : '❌'}
          </button>
          
          {isVisible && (
            <button
              className="minimize-btn"
              onClick={toggleMinimize}
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? '📈' : '�'}
            </button>
          )}
        </div>
        
        <h3 className="test-panel-title">
          🧪 Auth Test Panel {isDragging && '(Moving...)'}
        </h3>
        
        <div className="header-right">
          <span className="drag-hint">📌</span>
        </div>
      </div>

      {isVisible && !isMinimized && (
        <div className="test-panel-content">
          {/* Auth Monitor */}
          <div className="auth-monitor">
            <h4>📊 Auth State Monitor</h4>
            <div className="monitor-grid">
              <div className="monitor-item">
                <span className="label">Service Auth:</span>
                <span className={`value ${authMonitor.serviceAuth ? 'success' : 'error'}`}>
                  {authMonitor.serviceAuth ? '✅' : '❌'}
                </span>
              </div>
              <div className="monitor-item">
                <span className="label">Context Auth:</span>
                <span className={`value ${authMonitor.contextAuth ? 'success' : 'error'}`}>
                  {authMonitor.contextAuth ? '✅' : '❌'}
                </span>
              </div>
              <div className="monitor-item">
                <span className="label">Token:</span>
                <span className={`value ${authMonitor.token ? 'success' : 'error'}`}>
                  {authMonitor.token ? `✅ (${authMonitor.tokenLength})` : '❌'}
                </span>
              </div>
              <div className="monitor-item">
                <span className="label">Role:</span>
                <span className="value">{authMonitor.contextRole || 'none'}</span>
              </div>
              <div className="monitor-item">
                <span className="label">Synced:</span>
                <span className={`value ${authMonitor.serviceAuth === authMonitor.contextAuth ? 'success' : 'error'}`}>
                  {authMonitor.serviceAuth === authMonitor.contextAuth ? '✅' : '❌'}
                </span>
              </div>
              <div className="monitor-item">
                <span className="label">Updated:</span>
                <span className="value timestamp">{authMonitor.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Test Tabs */}
          <div className="test-tabs">
            <button
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              🔑
            </button>
            <button
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              📝
            </button>
            <button
              className={`tab ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              🔒
            </button>
            <button
              className={`tab ${activeTab === 'states' ? 'active' : ''}`}
              onClick={() => setActiveTab('states')}
            >
              📊
            </button>
          </div>

          {/* Login Tests */}
          {activeTab === 'login' && (
            <div className="test-section">
              <h4>🔑 Login Tests</h4>
              <div className="test-actions">
                <button
                  onClick={() => testLogin({
                    email: 'bachct504@gmail.com',
                    password: '123456789',
                    role: 'recruiter'
                  })}
                  disabled={isLoading}
                  className="test-btn"
                >
                  Recruiter
                </button>
                <button
                  onClick={() => testLogin({
                    email: 'candidate@test.com',
                    password: '123456789',
                    role: 'candidate'
                  })}
                  disabled={isLoading}
                  className="test-btn"
                >
                  Candidate
                </button>
                <button
                  onClick={logout}
                  disabled={isLoading}
                  className="test-btn logout"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Registration Tests */}
          {activeTab === 'register' && (
            <div className="test-section">
              <h4>📝 Registration Tests</h4>
              <div className="test-actions">
                <button
                  onClick={() => testRegister({
                    fullname: 'Test Recruiter',
                    email: `test-recruiter-${Date.now()}@example.com`,
                    password: 'TestPassword123!',
                    phone: '123456789'
                  }, 'recruiter')}
                  disabled={isLoading}
                  className="test-btn"
                >
                  Recruiter
                </button>
                <button
                  onClick={() => testRegister({
                    fullname: 'Test Candidate',
                    email: `test-candidate-${Date.now()}@example.com`,
                    password: 'TestPassword123!',
                    phone: '987654321'
                  }, 'candidate')}
                  disabled={isLoading}
                  className="test-btn"
                >
                  Candidate
                </button>
              </div>
            </div>
          )}

          {/* Password Tests */}
          {activeTab === 'password' && (
            <div className="test-section">
              <h4>🔒 Password Tests</h4>
              <div className="test-actions">
                <button
                  onClick={() => testForgotPassword('bachct504@gmail.com')}
                  disabled={isLoading}
                  className="test-btn"
                >
                  Forgot Password
                </button>
                <div className="test-input-group">
                  <input
                    type="text"
                    placeholder="Reset token"
                    id="reset-token"
                    className="test-input"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    id="new-password"
                    className="test-input"
                  />
                  <button
                    onClick={() => {
                      const token = document.getElementById('reset-token').value;
                      const password = document.getElementById('new-password').value;
                      if (token && password) {
                        testResetPassword(token, password);
                      }
                    }}
                    disabled={isLoading}
                    className="test-btn"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* State Tests */}
          {activeTab === 'states' && (
            <div className="test-section">
              <h4>📊 Auth State Tests</h4>
              <div className="test-actions">
                <button
                  onClick={testAuthStates}
                  disabled={isLoading}
                  className="test-btn"
                >
                  Check States
                </button>
              </div>
            </div>
          )}

          {/* Results Display */}
          <div className="test-results">
            <div className="results-header">
              <h4>📋 Results ({Object.keys(testResults).length})</h4>
              <button onClick={clearResults} className="clear-btn">Clear</button>
            </div>
            <div className="results-list">
              {Object.entries(testResults).slice(-3).map(([testName, result]) => (
                <div key={testName} className={`result-item ${result.success ? 'success' : 'error'}`}>
                  <div className="result-header">
                    <span className="result-name">{testName}</span>
                    <span className="result-status">
                      {result.success ? '✅' : '❌'}
                    </span>
                    <span className="result-time">{result.timestamp}</span>
                  </div>
                  <div className="result-message">{result.message}</div>
                  {result.error && (
                    <div className="result-error">Error: {result.error}</div>
                  )}
                  {result.data && (
                    <details className="result-data">
                      <summary>Data</summary>
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <span>Running test...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthTestPanel;