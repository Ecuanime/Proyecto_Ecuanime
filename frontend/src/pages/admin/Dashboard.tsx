"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaSpinner } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import { userService } from "../../services/api.js"
import AdminLayout from "./components/AdminLayout"
import styles from "./Dashboard.module.css"

interface Client {
  _id: string
  name: string
  email: string
  phone: string
  region: string
  registrationDate: string
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
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Clientes Totales</h3>
              <p className={styles.statNumber}>{stats.totalUsers}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Nuevos Clientes (Mes)</h3>
              <p className={styles.statNumber}>{stats.newUsers}</p>
            </div>
       
          </div>

          <div className={styles.clientsSection}>
            <div className={styles.sectionHeader}>
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
              <div className={styles.tableContainer}>
                <table className={styles.clientsTable}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Región</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client._id}>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.phone}</td>
                        <td>{client.region}</td>
                        <td>{new Date(client.registrationDate).toLocaleDateString()}</td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.actionButton}
                              onClick={() => navigate(`/admin/usuarios/${client._id}`)}
                            >
                              Ver
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  )
}

export default Dashboard
