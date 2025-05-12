import express from "express"
import { registerCatalogDownload, getCatalogDownloads } from "../controllers/catalogController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Ruta pública para registrar la descarga del catálogo (sin enviar el archivo)
router.post("/register", registerCatalogDownload)

// Ruta protegida para administradores para ver el historial de descargas
router.get("/downloads", protect, admin, getCatalogDownloads)

export default router
