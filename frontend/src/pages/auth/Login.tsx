"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaEnvelope, FaLock, FaExclamationTriangle, FaEye, FaEyeSlash } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import styles from "./Auth.module.css"

// Definir esquema de validación con zod
const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

const Login = () => {
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setError(null)
    try {
      const success = await login(data.email, data.password)
      if (success) {
        navigate("/")
      } else {
        setError("Credenciales inválidas. Por favor, intenta de nuevo.")
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error al iniciar sesión. Por favor, intenta de nuevo.")
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <img src="https://i.postimg.cc/7LgT124M/LOGO-PARA-PAGINA-WEB-BLANCO.png" alt="Logo" className={styles.logo} />
          <h1>Iniciar Sesión</h1>
          <p>Ingresa a tu cuenta para acceder a todos nuestros servicios</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <FaExclamationTriangle className={styles.alertIcon} />
            <span>{error}</span>
          </div>
        )}

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

          <div className={styles.formGroup}>
            <label htmlFor="password">
              <FaLock className={styles.inputIcon} /> Contraseña
            </label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`form-control ${errors.password ? styles.error : ""}`}
                {...register("password")}
                placeholder="Ingresa tu contraseña"
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

          <div className={styles.forgotPassword}>
            <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.authButton}`} disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>
            ¿No tienes una cuenta? <Link to="/registro">Regístrate ahora</Link>
          </p>
          <Link to="/" className={styles.backLink}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
