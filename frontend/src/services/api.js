import axios from "axios"

// Configuración base de axios
const API_URL = import.meta.env.VITE_API_URL || "https://ecuanimemoda.com/api"

// Función para obtener el header de autorización
const getAuthHeader = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Función para manejar errores de API
const handleApiError = (error) => {
  console.error("API Error:", error.response || error)

  // Si el error es 401 (no autorizado), limpiar el token
  if (error.response && error.response.status === 401) {
    localStorage.removeItem("token")
  }

  throw error
}

// Servicios de autenticación
export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Registro
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData)
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Obtener perfil
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: getAuthHeader(),
      })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Actualizar perfil
  updateProfile: async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, userData, {
        headers: getAuthHeader(),
      })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Solicitar recuperación de contraseña
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Restablecer contraseña
  resetPassword: async (token, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // --- NUEVA FUNCIÓN PARA GOOGLE SIGN-IN ---
  loginOrRegisterWithGoogle: async (idToken) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google-signin`, { idToken })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
  // --- FIN NUEVA FUNCIÓN ---
}

// Servicios de usuarios
export const userService = {
  // Obtener todos los usuarios
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: getAuthHeader(),
      })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: getAuthHeader(),
      })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Crear usuario (solo admin)
  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData, {
        headers: getAuthHeader(),
      })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, userData, {
        headers: getAuthHeader(),
      })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Eliminar usuario
  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`, {
        headers: getAuthHeader(),
      })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Enviar mensaje de bienvenida
  sendWelcome: async (id) => {
    try {
      const response = await axios.post(
        `${API_URL}/users/${id}/welcome`,
        {},
        {
          headers: getAuthHeader(),
        },
      )
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // NUEVAS FUNCIONES PARA CATÁLOGO

  // Obtener historial de descargas de catálogo (solo admin)
  getCatalogDownloads: async () => {
    try {
      const response = await axios.get(`${API_URL}/catalog/downloads`, {
        headers: getAuthHeader(),
      })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}

// Servicios de catálogo
export const catalogService = {
  // Descargar catálogo
  downloadCatalog: async (userData) => {
    try {
      console.log("Descargando catálogo desde:", `${API_URL}/catalog/download`)
      console.log("Datos de usuario:", userData)

      const response = await axios.post(`${API_URL}/catalog/download`, userData, {
        responseType: "blob", // Importante para recibir el archivo como blob
      })

      console.log("Respuesta recibida:", response)
      return response.data
    } catch (error) {
      console.error("Error en downloadCatalog:", error)
      handleApiError(error)
      throw error
    }
  },
}
