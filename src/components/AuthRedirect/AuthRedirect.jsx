import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthRedirect from './components/AuthRedirect/AuthRedirect';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthRedirect>
          <div className="App">
            <AppRoutes />
          </div>
        </AuthRedirect>
      </AuthProvider>
    </Router>
  );
}

export default App;