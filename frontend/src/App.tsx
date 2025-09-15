import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register.tsx"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword" // Asegúrate de que esta importación sea correcta
import ProfilePage from "./pages/ProfilePage"
import AdminUsers from "./pages/AdminUsers"
import TermsAndConditions from "./pages/TermsAndConditions"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/admin/Dashboard"
import UserManagement from "./pages/admin/UserManagement"
import CatalogDownloads from "./pages/admin/CatalogDownloads"
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/terminos-y-condiciones" element={<TermsAndConditions />} />

          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
          {/* MODIFICACIÓN CLAVE AQUÍ: Añadir el parámetro :token a la ruta */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Rutas protegidas - usuario */}
          <Route
            path="/mi-perfil"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas - admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios-api"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/descargas"
            element={
              <ProtectedRoute>
                <CatalogDownloads />
              </ProtectedRoute>
            }
          />
        </Routes>
        <WhatsAppButton />
      </Router>
    </AuthProvider>
  )
}

export default App