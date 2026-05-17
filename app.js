require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://frontend-gestor-claves.netlify.app',
    'https://erikcaballeroh.github.io',
    'https://gestor-claves-front-production.up.railway.app',
];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Necesario si estás detrás de un proxy como Railway
app.set('trust proxy', 1);

const isProduction = process.env.NODE_ENV === 'production';

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            ...(isProduction ? { domain: process.env.SESSION_COOKIE_DOMAIN } : {}),
        },
    })
);

// Si ya usas app.use(cors(corsOptions)), esto suele bastar.
// Si quieres conservar el preflight explícito, hazlo con las mismas opciones:
app.options('*', cors(corsOptions));

const {
    authRoutes,
    clavesRoutes,
    categoriasRoutes,
    familiasRoutes,
    invitacionesRoutes,
    rolesRoutes,
    usuariosRoutes,
} = require('./routes');

const { auth, checkRole } = require('./middlewares');

app.get('/api/', (_, res) => {
    res.send({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/claves', auth, clavesRoutes);
app.use('/api/categorias', auth, categoriasRoutes);
app.use('/api/familias', auth, familiasRoutes);
app.use('/api/invitaciones', auth, invitacionesRoutes);
app.use('/api/roles', auth, checkRole(1), rolesRoutes);
app.use('/api/usuarios', auth, checkRole(1), usuariosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});