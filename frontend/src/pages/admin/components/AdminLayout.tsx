"use client"

import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, LogOut, Menu, X, Home, FileDown } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import styles from "./AdminLayout.module.css"

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  // Prevenir scroll del body cuando el menú está abierto en móvil
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("sidebar-open")
    } else {
      document.body.classList.remove("sidebar-open")
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.classList.remove("sidebar-open")
    }
  }, [menuOpen])

  // Cerrar menú al cambiar el tamaño de ventana (si se pasa a desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [menuOpen])

  const handleLogout = () => {
    logout()
    window.location.href = "https://ecuanimemoda.com/"
    if (menuOpen) {
      setMenuOpen(false)
    }
  }

  const goToHomePage = () => {
    navigate("/")
    if (menuOpen) {
      setMenuOpen(false)
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
          <button className={styles.closeSidebar} onClick={toggleMenu} aria-label="Cerrar menú">
            <X size={24} />
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          <Link to="/admin" className={styles.navItem} onClick={closeMenu}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/usuarios" className={styles.navItem} onClick={closeMenu}>
            <Users size={20} />
            <span>Usuarios</span>
          </Link>
          <Link to="/admin/descargas" className={styles.navItem} onClick={closeMenu}>
            <FileDown size={20} />
            <span>Descargas de Catálogo</span>
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <button
            onClick={goToHomePage}
            className={`${styles.navItem} ${styles.footerButton} ${styles.homePageButtonFooter}`}
          >
            <Home size={20} />
            <span>Página Principal</span>
          </button>
          <button
            onClick={handleLogout}
            className={`${styles.navItem} ${styles.footerButton} ${styles.logoutButtonFooter}`}
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Abrir menú">
          <Menu size={24} />
        </button>
        <h2>Admin Panel</h2>
      </div>

      {/* Contenido principal */}
      <main className={styles.mainContent}>{children}</main>

      {/* Overlay */}
      {menuOpen && (
        <div className={`${styles.overlay} ${menuOpen ? styles.show : ""}`} onClick={closeMenu} aria-hidden="true" />
      )}
    </div>
  )
}

export default AdminLayout
