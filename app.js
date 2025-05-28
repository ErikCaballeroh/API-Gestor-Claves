require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');

const app = express();

// 🛠️ CORS configurado para Live Server con cookies
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://frontend-gestor-claves.netlify.app/'], // Acepta ambos
    credentials: true // Permite enviar cookies desde el navegador
}));

// Middleware para leer JSON
app.use(express.json());

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hora
        sameSite: 'none', // Obligatorio para cross-origin (Railway es HTTPS)
        secure: true, // Obligatorio con sameSite='none'
        httpOnly: true, // Seguridad contra XSS
        domain: 'api-gestor-claves.up.railway.app' // ← ¡Dominio exacto de tu API!
    }
}));

// Importar rutas
const {
    authRoutes,
    clavesRoutes,
    categoriasRoutes,
    familiasRoutes,
    invitacionesRoutes,
    rolesRoutes,
    usuariosRoutes,
} = require('./routes');

// Importar middlewares
const {
    auth,
    checkRole,
} = require('./middlewares');

// Usar las rutas con el prefijo /api
app.use('/api/auth', authRoutes);
app.use('/api/claves', auth, clavesRoutes);
app.use('/api/categorias', auth, categoriasRoutes);
app.use('/api/familias', auth, familiasRoutes);
app.use('/api/invitaciones', auth, invitacionesRoutes);
app.use('/api/roles', auth, checkRole(1), rolesRoutes);
app.use('/api/usuarios', auth, checkRole(1), usuariosRoutes);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
