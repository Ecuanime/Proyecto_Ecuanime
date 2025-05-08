import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt,FaTiktok } from "react-icons/fa"
import styles from "./Footer.module.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <img src="https://i.postimg.cc/VLQ76j53/LOGO-PARA-PAGINA-WEB-BLANCO.png" alt="Logo de la empresa" />
            <p>
              Somos tu mejor opción para la venta mayorista de ropa. Calidad, variedad y los mejores precios del
              mercado.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://www.facebook.com/share/15hkDu53bM/" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/ecuanimemoda?igsh=Y2d6NmdhdGFiaGd1" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://youtube.com/@ecuanimemoda?si=FOHumMXFPUr8rsH8" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
              <a href="https://www.tiktok.com/@ecuanimemoda?_t=ZS-8w3QrmVQuS9&_r=1" target="_blank" rel="noopener noreferrer">
                <FaTiktok />
              </a>

            </div>
          </div>

          <div className={styles.footerLinks}>
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li>
                <a href="#quienes-somos">¿Quiénes Somos?</a>
              </li>
              <li>
                <a href="#catalogos">Catálogos</a>
              </li>
              <li>
                <a href="#testimonios">Testimonios</a>
              </li>
              <li>
                <a href="#faq">Preguntas Frecuentes</a>
              </li>
              <li>
                <a href="#contacto">Contacto</a>
              </li>
              <li>
                <Link to="/terminos-y-condiciones">Términos y Condiciones</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerContact}>
            <h3>Contáctanos</h3>
            <ul>
              <li>
                <FaPhone />
                <span>+57 314 265 4760</span>
              </li>
              <li>
                <FaEnvelope />
                <span>ecuanimemoda@gmail.com
                </span>
              </li>
              <li>
                <FaMapMarkerAlt />
                <span>Calle 42 c # 90 a - 12 interior 204 La América Medellín</span>
              </li>
              <li>
                <FaWhatsapp />
                <a href="https://wa.me/573142654760" target="_blank" rel="noopener noreferrer">
                  Chatea con nosotros
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.footerNewsletter}>
            <h3>Suscríbete</h3>
            <p>Recibe nuestras novedades y ofertas especiales</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Tu correo electrónico" className="form-control" />
              <button type="submit" className="btn btn-primary">
                Suscribirse
              </button>
            </form>
            <p className={styles.newsletterDisclaimer}>
              Al suscribirte, aceptas recibir nuestros correos electrónicos y nuestra
              <Link to="/terminos-y-condiciones"> Política de Privacidad</Link>.
            </p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} Tu Empresa. Todos los derechos reservados.</p>
          <div className={styles.footerBottomLinks}>
            <Link to="/terminos-y-condiciones">Términos y Condiciones</Link>
            <Link to="/terminos-y-condiciones">Política de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
