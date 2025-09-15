import * as XLSX from "xlsx"
import Swal from "sweetalert2"

interface ExportData {
  sheetName: string
  data: any[]
  headers?: string[]
}

export const exportToExcel = (data: ExportData[], filename = "dashboard-data") => {
  try {
    // Crear un nuevo workbook
    const workbook = XLSX.utils.book_new()

    data.forEach(({ sheetName, data: sheetData, headers }) => {
      let worksheet

      if (headers && sheetData.length > 0) {
        // Si se proporcionan headers personalizados
        const formattedData = sheetData.map((row) => {
          const formattedRow: any = {}
          headers.forEach((header, index) => {
            const keys = Object.keys(row)
            formattedRow[header] = row[keys[index]] || ""
          })
          return formattedRow
        })
        worksheet = XLSX.utils.json_to_sheet(formattedData)
      } else {
        // Usar los datos tal como están
        worksheet = XLSX.utils.json_to_sheet(sheetData)
      }

      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    })

    // Generar el archivo y descargarlo
    const timestamp = new Date().toISOString().split("T")[0]
    XLSX.writeFile(workbook, `${filename}-${timestamp}.xlsx`)

    // Mostrar mensaje de éxito con SweetAlert2
    Swal.fire({
      icon: "success",
      title: "¡Exportación exitosa!",
      text: "El archivo Excel se ha descargado correctamente",
      background: "#1e1e1e",
      color: "#e0e0e0",
      confirmButtonColor: "#2ecc71",
      confirmButtonText: "Entendido",
      timer: 3000,
      timerProgressBar: true,
    })

    return true
  } catch (error) {
    console.error("Error al exportar a Excel:", error)

    // Mostrar mensaje de error con SweetAlert2
    Swal.fire({
      icon: "error",
      title: "Error en la exportación",
      text: "Hubo un problema al generar el archivo Excel. Por favor, inténtalo de nuevo.",
      background: "#1e1e1e",
      color: "#e0e0e0",
      confirmButtonColor: "#e74c3c",
      confirmButtonText: "Entendido",
    })

    return false
  }
}

// Función específica para exportar datos del dashboard
export const exportDashboardData = async (userService: any) => {
  try {
    // Mostrar loading mientras se procesan los datos
    Swal.fire({
      title: "Preparando exportación...",
      text: "Recopilando datos para el archivo Excel",
      background: "#1e1e1e",
      color: "#e0e0e0",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const users = await userService.getUsers()
    const downloads = await userService.getCatalogDownloads()

    const exportData: ExportData[] = [
      {
        sheetName: "Usuarios",
        data: users.map((user: any) => ({
          Nombre: user.name,
          Email: user.email,
          Teléfono: user.phone || "N/A",
          Región: user.region || "N/A",
          Tienda: user.storeName || "N/A",
          Rol: user.role === "admin" ? "Administrador" : "Usuario",
          "Fecha de Registro": user.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "N/A",
        })),
      },
      {
        sheetName: "Descargas de Catálogo",
        data: downloads.map((download: any) => ({
          Nombre: download.name,
          Email: download.email,
          Teléfono: download.phone || "N/A",
          Región: download.region || "N/A",
          Tienda: download.storeName || "N/A",
          "Fecha de Descarga": new Date(download.fechaDescarga).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        })),
      },
      {
        sheetName: "Estadísticas",
        data: [
          {
            Métrica: "Total de Usuarios",
            Valor: users.length,
            Descripción: "Número total de usuarios registrados",
          },
          {
            Métrica: "Administradores",
            Valor: users.filter((u: any) => u.role === "admin").length,
            Descripción: "Usuarios con rol de administrador",
          },
          {
            Métrica: "Usuarios Regulares",
            Valor: users.filter((u: any) => u.role === "user").length,
            Descripción: "Usuarios con rol regular",
          },
          {
            Métrica: "Total de Descargas",
            Valor: downloads.length,
            Descripción: "Número total de descargas de catálogo",
          },
          {
            Métrica: "Usuarios Únicos que Descargaron",
            Valor: new Set(downloads.map((d: any) => d.email)).size,
            Descripción: "Usuarios únicos que han descargado el catálogo",
          },
        ],
      },
    ]

    // Cerrar el loading y proceder con la exportación
    Swal.close()
    return exportToExcel(exportData, "dashboard-completo")
  } catch (error) {
    console.error("Error al exportar datos del dashboard:", error)

    // Mostrar error específico
    Swal.fire({
      icon: "error",
      title: "Error al recopilar datos",
      text: "No se pudieron obtener los datos necesarios para la exportación. Verifica tu conexión e inténtalo de nuevo.",
      background: "#1e1e1e",
      color: "#e0e0e0",
      confirmButtonColor: "#e74c3c",
      confirmButtonText: "Entendido",
    })

    return false
  }
}
