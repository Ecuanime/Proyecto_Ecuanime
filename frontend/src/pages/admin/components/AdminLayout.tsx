"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X, Home, Users, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from "../../context/AuthContext"
import styles from "./AdminLayout.module.css"

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = async () => {
    try {
      logout() // Usando tu función de logout que ya maneja la limpieza del token
      // Redirigir a la página principal después de cerrar sesión
      navigate("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
          <button className={styles.closeSidebar} onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            <li>
              <a href="/admin" className={window.location.pathname === "/admin" ? styles.active : ""}>
                <Home size={20} />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/usuarios"
                className={window.location.pathname.includes("/admin/usuarios") ? styles.active : ""}
              >
                <Users size={20} />
                <span>Usuarios</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/configuracion"
                className={window.location.pathname.includes("/admin/configuracion") ? styles.active : ""}
              >
                <Settings size={20} />
                <span>Configuración</span>
              </a>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <LogOut size={20} />
                <span>Cerrar sesión</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className={styles.mainContent}>
        {/* Top navbar */}
        <header className={styles.topNav}>
          <button className={styles.menuButton} onClick={toggleSidebar}>
            <Menu size={24} />
          </button>

          <div className={styles.userMenu}>
            <div className={styles.userInfo}>
              <span>{user?.name || "Admin"}</span>
              <ChevronDown size={16} />
            </div>
            <div className={styles.userDropdown}>
              <a href="/admin/perfil">Mi Perfil</a>
              <a href="/admin/configuracion">Configuración</a>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className={styles.pageContent}>{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout