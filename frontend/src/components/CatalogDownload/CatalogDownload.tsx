"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaDownload, FaCheck, FaSpinner } from "react-icons/fa"
import styles from "./CatalogDownload.module.css"
import { catalogService } from "../../services/api" // Importa el servicio que creamos

// Esquema de validación
const catalogSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(10, "El número debe tener al menos 10 dígitos"),
  region: z.string().min(2, "Por favor ingresa tu región"),
  storeName: z.string().optional(),
})

type FormData = z.infer<typeof catalogSchema>

const CatalogDownload = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(catalogSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Usar el servicio de catálogo para descargar
      const blob = await catalogService.downloadCatalog({
        name: data.name,
        email: data.email,
        phone: data.phone,
        region: data.region,
        storeName: data.storeName || "",
      })

      // Crear un objeto URL para el blob recibido
      const url = window.URL.createObjectURL(new Blob([blob]))

      // Crear un elemento <a> para descargar el archivo
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "Catalogos.zip")
      document.body.appendChild(link)
      link.click()

      // Limpiar
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)

      setIsSuccess(true)
      reset()
    } catch (err) {
      console.error("Error en el proceso:", err)
      setError("Error al procesar la solicitud. Por favor, intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="catalogos" className={`section ${styles.catalogDownload}`}>
      <div className="container">
        <h2 className="section-title">Descarga Nuestros Catálogos</h2>
        <p className={styles.subtitle}>Completa el formulario para recibir todos nuestros catálogos en un ZIP</p>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nombre Completo *</label>
                <input
                  type="text"
                  id="name"
                  className={`form-control ${errors.name ? styles.error : ""}`}
                  {...register("name")}
                />
                {errors.name && <p className="error-message">{errors.name.message}</p>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Correo Electrónico *</label>
                <input
                  type="email"
                  id="email"
                  className={`form-control ${errors.email ? styles.error : ""}`}
                  {...register("email")}
                />
                {errors.email && <p className="error-message">{errors.email.message}</p>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Teléfono *</label>
                <input
                  type="tel"
                  id="phone"
                  className={`form-control ${errors.phone ? styles.error : ""}`}
                  {...register("phone")}
                />
                {errors.phone && <p className="error-message">{errors.phone.message}</p>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="region">Región/Municipio/País *</label>
                <input
                  type="text"
                  id="region"
                  className={`form-control ${errors.region ? styles.error : ""}`}
                  {...register("region")}
                />
                {errors.region && <p className="error-message">{errors.region.message}</p>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="storeName">Nombre de la Tienda (Opcional)</label>
                <input type="text" id="storeName" className="form-control" {...register("storeName")} />
              </div>
            </div>

            <div className={styles.submitContainer}>
              <button type="submit" className={`btn btn-primary ${styles.submitButton}`} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <FaSpinner className={styles.spinner} /> Procesando...
                  </>
                ) : isSuccess ? (
                  <>
                    <FaCheck /> ¡Gracias!
                  </>
                ) : (
                  <>
                    <FaDownload /> Solicitar Catálogos
                  </>
                )}
              </button>

              {isSuccess && (
                <div className={styles.successMessage}>
                  <p>Tu descarga ha comenzado. ¡Gracias por tu interés!</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default CatalogDownload
