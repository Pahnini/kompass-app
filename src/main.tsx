import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import { UIProvider } from './context/UIContext';
import { UserDataProvider } from './context/UserDataContext';
import './index.css';
import './i18n'; // Importiere i18n für Übersetzungen


const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <UserDataProvider>
        {' '}
        {/* ✅ GANZ außen */}
        <BrowserRouter>
          <UIProvider>
            <ThemeProvider>
              {' '}
              {/* ✅ jetzt darf es useUserData verwenden */}
              <App />
            </ThemeProvider>
          </UIProvider>
        </BrowserRouter>
      </UserDataProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
