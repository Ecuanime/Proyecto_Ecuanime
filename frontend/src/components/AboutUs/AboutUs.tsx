"use client"

import { useRef, useEffect, useState } from "react"
import styles from "./AboutUs.module.css"

const AboutUs = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)

  // Configurar la API de YouTube
  useEffect(() => {
    // Cargar la API de YouTube
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Función que será llamada cuando la API esté lista
    window.onYouTubeIframeAPIReady = () => {
      setPlayerReady(true)
    }

    return () => {
      window.onYouTubeIframeAPIReady = () => {}
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible)
          }
        })
      },
      { threshold: 0.3 },
    )

    const elements = document.querySelectorAll(`.${styles.fadeIn}`)
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const handleVideoClick = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Reproducir el video
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "playVideo",
          args: [],
        }),
        "*",
      )
      setIsPlaying(true)
    }
  }

  // Escuchar mensajes del iframe para detectar cuando el video se reproduce o pausa
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        // Eventos de la API de YouTube
        if (data.event === "onStateChange") {
          // 1 = reproduciendo, 2 = pausado
          setIsPlaying(data.info === 1)
        }
      } catch (e) {
        // No es un mensaje JSON válido, ignorar
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <section id="quienes-somos" className={`section ${styles.aboutUs}`}>
      <div className="container">
        <h2 className="section-title">¿Quiénes Somos?</h2>

        <div className={styles.content}>
          <div className={`${styles.text} ${styles.fadeIn}`}>
            <p>
              ECUÁNIME Moda es el aliado ideal para emprendedores y tiendas de moda que buscan productos con estilo,
              calidad y precios justos. Con más de 10 años de experiencia en el mercado, ofrecemos un catálogo amplio y
              en constante renovación, siguiendo las últimas tendencias de la moda internacional. Nuestra sólida
              logística nos permite realizar entregas puntuales y seguras en toda Colombia, garantizando que tu negocio
              siempre cuente con las mejores colecciones. En ECUÁNIME Moda, trabajamos para potenciar tu éxito.
            </p>
          </div>

          <div className={`${styles.video} ${styles.fadeIn}`}>
            <div className={styles.videoWrapper}>
              <iframe
                ref={iframeRef}
                width="560"
                height="600"
                src="https://www.youtube.com/embed/MSHeFvX-j8I?enablejsapi=1&controls=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3"
                title="Presentación de nuestra empresa"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
              <div className={`${styles.playOverlay} ${isPlaying ? styles.hidden : ""}`} onClick={handleVideoClick}>
                <div className={styles.playButton}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="48"
                    height="48"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Añadir la definición de tipos para la API de YouTube
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
  }
}

export default AboutUs
