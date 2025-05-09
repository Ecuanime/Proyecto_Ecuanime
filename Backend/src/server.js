import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    const whitelist = process.env.CORS_ORIGIN?.split(',') || [];
    if (!origin || process.env.NODE_ENV === 'development' || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
}));

// Tus rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.get('/api/status', (req, res) =>
  res.json({
    status: 'success',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
);

// === SERVIR TU FRONTEND REACT BUILD ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calcula la ruta absoluta a ../frontend/dist desde Backend/src
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

// Verifica en los logs que esa carpeta existe
if (!fs.existsSync(frontendDist)) {
  console.error('❌ No existe frontendDist en:', frontendDist);
  process.exit(1);
}
console.log('✅ Sirviendo frontend desde:', frontendDist);

// Sirve los assets estáticos (/assets/*.css, /assets/*.js, /favicon.ico, etc.)
app.use(express.static(frontendDist));

// Cualquier otra ruta debe devolver index.html para que React Router maneje el ruteo
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Middlewares de error
app.use(notFound);
app.use(errorHandler);

// Arranca el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en puerto ${PORT} (env: ${process.env.NODE_ENV})`)
);
