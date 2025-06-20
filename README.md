
---

## ✅ Opción 2 – HTML profesional con logo y enlace

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Ecuanime – Proyecto Landing Page</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"/>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #f7f7f7;
      padding: 2rem;
    }
    .header-logo {
      max-height: 80px;
    }
    .card {
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .btn-link {
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container text-center mb-4">
    <img src="https://ecuanimemoda.com/logo.png" alt="Ecuanime Logo" class="header-logo mb-3"/>
    <h1 class="fw-bold">Ecuanime – Landing Page Mayorista</h1>
    <p>Desarrollado por Juan Sebastian Bertel Marzola</p>
    <a href="https://ecuanimemoda.com/" class="btn btn-primary" target="_blank">🌐 Ir al sitio principal</a>
  </div>

  <div class="container">
    <div class="card p-4">
      <h3>🔧 Tecnologías Utilizadas</h3>
      <hr/>
      <h5>🔙 Backend – Node.js + Express</h5>
      <ul>
        <li>Express.js</li>
        <li>MongoDB (Mongoose)</li>
        <li>JWT, bcryptjs</li>
        <li>dotenv, nodemailer</li>
        <li>cors, crypto</li>
      </ul>

      <h5>🎨 Frontend – React + Vite</h5>
      <ul>
        <li>React 19, Vite</li>
        <li>Bootstrap 5, Swiper</li>
        <li>React Hook Form + Zod</li>
        <li>Recharts, jsPDF, React Icons</li>
      </ul>

      <h3 class="mt-4">📁 Estructura del Proyecto</h3>
      <pre><code>
/backend
  └── src/server.js
/frontend
  └── src/main.jsx
      </code></pre>

      <h3 class="mt-4">📩 Contacto</h3>
      <ul>
        <li><strong>Nombre:</strong> Juan Sebastian Bertel Marzola</li>
        <li><strong>Correo:</strong> stbmydp2@gmail.com</li>
        <li><strong>Teléfono:</strong> +57 320 528 9488</li>
      </ul>
    </div>
  </div>
</body>
</html>
