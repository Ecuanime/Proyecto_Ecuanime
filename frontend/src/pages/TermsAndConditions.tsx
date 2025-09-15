"use client"

// src/pages/TermsAndConditions/TermsAndConditions.js
import React from "react"
import Header from "../components/Header/Header" // Ajusta la ruta si es necesario
import Footer from "../components/Footer/Footer" // Ajusta la ruta si es necesario
import styles from "./TermsAndConditions.module.css"

const TermsAndConditions = () => {
  React.useEffect(() => {
    // Scroll al inicio de la página al montar el componente
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Header />
      <main className={styles.termsPage}>
        <div className="container">
          {" "}
          {/* Asumiendo que 'container' es una clase global o de Bootstrap */}
          <h1 className={styles.title}>Términos y Condiciones Generales</h1>
          <div className={styles.content}>
            {/* Sección Introductoria General */}
            <section id="introduccion-general" className={styles.section}>
              <h2>1. Introducción General y Presentación de ECUÁNIME Moda</h2>
              <p>
                Bienvenido a los Términos y Condiciones de <strong>ECUÁNIME Moda</strong>.
              </p>
              <p>
                <strong>ECUÁNIME Moda</strong> es el aliado ideal para emprendedores y tiendas de moda que buscan
                productos con estilo, calidad y precios justos. Con más de 10 años de experiencia en el mercado,
                ofrecemos un catálogo amplio y en constante renovación, siguiendo las últimas tendencias de la moda
                internacional. Nuestra sólida logística nos permite realizar entregas puntuales y seguras en toda
                Colombia, garantizando que tu negocio siempre cuente con las mejores colecciones. En ECUÁNIME Moda,
                trabajamos para potenciar tu éxito.
              </p>
              <p>
                Estos términos y condiciones rigen el uso de nuestro sitio web (www.tuurldelsitio.com) y los servicios y
                productos que ofrecemos. Al acceder y utilizar nuestros servicios, usted acepta estos términos y
                condiciones en su totalidad. Por favor, léalos detenidamente.
              </p>
            </section>

          

            {/* POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES */}
            <section id="politica-tratamiento-datos" className={styles.section}>
              <h2>Política de Tratamiento de Datos Personales (Colombia)</h2>
              <p>
                <strong>ECUÁNIME Moda</strong>, en cumplimiento de la Ley Estatutaria 1581 de 2012 de Protección de
                Datos Personales y sus decretos reglamentarios, informa que es responsable del tratamiento de los datos
                personales que usted suministre.
              </p>
              {/* ... (Resto del contenido de la política de datos que te proporcioné antes) ... */}
            </section>

            {/* TÉRMINOS Y CONDICIONES PARA VENTAS MAYORISTAS */}
            <section id="terminos-mayorista" className={styles.section}>
              <h2>Términos y Condiciones para Ventas Mayoristas (Colombia y Alrededores)</h2>
              <p>
                Los presentes términos y condiciones aplican específicamente para clientes que realicen compras al por
                mayor con <strong>ECUÁNIME Moda</strong>. Al realizar un pedido mayorista, usted acepta estos términos.
              </p>
              {/* ... (Resto del contenido de los términos mayoristas que te proporcioné antes) ... */}
            </section>

            {/* ... (Otras secciones que tenías como Pedidos y Pagos, Envíos, Devoluciones, etc. adaptadas si es necesario) ... */}

            <section className={styles.section}>
              <h2>Limitación de Responsabilidad</h2> {/* Ejemplo de una de tus secciones existentes */}
              <p>
                En la medida máxima permitida por la ley aplicable, ECUÁNIME Moda no será responsable por ningún daño
                directo, indirecto, incidental, especial, consecuente o punitivo...
                {/* ... (contenido de tu sección) ... */}
              </p>
            </section>

            <section className={styles.section}>
              <h2>Modificaciones a los Términos</h2>
              <p>
                ECUÁNIME Moda se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las
                modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web. Su uso
                continuado del sitio web después de cualquier modificación constituye su aceptación de los términos y
                condiciones modificados. Se recomienda revisar esta página periódicamente.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Ley Aplicable y Jurisdicción</h2>
              <p>
                Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de la República de
                Colombia. Cualquier disputa relacionada con estos términos y condiciones estará sujeta a la jurisdicción
                exclusiva de los tribunales de la ciudad de Medellín, Antioquia, Colombia.
              </p>
            </section>

            <section id="contacto-terminos" className={styles.section}>
              <h2>Contacto para Dudas sobre Términos</h2>
              <p>
                Si tiene alguna pregunta sobre estos términos y condiciones generales, la política de tratamiento de
                datos, o los términos mayoristas, por favor contáctenos a través de:
              </p>
              <p>
                Email: ecuanimemoda@gmail.com
                <br />
                Teléfono: +57 314 265 4760
                <br />
                Dirección: Calle 42 c # 90 a - 12 interior 204 La América, Medellín, Colombia
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
