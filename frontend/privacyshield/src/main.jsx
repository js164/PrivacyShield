// ============================================================================
// MAIN.JSX - Application Entry Point and Root Setup
// ============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

/**
 * Application Entry Point
 * 
 * This file serves as the main entry point for the React application.
 * It sets up the root DOM element, configures React's rendering context,
 * and wraps the application with necessary providers.
 * 
 * Component Hierarchy:
 * - StrictMode: Enables additional development checks and warnings
 * - BrowserRouter: Provides client-side routing capabilities
 * - App: The main application component containing all routes and logic
 */

// Get the root DOM element where React will mount the application
const rootElement = document.getElementById('root');

// Create React root using the new createRoot API (React 18+)
const root = createRoot(rootElement);

// Render the application with all necessary wrappers
root.render(
  // StrictMode enables additional checks and warnings in development
  // - Helps identify unsafe lifecycles, legacy API usage, and side effects
  // - Only runs in development mode, no impact on production
  <StrictMode>
    {/* BrowserRouter enables client-side routing using HTML5 history API
        - Provides routing context for all Route components
        - Manages browser history and URL synchronization
        - Required wrapper for React Router functionality */}
    <BrowserRouter>
      {/* Main application component containing all routes, providers, and UI */}
      <App />
    </BrowserRouter>
  </StrictMode>
);