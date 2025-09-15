// src/controllers/authController.js
import User from '../models/userModel.js'; // Asegúrate de la ruta correcta a tu modelo User
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto'; // Módulo nativo de Node.js para generar tokens
import transporter from '../config/nodemailer.js'; // <<-- Importa tu transporter de Nodemailer
import dotenv from 'dotenv';

dotenv.config();

// Elimina esta parte:
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Público
export const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Credenciales inválidas');
    }
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Público
export const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('El usuario ya existe');
    }

    const user = await User.create({
        name,
        email,
        password,
        phone
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Datos de usuario inválidos');
    }
};

// @desc    Obtener perfil de usuario
// @route   GET /api/auth/profile
// @access  Privado
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            region: user.region,
            storeName: user.storeName
        });
    } else {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/auth/profile
// @access  Privado
export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.region = req.body.region || user.region;
        user.storeName = req.body.storeName || user.storeName;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            region: updatedUser.region,
            storeName: updatedUser.storeName,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }
};

// @desc    Solicitar recuperación de contraseña
// @route   POST /api/auth/forgot-password
// @access  Público
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No existe un usuario con ese correo electrónico.' });
        }

        // Generar token único (sin hashear aquí, el hash se guarda en la DB)
        const resetToken = crypto.randomBytes(32).toString('hex'); // Usar 32 bytes para un token más largo y seguro

        // Guardar token hasheado en la base de datos y la expiración
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de validez

        await user.save();

        // URL de restablecimiento (frontend)
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; // Asegúrate de usar el token sin hashear aquí

        // Contenido del correo
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER, // Usar la variable de entorno
            subject: 'Recuperación de contraseña para Ecuanimemoda',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Recuperación de contraseña Ecuanimemoda</h2>
                    <p>Hola ${user.name || 'usuario'},</p>
                    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                    <p>
                        <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                            Restablecer contraseña
                        </a>
                    </p>
                    <p>Este enlace expirará en 1 hora.</p>
                    <p>Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>
                    <p>Saludos,<br>El equipo de Ecuanimemoda</p>
                </div>
            `
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.' });
    } catch (error) {
        console.error('Error en forgotPassword:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud de recuperación de contraseña.' });
    }
};

// @desc    Restablecer contraseña
// @route   POST /api/auth/reset-password/:token
// @access  Público
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Hash el token recibido para buscarlo en la DB
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        // Buscar usuario con token válido y no expirado
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido o expirado.' });
        }

        // Establecer nueva contraseña
        user.password = password; // El middleware `pre('save')` del modelo se encargará de hashear

        // Limpiar el token y la expiración después de usarlo
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        // Enviar correo de confirmación
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER, // Usar la variable de entorno
            subject: 'Tu contraseña ha sido cambiada para Ecuanimemoda',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Cambio de contraseña exitoso Ecuanimemoda</h2>
                    <p>Hola ${user.name || 'usuario'},</p>
                    <p>Tu contraseña ha sido cambiada exitosamente.</p>
                    <p>Si no realizaste este cambio, por favor contacta inmediatamente con nuestro equipo de soporte.</p>
                    <p>Saludos,<br>El equipo de Ecuanimemoda</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        console.error('Error en resetPassword:', error);
        res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
};