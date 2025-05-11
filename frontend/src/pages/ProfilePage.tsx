"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaStore, FaSave, FaCheckCircle } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { userService } from "../services/api"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import styles from "./ProfilePage.module.css"

const profileSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido").optional(),
  phone: z.string().min(10, "El número debe tener al menos 10 dígitos"),
  region: z.string().min(2, "Por favor ingresa tu región"),
  storeName: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      region: "",
      storeName: "",
    },
  })

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // Try to get user data from API
        try {
          const data = await userService.getUserById(user.id)
          setUserData(data)
          reset({
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            region: data.region || "",
            storeName: data.storeName || "",
          })
        } catch (error) {
          console.error("Error fetching user data:", error)
          // Use existing user data from context
          reset({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            region: "",
            storeName: "",
          })
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error)
        setError("No se pudo cargar la información del usuario")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user, navigate, reset])

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      const success = await updateProfile({
        name: data.name,
        phone: data.phone,
        region: data.region,
        storeName: data.storeName,
      })

      if (success) {
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        setError("Error al actualizar el perfil")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Error al actualizar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (!user) {
    return null
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
                <div className={styles.profileAvatar}>{user.name.charAt(0).toUpperCase()}</div>
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

                {error && (
                  <div className={styles.errorMessage}>
                    <p>{error}</p>
                  </div>
                )}

                {isSuccess && (
                  <div className={styles.successMessage}>
                    <FaCheckCircle className={styles.successIcon} />
                    <p>¡Perfil actualizado con éxito!</p>
                  </div>
                )}

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
