import express from "express"
import { downloadCatalog, getCatalogDownloads } from "../controllers/catalogController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Ruta pública para descargar el catálogo
router.post("/download", downloadCatalog)

// Ruta protegida para administradores para ver el historial de descargas
router.get("/downloads", protect, admin, getCatalogDownloads)

export default router
