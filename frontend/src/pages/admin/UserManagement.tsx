"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Search, UserPlus, Edit, Trash, XIcon as IconX, Download } from "lucide-react"
import Swal from "sweetalert2"
import AdminLayout from "../../pages/admin/components/AdminLayout.js"
import { userService } from "../../services/api.js"
import { exportToExcel } from "../../utils/excelExport.js"
import styles from "./UserManagement.module.css"

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  region?: string
  storeName?: string
  role: "admin" | "user"
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await userService.getUsers()
      setUsers(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar los usuarios"
      setError(errorMessage)
      console.error("Error al cargar usuarios:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm)) ||
      (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.storeName && user.storeName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleExportUsers = async () => {
    if (filteredUsers.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No hay datos para exportar",
        text: "No se encontraron usuarios para exportar",
        background: "#1e1e1e",
        color: "#e0e0e0",
        confirmButtonColor: "#ffc107",
        confirmButtonText: "Entendido",
      })
      return
    }

    // Mostrar confirmación antes de exportar
    const result = await Swal.fire({
      title: "¿Exportar lista de usuarios?",
      text: `Se exportarán ${filteredUsers.length} usuario(s) a Excel`,
      icon: "question",
      background: "#1e1e1e",
      color: "#e0e0e0",
      showCancelButton: true,
      confirmButtonColor: "#2ecc71",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, exportar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    })

    if (result.isConfirmed) {
      setIsExporting(true)
      try {
        // Mostrar loading
        Swal.fire({
          title: "Exportando usuarios...",
          text: "Generando archivo Excel",
          background: "#1e1e1e",
          color: "#e0e0e0",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        const exportData = [
          {
            sheetName: "Usuarios",
            data: filteredUsers.map((user) => ({
              Nombre: user.name,
              Email: user.email,
              Teléfono: user.phone || "N/A",
              Región: user.region || "N/A",
              Tienda: user.storeName || "N/A",
              Rol: user.role === "admin" ? "Administrador" : "Usuario",
            })),
          },
        ]

        const success = exportToExcel(exportData, "usuarios")
        if (!success) {
          // El error ya se maneja en exportToExcel
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error inesperado",
          text: "Ocurrió un error inesperado durante la exportación",
          background: "#1e1e1e",
          color: "#e0e0e0",
          confirmButtonColor: "#e74c3c",
          confirmButtonText: "Entendido",
        })
      } finally {
        setIsExporting(false)
      }
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const openDeleteModal = (user: User) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const openAddModal = () => {
    setSelectedUser(null)
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowEditModal(false)
    setShowDeleteModal(false)
    setShowAddModal(false)
    setSelectedUser(null)
  }

  const confirmDeleteUser = async () => {
    if (!selectedUser) return
    try {
      await userService.deleteUser(selectedUser._id)
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUser._id))
      closeModal()

      Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
        text: "El usuario ha sido eliminado correctamente",
        background: "#1e1e1e",
        color: "#e0e0e0",
        confirmButtonColor: "#2ecc71",
        confirmButtonText: "Entendido",
        timer: 3000,
        timerProgressBar: true,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: `No se pudo eliminar el usuario: ${errorMessage}`,
        background: "#1e1e1e",
        color: "#e0e0e0",
        confirmButtonColor: "#e74c3c",
        confirmButtonText: "Entendido",
      })
    }
  }

  const saveUserChanges = async (userData: Partial<User>) => {
    if (!selectedUser) return
    try {
      const updatedUser = await userService.updateUser(selectedUser._id, userData)
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === selectedUser._id ? { ...user, ...updatedUser } : user)),
      )
      closeModal()

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: "Los datos del usuario han sido actualizados correctamente",
        background: "#1e1e1e",
        color: "#e0e0e0",
        confirmButtonColor: "#2ecc71",
        confirmButtonText: "Entendido",
        timer: 3000,
        timerProgressBar: true,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: `No se pudo actualizar el usuario: ${errorMessage}`,
        background: "#1e1e1e",
        color: "#e0e0e0",
        confirmButtonColor: "#e74c3c",
        confirmButtonText: "Entendido",
      })
    }
  }

  const createUser = async (newUserData: Omit<User, "_id">) => {
    try {
      const newUser = await userService.createUser(newUserData)
      setUsers((prevUsers) => [...prevUsers, newUser])
      closeModal()

      Swal.fire({
        icon: "success",
        title: "Usuario creado",
        text: "El nuevo usuario ha sido creado correctamente",
        background: "#1e1e1e",
        color: "#e0e0e0",
        confirmButtonColor: "#2ecc71",
        confirmButtonText: "Entendido",
        timer: 3000,
        timerProgressBar: true,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear el usuario"
      Swal.fire({
        icon: "error",
        title: "Error al crear usuario",
        text: `No se pudo crear el usuario: ${errorMessage}`,
        background: "#1e1e1e",
        color: "#e0e0e0",
        confirmButtonColor: "#e74c3c",
        confirmButtonText: "Entendido",
      })
    }
  }

  return (
    <AdminLayout>
      <div className={styles.userManagementContainer}>
        <div className={styles.userManagementHeader}>
          <div className={styles.headerContent}>
            <div>
              <h1>Gestión de Usuarios</h1>
              <p>Administra los usuarios del sistema de forma eficiente y segura.</p>
            </div>
            <button
              onClick={handleExportUsers}
              disabled={isExporting || filteredUsers.length === 0}
              className={styles.exportButton}
            >
              <Download size={18} />
              {isExporting ? "Exportando..." : "Exportar Excel"}
            </button>
          </div>
        </div>

        <div className={styles.controlsContainer}>
          <div className={styles.searchInputContainer}>
            <div className={styles.searchInput}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                className={styles.inputField}
                placeholder="Buscar por nombre, email, rol..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <button className={styles.addButton} onClick={openAddModal}>
            <UserPlus size={18} /> Nuevo Usuario
          </button>
        </div>

        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando usuarios...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={loadUsers} className={`${styles.modalButton} ${styles.primaryButton}`}>
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableContainer}>
              <table className={styles.usersTable}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th className={styles.hideOnMobile}>Teléfono</th>
                    <th className={styles.hideOnTablet}>Tienda</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.noResults}>
                        No se encontraron usuarios que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td data-label="Nombre">{user.name}</td>
                        <td data-label="Email">{user.email}</td>
                        <td data-label="Teléfono" className={styles.hideOnMobile}>
                          {user.phone || "N/A"}
                        </td>
                        <td data-label="Tienda" className={styles.hideOnTablet}>
                          {user.storeName || "N/A"}
                        </td>
                        <td data-label="Rol">
                          <span
                            className={`${styles.roleBadge} ${user.role === "admin" ? styles.adminBadge : styles.userBadge}`}
                          >
                            {user.role === "admin" ? "Admin" : "Usuario"}
                          </span>
                        </td>
                        <td data-label="Acciones">
                          <div className={styles.actions}>
                            <button
                              className={`${styles.actionButton} ${styles.editButton}`}
                              onClick={() => openEditModal(user)}
                              title="Editar usuario"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              onClick={() => openDeleteModal(user)}
                              title="Eliminar usuario"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAddModal && <AddUserModal onClose={closeModal} onCreateUser={createUser} />}
        {showEditModal && selectedUser && (
          <EditUserModal user={selectedUser} onClose={closeModal} onSave={saveUserChanges} />
        )}
        {showDeleteModal && selectedUser && (
          <DeleteConfirmModal user={selectedUser} onClose={closeModal} onConfirm={confirmDeleteUser} />
        )}
      </div>
    </AdminLayout>
  )
}

