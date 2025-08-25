import { Route, Routes } from "react-router-dom"; // removed BrowserRouter
import HomePage from "./components/HomePage";
import InitialAssesment from "./components/InitialAssesment";
import Assesment from "./components/Assesment";
import Report from "./components/Report";
import axios from "axios";
import Footer from "./components/ui/Footer";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminLogin from "./components/AdminLogin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard"; // keep this one
const backend_url = import.meta.env.VITE_BACKEND_URI;

axios.interceptors.request.use(function (config) {
  if (config.url.slice(0, 4) !== "http") {
    config.url = backend_url + config.url;
  }
  return config;
});

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/" element={<HomePage />} />
        <Route path="/initialassesment" element={<InitialAssesment />} />
        <Route path="/assesment" element={<Assesment />} />
        <Route path="/report" element={<Report />} />
      </Routes>
      <Footer />
    </AdminAuthProvider>
  );
}

export default App;
