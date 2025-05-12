"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, LogOut, Menu, X, Home, FileDown } from "lucide-react"
import { useAuth } from "../../../context/AuthContext" // Asegúrate que esta ruta sea la correcta
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
    // Alternativa usando navigate si la landing es parte de la app React:
    // navigate("/");
    if (menuOpen) {
      setMenuOpen(false)
    }
  }

  const goToHomePage = () => {
    navigate("/") // Asegúrate de que esta ruta sea la correcta para tu página principal en la app
    if (menuOpen) {
      setMenuOpen(false)
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  // Determina si estamos en una vista móvil para la lógica del sidebar/overlay
  // Esto es un ejemplo, podrías usar window.innerWidth o una librería si necesitas más precisión
  // o basarte puramente en CSS para mostrar/ocultar.
  // Por ahora, la lógica de 'menuOpen' controlará el sidebar y el overlay.

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar: se adapta para ser el menú en móvil */}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
          {/* Botón de cierre para el sidebar en vista móvil */}
          <button className={styles.closeSidebar} onClick={toggleMenu}>
            <X size={24} />
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          <Link to="/admin" className={styles.navItem} onClick={menuOpen ? toggleMenu : undefined}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/usuarios" className={styles.navItem} onClick={menuOpen ? toggleMenu : undefined}>
            <Users size={20} />
            <span>Usuarios</span>
          </Link>
          <Link to="/admin/descargas" className={styles.navItem} onClick={menuOpen ? toggleMenu : undefined}>
            <FileDown size={20} />
            <span>Descargas de Catálogo</span>
          </Link>
          {/* El botón de Página Principal se ha movido al sidebarFooter */}
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

      {/* Header principal (visible en desktop, y en móvil con el toggle) */}
      <div className={styles.header}>
        <button className={styles.menuToggle} onClick={toggleMenu}>
          <Menu size={24} />
        </button>
        <h2>Admin Panel</h2> {/* O el título que corresponda a la sección */}
        {/* Aquí podrían ir otros elementos del header como notificaciones, perfil de usuario, etc. */}
        {/* <div className={styles.headerRight}> ... </div> */}
      </div>

      {/* Contenido principal */}
      <main className={styles.mainContent}>{children}</main>

      {/* Overlay para cerrar el menú al hacer clic fuera en vista móvil */}
      {menuOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
    </div>
  )
}

export default AdminLayout
