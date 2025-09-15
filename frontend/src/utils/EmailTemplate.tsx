"use client"

const EmailTemplate = (userName: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Catálogo de Productos</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f7f7f7;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background-color: #000000;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .logo {
          max-width: 200px;
          margin-bottom: 20px;
        }
        .content {
          padding: 30px 20px;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #ff4500;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          margin: 20px 0;
        }
        .catalog-preview {
          border: 1px solid #eee;
          border-radius: 8px;
          margin: 20px 0;
          overflow: hidden;
        }
        .catalog-preview img {
          width: 100%;
          height: auto;
          display: block;
        }
        h1 {
          color: #ff4500;
          margin-top: 0;
        }
        p {
          margin-bottom: 15px;
        }
        .divider {
          height: 1px;
          background-color: #eee;
          margin: 30px 0;
        }
        .social-icons {
          margin-top: 20px;
        }
        .social-icons a {
          display: inline-block;
          margin: 0 10px;
          color: #333;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://placehold.co/200x60/000000/FFFFFF?text=FASHION+STORE" alt="Logo" class="logo">
          <h2>¡Gracias por registrarte!</h2>
        </div>
        <div class="content">
          <h1>Hola ${userName},</h1>
          <p>Nos complace darte la bienvenida a nuestra familia de clientes mayoristas. Estamos entusiasmados de tener la oportunidad de ser tu proveedor de confianza para productos de moda.</p>
          
          <p>Como agradecimiento por tu registro, te enviamos nuestro catálogo completo con todos los productos disponibles actualmente.</p>
          
          <div class="catalog-preview">
            <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixli b=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Catálogo Preview">
          </div>
          
          <p>Nuestro catálogo incluye:</p>
          <ul>
            <li>Ropa para dama - últimas tendencias</li>
            <li>Colección de caballero</li>
            <li>Moda infantil</li>
            <li>Accesorios y complementos</li>
            <li>Lista de precios mayoristas actualizada</li>
          </ul>
          
          <a href="#" class="button">VER CATÁLOGO COMPLETO</a>
          
          <div class="divider"></div>
          
          <p>Si tienes alguna pregunta o necesitas asesoría personalizada, no dudes en contactarnos:</p>
          <ul>
            <li>WhatsApp: +57 314 265 4760</li>
            <li>Email: ventas@tuempresa.com</li>
            <li>Teléfono: +57 300 123 4567</li>
          </ul>
          
          <p>¡Esperamos construir una relación comercial duradera y exitosa!</p>
          
          <p>Saludos cordiales,<br>El equipo de Fashion Store</p>
          
          <div class="social-icons">
            <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="#">Twitter</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Fashion Store. Todos los derechos reservados.</p>
          <p>Calle Principal #123, Bogotá, Colombia</p>
          <p>Si no deseas recibir más correos, puedes <a href="#">darte de baja</a>.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export default EmailTemplate
