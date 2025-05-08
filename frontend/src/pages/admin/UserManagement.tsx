"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, UserPlus, Edit, Mail, Trash } from "lucide-react"
import AdminLayout from "../../pages/admin/components/AdminLayout.js"
import { userService } from "../../services/api.js"
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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    // Cargar usuarios desde la API
    const loadUsers = async () => {
      try {
        setIsLoading(true)
        const data = await userService.getUsers()
        setUsers(data)
        setFilteredUsers(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error al cargar los usuarios"
        setError(errorMessage)
        console.error("Error al cargar usuarios:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Filtrar usuarios cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phone && user.phone.includes(searchTerm)),
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleSendWelcome = async (userId: string) => {
    try {
      await userService.sendWelcome(userId)
      alert("Correo de bienvenida enviado correctamente")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      alert("Error al enviar correo: " + errorMessage)
    }
  }

  const confirmDelete = async () => {
    if (!selectedUser) return

    try {
      await userService.deleteUser(selectedUser._id)
      setUsers(users.filter((user) => user._id !== selectedUser._id))
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      alert("Error al eliminar usuario: " + errorMessage)
    }
  }

  const saveUserChanges = async (userData: Partial<User>) => {
    if (!selectedUser) return

    try {
      const updatedUser = await userService.updateUser(selectedUser._id, userData)
      setUsers(users.map((user) => (user._id === selectedUser._id ? { ...user, ...updatedUser } : user)))
      setShowEditModal(false)
      setSelectedUser(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      alert("Error al actualizar usuario: " + errorMessage)
    }
  }

  const handleAddUser = () => {
    // Aquí se podría implementar la lógica para abrir un modal de creación de usuario
    alert("Funcionalidad de añadir usuario pendiente de implementar")
  }

  return (
    <AdminLayout>
      <div className={styles.userManagementHeader}>
        <h1>Gestión de Usuarios</h1>
        <p>Administra los usuarios del sistema</p>
      </div>

      <div className={styles.searchBar}>
        <div className={styles.searchInput}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button className={styles.addButton} onClick={handleAddUser}>
          <UserPlus size={16} /> Nuevo Usuario
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>{error}</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Región</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.noResults}>
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "N/A"}</td>
                    <td>{user.region || "N/A"}</td>
                    <td>
                      <span
                        className={`${styles.roleBadge} ${user.role === "admin" ? styles.adminBadge : styles.userBadge}`}
                      >
                        {user.role === "admin" ? "Administrador" : "Usuario"}
                      </span>
                    </td>
                    <td className={styles.actions}>
                      <button className={styles.actionButton} onClick={() => handleEdit(user)} title="Editar usuario">
                        <Edit size={16} />
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleSendWelcome(user._id)}
                        title="Enviar correo de bienvenida"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDelete(user)}
                        title="Eliminar usuario"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de edición */}
      {showEditModal && selectedUser && (
        <EditUserModal user={selectedUser} onClose={() => setShowEditModal(false)} onSave={saveUserChanges} />
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && selectedUser && (
        <DeleteConfirmModal user={selectedUser} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />
      )}
    </AdminLayout>
  )
}

// Componente modal para editar usuario
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
          <h2>Editar Usuario</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nombre</label>
            <input type="text" name="name" value={userData.name} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" value={user.email} disabled className={styles.disabledInput} />
            <small>El email no se puede modificar</small>
          </div>
          <div className={styles.formGroup}>
            <label>Teléfono</label>
            <input type="tel" name="phone" value={userData.phone} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Región</label>
            <input type="text" name="region" value={userData.region} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Nombre de Tienda</label>
            <input type="text" name="storeName" value={userData.storeName} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Rol</label>
            <select name="role" value={userData.role} onChange={handleChange}>
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Componente modal para confirmar eliminación
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
          <h2>Confirmar Eliminación</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <p>
            ¿Estás seguro que deseas eliminar al usuario <strong>{user.name}</strong>?
          </p>
          <p>Esta acción no se puede deshacer.</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button className={`${styles.deleteButton} ${styles.confirmButton}`} onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
