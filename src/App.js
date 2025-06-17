import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './core/providers/AppProviders';
import AppRoutes from './core/routing/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <div className="App">
          <AppRoutes />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;