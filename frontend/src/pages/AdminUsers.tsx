"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch, FaEdit, FaTrash, FaDownload, FaExclamationTriangle, FaEnvelope, FaCheckCircle, FaEye, FaUserPlus } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { userService } from "../services/api.js"
import AdminLayout from "./admin/components/AdminLayout"
import CreateUserModal from "./admin/components/CreateUserModal"
import UserDetailModal from "./admin/components/UserDetailModal"
import styles from "./AdminUsers.module.css"

interface User {
  _id: string
  name: string
  email: string
  phone: string
  region?: string
  registrationDate: string
  createdAt?: string
  isWelcomed?: boolean
  role?: string
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login")
      return
    }

    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        // Obtener usuarios de la API
        const data = await userService.getUsers()
        setUsers(data)
        setFilteredUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("No se pudieron cargar los usuarios.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [user, navigate])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleEdit = (userId: string) => {
    const userToEdit = users.find(u => u._id === userId)
    if (userToEdit) {
      setSelectedUser(userToEdit)
      // Aquí podrías abrir un modal de edición o redirigir a una página de edición
    }
  }

  const handleDelete = async (userId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await userService.deleteUser(userId)
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId))
        setFilteredUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId))
        setSuccessMessage("Usuario eliminado correctamente")
        setTimeout(() => setSuccessMessage(null), 3000)
      } catch (error) {
        console.error("Error deleting user:", error)
        setError("Error al eliminar el usuario")
        setTimeout(() => setError(null), 3000)
      }
    }
  }

  const handleViewUser = (userId: string) => {
    const userToView = users.find(u => u._id === userId)
    if (userToView) {
      setSelectedUser(userToView)
      setIsDetailModalOpen(true)
    }
  }

  const handleSendWelcome = async (userId: string) => {
    try {
      await userService.sendWelcome(userId)
      setUsers((prevUsers) => prevUsers.map((user) => (user._id === userId ? { ...user, isWelcomed: true } : user)))
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? { ...user, isWelcomed: true } : user)),
      )
      setSuccessMessage("Mensaje de bienvenida enviado correctamente")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error("Error sending welcome:", error)
      setError("Error al enviar el mensaje de bienvenida")
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleExportUsers = () => {
    // Crear un CSV con los datos de usuarios
    const headers = ["Nombre", "Email", "Teléfono", "Fecha de registro", "Rol"]
    const csvData = filteredUsers.map((user) => {
      const date = new Date(user.registrationDate || user.createdAt || "").toLocaleDateString()
      return `"${user.name || ''}","${user.email || ''}","${user.phone || ''}","${date}","${user.role === 'admin' ? 'Administrador' : 'Cliente'}"`
    })

    const csv = [headers.join(","), ...csvData].join("\n")

    // Crear un blob y descargar
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `usuarios_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCreateUserSuccess = async () => {
    setSuccessMessage("Usuario creado correctamente")
    setTimeout(() => setSuccessMessage(null), 3000)
    
    // Recargar la lista de usuarios
    try {
      const data = await userService.getUsers()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      console.error("Error reloading users:", error)
    }
  }

  return (
    <AdminLayout>
      <div className={styles.adminUsersPage}>
        <div className="container">
          <div className={styles.pageHeader}>
            <div>
              <h1>Administración de Usuarios</h1>
              <p className={styles.adminBadge}>Modo Administrador</p>
            </div>
            <button className={styles.createUserButton} onClick={() => setIsCreateModalOpen(true)}>
              <FaUserPlus /> Crear Usuario
            </button>
          </div>

          <div className={styles.actionsBar}>
            <div className={styles.searchBar}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.exportButton} onClick={handleExportUsers}>
              <FaDownload /> Exportar Usuarios
            </button>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <FaExclamationTriangle />
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className={styles.successMessage}>
              <FaCheckCircle />
              <p>{successMessage}</p>
            </div>
          )}

          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando usuarios...</p>
            </div>
          ) : (
            <>
              <div className={styles.usersTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.headerCell}>Nombre</div>
                  <div className={styles.headerCell}>Email</div>
                  <div className={styles.headerCell}>Teléfono</div>
                  <div className={styles.headerCell}>Registro</div>
                  <div className={styles.headerCell}>Rol</div>
                  <div className={styles.headerCell}>Acciones</div>
                </div>

                {filteredUsers.length === 0 ? (
                  <div className={styles.noResults}>
                    <p>No se encontraron usuarios</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user._id} className={styles.tableRow}>
                      <div className={styles.cell}>{user.name}</div>
                      <div className={styles.cell}>{user.email}</div>
                      <div className={styles.cell}>{user.phone || "No especificado"}</div>
                      <div className={styles.cell}>
                        {new Date(user.registrationDate || user.createdAt || "").toLocaleDateString()}
                      </div>
                      <div className={styles.cell}>
                        <span
                          className={`${styles.roleBadge} ${user.role === "admin" ? styles.adminRole : styles.userRole}`}
                        >
                          {user.role === "admin" ? "Admin" : "Cliente"}
                        </span>
                      </div>
                      <div className={styles.cell}>
                        <div className={styles.actions}>
                          <button 
                            className={styles.actionButton} 
                            onClick={() => handleViewUser(user._id)} 
                            title="Ver detalles"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className={styles.actionButton} 
                            onClick={() => handleEdit(user._id)} 
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          {!user.isWelcomed && user.role !== "admin" && (
                            <button
                              className={`${styles.actionButton} ${styles.welcomeButton}`}
                              onClick={() => handleSendWelcome(user._id)}
                              title="Enviar bienvenida"
                            >
                              <FaEnvelope />
                            </button>
                          )}
                          {user.role !== "admin" && (
                            <button
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              onClick={() => handleDelete(user._id)}
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal para crear usuario */}
      <CreateUserModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={handleCreateUserSuccess}
      />

      {/* Modal para ver detalles del usuario */}
      <UserDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        user={selectedUser}
      />
    </AdminLayout>
  )
}

export default AdminUsers