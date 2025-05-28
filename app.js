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
    'https://erikcaballeroh.github.io' // ← Sin barra final ni rutas
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

// ... (el resto de tu código de rutas y servidor)