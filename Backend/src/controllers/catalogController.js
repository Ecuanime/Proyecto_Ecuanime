import axios from "axios"
import User from "../models/userModel.js"

// @desc    Descargar catálogo y registrar la descarga
// @route   POST /api/catalog/download
// @access  Público
export const downloadCatalog = async (req, res) => {
  try {
    const { name, email, phone, region, storeName } = req.body

    // Verificar si el usuario existe
    let user = await User.findOne({ email })

    if (user) {
      // Actualizar información del usuario existente
      user.catalogoDescargado = true
      user.fechaDescarga = new Date()

      // Actualizar campos adicionales si se proporcionan
      if (phone) user.phone = phone
      if (region) user.region = region
      if (storeName) user.storeName = storeName

      await user.save()
    } else {
      // Crear un nuevo usuario con la información proporcionada
      user = await User.create({
        name,
        email,
        phone,
        region,
        storeName,
        catalogoDescargado: true,
        fechaDescarga: new Date(),
        // Asignar una contraseña temporal o dejarla vacía según tu lógica de negocio
        password: Math.random().toString(36).slice(-8), // Contraseña aleatoria
      })
    }

    // Descargar el archivo ZIP desde GitHub
    const response = await axios({
      method: "get",
      url: "https://github.com/Ecuanime/Descargas/raw/main/Catalogo.zip",
      responseType: "arraybuffer",
    })

    // Configurar los headers para la descarga
    res.setHeader("Content-Type", "application/zip")
    res.setHeader("Content-Disposition", "attachment; filename=Catalogos.zip")

    // Enviar el archivo al cliente
    res.send(response.data)
  } catch (error) {
    console.error("Error al descargar el catálogo:", error)
    res.status(500).json({ message: "Error al descargar el catálogo" })
  }
}

// @desc    Obtener historial de descargas de catálogo
// @route   GET /api/catalog/downloads
// @access  Privado/Admin
export const getCatalogDownloads = async (req, res) => {
  try {
    const downloads = await User.find({ catalogoDescargado: true })
      .select("name email phone region storeName fechaDescarga")
      .sort({ fechaDescarga: -1 })

    res.json(downloads)
  } catch (error) {
    console.error("Error al obtener historial de descargas:", error)
    res.status(500).json({ message: "Error al obtener historial de descargas" })
  }
}
