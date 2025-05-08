"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"
import styles from "./ContactForm.module.css"

const contactSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(10, "El número debe tener al menos 10 dígitos"),
  region: z.string().min(2, "Por favor ingresa tu región"),
  storeName: z.string().optional(),
  address: z.string().min(5, "Por favor ingresa una dirección válida"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

type ContactFormData = z.infer<typeof contactSchema>

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const message = `Hola, mi nombre es ${data.name}.
Correo electrónico: ${data.email}
Teléfono: ${data.phone}
Región: ${data.region}
${data.storeName ? `Nombre de la tienda: ${data.storeName}\n` : ""}Dirección: ${data.address}
Mensaje: ${data.message}`

      const encodedMessage = encodeURIComponent(message)
      window.open(`https://wa.me/573142654760?text=${encodedMessage}`, "_blank")

      setIsSuccess(true)
      reset()
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      console.error("Error al enviar el mensaje por WhatsApp:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppClick = () => {
    const message = "Hola, estoy interesado en sus productos mayoristas."
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/573142654760?text=${encodedMessage}`, "_blank")
  }

  return (
    <section id="contacto" className={`section ${styles.contact}`}>
      <div className="container">
        <h2 className="section-title">Contáctanos</h2>
        <p className={styles.subtitle}>
          Estamos aquí para ayudarte. Completa el formulario y nos pondremos en contacto contigo lo antes posible.
        </p>

        <div className={styles.contactContainer}>
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><FaPhone /></div>
              <div className={styles.infoContent}>
                <h3>Teléfono</h3>
                <p>+57 314 265 4760</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><FaEnvelope /></div>
              <div className={styles.infoContent}>
                <h3>Correo Electrónico</h3>
                <p>ecuanimemoda@gmail.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><FaMapMarkerAlt /></div>
              <div className={styles.infoContent}>
                <h3>Dirección</h3>
                <p>Calle 42 c # 90 a - 12 interior 204 La América Medellín</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><FaWhatsapp /></div>
              <div className={styles.infoContent}>
                <h3>WhatsApp</h3>
                <p>+57 314 265 4760</p>
                <button className={`btn btn-whatsapp ${styles.whatsappButton}`} onClick={handleWhatsAppClick}>
                  Enviar mensaje
                </button>
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <form id="contactForm" onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nombre Completo *</label>
                <input id="name" type="text" className={`form-control ${errors.name ? styles.error : ""}`} {...register("name")} />
                {errors.name && <p className="error-message">{errors.name.message}</p>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Correo Electrónico *</label>
                  <input id="email" type="email" className={`form-control ${errors.email ? styles.error : ""}`} {...register("email")} />
                  {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Teléfono *</label>
                  <input id="phone" type="tel" className={`form-control ${errors.phone ? styles.error : ""}`} {...register("phone")} />
                  {errors.phone && <p className="error-message">{errors.phone.message}</p>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="region">Región/Municipio/País *</label>
                  <input id="region" type="text" className={`form-control ${errors.region ? styles.error : ""}`} {...register("region")} />
                  {errors.region && <p className="error-message">{errors.region.message}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="storeName">Nombre de la Tienda (Opcional)</label>
                  <input id="storeName" type="text" className="form-control" {...register("storeName")} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Dirección *</label>
                <input id="address" type="text" className={`form-control ${errors.address ? styles.error : ""}`} {...register("address")} />
                {errors.address && <p className="error-message">{errors.address.message}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Mensaje *</label>
                <textarea id="message" rows={5} className={`form-control ${errors.message ? styles.error : ""}`} {...register("message")} />
                {errors.message && <p className="error-message">{errors.message.message}</p>}
              </div>

              <div className={styles.formActions}>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </button>

                <button type="button" className={`btn btn-whatsapp ${styles.whatsappFormButton}`} onClick={handleWhatsAppClick}>
                  <FaWhatsapp /> Contactar por WhatsApp
                </button>
              </div>

              {isSuccess && (
                <div className={styles.successMessage}>
                  <p>¡Gracias por tu mensaje! Nos pondremos en contacto contigo lo antes posible.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
