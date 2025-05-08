import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import styles from "./TermsAndConditions.module.css"

const TermsAndConditions = () => {
  return (
    <>
      <Header />
      <main className={styles.termsPage}>
        <div className="container">
          <h1 className={styles.title}>Términos y Condiciones</h1>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2>1. Introducción</h2>
              <p>
                Bienvenido a los Términos y Condiciones de Tu Empresa. Estos términos y condiciones rigen el uso de
                nuestro sitio web y los servicios que ofrecemos. Al acceder a nuestro sitio web y utilizar nuestros
                servicios, usted acepta estos términos y condiciones en su totalidad.
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Definiciones</h2>
              <p>
                "Nosotros", "nuestro" y "nos" se refiere a Tu Empresa. "Usted" y "su" se refiere al usuario o visitante
                de nuestro sitio web. "Sitio web" se refiere a tuempresa.com. "Servicios" se refiere a los productos y
                servicios que ofrecemos a través de nuestro sitio web.
              </p>
            </section>

            <section className={styles.section}>
              <h2>3. Uso del Sitio Web</h2>
              <p>
                Usted acepta utilizar nuestro sitio web solo para fines legales y de una manera que no infrinja los
                derechos de, restrinja o inhiba el uso y disfrute del sitio web por parte de cualquier tercero.
              </p>
              <p>
                Está prohibido el uso del sitio web de cualquier manera que cause, o pueda causar, daño al sitio web o
                deterioro de la disponibilidad o accesibilidad del sitio web; o de cualquier manera que sea ilegal,
                fraudulenta o dañina.
              </p>
            </section>

            <section className={styles.section}>
              <h2>4. Propiedad Intelectual</h2>
              <p>
                Todo el contenido incluido en o disponible a través de nuestro sitio web, incluyendo pero no limitado a
                texto, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales, compilaciones de
                datos y software, es propiedad de Tu Empresa o de sus proveedores de contenido y está protegido por las
                leyes de propiedad intelectual aplicables.
              </p>
            </section>

            <section className={styles.section}>
              <h2>5. Pedidos y Pagos</h2>
              <p>
                Al realizar un pedido a través de nuestro sitio web, usted garantiza que está legalmente capacitado para
                celebrar contratos vinculantes.
              </p>
              <p>
                Los precios de los productos están sujetos a cambios sin previo aviso. Nos reservamos el derecho de
                rechazar o cancelar cualquier pedido por cualquier motivo en cualquier momento.
              </p>
              <p>
                El pago debe realizarse en su totalidad antes del envío de los productos, a menos que se acuerde lo
                contrario por escrito.
              </p>
            </section>

            <section className={styles.section}>
              <h2>6. Envíos y Entregas</h2>
              <p>
                Los tiempos de entrega son estimados y no garantizados. No somos responsables de los retrasos causados
                por eventos fuera de nuestro control razonable.
              </p>
              <p>El riesgo de pérdida y daño de los productos pasa a usted en el momento de la entrega.</p>
            </section>

            <section className={styles.section}>
              <h2>7. Devoluciones y Reembolsos</h2>
              <p>
                Aceptamos devoluciones de productos defectuosos dentro de los 7 días posteriores a la recepción. Los
                productos deben estar en su estado original, sin usar y con todas las etiquetas y embalajes originales.
              </p>
              <p>
                No aceptamos devoluciones de productos que hayan sido usados, dañados o alterados después de la entrega.
              </p>
            </section>

            <section className={styles.section}>
              <h2>8. Limitación de Responsabilidad</h2>
              <p>
                En la medida máxima permitida por la ley aplicable, Tu Empresa no será responsable por ningún daño
                directo, indirecto, incidental, especial, consecuente o punitivo, o cualquier pérdida de beneficios o
                ingresos, ya sea incurrida directa o indirectamente, o cualquier pérdida de datos, uso, buena voluntad,
                u otras pérdidas intangibles, resultantes de:
              </p>
              <ul>
                <li>Su uso o incapacidad para usar nuestro sitio web o servicios;</li>
                <li>
                  Cualquier acceso no autorizado a o uso de nuestros servidores seguros y/o cualquier información
                  personal almacenada en ellos;
                </li>
                <li>Cualquier interrupción o cese de la transmisión a o desde nuestro sitio web;</li>
                <li>
                  Cualquier error, virus, troyano o similar que pueda ser transmitido a o a través de nuestro sitio web
                  por cualquier tercero.
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>9. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las
                modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web. Su uso
                continuado del sitio web después de cualquier modificación constituye su aceptación de los términos y
                condiciones modificados.
              </p>
            </section>

            <section className={styles.section}>
              <h2>10. Ley Aplicable</h2>
              <p>
                Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de Colombia, y cualquier
                disputa relacionada con estos términos y condiciones estará sujeta a la jurisdicción exclusiva de los
                tribunales de Colombia.
              </p>
            </section>

            <section className={styles.section}>
              <h2>11. Contacto</h2>
              <p>Si tiene alguna pregunta sobre estos términos y condiciones, por favor contáctenos a través de:</p>
              <p>
                Email: info@tuempresa.com
                <br />
                Teléfono: +57 314 265 4760
                <br />
                Dirección: Calle Principal #123, Bogotá, Colombia
              </p>
            </section>
          </div>

          <div className={styles.backToHome}>
            <a href="/" className="btn btn-primary">
              Volver al Inicio
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default TermsAndConditions
