require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');

const app = express();

// 🛠️ CORS configurado correctamente
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://frontend-gestor-claves.netlify.app',
    'https://erikcaballeroh.github.io',
    'https://gestor-claves-front-production.up.railway.app' // ← Sin barra final ni rutas
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ← Añade OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para leer JSON
app.use(express.json());

// Configuración de sesiones (arreglada)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60,
        sameSite: 'none',
        secure: true,
        httpOnly: true,
        // domain: 'api-gestor-claves.up.railway.app' // ← ¡Elimina esto o usa '.railway.app'!
    }
}));

// Manejar preflight OPTIONS para todas las rutas
app.options('*', cors()); // ← Esto es crucial

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
