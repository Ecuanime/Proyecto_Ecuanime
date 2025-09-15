"use client"
import { useState, useEffect } from "react"
import { FaShoppingBag, FaWhatsapp, FaEye, FaTimes } from "react-icons/fa"
import styles from "./Products.module.css"

interface Product {
  id: number
  name: string
  price: number
  image: string
  modalImage?: string
  category: string
  description: string
  sizes?: string[]
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simulate API call to fetch products
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // Mock products data with defined sizes for all
        const baseProducts: Product[] = [
          {
            id: 1,
            name: "Camiseta tipo polo",
            price: 30000,
            image: "https://i.postimg.cc/5yYDGvS6/imagen-polo-editada.jpg",
            modalImage: "https://i.postimg.cc/MGTnQJqV/portada-tipo-polo-catalogo.jpg",
            category: "Hombre",
            description:
              "Descubre nuestras camisetas tipo polo en tela piqué suavizada de alto gramaje (220), diseñadas para ofrecerte máximo confort y durabilidad. Su tejido premium garantiza una textura suave al tacto y un excelente acabado, ideal tanto para uso diario como para uniformes corporativos. Disponibles en 22 vibrantes colores que se mantienen firmes lavado tras lavado. Calidad superior que se nota y se siente.",
            sizes: ["S", "M", "L", "XL", "2 XL", "3 XL", "4 XL"],
          },
          {
            id: 2,
            name: "Boxer Masculino",
            price: 9800,
            image: "https://i.postimg.cc/pVgccPSV/imagen-de-productos-boxers.jpg",
            modalImage: "https://i.postimg.cc/zfrkppSN/portada-boxers-catalogo.jpg",
            category: "Hombre",
            description:
              "Boxers masculinos en tela microfibra transpirable, que brindan frescura y comodidad todo el día. Con resorte ancho de 4 cm para un ajuste perfecto y excelentes acabados que garantizan durabilidad y estilo. Largo medio, disponibles en 10 colores modernos y Calidad premium en cada detalle.",
            sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
          },
          {
            id: 4,
            name: "Camisetas de mujer",
            price: 20000,
            image: "https://i.postimg.cc/XJNXbMDp/imagen-productos-camisetas-dama.jpg",
            modalImage: "https://i.postimg.cc/7ZGPP8cH/portada-camisetas-dama-catalogo.jpg",
            category: "Mujer",
            description:
              "Camisetas para mujer con cuello redondo y moldería regular fit, elaboradas en tela poli algodón de excelente calidad, suave al tacto y de gran durabilidad. Más de 40 diseños modernos y actuales que se adaptan a tu estilo. Comodidad y moda en cada detalle.",
            sizes: ["S", "M", "L", "XL", "XXL"],
          },
          {
            id: 7,
            name: "Camisetas hombre",
            price: 20000,
            image: "https://i.postimg.cc/Pqp2QcMv/imagen-portada-productos.jpg",
            modalImage: "https://i.postimg.cc/3xGzym3W/portada-camisetas-hombre-catalogo.jpg",
            category: "Hombre",
            description:
              "Camisetas cuello redondo con moldería regular fit, confeccionadas en tela poli algodón que ofrece excelente calidad, comodidad y durabilidad. Más de 40 diseños modernos y actuales para todos los gustos. La combinación perfecta entre estilo y resistencia.",
            sizes: ["S", "M", "L", "XL", "XXL"],
          },
          {
            id: 5,
            name: "Camisetas hombre y mujer Oversize",
            price: 30000,
            image: "https://i.postimg.cc/1zXvP0sk/portada-camisetas-oversize-catalogo.jpg",
            modalImage: "https://i.postimg.cc/1zXvP0sk/portada-camisetas-oversize-catalogo.jpg",
            category: "Hombre",
            description:
              "Camisetas oversize para hombre y mujer, hechas en 100% algodón de alto gramaje premium: suaves, resistentes y con flow. Disponibles en colores modernos que marcan tendencia. El fit relajado que se siente cómodo y se ve increíble. ¡Exprésate con estilo y calidad!",
            sizes: ["S", "M", "L", "XL", "Mujer Talla unica"],
          },
          {
            id: 6,
            name: "Buzos de hombre y mujer",
            price: 37000,
            image: "https://i.postimg.cc/3RbrQkvc/imagen-productos-buzos.jpg",
            modalImage: "https://i.postimg.cc/BQWf5Lw0/portada-catalog-buzos.jpg",
            category: "Hombre",
            description:
              "Buzos para hombre y mujer en tela burda algodón, con excelentes acabados que garantizan calidad y confort. Moldería regular que brinda un ajuste cómodo y moderno. Estilo y durabilidad en cada prenda.",
            sizes: ["S", "M", "L", "XL", "XXL", "Mujer Talla unica"],
          },
        ]

