"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import styles from "./Testimonials.module.css"

// Modificar el array de testimonios para incluir imágenes de avatares
const testimonials = [
  {
    id: 1,
    name: "María Rodríguez",
    business: "Boutique Eleganza",
    location: "Bogotá",
    rating: 5,
    text: "Excelente servicio y productos de alta calidad. Mis clientes están encantados con las prendas y siempre vuelven por más. El proceso de pedido es muy sencillo y los envíos llegan en tiempo récord.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    business: "Tienda Fashion",
    location: "Medellín",
    rating: 5,
    text: "Llevo más de 3 años trabajando con ellos y nunca me han fallado. La calidad de las prendas es excepcional y los precios son muy competitivos. Recomiendo 100% sus servicios.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Laura Gómez",
    business: "Estilo Único",
    location: "Cali",
    rating: 4,
    text: "Muy satisfecha con la variedad de productos y la atención personalizada. Siempre están pendientes de mis necesidades y me ayudan a seleccionar las mejores piezas para mi tienda.",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    name: "Javier Pérez",
    business: "Moda Express",
    location: "Barranquilla",
    rating: 5,
    text: "La mejor opción para surtir mi tienda. Productos de calidad, precios justos y un servicio al cliente excepcional. Definitivamente seguiré comprando con ellos.",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
]

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(3)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Determinar cuántos testimonios mostrar según el ancho de la pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setSlidesToShow(1)
      } else if (window.innerWidth < 992) {
        setSlidesToShow(2)
      } else {
        setSlidesToShow(3)
      }
    }

    handleResize() // Inicializar
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Autoplay
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [currentIndex, slidesToShow])

  // Función para ir al slide anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - slidesToShow : prevIndex - 1))
  }

  // Función para ir al slide siguiente
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= testimonials.length - slidesToShow ? 0 : prevIndex + 1))
  }

  // Manejo de eventos táctiles para dispositivos móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Deslizar a la izquierda
      nextSlide()
    }

    if (touchStart - touchEnd < -50) {
      // Deslizar a la derecha
      prevSlide()
    }
  }

  // Calcular qué testimonios mostrar
  const visibleTestimonials = []
  for (let i = 0; i < slidesToShow; i++) {
    const index = (currentIndex + i) % testimonials.length
    visibleTestimonials.push(testimonials[index])
  }

  return (
    <section id="testimonios" className={`section ${styles.testimonials}`}>
      <div className="container">
        <h2 className="section-title">Lo que dicen nuestros clientes</h2>

        <div className={styles.testimonialsContainer}>
          <button className={`${styles.navButton} ${styles.prevButton}`} onClick={prevSlide}>
            <FaChevronLeft />
          </button>

          <div
            className={styles.testimonialsSlider}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={styles.testimonialsTrack}
              style={{
                display: "flex",
                gap: "30px",
              }}
            >
              {visibleTestimonials.map((testimonial) => (
                <div key={testimonial.id} className={styles.testimonialCard}>
                  <div className={styles.quoteIcon}>
                    <FaQuoteLeft />
                  </div>
                  <div className={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < testimonial.rating ? styles.starFilled : styles.starEmpty} />
                    ))}
                  </div>
                  <p className={styles.testimonialText}>{testimonial.text}</p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.authorAvatar}>
                      <img src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    </div>
                    <div className={styles.authorInfo}>
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.business}</p>
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className={`${styles.navButton} ${styles.nextButton}`} onClick={nextSlide}>
            <FaChevronRight />
          </button>
        </div>

        <div className={styles.indicators}>
          {Array.from({ length: testimonials.length - slidesToShow + 1 }).map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.active : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
