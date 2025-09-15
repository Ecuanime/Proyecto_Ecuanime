import { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si el usuario está autenticado al cargar la página
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setIsLoading(true);
        try {
          const userData = await authService.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error verificando autenticación:", error);
          logout(); // Limpiar datos si hay error
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, []);

  // Función de login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        
        // CAMBIO AQUÍ: Obtener el perfil completo inmediatamente después del login
        try {
          const profileData = await authService.getProfile();
          setUser(profileData); // Actualiza con datos completos del perfil incluyendo el rol
        } catch (profileError) {
          console.error("Error al cargar perfil completo:", profileError);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de registro
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);

      // Si el registro devuelve un token, iniciar sesión automáticamente
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      }
      
      return true;
    } catch (error) {
      console.error("Error en registro:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función para actualizar el perfil
  const updateProfile = async (userData) => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(userData);

      // Actualizar el usuario en el contexto
      setUser({
        ...user,
        ...updatedUser
      });
      
      return true;
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si el usuario es administrador
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        isAdmin,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);