"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaWhatsapp, FaBars, FaTimes, FaUser } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import styles from "./Header.module.css"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen)
  }

  const handleLogout = () => {
    logout()
    setProfileMenuOpen(false)
    navigate("/")
  }

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/573142654760", "_blank")
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      {/* Mensaje deslizante con animación CSS */}
      <div className={styles.scrollingMessageContainer}>
        <div className={styles.scrollingText}>
          {/* First copy of the text */}
          Expertos en Ventas Mayoristas - Envíos Nacionales e Internacionales 🌍 &nbsp;&nbsp;&nbsp;&nbsp; Expertos en
          Ventas Mayoristas - Envíos Nacionales e Internacionales 🌍 &nbsp;&nbsp;&nbsp;&nbsp; Expertos en Ventas
          Mayoristas - Envíos Nacionales e Internacionales 🌍 &nbsp;&nbsp;&nbsp;&nbsp;
          {/* Second copy to create the seamless loop */}
          Expertos en Ventas Mayoristas - Envíos Nacionales e Internacionales 🌍 &nbsp;&nbsp;&nbsp;&nbsp; Expertos en
          Ventas Mayoristas - Envíos Nacionales e Internacionales 🌍 &nbsp;&nbsp;&nbsp;&nbsp; Expertos en Ventas
          Mayoristas - Envíos Nacionales e Internacionales 🌍 &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="https://i.postimg.cc/VLQ76j53/LOGO-PARA-PAGINA-WEB-BLANCO.png" alt="Logo de la empresa" />
          </Link>
        </div>

        <div className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.active : ""}`}>
          <ul>
            <li>
              <a href="#quienes-somos">¿Quiénes Somos?</a>
            </li>
            <li>
              <a href="#productos">Productos</a>
            </li>
            <li>
              <a href="#testimonios">Testimonios</a>
            </li>
            <li>
              <a href="#contacto">Contacto</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <button className={`${styles.whatsappButton} btn btn-whatsapp`} onClick={handleWhatsAppClick}>
            <FaWhatsapp /> Contacta a un asesor
          </button>

          <div className={styles.profileContainer}>
            <button className={styles.profileButton} onClick={toggleProfileMenu}>
              <FaUser />
            </button>

            {profileMenuOpen && (
              <div className={styles.profileMenu}>
                {isAuthenticated ? (
                  <>
                    <div className={styles.profileInfo}>
                      <span>{user?.name}</span>
                      <small>{user?.email}</small>
                    </div>
                    <div className={styles.profileMenuDivider}></div>
                    {user?.role === "admin" && (
                      <Link to="/admin" className={styles.profileMenuItem} onClick={() => setProfileMenuOpen(false)}>
                        Panel de Administración
                      </Link>
                    )}
                    <Link to="/mi-perfil" className={styles.profileMenuItem} onClick={() => setProfileMenuOpen(false)}>
                      Mi Perfil
                    </Link>
                    <button className={styles.profileMenuItem} onClick={handleLogout}>
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={styles.profileMenuItem} onClick={() => setProfileMenuOpen(false)}>
                      Iniciar Sesión
                    </Link>
                    <Link to="/registro" className={styles.profileMenuItem} onClick={() => setProfileMenuOpen(false)}>
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