// Componentes de Modal (mantienen la misma estructura)
interface AddUserModalProps {
  onClose: () => void
  onCreateUser: (newUserData: Omit<User, "_id">) => void
}

const AddUserModal = ({ onClose, onCreateUser }: AddUserModalProps) => {
  const [newUserData, setNewUserData] = useState<Omit<User, "_id">>({
    name: "",
    email: "",
    phone: "",
    region: "",
    storeName: "",
    role: "user",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserData.name || !newUserData.email) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Nombre y Email son obligatorios",
        background: "#1e1e1e",
        color: "#e0e0e0",
        confirmButtonColor: "#ffc107",
        confirmButtonText: "Entendido",
      })
      return
    }
    onCreateUser(newUserData)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h5>Crear Nuevo Usuario</h5>
          <button onClick={onClose} className={styles.closeButton} aria-label="Cerrar modal">
            <IconX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre Completo</label>
              <input type="text" id="name" name="name" value={newUserData.name} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={newUserData.email} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Teléfono (Opcional)</label>
              <input type="tel" id="phone" name="phone" value={newUserData.phone} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="storeName">Nombre de Tienda (Opcional)</label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={newUserData.storeName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="region">Región (Opcional)</label>
              <input type="text" id="region" name="region" value={newUserData.region} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="role">Rol</label>
              <select id="role" name="role" value={newUserData.role} onChange={handleChange}>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.modalButton} ${styles.secondaryButton}`} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={`${styles.modalButton} ${styles.primaryButton}`}>
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface EditUserModalProps {
  user: User
  onClose: () => void
  onSave: (userData: Partial<User>) => void
}

const EditUserModal = ({ user, onClose, onSave }: EditUserModalProps) => {
  const [userData, setUserData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    region: user.region || "",
    storeName: user.storeName || "",
    role: user.role || "user",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(userData)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h5>Editar Usuario: {user.name}</h5>
          <button onClick={onClose} className={styles.closeButton} aria-label="Cerrar modal">
            <IconX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="edit-name">Nombre Completo</label>
              <input type="text" id="edit-name" name="name" value={userData.name} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="edit-email">Email</label>
              <input
                type="email"
                id="edit-email"
                name="email"
                value={user.email}
                disabled
                className={styles.disabledInput}
              />
              <small>El email no se puede modificar.</small>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="edit-phone">Teléfono</label>
              <input type="tel" id="edit-phone" name="phone" value={userData.phone} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="edit-storeName">Nombre de Tienda</label>
              <input
                type="text"
                id="edit-storeName"
                name="storeName"
                value={userData.storeName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="edit-region">Región</label>
              <input type="text" id="edit-region" name="region" value={userData.region} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="edit-role">Rol</label>
              <select id="edit-role" name="role" value={userData.role} onChange={handleChange}>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.modalButton} ${styles.secondaryButton}`} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={`${styles.modalButton} ${styles.primaryButton}`}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface DeleteConfirmModalProps {
  user: User
  onClose: () => void
  onConfirm: () => void
}

const DeleteConfirmModal = ({ user, onClose, onConfirm }: DeleteConfirmModalProps) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h5>Confirmar Eliminación</h5>
          <button onClick={onClose} className={styles.closeButton} aria-label="Cerrar modal">
            <IconX size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p>
            ¿Estás seguro que deseas eliminar al usuario <strong>{user.name}</strong> ({user.email})?
          </p>
          <p style={{ color: "var(--danger-color)", fontWeight: "500" }}>Esta acción no se puede deshacer.</p>
        </div>
        <div className={styles.modalFooter}>
          <button type="button" className={`${styles.modalButton} ${styles.secondaryButton}`} onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className={`${styles.modalButton} ${styles.dangerButton}`} onClick={onConfirm}>
            Eliminar Usuario
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
