import { FaCheck, FaTimes } from "react-icons/fa"
import styles from "./ComparisonTable.module.css"

const ComparisonTable = () => {
  const features = [
    {
      name: "Pedido mínimo bajo",
      us: true,
      others: false,
    },
    {
      name: "Envío a todo el país",
      us: true,
      others: true,
    },
    {
      name: "Catálogos actualizados mensualmente",
      us: true,
      others: false,
    },
    {
      name: "Asesoría personalizada",
      us: true,
      others: false,
    },
    {
      name: "Garantía de calidad",
      us: true,
      others: true,
    },
    {
      name: "Devoluciones sin complicaciones",
      us: true,
      others: false,
    },
    {
      name: "Múltiples métodos de pago",
      us: true,
      others: true,
    },
    {
      name: "Descuentos por volumen",
      us: true,
      others: false,
    },
    {
      name: "Atención 7 días a la semana",
      us: true,
      others: false,
    },
  ]

  return (
    <section className={`section ${styles.comparison}`}>
      <div className="container">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <p className={styles.subtitle}>Comparativa con otros proveedores mayoristas</p>

        <div className={styles.tableWrapper}>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th className={styles.featureColumn}>Características</th>
                <th className={styles.usColumn}>Nosotros</th>
                <th>Otros Proveedores</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index}>
                  <td>{feature.name}</td>
                  <td className={styles.usColumn}>
                    {feature.us ? <FaCheck className={styles.checkIcon} /> : <FaTimes className={styles.timesIcon} />}
                  </td>
                  <td>
                    {feature.others ? (
                      <FaCheck className={styles.checkIcon} />
                    ) : (
                      <FaTimes className={styles.timesIcon} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.callToAction}>
          <p>¿Listo para comenzar a trabajar con nosotros?</p>
          <a href="#contacto" className="btn btn-primary">
            Contactar Ahora
          </a>
        </div>
      </div>
    </section>
  )
}

export default ComparisonTable
