const express = require('express');
const app = express();
const clavesRoutes = require('./routes/claves.routes');
const categoriasRoutes = require('./routes/categorias.routes');

app.use(express.json());

// Usar las rutas de "claves" con el prefijo /api/claves
app.use('/api/claves', clavesRoutes);
app.use('/api/categorias', categoriasRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
