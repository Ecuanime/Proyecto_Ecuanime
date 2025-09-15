"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaLock, FaExclamationTriangle, FaEye, FaEyeSlash } from "react-icons/fa"
import { authService } from "../../services/api"
import styles from "./Auth.module.css"

// Definir esquema de validación con zod
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

const ResetPassword = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { token } = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  // Verificar la presencia del token al cargar el componente
  useEffect(() => {
    if (!token) {
      setTokenValid(false)
      setError("El enlace para restablecer la contraseña es inválido o no se encontró el token.")
    }
  }, [token])

  const onSubmit = async (data) => {
    setError(null)
    setIsLoading(true)

    if (!token) {
      setError("Token de restablecimiento no encontrado.")
      setIsLoading(false)
      setTokenValid(false)
      return
    }

    try {
      await authService.resetPassword(token, data.password)
      navigate("/login", {
        state: { message: "Contraseña actualizada correctamente. Inicia sesión con tu nueva contraseña." },
      })
    } catch (apiError) {
      const errorMessage =
        apiError.response?.data?.message || "Error al restablecer la contraseña. Por favor, intenta de nuevo."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authHeader}>
            <img
              src="https://i.postimg.cc/YSMsH2bX/Chat-GPT-Image-12-may-2025-17-19-48.png"
              alt="Logo"
              className={styles.logo}
            />
            <h1>Error</h1>
          </div>

          <div className={styles.errorAlert}>
            <FaExclamationTriangle className={styles.alertIcon} />
            <span>{error || "El enlace para restablecer la contraseña es inválido o ha expirado."}</span>
          </div>

          <div className={styles.authFooter}>
            <Link to="/recuperar-contrasena" className={styles.authButton}>
              Solicitar nuevo enlace
            </Link>
            <Link to="/login" className={styles.backLink}>
              Volver a Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <img
            src="https://i.postimg.cc/YSMsH2bX/Chat-GPT-Image-12-may-2025-17-19-48.png"
            alt="Logo"
            className={styles.logo}
          />
          <h1>Restablecer Contraseña</h1>
          <p>Ingresa tu nueva contraseña</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <FaExclamationTriangle className={styles.alertIcon} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="password">
              <FaLock className={styles.inputIcon} /> Nueva Contraseña
            </label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`form-control ${errors.password ? styles.error : ""}`}
                {...register("password")}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">
              <FaLock className={styles.inputIcon} /> Confirmar Contraseña
            </label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`form-control ${errors.confirmPassword ? styles.error : ""}`}
                {...register("confirmPassword")}
                placeholder="Repite tu nueva contraseña"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" className={`btn btn-primary ${styles.authButton}`} disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>

        <div className={styles.authFooter}>
          <Link to="/login" className={styles.backLink}>
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
