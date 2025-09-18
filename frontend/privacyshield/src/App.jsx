// ============================================================================
// APP.JS - Main Application Component and Routing
// ============================================================================

import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import InitialAssesment from "./components/InitialAssesment";
import Assesment from "./components/Assesment";
import Report from "./components/Report";
import axios from "axios";
import Footer from "./components/ui/Footer";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminLogin from "./components/AdminLogin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AboutUs from "./components/AboutUs";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import { FloatingDownloadButton } from "./components/ui/FloatingDownloadButton";

// Get backend URL from environment variables
const backend_url = import.meta.env.VITE_BACKEND_URI;

/**
 * Axios request interceptor
 * 
 * Automatically prepends the backend URL to relative API endpoints.
 * This allows using relative paths throughout the app (e.g., '/api/users')
 * while automatically resolving to the full backend URL.
 */
axios.interceptors.request.use(function (config) {
  // Only prepend backend URL if the URL doesn't start with 'http'
  if (config.url.slice(0, 4) !== "http") {
    config.url = backend_url + config.url;
  }
  return config;
});

/**
 * Main App Component
 * 
 * Sets up the application routing, authentication context, and global components.
 * Provides the main structure for the privacy assessment application.
 */
function App() {
  return (
    <AdminAuthProvider>                          {/* Provide admin authentication context */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />                           {/* Landing page */}
        <Route path="/initialassesment" element={<InitialAssesment />} />         {/* Initial assessment */}
        <Route path="/assesment" element={<Assesment />} />                 {/* Main assessment */}
        <Route path="/report" element={<Report />} />                       {/* Results report */}
        <Route path="/about" element={<AboutUs />} />                       {/* About page */}
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />              {/* Admin login */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedAdminRoute>                                           {/* Protected admin route */}
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      
      {/* Global UI Components */}
      <Footer />                                                           {/* Site footer */}
      <FloatingDownloadButton />                                           {/* Download functionality */}
    </AdminAuthProvider>
  );
}

export default App;
