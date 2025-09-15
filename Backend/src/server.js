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
import catalogRoutes from './routes/catalogRoutes.js';


// 1. Carga variables de entorno y conecta a MongoDB
dotenv.config();
connectDB();

const app = express();

// Middlewares esenciales que no dependen de CORS para todas las rutas
app.use(express.json()); // Para parsear JSON en las solicitudes

// 2. Configuración de CORS
// Define la whitelist de orígenes permitidos
const whitelist = (process.env.CORS_ORIGIN || '').split(',').map(origin => origin.trim()).filter(Boolean);

// Si estás en desarrollo, permite cualquier origen para facilitar las pruebas locales.
// También puedes añadir aquí explícitamente 'http://localhost:PUERTO_DEL_FRONTEND_VITE'
if (process.env.NODE_ENV === 'development') {
  console.log('>>> Entorno de desarrollo: Permitiendo todos los orígenes para CORS.');
  // En desarrollo, podrías ser más permisivo o añadir tus URLs de desarrollo locales:
  // Ejemplo: whitelist.push('http://localhost:5173'); // Si tu frontend Vite corre en el puerto 5173
}

console.log('>>> Whitelist de CORS configurada:', whitelist);

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir solicitudes sin 'origin' (como las de Postman o scripts del mismo servidor, o mobile apps)
    // O si el origen está en la whitelist
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`>>> CORS Bloqueado: Origen '${origin}' no está en la whitelist.`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true, // Para permitir cookies y cabeceras de autorización
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Cabeceras permitidas
};

// Aplica CORS globalmente. Las rutas de API lo usarán.
// Las rutas de archivos estáticos y el catch-all del frontend se definirán DESPUÉS,
// por lo que esta política de CORS se aplicará principalmente a las rutas API.
// Si quieres que los archivos estáticos también tengan estas cabeceras CORS (útil si se sirven desde un CDN o subdominio diferente),
// este orden está bien. Si solo quieres CORS para las APIs, podrías aplicarlo selectivamente a las rutas API.
app.use(cors(corsOptions));

// 3. SERVIR EL FRONTEND REACT BUILD (Archivos Estáticos)
// Es crucial que esto venga ANTES de las rutas de API si quieres que las rutas base como '/' sirvan el index.html
// y no sean interceptadas por una posible ruta API catch-all (que no tienes, pero es buena práctica).
// Sin embargo, para el problema específico del 500 en assets, el orden de CORS era el culpable.
// Colocarlo aquí asegura que los assets no fallen por CORS si el `origin` está bien configurado.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

// DEBUG: Mantenemos tus logs, son útiles
console.log('>>> Ruta candidate frontendDist:', frontendDist);
console.log('>>> frontendDist existe?:', fs.existsSync(frontendDist));

if (fs.existsSync(frontendDist)) {
  console.log('>>> Contenido de frontendDist:', fs.readdirSync(frontendDist));
  const assetsDir = path.join(frontendDist, 'assets');
  console.log('>>> assets subdir existe?:', fs.existsSync(assetsDir));
  if (fs.existsSync(assetsDir)) {
    console.log('>>> Contenido de assets/:', fs.readdirSync(assetsDir));
  }

  // Servir archivos estáticos desde la carpeta 'dist' del frontend
  app.use(express.static(frontendDist));
} else {
  console.error('❌ No existe frontendDist en la ruta indicada. El frontend no se servirá.');
  // No abortes el servidor aquí si quieres que la API siga funcionando incluso si el frontend falla en el build.
  // process.exit(1); // Considera si realmente quieres que el backend muera si el frontend no está.
}

// 4. Monta tus rutas de API
// Estas rutas estarán sujetas a la política de CORS definida arriba.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catalog', catalogRoutes); 
app.get('/api/status', (req, res) =>
  res.json({
    status: 'success',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
);

// 5. Catch-all para servir el `index.html` del frontend (Debe ir DESPUÉS de las rutas API y estáticos)
// Esto es para que el enrutamiento del lado del cliente de React funcione correctamente.
if (fs.existsSync(frontendDist)) {
  app.get('*', (req, res) => {
    // Solo sirve index.html si la petición no es para una API y no es un archivo estático ya servido
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    } else {
      // Si es una ruta API no encontrada, deja que el middleware notFound lo maneje
      // Esto normalmente no se alcanzaría si notFound está después, pero es una salvaguarda.
      notFound(req, res, () => {}); // Llama a notFound explícitamente o pasa al siguiente
    }
  });
}

// 6. Middlewares de error (Deben ir al final)
app.use(notFound); // Para rutas no encontradas
app.use(errorHandler); // Para otros errores

// 7. Arranque del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en puerto ${PORT} (env: ${process.env.NODE_ENV})`)
);