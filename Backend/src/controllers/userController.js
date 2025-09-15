import User from '../models/userModel.js';
import nodemailer from 'nodemailer';

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Privado/Admin
export const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password -resetPasswordToken -resetPasswordExpires');
  res.json(users);
};

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Privado/Admin
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpires');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
};

// @desc    Crear un nuevo usuario (por admin)
// @route   POST /api/users
// @access  Privado/Admin
export const createUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('El usuario ya existe');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'user'
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  } else {
    res.status(400);
    throw new Error('Datos de usuario inválidos');
  }
};

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Privado/Admin
export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.region = req.body.region || user.region;
    user.storeName = req.body.storeName || user.storeName;
    
    if (req.body.role) {
      user.role = req.body.role;
    }
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      region: updatedUser.region,
      storeName: updatedUser.storeName,
      role: updatedUser.role
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Privado/Admin
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    await user.deleteOne();
    res.json({ message: 'Usuario eliminado' });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
};

// @desc    Enviar mensaje de bienvenida
// @route   POST /api/users/:id/welcome
// @access  Privado/Admin
export const sendWelcomeEmail = async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  
  try {
    // Contenido del correo
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: '¡Bienvenido a nuestra plataforma!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">¡Bienvenido/a ${user.name}!</h2>
          <p>Gracias por registrarte en nuestra plataforma.</p>
          <p>Tu cuenta ha sido creada exitosamente y ya puedes comenzar a utilizar todos nuestros servicios.</p>
          <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
          <p>Saludos,<br>El equipo de soporte</p>
        </div>
      `
    };
    
    // Enviar correo
    await transporter.sendMail(mailOptions);
    
    // Marcar como bienvenido
    user.isWelcomed = true;
    await user.save();
    
    res.status(200).json({ message: 'Mensaje de bienvenida enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar mensaje de bienvenida:', error);
    res.status(500);
    throw new Error('Error al enviar mensaje de bienvenida');
  }
};

// @desc    Obtener usuarios recientes (últimos 7 días)
// @route   GET /api/users/recent
// @access  Privado/Admin
export const getRecentUsers = async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const users = await User.find({
    createdAt: { $gte: oneWeekAgo }
  }).select('-password -resetPasswordToken -resetPasswordExpires');
  
  res.json(users);
};