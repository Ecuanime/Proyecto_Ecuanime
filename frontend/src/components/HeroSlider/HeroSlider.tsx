"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import styles from "./HeroSlider.module.css"
import "bootstrap/dist/css/bootstrap.min.css"

// Slides para PC
const desktopSlides = [
  {
    id: 1,
    image: "https://i.postimg.cc/13VxngwS/archivos-pagina-web.jpg", //Tipo polo
  },
  {
    id: 2,
    image: "https://i.postimg.cc/kgsj5qhC/boxers-waner.jpg", //Boxer
  },
  {
    id: 3,
    image: "https://i.postimg.cc/wTCzkc6M/WANNER-DE-CAMISETAS-DAMA-PAGINA-WEB.jpg", //Camisetas Dama
  },
  {
    id: 4,
    image: "https://i.postimg.cc/hv8YbxMz/WANNER-CAMISETAS-DE-HOMBRE-PAGINA-WEB.jpg", //Camisetas hombre
  },
  {
    id: 5,
    image: "https://i.postimg.cc/Gp0krNbR/WANNER-BUZOS-PAGINA-WEB.jpg", //Buzos
  },
]

// Slides para móvil - Puedes reemplazar estas URLs con tus imágenes para móvil
const mobileSlides = [
  {
    id: 1,
    image: "https://i.postimg.cc/PfLM9FKJ/imagen-editada-para-la-pagina.jpg", // Reemplaza con tu imagen para móvil
  },
  {
    id: 2,
    image: "https://i.postimg.cc/FHGwfjn7/imagen-wanner-celular-boxers.jpg", // Reemplaza con tu imagen para móvil
  },
  {
    id: 3,
    image: "https://i.postimg.cc/vHYz4pRt/wanner-celular-camisetas-dama.jpg", // Reemplaza con tu imagen para móvil
  },
  {
    id: 4,
    image: "https://i.postimg.cc/PqPVP0wR/imagen-wanner-celular-camisetas-hombre.jpg", // Reemplaza con tu imagen para móvil
  },
  {
    id: 5,
    image: "https://i.postimg.cc/BQbSQnv5/imagen-celular-buzos-wanner.jpg", // Reemplaza con tu imagen para móvil
  },
]

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [useJsAnimation, setUseJsAnimation] = useState(false)
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

  // Seleccionar el conjunto de slides según el dispositivo
  const slides = isMobile ? mobileSlides : desktopSlides

  // Función para cambiar de slide
  const goToSlide = (index: number) => {
    if (isAnimating || !useJsAnimation) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 300) // Duración de la animación
  }

  // Función para ir al slide anterior
  const prevSlide = () => {
    if (!useJsAnimation) return
    const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1
    goToSlide(newIndex)
  }

  // Función para ir al slide siguiente
  const nextSlide = () => {
    if (!useJsAnimation) return
    const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1
    goToSlide(newIndex)
  }

  // Autoplay con JavaScript (solo si useJsAnimation es true)
  useEffect(() => {
    if (!useJsAnimation) return

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
  }, [currentSlide, useJsAnimation])

  // Manejo de eventos táctiles para dispositivos móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!useJsAnimation) return
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!useJsAnimation) return
    setTouchEnd(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!useJsAnimation) return
    if (touchStart - touchEnd > 50) {
      // Deslizar a la izquierda
      nextSlide()
    }

    if (touchStart - touchEnd < -50) {
      // Deslizar a la derecha
      prevSlide()
    }
  }

  // Cambiar entre animación CSS y JS
  const toggleAnimation = () => {
    setUseJsAnimation(!useJsAnimation)
  }

  return (
    <div className={`${isMobile ? "" : "container-fluid p-0"} ${styles.heroSliderContainer}`}>
      <div
        className={`${styles.heroSlider}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`${styles.slidesContainer} ${!useJsAnimation ? styles.autoplay : ""} ${isMobile ? "" : "row g-0"}`}
          ref={slideRef}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.slide} ${useJsAnimation && index === currentSlide ? styles.active : ""} ${isMobile ? "" : "col-12"}`}
              style={{
                backgroundImage: `url(${slide.image})`,
                opacity: useJsAnimation ? (index === currentSlide ? 1 : 0) : undefined,
                zIndex: useJsAnimation ? (index === currentSlide ? 1 : 0) : undefined,
              }}
            ></div>
          ))}
        </div>

        {!isMobile && useJsAnimation && (
          <>
            <button className={`${styles.navButton} ${styles.prevButton} d-none d-lg-flex`} onClick={prevSlide}>
              <FaChevronLeft />
            </button>
            <button className={`${styles.navButton} ${styles.nextButton} d-none d-lg-flex`} onClick={nextSlide}>
              <FaChevronRight />
            </button>
          </>
        )}

        <div className={`${styles.indicators} ${isMobile ? "" : "d-flex justify-content-center"}`}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${useJsAnimation && index === currentSlide ? styles.active : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        
        {/* Botón oculto para cambiar entre animación CSS y JS (solo para pruebas) */}
        <button
          onClick={toggleAnimation}
          style={{
            position: "absolute",
            bottom: "5px",
            right: "5px",
            zIndex: 100,
            background: "transparent",
            border: "none",
            color: "transparent",
            width: "10px",
            height: "10px",
          }}
        >
          Toggle
        </button>
      </div>
    </div>
  )
}

export default HeroSlider