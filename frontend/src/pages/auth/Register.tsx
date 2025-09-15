"use client"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaStore,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import styles from "./Auth.module.css"

const registerSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "El número debe tener al menos 10 dígitos"),
    region: z.string().min(2, "Por favor ingresa tu región"),
    storeName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const Register = () => {
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isLoading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        region: data.region,
        storeName: data.storeName || "",
      }
      const success = await registerUser(userData)
      if (success) {
        navigate("/")
      } else {
        setError("Error al registrar. Por favor, intenta de nuevo.")
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Error al registrar. Por favor, intenta de nuevo.")
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <img src="https://i.postimg.cc/7LgT124M/LOGO-PARA-PAGINA-WEB-BLANCO.png" alt="Logo" className={styles.logo} />
          <h1>Crear Cuenta</h1>
          <p>Regístrate para acceder a todos nuestros servicios</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <FaExclamationTriangle className={styles.alertIcon} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              <FaUser className={styles.inputIcon} /> Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              className={`form-control ${errors.name ? styles.error : ""}`}
              {...register("name")}
              placeholder="Tu nombre completo"
            />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>

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

          <div className={styles.formRow}>
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
                  placeholder="Repite tu contraseña"
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
                placeholder="+57 300 123 4567"
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
                placeholder="Tu ciudad o región"
              />
              {errors.region && <p className="error-message">{errors.region.message}</p>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="storeName">
              <FaStore className={styles.inputIcon} /> Nombre de la Tienda (Opcional)
            </label>
            <input
              type="text"
              id="storeName"
              className="form-control"
              {...register("storeName")}
              placeholder="Nombre de tu tienda o negocio"
            />
          </div>

          <button type="submit" className={`btn btn-primary ${styles.authButton}`} disabled={isLoading}>
            {isLoading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>
            ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link>
          </p>
          <Link to="/" className={styles.backLink}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
