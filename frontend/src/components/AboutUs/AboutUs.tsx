"use client"

import { useRef, useEffect, useState } from "react"
import styles from "./AboutUs.module.css"

const AboutUs = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(0) // 0, 1, 2 para los tres videos de YouTube

  useEffect(() => {
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

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
    if (iframeRef.current && iframeRef.current.contentWindow && currentVideo === 0) {
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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        if (data.event === "onStateChange") {
          setIsPlaying(data.info === 1)
        }
      } catch (e) {}
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % 3)
    setIsPlaying(false)
  }

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + 3) % 3)
    setIsPlaying(false)
  }

  return (
    <section id="quienes-somos" className={`section ${styles.aboutUs}`}>
      <div className="container">
        <h2 className="section-title">¿Quiénes Somos?</h2>

        <div className={styles.content}>
          <div className={`${styles.text} ${styles.fadeIn}`}>
            <div className={styles.companyInfo}>
              <h3>ECUÁNIME Moda - Tu Aliado en el Mundo de la Moda</h3>
              <p>
                ECUÁNIME Moda es el aliado ideal para emprendedores y tiendas de moda que buscan productos con estilo,
                calidad y precios justos. Con más de 10 años de experiencia en el mercado, ofrecemos un catálogo amplio
                y en constante renovación, siguiendo las últimas tendencias de la moda internacional.
              </p>

              <div className={styles.highlights}>
                <div className={styles.highlight}>
                  <h4>🎯 Nuestra Misión</h4>
                  <p>
                    Potenciar el éxito de tu negocio con las mejores colecciones de moda, garantizando calidad, estilo y
                    precios competitivos.
                  </p>
                </div>

                <div className={styles.highlight}>
                  <h4>📦 Logística Confiable</h4>
                  <p>
                    Nuestra sólida logística nos permite realizar entregas puntuales y seguras en toda Colombia,
                    garantizando que tu negocio siempre cuente con las mejores colecciones.
                  </p>
                </div>

                <div className={styles.highlight}>
                  <h4>🌟 Experiencia Comprobada</h4>
                  <p>
                    Más de 10 años en el mercado nos respaldan, ofreciendo un catálogo en constante renovación siguiendo
                    las últimas tendencias internacionales.
                  </p>
                </div>
              </div>

              <div className={styles.contactInfo}>
                <h4>📍 Información de Contacto</h4>
                <div className={styles.contactDetails}>
                  <p>
                    <strong>Ubicación:</strong> Calle 42 c # 90 a - 12 interior 204 La América, Medellín, Colombia
                  </p>
                  <p>
                    <strong>Email:</strong> ecuanimemoda@gmail.com
                  </p>
                  <p>
                    <strong>Teléfono:</strong> +57 314 265 4760
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.videoContainer} ${styles.fadeIn}`}>
            <div className={styles.videoCarousel}>
              <div className={`${styles.video} ${currentVideo === 0 ? styles.active : styles.hidden}`}>
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

              <div className={`${styles.video} ${currentVideo === 1 ? styles.active : styles.hidden}`}>
                <div className={styles.videoWrapper}>
                  <iframe
                    width="560"
                    height="600"
                    src="https://www.youtube.com/embed/yj_FvuAPLp8?enablejsapi=1&controls=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3"
                    title="Tendencias de Moda"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              <div className={`${styles.video} ${currentVideo === 2 ? styles.active : styles.hidden}`}>
                <div className={styles.videoWrapper}>
                  <iframe
                    width="560"
                    height="600"
                    src="https://www.youtube.com/embed/IVRVS_f9zZ8?enablejsapi=1&controls=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3"
                    title="Catálogo de Productos"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            <div className={styles.videoControls}>
              <button className={styles.navButton} onClick={prevVideo} aria-label="Video anterior">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>

              <div className={styles.videoIndicators}>
                <span
                  className={`${styles.indicator} ${currentVideo === 0 ? styles.active : ""}`}
                  onClick={() => setCurrentVideo(0)}
                ></span>
                <span
                  className={`${styles.indicator} ${currentVideo === 1 ? styles.active : ""}`}
                  onClick={() => setCurrentVideo(1)}
                ></span>
                <span
                  className={`${styles.indicator} ${currentVideo === 2 ? styles.active : ""}`}
                  onClick={() => setCurrentVideo(2)}
                ></span>
              </div>

              <button className={styles.navButton} onClick={nextVideo} aria-label="Siguiente video">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </div>

            <div className={styles.videoTitle}>
              {currentVideo === 0
                ? "Presentación de nuestra empresa"
                : currentVideo === 1
                  ? "Tendencias de Moda"
                  : "Catálogo de Productos"}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
  }
}

export default AboutUs