        // Crear productos duplicados para la categoría "Mujer"
        const duplicatedProducts = [
          {
            ...baseProducts.find((p) => p.id === 5)!,
            id: 51,
            category: "Mujer",
          },
          {
            ...baseProducts.find((p) => p.id === 6)!,
            id: 61,
            category: "Mujer",
          },
        ]

        const allProducts = [...baseProducts, ...duplicatedProducts]
        setProducts(allProducts)

        // Extract unique categories
        const uniqueCategories = ["all", ...new Set(allProducts.map((product) => product.category))]
        setCategories(uniqueCategories)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleFilterCategory = (category: string) => {
    setActiveCategory(category)
  }

  // Lógica de filtrado mejorada para evitar duplicados en "all"
  const filteredProducts = (() => {
    if (activeCategory === "all") {
      return products.filter((product) => product.id < 50)
    } else {
      return products.filter((product) => product.category === activeCategory)
    }
  })()

  const handleContactClick = (product: Product) => {
    const message = `Hola, estoy interesado en el producto "${product.name}" con precio de ${product.price.toLocaleString("es-CO")} COP. ¿Podrías darme más información?`
    window.open(`https://wa.me/573142654760?text=${encodeURIComponent(message)}`, "_blank")
  }

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <section id="productos" className={`section ${styles.products}`}>
      <div className="container">
        <h2 className="section-title">Nuestros Productos</h2>
        <p className={styles.subtitle}>Descubre nuestra selección de productos mayoristas de alta calidad</p>

        <div className={styles.categories}>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ""}`}
              onClick={() => handleFilterCategory(category)}
            >
              {category === "all"
                ? "Todos"
                : category === "Mujer"
                  ? "Ropa de Mujer"
                  : category === "Hombre"
                    ? "Ropa de Hombre"
                    : category === "calzado"
                      ? "Calzado"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando productos...</p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image || "/placeholder.svg"} alt={product.name} />
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <div className={styles.productPrice}>
                    <span>$ {product.price.toLocaleString("es-CO")}</span>
                    <small>Precio mayorista</small>
                  </div>
                  <button className={styles.contactButton} onClick={() => handleContactClick(product)}>
                    <FaWhatsapp /> Consultar
                  </button>
                  <button className={styles.detailsButton} onClick={() => handleViewDetails(product)}>
                    <FaEye /> Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className={styles.noProducts}>
            <FaShoppingBag className={styles.noProductsIcon} />
            <p>No hay productos en esta categoría</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedProduct && (
        <div className={`${styles.modalOverlay} ${isModalOpen ? styles.modalOpen : ""}`} onClick={handleCloseModal}>
          <div
            className={`${styles.modalContent} ${isModalOpen ? styles.modalOpen : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={handleCloseModal}>
              <FaTimes />
            </button>
            <div className={styles.modalImageContainer}>
              <img
                src={selectedProduct.modalImage || selectedProduct.image || "/placeholder.svg"}
                alt={selectedProduct.name}
              />
            </div>
            <div className={styles.modalInfo}>
              <h2>{selectedProduct.name}</h2>
              <div className={styles.modalPrice}>
                <span>$ {selectedProduct.price.toLocaleString("es-CO")}</span>
                <small>Precio mayorista</small>
              </div>
              <div className={styles.modalDescription}>
                <h3>Descripción:</h3>
                <p>{selectedProduct.description}</p>
              </div>
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className={styles.modalSizes}>
                  <h3>Tallas Disponibles:</h3>
                  <ul className={styles.modalSizesList}>
                    {selectedProduct.sizes.map((size, index) => (
                      <li key={index}>{size}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                className={styles.modalContactButton}
                onClick={() => {
                  const message = `Hola, estoy interesado en el producto "${selectedProduct.name}" con precio de ${selectedProduct.price.toLocaleString("es-CO")} COP. ¿Podrías darme más información?`
                  window.open(`https://wa.me/573142654760?text=${encodeURIComponent(message)}`, "_blank")
                  handleCloseModal()
                }}
              >
                <FaWhatsapp /> Contactar asesor
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Products
