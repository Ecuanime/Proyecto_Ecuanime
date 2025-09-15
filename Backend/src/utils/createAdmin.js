import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import connectDB from '../config/db.js';

// Cargar variables de entorno
dotenv.config();

// Función para crear admin
const createAdmin = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Verificar si ya existe un admin
    const adminExists = await User.findOne({ email: 'admin@ecuanimemoda.com' });
    
    if (adminExists) {
      console.log('El administrador ya existe');
    } else {
      // Crear admin
      const admin = await User.create({
        name: 'Administrador',
        email: 'admin@ecuanimemoda.com',
        password: 'admin123456',
        role: 'admin'
      });
      
      console.log('Administrador creado:', admin);
    }
    
    // Cerrar conexión
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
  }
};

// Ejecutar función
createAdmin();