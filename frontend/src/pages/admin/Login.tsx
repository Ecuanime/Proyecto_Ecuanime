"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "../../context/AuthContext"
import styles from "./Login.module.css"

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>

const Login = () => {
  const [error, setError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    const success = await login(data.email, data.password)

    if (success) {
      navigate("/")
    } else {
      setError("Credenciales inválidas. Por favor, intenta de nuevo.")
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <img src="https://i.postimg.cc/2Sczjj7t/LOGO-PARA-PAGINA-WEB-BLANCO.png" alt="Logo" className={styles.logo} />
          <h1>Panel de Administración</h1>
          <p>Ingresa tus credenciales para acceder</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? styles.error : ""}`}
              {...register("email")}
              placeholder="admin@example.com"
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? styles.error : ""}`}
              {...register("password")}
              placeholder="••••••"
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <button type="submit" className={`btn btn-primary ${styles.loginButton}`} disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>¿Olvidaste tu contraseña? Contacta al administrador del sistema.</p>
          <a href="/" className={styles.backLink}>
            Volver al sitio principal
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
