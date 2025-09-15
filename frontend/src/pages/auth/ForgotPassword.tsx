import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaEnvelope, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa"
import { authService } from "../../services/api"
import styles from "./Auth.module.css"

// Definir esquema de validación con zod
const forgotPasswordSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const ForgotPassword = () => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null)
    setSuccess(false)
    setIsLoading(true)
    
    try {
      await authService.forgotPassword(data.email)
      setSuccess(true)
    } catch (error: any) {
      setError(error.response?.data?.message || "Error al enviar el correo. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <img src="https://i.postimg.cc/YSMsH2bX/Chat-GPT-Image-12-may-2025-17-19-48.png" alt="Logo" className={styles.logo} />
          <h1>Recuperar Contraseña</h1>
          <p>Ingresa tu correo electrónico para recibir instrucciones</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <FaExclamationTriangle className={styles.alertIcon} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={styles.successAlert}>
            <FaCheckCircle className={styles.alertIcon} />
            <span>Se ha enviado un correo con instrucciones para restablecer tu contraseña.</span>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">
                <FaEnvelope className={styles.inputIcon} /> Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? styles.error : ""}`}
                {...register("email")}
                placeholder="tucorreo@ejemplo.com"
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <button type="submit" className={`btn btn-primary ${styles.authButton}`} disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Instrucciones"}
            </button>
          </form>
        ) : (
          <div className={styles.successMessage}>
            <p>Revisa tu bandeja de entrada y sigue las instrucciones enviadas a tu correo.</p>
            <button 
              onClick={() => setSuccess(false)} 
              className={`btn btn-outline ${styles.authButton}`}
            >
              Enviar de nuevo
            </button>
          </div>
        )}

        <div className={styles.authFooter}>
          <p>
            <Link to="/login">Volver a Iniciar Sesión</Link>
          </p>
          <Link to="/" className={styles.backLink}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword