import express from 'express';
import { 
  getUsers, 
  getUserById, 
  createUser,
  updateUser, 
  deleteUser, 
  getRecentUsers,
  sendWelcomeEmail
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(protect);

// Rutas que requieren ser admin
router.route('/')
  .get(admin, getUsers)
  .post(admin, createUser);

// Ruta para usuarios recientes
router.get('/recent', admin, getRecentUsers);

// Rutas para usuario específico
router.route('/:id')
  .get(admin, getUserById)
  .put(admin, updateUser)
  .delete(admin, deleteUser);

// Ruta para enviar mensaje de bienvenida
router.post('/:id/welcome', admin, sendWelcomeEmail);

export default router;