import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaLock, FaExclamationTriangle } from "react-icons/fa"
import { authService } from "../services/api"
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  // Verificar validez del token al cargar
  useEffect(() => {
    if (!token) {
      setTokenValid(false)
      setError("Token inválido o expirado")
    }
  }, [token])

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null)
    setIsLoading(true)
    
    try {
      await authService.resetPassword(token!, data.password)
      // Redirigir al login con mensaje de éxito
      navigate("/login", { state: { message: "Contraseña actualizada correctamente. Inicia sesión con tu nueva contraseña." } })
    } catch (error: any) {
      setError(error.response?.data?.message || "Error al restablecer la contraseña. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authHeader}>
            <img src="https://i.postimg.cc/zXjLVJJz/LOGO-PARA-PAGINA-WEB-FONDO-NEGRO.png" alt="Logo" className={styles.logo} />
            <h1>Error</h1>
          </div>
          
          <div className={styles.errorAlert}>
            <FaExclamationTriangle className={styles.alertIcon} />
            <span>El enlace para restablecer la contraseña es inválido o ha expirado.</span>
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
          <img src="https://i.postimg.cc/zXjLVJJz/LOGO-PARA-PAGINA-WEB-FONDO-NEGRO.png" alt="Logo" className={styles.logo} />
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
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? styles.error : ""}`}
              {...register("password")}
              placeholder="••••••"
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">
              <FaLock className={styles.inputIcon} /> Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-control ${errors.confirmPassword ? styles.error : ""}`}
              {...register("confirmPassword")}
              placeholder="••••••"
            />
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