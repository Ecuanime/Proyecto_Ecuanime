import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaUser, FaEnvelope, FaLock, FaPhone, FaTimes } from "react-icons/fa"
import { userService } from "../../../services/api"
import styles from "./Modal.module.css"

const createUserSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  phone: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
})

type CreateUserFormData = z.infer<typeof createUserSchema>

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CreateUserModal = ({ isOpen, onClose, onSuccess }: CreateUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "user",
    },
  })

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await userService.createUser(data)
      reset()
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error creating user:", error)
      setError(error.response?.data?.message || "Error al crear el usuario")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Crear Nuevo Usuario</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <div className={styles.errorAlert}>{error}</div>}

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
                placeholder="Nombre del usuario"
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
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">
                <FaLock className={styles.inputIcon} /> Contraseña
              </label>
              <input
                type="password"
                id="password"
                className={`form-control ${errors.password ? styles.error : ""}`}
                {...register("password")}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">
                <FaPhone className={styles.inputIcon} /> Teléfono (Opcional)
              </label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                {...register("phone")}
                placeholder="Número de teléfono"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">Rol</label>
              <select id="role" className="form-control" {...register("role")}>
                <option value="user">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateUserModal