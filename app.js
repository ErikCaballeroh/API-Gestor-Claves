require('dotenv').config();

const express = require('express');
const session = require('express-session');

const app = express();
const authRoutes = require('./routes/auth.routes');
const clavesRoutes = require('./routes/claves.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const familiasRoutes = require('./routes/familias.routes');
const invitacionesRoutes = require('./routes/invitaciones.routes');
const rolesRoutes = require('./routes/roles.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

app.use(express.json());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }
}))

// Usar las rutas con el prefijo /api/ruta
app.use('/api/auth', authRoutes);
app.use('/api/claves', clavesRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/familias', familiasRoutes);
app.use('/api/invitaciones', invitacionesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/usuarios', usuariosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
