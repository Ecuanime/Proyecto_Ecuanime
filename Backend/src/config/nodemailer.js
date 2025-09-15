// src/config/nodemailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Servidor SMTP de Gmail
    port: 587,
    secure: false, // true para 465, false para otros puertos (como 587 con STARTTLS)
    auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico (desde .env)
        pass: process.env.EMAIL_PASSWORD // Tu contraseña de aplicación de Gmail (desde .env)
    }
});

// Opcional: Verifica la conexión al inicio del servidor
transporter.verify(function(error, success) {
    if (error) {
        console.error("❌ Error al conectar con el servidor de correo:", error.message);
        // Si necesitas un error más específico para Gmail:
        if (error.code === 'EENVELOPE' || error.responseCode === 535) {
             console.error("Posible problema: Revisa EMAIL_USER y EMAIL_PASSWORD. Asegúrate de usar una contraseña de aplicación para Gmail.");
        }
    } else {
        console.log("✅ Servidor de correo listo para enviar mensajes");
    }
});

export default transporter;