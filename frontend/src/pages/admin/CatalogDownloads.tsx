"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Calendar, FileDown, BarChart2 } from "lucide-react"
import AdminLayout from "./components/AdminLayout"
import { userService } from "../../services/api"
import styles from "./CatalogDownloads.module.css"

interface DownloadRecord {
  _id: string
  name: string
  email: string
  phone?: string
  region?: string
  storeName?: string
  fechaDescarga: string
}

const CatalogDownloads = () => {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadDownloads = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await userService.getCatalogDownloads()
        setDownloads(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar el historial de descargas"
        setError(errorMessage)
        console.error("Error al cargar historial de descargas:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDownloads()
  }, [])

  const filteredDownloads = downloads.filter(
    (download) =>
      download.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      download.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (download.phone && download.phone.includes(searchTerm)) ||
      (download.region && download.region.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (download.storeName && download.storeName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Agrupar descargas por fecha (para estadísticas)
  const getDownloadsByDate = () => {
    const dateMap = new Map()
    downloads.forEach((download) => {
      const date = new Date(download.fechaDescarga).toLocaleDateString("es-ES")
      dateMap.set(date, (dateMap.get(date) || 0) + 1)
    })
    return dateMap
  }

  // Obtener las últimas 5 fechas con descargas
  const getRecentDates = () => {
    const dateMap = getDownloadsByDate()
    return Array.from(dateMap.entries())
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 5)
  }

  return (
    <AdminLayout>
      <div className={styles.downloadsContainer}>
        <div className={styles.downloadsHeader}>
          <h1>Historial de Descargas de Catálogo</h1>
          <p>Visualiza todos los usuarios que han descargado el catálogo.</p>
        </div>

        {/* Tarjetas de estadísticas */}
        {!isLoading && !error && downloads.length > 0 && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.totalDownloadsIcon}`}>
                <FileDown size={24} />
              </div>
              <div className={styles.statInfo}>
                <h4>Total de Descargas</h4>
                <p>{downloads.length}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.uniqueUsersIcon}`}>
                <BarChart2 size={24} />
              </div>
              <div className={styles.statInfo}>
                <h4>Usuarios Únicos</h4>
                <p>{new Set(downloads.map((d) => d.email)).size}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.todayDownloadsIcon}`}>
                <Calendar size={24} />
              </div>
              <div className={styles.statInfo}>
                <h4>Hoy</h4>
                <p>
                  {
                    downloads.filter(
                      (d) => new Date(d.fechaDescarga).toLocaleDateString() === new Date().toLocaleDateString(),
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.controlsContainer}>
          <div className={styles.searchInputContainer}>
            <div className={styles.searchInput}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                className={styles.inputField}
                placeholder="Buscar por nombre, email, región..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Cargando historial de descargas...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className={styles.mainContentGrid}>
            {/* Tabla de descargas */}
            <div className={styles.contentCard}>
              <h3 className={styles.cardTitle}>Registro de Descargas</h3>
              <div className={styles.tableWrapper}>
                <div className={styles.tableContainer}>
                  <table className={styles.dashboardTable}>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th className="d-none d-md-table-cell">Teléfono</th>
                        <th className="d-none d-md-table-cell">Región</th>
                        <th className="d-none d-lg-table-cell">Tienda</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDownloads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className={styles.noDataMessage}>
                            No se encontraron registros de descargas que coincidan con la búsqueda.
                          </td>
                        </tr>
                      ) : (
                        filteredDownloads.map((download) => (
                          <tr key={download._id}>
                            <td data-label="Nombre">{download.name}</td>
                            <td data-label="Email">{download.email}</td>
                            <td data-label="Teléfono" className="d-none d-md-table-cell">
                              {download.phone || "N/A"}
                            </td>
                            <td data-label="Región" className="d-none d-md-table-cell">
                              {download.region || "N/A"}
                            </td>
                            <td data-label="Tienda" className="d-none d-lg-table-cell">
                              {download.storeName || "N/A"}
                            </td>
                            <td data-label="Fecha">
                              <div className={styles.dateContainer}>
                                <Calendar size={16} className={styles.calendarIcon} />
                                {formatDate(download.fechaDescarga)}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Estadísticas recientes */}
            {!isLoading && !error && downloads.length > 0 && (
              <div className={styles.contentCard}>
                <h3 className={styles.cardTitle}>Descargas Recientes</h3>
                {getRecentDates().length > 0 ? (
                  <div className={styles.recentStats}>
                    {getRecentDates().map(([date, count]) => (
                      <div key={date} className={styles.recentStatItem}>
                        <div className={styles.recentStatDate}>{date}</div>
                        <div className={styles.recentStatBar}>
                          <div
                            className={styles.recentStatBarFill}
                            style={{
                              width: `${Math.min(100, (count / Math.max(...Array.from(getDownloadsByDate().values()))) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <div className={styles.recentStatCount}>{count}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.chartPlaceholder}>
                    <BarChart2 size={40} />
                    <p>No hay datos suficientes para mostrar estadísticas</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default CatalogDownloads
