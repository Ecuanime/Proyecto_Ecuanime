"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaStore, FaSave, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { authService } from "../services/api" // Importamos authService
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import styles from "./ProfilePage.module.css"

// Esquema de validación para el formulario de perfil
const profileSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido").optional(), // El email es opcional porque no se edita
  phone: z.string().min(10, "El número debe tener al menos 10 dígitos"),
  region: z.string().min(2, "Por favor ingresa tu región"),
  storeName: z.string().optional().nullable(), // storeName puede ser nulo en la DB
})

// Tipo inferido del esquema para tipado seguro
type ProfileFormData = z.infer<typeof profileSchema>

const ProfilePage = () => {
  const { user, logout, updateProfile: updateAuthContextProfile } = useAuth() // Renombrar para evitar conflicto
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Iniciar en true para cargar datos al inicio
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Función para resetear los valores del formulario
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    // Los defaultValues se establecerán después de que los datos se carguen del backend
    defaultValues: {
        name: "",
        email: "",
        phone: "",
        region: "",
        storeName: "",
    }
  })

  // useEffect para cargar los datos del usuario al montar el componente
  useEffect(() => {
    // Si no hay usuario autenticado, redirigir al login
    if (!user) {
      navigate("/login")
      return
    }

    const fetchUserProfile = async () => {
      setIsLoading(true)
      setError(null) // Limpiar errores anteriores
      try {
        // CAMBIO AQUÍ: Llamar a authService.getProfile()
        const data = await authService.getProfile() 
        
        // Establecer los valores del formulario con los datos obtenidos
        reset({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          region: data.region || "",
          storeName: data.storeName || "",
        })
      } catch (err: any) {
        console.error("Error al cargar el perfil del usuario:", err)
        // Manejar errores de la API, por ejemplo, si el token expiró
        const errorMessage = err.response?.data?.message || "No se pudo cargar la información del usuario. Intenta recargar la página."
        setError(errorMessage)
        // Si hay un error grave (ej. token inválido), considera cerrar sesión
        if (err.response?.status === 401) {
            logout();
            navigate("/login");
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, navigate, reset, logout]) // Dependencias: user, navigate, reset, logout

  // Función para manejar el envío del formulario de actualización de perfil
  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false) // Resetear el mensaje de éxito

    try {
      // CAMBIO AQUÍ: Llamar a authService.updateProfile()
      const updatedUserData = await authService.updateProfile(data) 

      // Actualizar el contexto de autenticación con los nuevos datos
      updateAuthContextProfile(updatedUserData) 

      setIsSuccess(true)
      // Opcional: Resetear el formulario con los datos actualizados (aunque ya se actualizó el contexto)
      reset({
        name: updatedUserData.name || "",
        email: updatedUserData.email || "",
        phone: updatedUserData.phone || "",
        region: updatedUserData.region || "",
        storeName: updatedUserData.storeName || "",
      });

      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (err: any) {
      console.error("Error al actualizar el perfil:", err)
      const errorMessage = err.response?.data?.message || "Error al actualizar el perfil. Por favor, intenta de nuevo."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Si no hay usuario o está cargando inicialmente y no hay datos, mostrar spinner o null
  if (!user) {
    return null // O un spinner global si prefieres
  }

  return (
    <>
      <Header />
      <div className={styles.profilePage}>
        <div className="container">
          <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
              <h1>Mi Perfil</h1>
              <p>Gestiona tu información personal y preferencias</p>
            </div>

            <div className={styles.profileContent}>
              <div className={styles.profileSidebar}>
                {/* Asegúrate de que user.name exista antes de usar charAt */}
                <div className={styles.profileAvatar}>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <div className={styles.profileRole}>
                  {user.role === "admin" ? "Administrador" : "Cliente Mayorista"}
                </div>

                <div className={styles.profileActions}>
                  {user.role === "admin" && (
                    <button onClick={() => navigate("/admin")} className={styles.adminButton}>
                      Panel de Administración
                    </button>
                  )}
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    Cerrar Sesión
                  </button>
                </div>
              </div>

              <div className={styles.profileForm}>
                <h2>Información Personal</h2>

                {/* Mensajes de error */}
                {error && (
                  <div className={`${styles.errorMessage} ${styles.errorAlert}`}>
                    <FaExclamationTriangle className={styles.alertIcon} />
                    <p>{error}</p>
                  </div>
                )}

                {/* Mensaje de éxito */}
                {isSuccess && (
                  <div className={`${styles.successMessage} ${styles.successAlert}`}>
                    <FaCheckCircle className={styles.alertIcon} />
                    <p>¡Perfil actualizado con éxito!</p>
                  </div>
                )}

                {/* Contenido condicional: spinner o formulario */}
                {isLoading ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Cargando información...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">
                        <FaUser className={styles.inputIcon} /> Nombre Completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        className={`form-control ${errors.name ? styles.error : ""}`}
                        {...register("name")}
                      />
                      {errors.name && <p className="error-message">{errors.name.message}</p>}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">
                        <FaEnvelope className={styles.inputIcon} /> Correo Electrónico
                      </label>
                      <input type="email" id="email" className="form-control" disabled {...register("email")} />
                      <small>El correo electrónico no se puede modificar</small>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="phone">
                          <FaPhoneAlt className={styles.inputIcon} /> Teléfono
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className={`form-control ${errors.phone ? styles.error : ""}`}
                          {...register("phone")}
                        />
                        {errors.phone && <p className="error-message">{errors.phone.message}</p>}
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="region">
                          <FaMapMarkerAlt className={styles.inputIcon} /> Región/Ciudad
                        </label>
                        <input
                          type="text"
                          id="region"
                          className={`form-control ${errors.region ? styles.error : ""}`}
                          {...register("region")}
                        />
                        {errors.region && <p className="error-message">{errors.region.message}</p>}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="storeName">
                        <FaStore className={styles.inputIcon} /> Nombre de la Tienda (Opcional)
                      </label>
                      <input type="text" id="storeName" className="form-control" {...register("storeName")} />
                    </div>

                    <button type="submit" className={styles.saveButton} disabled={isLoading}>
                      <FaSave /> {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProfilePage
