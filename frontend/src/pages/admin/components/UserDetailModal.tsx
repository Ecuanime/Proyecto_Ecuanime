import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaStore } from "react-icons/fa"
import styles from "./Modal.module.css"

interface UserDetailModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

const UserDetailModal = ({ isOpen, onClose, user }: UserDetailModalProps) => {
  if (!isOpen || !user) return null

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Detalles del Usuario</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.userDetailHeader}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className={`${styles.userRole} ${styles[user.role || "user"]}`}>
              {user.role === "admin" ? "Administrador" : "Cliente"}
            </span>
          </div>

          <div className={styles.userDetailGrid}>
            <div className={styles.userDetailItem}>
              <h4>
                <FaUser /> Nombre
              </h4>
              <p>{user.name || "No especificado"}</p>
            </div>

            <div className={styles.userDetailItem}>
              <h4>
                <FaEnvelope /> Correo Electrónico
              </h4>
              <p>{user.email || "No especificado"}</p>
            </div>

            <div className={styles.userDetailItem}>
              <h4>
                <FaPhone /> Teléfono
              </h4>
              <p>{user.phone || "No especificado"}</p>
            </div>

            <div className={styles.userDetailItem}>
              <h4>
                <FaMapMarkerAlt /> Región
              </h4>
              <p>{user.region || "No especificada"}</p>
            </div>

            <div className={styles.userDetailItem}>
              <h4>
                <FaCalendarAlt /> Fecha de Registro
              </h4>
              <p>{formatDate(user.registrationDate || user.createdAt)}</p>
            </div>

            <div className={styles.userDetailItem}>
              <h4>
                <FaStore /> Nombre de Tienda
              </h4>
              <p>{user.storeName || "No especificado"}</p>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailModal