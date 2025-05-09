import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
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

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// === SERVIR FRONTEND ESTÁTICO ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// **SUBIMOS DOS NIVELES** hasta Proyecto_REACT_ECUANIME, luego bajamos a frontend/dist
// src/server.js
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
console.log('>>> frontendDist is', frontendDist);
app.use(express.static(frontendDist));



app.use(express.static(frontendDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT} (env: ${process.env.NODE_ENV})`);
});
