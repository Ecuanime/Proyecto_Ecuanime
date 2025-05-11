"use client"

import React, { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Activity, ShieldCheck, BarChart3 as BarChartIconLucide } from "lucide-react"; // Cambiado BarChart2 a BarChart3 o el que prefieras
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell // Para colores personalizados en las barras
} from 'recharts'; // Importaciones de Recharts
import AdminLayout from "../../pages/admin/components/AdminLayout.js";
import { userService } from "../../services/api.js";
import styles from "./Dashboard.module.css"; // Asumiendo que tienes Dashboard.module.css

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt?: string;
}

interface DashboardStats {
  totalUsers: number;
  newUsersLastWeek: number;
  adminCount: number;
  userCount: number; // Añadido para el gráfico
  activeUsersToday: number;
}

// Colores para el gráfico (coherentes con los badges)
const COLORS = {
  admin: 'var(--warning-color, #ffc107)', // Color de --warning-color
  user: 'var(--info-color, #17a2b8)'     // Color de --info-color
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const usersData = await userService.getUsers();
      
      const totalUsers = usersData.length;
      const adminCount = usersData.filter((user: User) => user.role === "admin").length;
      const userCount = totalUsers - adminCount; // Usuarios no administradores

      const newUsersLastWeek = Math.floor(Math.random() * (totalUsers / 10));
      const activeUsersToday = Math.floor(Math.random() * (totalUsers / 2));

      setStats({
        totalUsers,
        newUsersLastWeek,
        adminCount,
        userCount, // Añadido
        activeUsersToday,
      });

      const sortedRecentUsers = usersData
        .sort((a: User, b: User) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 5);
      setRecentUsers(sortedRecentUsers);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar datos del dashboard";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Datos para el gráfico de usuarios por rol
  const usersByRoleData = stats ? [
    { name: 'Administradores', count: stats.adminCount, fill: COLORS.admin },
    { name: 'Usuarios', count: stats.userCount, fill: COLORS.user },
  ] : [];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className={styles.dashboardContainer}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Cargando Dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className={styles.dashboardContainer}>
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={loadDashboardData} className={styles.retryButton}>Reintentar</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1>Dashboard Principal</h1>
          <p>Bienvenido al panel de administración. Aquí tienes un resumen general.</p>
        </div>

        {stats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', color: 'var(--accent-color, #007bff)' }}>
                <Users size={28} />
              </div>
              <div className={styles.statInfo}>
                <h4>Total de Usuarios</h4>
                <p>{stats.totalUsers}</p>
              </div>
            </div>
            <div className={styles.statCard}>
               <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', color: 'var(--success-color, #28a745)' }}>
                <UserPlus size={28} />
              </div>
              <div className={styles.statInfo}>
                <h4>Nuevos (Últ. 7 días)</h4>
                <p>{stats.newUsersLastWeek}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', color: 'var(--warning-color, #ffc107)' }}>
                <ShieldCheck size={28} />
              </div>
              <div className={styles.statInfo}>
                <h4>Administradores</h4>
                <p>{stats.adminCount}</p>
              </div>
            </div>
             <div className={styles.statCard}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)', color: 'var(--info-color, #17a2b8)' }}>
                <Activity size={28} />
              </div>
              <div className={styles.statInfo}>
                <h4>Activos Hoy (Sim.)</h4>
                <p>{stats.activeUsersToday}</p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.mainContentGrid}>
          <div className={`${styles.contentCard} ${styles.recentUsersCard}`}>
            <h3 className={styles.cardTitle}>Usuarios Registrados Recientemente</h3>
            {recentUsers.length > 0 ? (
              <div className={styles.tableContainer}>
                <table className={styles.dashboardTable}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th className="d-none d-sm-table-cell">Email</th>
                      <th>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td className="d-none d-sm-table-cell">{user.email}</td>
                        <td>
                          <span className={`${styles.roleBadge} ${user.role === "admin" ? styles.adminBadge : styles.userBadge}`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.noDataMessage}>No hay usuarios recientes para mostrar.</p>
            )}
          </div>

          {/* GRÁFICO REAL CON RECHARTS */}
          <div className={`${styles.contentCard} ${styles.chartCard}`}>
            <h3 className={styles.cardTitle}>Distribución de Usuarios por Rol</h3>
            {usersByRoleData.length > 0 ? (
              <div className={styles.chartContainer}> {/* Contenedor para el gráfico */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={usersByRoleData}
                    margin={{ top: 5, right: 0, left: -25, bottom: 5 }} /* Ajusta márgenes */
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary-dark)', fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary-dark)', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface-dark-light)',
                        borderColor: 'var(--border-dark)',
                        borderRadius: '6px',
                        color: 'var(--text-primary-dark)'
                      }}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    {/* <Legend wrapperStyle={{ color: 'var(--text-secondary-dark)', fontSize: 12 }}/> */}
                    <Bar dataKey="count"  barSize={40}>
                       {usersByRoleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className={styles.chartPlaceholder}>
                 <BarChartIconLucide size={50} opacity={0.3} />
                 <p>No hay datos suficientes para mostrar el gráfico.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;