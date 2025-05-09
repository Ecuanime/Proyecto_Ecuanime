import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : [];
    if (
      !origin ||
      process.env.NODE_ENV === 'development' ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// === SERVIR FRONTEND ESTÁTICO (antes de los errores) ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sube un nivel (de Backend) y entra a frontend/dist
const frontendPath = path.resolve(__dirname, '../frontend/dist');

app.use(express.static(frontendPath));

// Catch-all: siempre enviar index.html para React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Middleware de manejo de errores (404 y genérico)
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en puerto ${PORT} en modo ${process.env.NODE_ENV}`
  );
});
