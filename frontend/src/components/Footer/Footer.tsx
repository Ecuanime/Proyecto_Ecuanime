import { Link, useLocation, useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate también
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTiktok } from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation(); // Hook para obtener la ruta actual
  const navigate = useNavigate(); // Hook para navegar programáticamente si es necesario

  // Función para manejar el clic en enlaces legales y de ancla
  const handleLinkClick = (e, path) => {
    const isSamePage = location.pathname === path;
    const isAnchorLink = path.includes("#");
    const targetPathWithoutHash = path.split("#")[0]; // Obtiene la parte de la ruta antes del ancla

    if (isAnchorLink) {
      // Si es un enlace de ancla
      if (location.pathname === targetPathWithoutHash || (targetPathWithoutHash === "" && location.pathname === "/")) {
        // Si estamos en la misma página base del ancla (o en la home para anclas directas como "#quienes-somos")
        e.preventDefault();
        const hash = path.substring(path.indexOf("#") + 1);
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          // Si el elemento no se encuentra en la página actual pero la ruta base coincide,
          // podría ser un ancla para la parte superior de la página actual si el hash es solo "#" o similar
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        // Si estamos en una página diferente, navegamos a la ruta con el ancla
        // react-router-dom maneja el Link to={path}
        // No es necesario e.preventDefault() aquí, Link se encargará.
      }
    } else if (isSamePage) {
      // Si es un enlace a la misma página (sin ancla, ej. Términos y Condiciones estando en esa página)
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // Para otros casos (navegación a una página diferente), Link se encarga.
  };


  // Determina el prefijo para los enlaces de ancla de "Enlaces Rápidos"
  // Si estamos en la página de inicio, el ancla es directa (ej. #quienes-somos)
  // Si estamos en otra página, el ancla debe llevar a la página de inicio (ej. /#quienes-somos)
  const anchorPrefix = location.pathname === "/" ? "" : "/";

  return (
    <footer className={styles.footer}>
      <div className="container"> {/* Asumiendo que tienes una clase global .container o de Bootstrap */}
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <img src="https://i.postimg.cc/VLQ76j53/LOGO-PARA-PAGINA-WEB-BLANCO.png" alt="Logo de la empresa" />
            <p>
              Somos tu mejor opción para la venta mayorista de ropa. Calidad, variedad y los mejores precios del
              mercado.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://www.facebook.com/share/15hkDu53bM/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/ecuanimemoda?igsh=Y2d6NmdhdGFiaGd1" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.youtube.com/@EcuanimeModa" target="_blank" rel="noopener noreferrer" aria-label="Youtube"> {/* URL corregida/ejemplo */}
                <FaYoutube />
              </a>
              <a href="https://www.tiktok.com/@ecuanimemoda?_t=ZS-8w3QrmVQuS9&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FaTiktok />
              </a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li>
                <a href={`${anchorPrefix}#quienes-somos`} onClick={(e) => handleLinkClick(e, `${anchorPrefix}#quienes-somos`)}>¿Quiénes Somos?</a>
              </li>
              <li>
                <a href={`${anchorPrefix}#catalogos`} onClick={(e) => handleLinkClick(e, `${anchorPrefix}#catalogos`)}>Catálogos</a>
              </li>
              <li>
                <a href={`${anchorPrefix}#testimonios`} onClick={(e) => handleLinkClick(e, `${anchorPrefix}#testimonios`)}>Testimonios</a>
              </li>
              <li>
                <a href={`${anchorPrefix}#faq`} onClick={(e) => handleLinkClick(e, `${anchorPrefix}#faq`)}>Preguntas Frecuentes</a>
              </li>
              <li>
                <a href={`${anchorPrefix}#contacto`} onClick={(e) => handleLinkClick(e, `${anchorPrefix}#contacto`)}>Contacto</a>
              </li>
              <li>
                <Link to="/terminos-y-condiciones" onClick={(e) => handleLinkClick(e, "/terminos-y-condiciones")}>
                  Términos y Condiciones
                </Link>
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
                <span>ecuanimemoda@gmail.com</span>
              </li>
              <li>
                <FaMapMarkerAlt />
                <span>Calle 42 c # 90 a - 12 interior 204 La América, Medellín</span>
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
              <input type="email" placeholder="Tu correo electrónico" className="form-control" /> {/* Asume clase form-control global o de Bootstrap */}
              <button type="submit" className="btn btn-primary"> {/* Asume clase btn y btn-primary global o de Bootstrap */}
                Suscribirse
              </button>
            </form>
            <p className={styles.newsletterDisclaimer}>
              Al suscribirte, aceptas recibir nuestros correos y nuestra
              {/* Corregido: El enlace debe ir a una página de política de privacidad */}
              <Link to="/politica-de-privacidad" onClick={(e) => handleLinkClick(e, "/politica-de-privacidad")}> Política de Privacidad</Link>.
            </p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {currentYear} Ecuanime Moda. Todos los derechos reservados.</p> {/* Nombre de empresa actualizado */}
          <div className={styles.footerBottomLinks}>
            <Link to="/terminos-y-condiciones" onClick={(e) => handleLinkClick(e, "/terminos-y-condiciones")}>
              Términos y Condiciones
            </Link>
            {/* Corregido: El enlace debe ir a una página de política de privacidad */}
            <Link to="/politica-de-privacidad" onClick={(e) => handleLinkClick(e, "/politica-de-privacidad")}>
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;