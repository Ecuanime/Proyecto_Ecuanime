"use client"

import { useState } from "react"
import { FaPlus, FaMinus } from "react-icons/fa"
import styles from "./FAQ.module.css"

const faqs = [
  {
    id: 1,
    question: "¿Cuál es el pedido mínimo?",
    answer:
      "Nuestro pedido mínimo es accesible, ideal para emprendedores y tiendas que están comenzando. Solo necesitas adquirir 6 unidades por referencia para realizar tu compra mayorista.",
  },
  {
    id: 2,
    question: "¿Cuánto tiempo tarda en llegar mi pedido?",
    answer:
      "Realizamos envíos a todo Colombia en un tiempo estimado de 2 a 5 días hábiles, dependiendo de tu ciudad o municipio. Además, trabajamos con transportadoras confiables para garantizar la puntualidad en las entregas.",
  },
  {
    id: 4,
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos múltiples métodos de pago: transferencias bancarias, consignaciones, pagos vía PSE, y pagos contra entrega en ciudades seleccionadas. Nos adaptamos a lo que te sea más conveniente.",
  },
  {
    id: 5,
    question: "¿Tienen política de devoluciones?",
    answer:
      "Sí, contamos con una política clara de cambios y devoluciones en caso de productos defectuosos o errores en el pedido. Tu satisfacción es nuestra prioridad.",
  },
  {
    id: 6,
    question: "¿Ofrecen descuentos por volumen?",
    answer:
      "Por supuesto. Entre mayor sea tu compra, mejores precios podrás obtener. Contamos con tarifas especiales y descuentos exclusivos para compras por volumen.",
  },
]

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section id="faq" className={`section ${styles.faq}`}>
      <div className="container">
        <h2 className="section-title">Preguntas Frecuentes</h2>
        <p className={styles.subtitle}>
        En ECUÁNIME Moda, estamos comprometidos en brindarte la mejor experiencia de compra mayorista. Aquí respondemos tus preguntas para que realices tus pedidos con total tranquilidad.
        </p>

        <div className={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <div key={faq.id} className={`${styles.faqItem} ${activeIndex === index ? styles.active : ""}`}>
              <div className={styles.faqQuestion} onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                <span className={styles.faqIcon}>{activeIndex === index ? <FaMinus /> : <FaPlus />}</span>
              </div>
              <div className={styles.faqAnswer}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.moreQuestions}>
          <p>¿Tienes más preguntas? No dudes en contactarnos</p>
          <a href="#contacto" className="btn btn-primary">
            Contactar
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQ
