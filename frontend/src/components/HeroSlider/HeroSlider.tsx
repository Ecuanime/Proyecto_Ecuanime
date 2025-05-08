"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import styles from "./HeroSlider.module.css"

const slides = [
  {
    id: 1,
    image: "https://i.postimg.cc/fLqmBYYK/imagen-polos-web-definitiva.jpg",
  },
  {
    id: 2,
    image: "https://i.postimg.cc/tJ0PKpmZ/IMAGEN-WANNER-BOXER-TERMINADO.jpg",
  },
  {
    id: 3,
    image: "https://i.postimg.cc/WzQ9YB0X/WANNER-DE-CAMISETAS-DAMA-PAGINA-WEB.jpg",
  },
  {
    id: 4,
    image: "https://i.postimg.cc/L8kyv053/WANNER-CAMISETAS-DE-HOMBRE-PAGINA-WEB.jpg",
  },
  {
    id: 5,
    image: "https://i.postimg.cc/tTcD7Kvp/WANNER-BUZOS-PAGINA-WEB.jpg",
  },
]

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const slideRef = useRef<HTMLDivElement>(null)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize() // Inicializar
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Función para cambiar de slide
  const goToSlide = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 300) // Duración de la animación
  }

  // Función para ir al slide anterior
  const prevSlide = () => {
    const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1
    goToSlide(newIndex)
  }

  // Función para ir al slide siguiente
  const nextSlide = () => {
    const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1
    goToSlide(newIndex)
  }

  // Autoplay
  useEffect(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    autoPlayRef.current = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [currentSlide])

  // Manejo de eventos táctiles para dispositivos móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX)
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

  return (
    <div
      className={styles.heroSlider}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.slidesContainer} ref={slideRef}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ""}`}
            style={{
              backgroundImage: `url(${slide.image})`,
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 1 : 0,
            }}
          >
          </div>
        ))}
      </div>

      {!isMobile && (
        <>
          <button className={`${styles.navButton} ${styles.prevButton}`} onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className={`${styles.navButton} ${styles.nextButton}`} onClick={nextSlide}>
            <FaChevronRight />
          </button>
        </>
      )}

      <div className={styles.indicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
