"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaSpinner } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import { userService } from "../../services/api.js"
import AdminLayout from "./components/AdminLayout"
import styles from "./Dashboard.module.css"
import "bootstrap/dist/css/bootstrap.min.css" // Importa Bootstrap para la estructura base

interface Client {
  _id: string
  name: string
  email: string
  phone: string
  region: string
  registrationDate: string
  // Puedes añadir aquí otros campos que necesites mostrar en el modal
  storeName?: string
  // ... otros campos
}

interface DashboardStats {
  totalUsers: number
  newUsers: number
  pendingMessages: number
  catalogDownloads: number
}

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    newUsers: 0,
    pendingMessages: 0,
    catalogDownloads: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showClientModal, setShowClientModal] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login")
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Obtener todos los usuarios
        const allUsers = await userService.getUsers()

        // Obtener usuarios recientes (últimos 5)
        const recentClients = allUsers
          .filter((user: any) => user.role !== "admin")
          .sort((a: any, b: any) => {
            return (
              new Date(b.registrationDate || b.createdAt || 0).getTime() -
              new Date(a.registrationDate || a.createdAt || 0).getTime()
            )
          })
          .slice(0, 5)
          .map((client: any) => ({
            _id: client._id,
            name: client.name || "Sin nombre",
            email: client.email || "Sin email",
            phone: client.phone || "Sin teléfono",
            region: client.region || "Sin región",
            registrationDate: client.registrationDate || client.createdAt || new Date().toISOString(),
            storeName: client.storeName, // Ejemplo de cómo traer otros campos
            // ... trae aquí otros campos que necesites
          }))

        setClients(recentClients)

        // Calcular estadísticas
        const newUsersCount = allUsers.filter((user: any) => {
          const registrationDate = new Date(user.registrationDate || user.createdAt || 0)
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return registrationDate >= thirtyDaysAgo
        }).length

        setStats({
          totalUsers: allUsers.filter((user: any) => user.role !== "admin").length,
          newUsers: newUsersCount,
          pendingMessages: Math.floor(Math.random() * 10), // Simulado por ahora
          catalogDownloads: allUsers.length * 2, // Simulado por ahora
        })
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error)
        setError(`Error al cargar datos: ${error.message || "Error desconocido"}`)

        // Datos de respaldo en caso de error
        setClients([])
        setStats({
          totalUsers: 0,
          newUsers: 0,
          pendingMessages: 0,
          catalogDownloads: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, navigate])

  const handleShowClientDetails = (client: Client) => {
    setSelectedClient(client)
    setShowClientModal(true)
  }

  const handleCloseClientModal = () => {
    setSelectedClient(null)
    setShowClientModal(false)
  }

  return (
    <AdminLayout>
      <div className={styles.dashboardHeader}>
        <h1>Dashboard</h1>
        <p>Bienvenido, {user?.name}!</p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>
          <FaSpinner className={styles.spinner} />
          <p>Cargando datos del dashboard...</p>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-4">
            <div className="col">
              <div className={`${styles.statCard} rounded shadow-sm p-3`}>
                <h3>Clientes Totales</h3>
                <p className={`${styles.statNumber}`}>{stats.totalUsers}</p>
              </div>
            </div>
            <div className="col">
              <div className={`${styles.statCard} rounded shadow-sm p-3`}>
                <h3>Nuevos Clientes (Mes)</h3>
                <p className={`${styles.statNumber}`}>{stats.newUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-transparent rounded shadow-sm p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Clientes Recientes</h2>
              <button className="btn btn-primary" onClick={() => navigate("/admin/usuarios")}>
                Ver Todos
              </button>
            </div>

            {clients.length === 0 ? (
              <div className={styles.noData}>
                <p>No hay clientes registrados aún.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className={`${styles.clientsTable} table table-hover bg-transparent`}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th className="d-none d-md-table-cell">Teléfono</th>
                      <th className="d-none d-lg-table-cell">Región</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client._id}>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td className="d-none d-md-table-cell">{client.phone}</td>
                        <td className="d-none d-lg-table-cell">{client.region}</td>
                        <td>{new Date(client.registrationDate).toLocaleDateString()}</td>
                        <td>
                          <button
                            className={`${styles.actionButton} btn btn-sm btn-outline-info`}
                            onClick={() => handleShowClientDetails(client)}
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal de Detalles del Cliente */}
          {selectedClient && (
            <div className="modal fade show" style={{ display: "block" }} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className={`${styles.modal} modal-content`}>
                  <div className={`${styles.modalHeader} modal-header`}>
                    <h5 className="modal-title">Detalles del Cliente</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseClientModal}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className={`${styles.modalBody} modal-body`}>
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Nombre:</strong> {selectedClient.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedClient.email}
                        </p>
                        <p>
                          <strong>Teléfono:</strong> {selectedClient.phone}
                        </p>
                        <p>
                          <strong>Región:</strong> {selectedClient.region}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Fecha de Registro:</strong>{" "}
                          {new Date(selectedClient.registrationDate).toLocaleDateString()}
                        </p>
                        {selectedClient.storeName && (
                          <p>
                            <strong>Nombre de Tienda:</strong> {selectedClient.storeName}
                          </p>
                        )}
                        {/* Aquí puedes mostrar otros detalles del cliente */}
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.modalFooter} modal-footer`}>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseClientModal}>
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  )
}

export default Dashboard
