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

// 1. Carga variables de entorno y conecta a MongoDB
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

// 2. Monta tus rutas de API
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

// 3. SERVIR EL FRONTEND REACT BUILD con DEBUG
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construimos la ruta esperada a frontend/dist
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

// DEBUG: imprime en logs la ruta y su contenido
console.log('>>> Ruta candidate frontendDist:', frontendDist);
console.log('>>> frontendDist existe?:', fs.existsSync(frontendDist));

if (fs.existsSync(frontendDist)) {
  console.log('>>> Contenido de frontendDist:', fs.readdirSync(frontendDist));
  const assetsDir = path.join(frontendDist, 'assets');
  console.log('>>> assets subdir existe?:', fs.existsSync(assetsDir));
  if (fs.existsSync(assetsDir)) {
    console.log('>>> Contenido de assets/:', fs.readdirSync(assetsDir));
  }
} else {
  console.error('❌ No existe frontendDist en la ruta indicada; abortando servidor.');
  process.exit(1);
}

// Sirve estáticos y catch‑all
app.use(express.static(frontendDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// 4. Middlewares de error
app.use(notFound);
app.use(errorHandler);

// 5. Arranque del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en puerto ${PORT} (env: ${process.env.NODE_ENV})`)
);
