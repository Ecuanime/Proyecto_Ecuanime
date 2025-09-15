// routes/catalogRoutes.js
import { Router } from 'express';
import {
  registerCatalogDownload,
  getCatalogDownloads
} from '../controllers/catalogController.js'; // ajústalo si tu controlador está en otra ruta

const router = Router();

// Rutas públicas
router.post('/register', registerCatalogDownload);

// Rutas privadas/admin (añade aquí tu middleware de auth si lo tienes)
// router.get('/downloads', protect, admin, getCatalogDownloads);
router.get('/downloads', getCatalogDownloads);

export default router;
