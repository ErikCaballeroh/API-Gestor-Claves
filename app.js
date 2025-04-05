require('dotenv').config();

const express = require('express');
const session = require('express-session');

const app = express();

const {
    authRoutes,
    clavesRoutes,
    categoriasRoutes,
    familiasRoutes,
    invitacionesRoutes,
    rolesRoutes,
    usuariosRoutes,
} = require('./routes');

const {
    auth,
    checkRole,
} = require('./middlewares');

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }
}))

// Usar las rutas con el prefijo /api/ruta
app.use('/api/auth', authRoutes);
app.use('/api/claves', auth, clavesRoutes);
app.use('/api/categorias', auth, categoriasRoutes);
app.use('/api/familias', auth, familiasRoutes);
app.use('/api/invitaciones', auth, invitacionesRoutes);
app.use('/api/roles', auth, rolesRoutes);
app.use('/api/usuarios', auth, usuariosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
