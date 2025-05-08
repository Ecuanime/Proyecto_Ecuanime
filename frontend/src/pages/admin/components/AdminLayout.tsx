"use client"

import { type ReactNode, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaHome, FaUsers, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa"
import { useAuth } from "../../../context/AuthContext"
import styles from "./AdminLayout.module.css"

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/") // Redirige a la página principal
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    if (sidebarOpen) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className={styles.adminLayout}>
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <img src="https://i.postimg.cc/zXjLVJJz/LOGO-PARA-PAGINA-WEB-FONDO-NEGRO.png" alt="Logo" className={styles.logo} />
          <button className={styles.closeSidebar} onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>{user?.name.charAt(0)}</div>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userRole}>{user?.role === "admin" ? "Administrador" : "Usuario"}</div>
        </div>

        <nav className={styles.sidebarNav}>
          <Link
            to="/admin"
            className={`${styles.navItem} ${location.pathname === "/admin" ? styles.active : ""}`}
            onClick={closeSidebar}
          >
            <FaHome className={styles.navIcon} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/usuarios"
            className={`${styles.navItem} ${location.pathname === "/admin/usuarios" ? styles.active : ""}`}
            onClick={closeSidebar}
          >
            <FaUsers className={styles.navIcon} />
            <span>Usuarios</span>
          </Link>

          <Link
            to="/admin/configuracion"
            className={`${styles.navItem} ${location.pathname === "/admin/configuracion" ? styles.active : ""}`}
            onClick={closeSidebar}
          >
            <FaCog className={styles.navIcon} />
            <span>Configuración</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <FaSignOutAlt className={styles.navIcon} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <button className={styles.menuToggle} onClick={toggleSidebar}>
            <FaBars />
          </button>

          <div className={styles.headerRight}>
            {/* Se eliminó el componente de notificaciones */}
            <div className={styles.userDropdown}>
              <div className={styles.userAvatar}>{user?.name.charAt(0)}</div>
            </div>
          </div>
        </header>

        <main className={styles.content}>{children}</main>

        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
        </footer>
      </div>

      {sidebarOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </div>
  )
}

export default AdminLayout