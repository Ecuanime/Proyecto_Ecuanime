"use client"

import { FaWhatsapp } from "react-icons/fa"
import styles from "./WhatsAppButton.module.css"

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    window.open(
      "https://wa.me/573142654760?text=Hola,%20estoy%20interesado%20en%20sus%20productos%20mayoristas.%20¿Podría%20darme%20más%20información?",
      "_blank",
    )
  }

  return (
    <button className={styles.whatsappButton} onClick={handleWhatsAppClick}>
      <FaWhatsapp className={styles.whatsappIcon} />
    </button>
  )
}

export default WhatsAppButton
