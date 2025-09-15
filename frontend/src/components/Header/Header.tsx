// src/components/Header/Header.js
"use client"; // Mantén esto si estás en Next.js App Router

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaWhatsapp, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileLinkClick = (targetHref) => {
    if (mobileMenuOpen && window.innerWidth < 992) {
      setMobileMenuOpen(false);
    }
    if (targetHref.startsWith("/#") && location.pathname !== "/") {
      navigate(targetHref);
    } else if (targetHref.startsWith("#") && location.pathname !== "/") {
      navigate("/" + targetHref);
    }
  };

  // CAMBIO AQUÍ: Modificado para asegurar que el menú de perfil siempre muestre la información actualizada
  const toggleProfileMenu = () => {
    // Si estamos abriendo el menú, aseguramos que tenemos la información más reciente
    if (!profileMenuOpen && isAuthenticated) {
      // No es necesario hacer nada adicional aquí, ya que el perfil completo
      // se carga inmediatamente después del login en el AuthContext
    }
    setProfileMenuOpen(!profileMenuOpen);
  };


  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    if (mobileMenuOpen) setMobileMenuOpen(false);
    navigate("/");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/573142654760", "_blank");
    if (mobileMenuOpen && window.innerWidth < 992) {
      setMobileMenuOpen(false);
    }
  };

  const handleProfileNavigation = (path) => {
    navigate(path);
    setProfileMenuOpen(false);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const anchorPrefix = location.pathname === "/" ? "" : "/";

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.scrollingMessageContainer}>
        <div className={styles.scrollingText}>
          Expertos en Ventas Mayoristas - Envíos Nacionales e Internacionales 🌍 &nbsp;&nbsp;&nbsp;&nbsp;
          Expertos en Ventas Mayoristas - Envíos Nacionales e Internacionales 🌍 &nbsp;&nbsp;&nbsp;&nbsp;
          Expertos en Ventas Mayoristas - Envíos Nacionales e Internacionales 🌍 &nbsp;&nbsp;&nbsp;&nbsp;
          Expertos en Ventas Mayoristas - Envíos Nacionales e Internacionales 🌍
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" onClick={() => handleMobileLinkClick("/")}>
            <img
              src="https://i.postimg.cc/VLQ76j53/LOGO-PARA-PAGINA-WEB-BLANCO.png"
              alt="Logo de la empresa"
            />
          </Link>
        </div>

        <div className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.active : ""}`}>
          <ul>
            <li>
              <a
                href={`${anchorPrefix}#quienes-somos`}
                onClick={() => handleMobileLinkClick(`${anchorPrefix}#quienes-somos`)}
              >
                ¿Quiénes Somos?
              </a>
            </li>
            <li>
              <a
                href={`${anchorPrefix}#productos`}
                onClick={() => handleMobileLinkClick(`${anchorPrefix}#productos`)}
              >
                Productos
              </a>
            </li>
            <li>
              <a
                href={`${anchorPrefix}#testimonios`}
                onClick={() => handleMobileLinkClick(`${anchorPrefix}#testimonios`)}
              >
                Testimonios
              </a>
            </li>
            <li>
              <a
                href={`${anchorPrefix}#contacto`}
                onClick={() => handleMobileLinkClick(`${anchorPrefix}#contacto`)}
              >
                Contacto
              </a>
            </li>
            <li>
              <a
                href={`${anchorPrefix}#faq`}
                onClick={() => handleMobileLinkClick(`${anchorPrefix}#faq`)}
              >
                FAQ
              </a>
            </li>
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <button
            className={`${styles.whatsappButton} btn btn-whatsapp`}
            onClick={handleWhatsAppClick}
          >
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
                      <Link
                        to="/admin"
                        className={styles.profileMenuItem}
                        onClick={() => handleProfileNavigation("/admin")}
                      >
                        Panel de Administración
                      </Link>
                    )}
                    <Link
                      to="/mi-perfil"
                      className={styles.profileMenuItem}
                      onClick={() => handleProfileNavigation("/mi-perfil")}
                    >
                      Mi Perfil
                    </Link>
                    <button
                      className={styles.profileMenuItem}
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={styles.profileMenuItem}
                      onClick={() => handleProfileNavigation("/login")}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/registro"
                      className={styles.profileMenuItem}
                      onClick={() => handleProfileNavigation("/registro")}
                    >
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
  );
};

export default Header;
