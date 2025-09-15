import styles from "./PaymentMethods.module.css"

const paymentMethods = [
  { 
    id: 1, 
    name: "PSE", 
    logo: "https://placehold.co/120x60/FFFFFF/0033A0?text=PSE" 
  },
  { 
    id: 6, 
    name: "Master Card", 
    logo: "https://i.postimg.cc/wvLJfVGt/logo-mastercard.jpg" 
  },
  { 
    id: 7, 
    name: "Visa", 
    logo: "https://i.postimg.cc/BnRQT4k9/Visa.jpg " 
  },
  { 
    id: 3, 
    name: "Americans exprés", 
    logo: "https://i.postimg.cc/k5n5pqsy/Sin-t-tulo-1.jpg" 
  },
  { 
    id: 4, 
    name: "Bancolombia",
    logo: "https://i.postimg.cc/PJn9SrzX/logo-bancolombia.jpg",
  },
  { 
    id: 2, 
    name: "Nequi", 
    logo: "https://placehold.co/120x60/FFFFFF/5D12D2?text=NEQUI" 
  },


]

const PaymentMethods = () => {
  return (
    <section className={`section ${styles.paymentMethods}`}>
      <div className="container">
        <h2 className="section-title">Métodos de Pago</h2>
        <p className={styles.subtitle}>Ofrecemos múltiples opciones de pago para facilitar tus compras</p>

        <div className={styles.methodsGrid}>
          {paymentMethods.map((method) => (
            <div key={method.id} className={styles.methodItem}>
              <img src={method.logo || "/placeholder.svg"} alt={method.name} />
              <p>{method.name}</p>
            </div>
          ))}
        </div>

        <div className={styles.info}>
          <p>
            También aceptamos transferencias bancarias y pagos en efectivo. Consulta con tu asesor para más detalles.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PaymentMethods
