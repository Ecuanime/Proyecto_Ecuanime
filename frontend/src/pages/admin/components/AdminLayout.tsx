"use client"

import { useState } from "react"

import type { ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import styles from "./AdminLayout.module.css"

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    // Redirigir al usuario a la página principal (landing page)
    window.location.href = "https://proyecto-ecuanime.onrender.com/"
    // Alternativa usando navigate:
    // navigate("/")
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar para pantallas medianas y grandes */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <Link to="/admin" className={styles.navItem}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/usuarios" className={styles.navItem}>
            <Users size={20} />
            <span>Usuarios</span>
          </Link>
          {/* Se eliminó la opción de Configuración */}
          <button onClick={handleLogout} className={`${styles.navItem} ${styles.logoutButton}`}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>

      {/* Header móvil */}
      <div className={styles.mobileHeader}>
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h2>Admin Panel</h2>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <nav>
            <Link to="/admin" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/usuarios" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>
              <Users size={20} />
              <span>Usuarios</span>
            </Link>
            {/* Se eliminó la opción de Configuración */}
            <button onClick={handleLogout} className={`${styles.mobileNavItem} ${styles.logoutButton}`}>
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </nav>
        </div>
      )}

      {/* Contenido principal */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  )
}

export default AdminLayout
