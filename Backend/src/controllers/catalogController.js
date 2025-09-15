import User from "../models/userModel.js"

// @desc    Registrar descarga de catálogo sin enviar el archivo
// @route   POST /api/catalog/register
// @access  Público
export const registerCatalogDownload = async (req, res) => {
  try {
    console.log("Recibida solicitud para registrar descarga de catálogo")
    console.log("Datos recibidos:", req.body)

    const { name, email, phone, region, storeName } = req.body

    // Verificar si el usuario existe
    let user = await User.findOne({ email })

    if (user) {
      console.log("Usuario existente encontrado:", user._id)
      // Actualizar información del usuario existente
      user.catalogoDescargado = true
      user.fechaDescarga = new Date()

      // Actualizar campos adicionales si se proporcionan
      if (phone) user.phone = phone
      if (region) user.region = region
      if (storeName) user.storeName = storeName

      await user.save()
      console.log("Usuario actualizado con información de descarga")
    } else {
      console.log("Creando nuevo usuario para la descarga")
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
      console.log("Nuevo usuario creado:", user._id)
    }

    res.status(200).json({ success: true, message: "Descarga registrada correctamente" })
  } catch (error) {
    console.error("Error al registrar la descarga del catálogo:", error)
    res.status(500).json({ message: "Error al registrar la descarga del catálogo" })
  }
}

// @desc    Obtener historial de descargas de catálogo
// @route   GET /api/catalog/downloads
// @access  Privado/Admin
export const getCatalogDownloads = async (req, res) => {
  try {
    console.log("Obteniendo historial de descargas de catálogo")

    const downloads = await User.find({ catalogoDescargado: true })
      .select("name email phone region storeName fechaDescarga")
      .sort({ fechaDescarga: -1 })

    console.log(`Se encontraron ${downloads.length} registros de descargas`)
    res.json(downloads)
  } catch (error) {
    console.error("Error al obtener historial de descargas:", error)
    res.status(500).json({ message: "Error al obtener historial de descargas" })
  }
}
