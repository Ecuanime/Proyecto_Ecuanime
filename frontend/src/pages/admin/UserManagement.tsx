"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, UserPlus, Edit, Mail, Trash } from "lucide-react"
import AdminLayout from "../../pages/admin/components/AdminLayout.js"
import { userService } from "../../services/api.js"
import styles from "./UserManagement.module.css" // Mantenemos tus estilos personalizados

// Importa los estilos de Bootstrap (asegúrate de tener Bootstrap instalado en tu proyecto)
import "bootstrap/dist/css/bootstrap.min.css"

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
  const [showAddModal, setShowAddModal] = useState(false) // Nuevo estado para el modal de añadir usuario

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
    setShowAddModal(true)
  }

  const closeAddModal = () => {
    setShowAddModal(false)
  }

  const createUser = async (newUserData: Omit<User, "_id">) => {
    try {
      const newUser = await userService.createUser(newUserData) // Usando tu función de la API
      setUsers([...users, newUser])
      setFilteredUsers([...filteredUsers, newUser])
      closeAddModal()
      alert("Usuario creado correctamente")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear el usuario"
      alert("Error al crear usuario: " + errorMessage)
      console.error("Error al crear usuario:", error)
    }
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="row mb-3">
          <div className="col">
            <h1 className={styles.userManagementHeaderH1}>Gestión de Usuarios</h1>
            <p className={styles.userManagementHeaderP}>Administra los usuarios del sistema</p>
          </div>
        </div>

        <div className="row mb-3 align-items-center">
          <div className="col-md-6">
            <div className={styles.searchInput}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <button className={styles.addButton} onClick={handleAddUser}>
              <UserPlus size={16} className="me-2" /> Nuevo Usuario
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
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
              <div className="table-responsive">
                <table className={`${styles.usersTable} table table-striped table-hover bg-light rounded shadow-sm w-100`}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th className="d-none d-md-table-cell">Teléfono</th>
                      <th className="d-none d-lg-table-cell">Región</th>
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
                          <td className="d-none d-md-table-cell">{user.phone || "N/A"}</td>
                          <td className="d-none d-lg-table-cell">{user.region || "N/A"}</td>
                          <td>
                            <span
                              className={`${styles.roleBadge} rounded-pill ${
                                user.role === "admin" ? styles.adminBadge : styles.userBadge
                              }`}
                            >
                              {user.role === "admin" ? "Administrador" : "Usuario"}
                            </span>
                          </td>
                          <td className={styles.actions}>
                            <div className="d-flex gap-2">
                              <button
                                className={`${styles.actionButton} btn btn-sm btn-outline-primary`}
                                onClick={() => handleEdit(user)}
                                title="Editar usuario"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className={`${styles.actionButton} btn btn-sm btn-outline-success`}
                                onClick={() => handleSendWelcome(user._id)}
                                title="Enviar correo de bienvenida"
                              >
                                <Mail size={16} />
                              </button>
                              <button
                                className={`${styles.actionButton} ${styles.deleteButton} btn btn-sm btn-outline-danger`}
                                onClick={() => handleDelete(user)}
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
            )}
          </div>
        </div>

        {/* Modal de edición */}
        {showEditModal && selectedUser && (
          <EditUserModal user={selectedUser} onClose={() => setShowEditModal(false)} onSave={saveUserChanges} />
        )}

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && selectedUser && (
          <DeleteConfirmModal user={selectedUser} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />
        )}

        {/* Modal de añadir usuario */}
        {showAddModal && (
          <AddUserModal onClose={closeAddModal} onCreateUser={createUser} />
        )}
      </div>
    </AdminLayout>
  )
}

// Componente modal para añadir usuario
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
    onCreateUser(newUserData)
  }

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nuevo Usuario</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" name="name" value={newUserData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={newUserData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input type="tel" className="form-control" name="phone" value={newUserData.phone} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Región</label>
                <input type="text" className="form-control" name="region" value={newUserData.region} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Nombre de Tienda</label>
                <input type="text" className="form-control" name="storeName" value={newUserData.storeName} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Rol</label>
                <select className="form-select" name="role" value={newUserData.role} onChange={handleChange}>
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente modal para editar usuario (sin cambios significativos en la estructura)
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
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Usuario</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" name="name" value={userData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={user.email} disabled />
                <small className="text-muted">El email no se puede modificar</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input type="tel" className="form-control" name="phone" value={userData.phone} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Región</label>
                <input type="text" className="form-control" name="region" value={userData.region} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Nombre de Tienda</label>
                <input type="text" className="form-control" name="storeName" value={userData.storeName} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Rol</label>
                <select className="form-select" name="role" value={userData.role} onChange={handleChange}>
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente modal para confirmar eliminación (sin cambios significativos en la estructura)
interface DeleteConfirmModalProps {
  user: User
  onClose: () => void
  onConfirm: () => void
}

const DeleteConfirmModal = ({ user, onClose, onConfirm }: DeleteConfirmModalProps) => {
  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar Eliminación</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>
              ¿Estás seguro que deseas eliminar al usuario <strong>{user.name}</strong>?
            </p>
            <p className="text-muted">Esta acción no se puede deshacer.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement