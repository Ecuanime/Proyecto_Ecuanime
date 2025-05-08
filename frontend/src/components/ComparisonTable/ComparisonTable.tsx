import { FaCheck, FaTimes } from "react-icons/fa"
import styles from "./ComparisonTable.module.css"

const ComparisonTable = () => {
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
              <tr>
                <td>Pedido mínimo bajo</td>
                <td className={styles.usColumn}>
                  <FaCheck className={styles.checkIcon} />
                </td>
                <td>
                  <FaTimes className={styles.timesIcon} />
                </td>
              </tr>
              <tr>
                <td>Envío a todo el país</td>
                <td className={styles.usColumn}>
                  <FaCheck className={styles.checkIcon} />
                </td>
                <td>
                  <FaCheck className={styles.checkIcon} />
                </td>
              </tr>
              <tr>
                <td>Catálogos actualizados mensualmente</td>
                <td className={styles.usColumn}>
                  <FaCheck className={styles.checkIcon} />
                </td>
                <td>
                  <FaTimes className={styles.timesIcon} />
                </td>
              </tr>
              <tr>
                <td>Asesoría personalizada</td>
                <td className={styles.usColumn}>
                  <FaCheck className={styles.checkIcon} />
                </td>
                <td>
                  <FaTimes className={styles.timesIcon} />
                </td>
              </tr>
              <tr>
                <td>Garantía de calidad</td>
                <td className={styles.usColumn}>
                  <FaCheck className={styles.checkIcon} />
                </td>
                <td>
                  <FaCheck className={styles.checkIcon} />
                </td>
              </tr>
              <tr>
                <td>Devoluciones sin complicaciones</td>
                <td className={styles.usColumn}>
                  <FaCheck className={styles.checkIcon} />
                </td>
                <td>
                  <FaTimes className={styles.timesIcon} />
                </td>
              </tr>
              <tr>
                <td>Múltiples métodos de pago</td>
                <td className={styles.usColumn}>
                  <FaCheck className={styles.checkIcon} />
                </td>
                <td>
                  <FaCheck className={styles.checkIcon} />
                </td>
              </tr>
              <tr>
                <td>Descuentos por volumen</td>
                <td className={styles.usColumn}>
                  <FaCheck className={styles.checkIcon} />
                </td>
                <td>
                  <FaTimes className={styles.timesIcon} />
                </td>
              </tr>
              <tr>
                <td>Atención 7 días a la semana</td>
                <td className={styles.usColumn}>
                  <FaCheck className={styles.checkIcon} />
                </td>
                <td>
                  <FaTimes className={styles.timesIcon} />
                </td>
              </tr>
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
