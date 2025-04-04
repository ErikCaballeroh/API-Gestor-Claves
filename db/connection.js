require('dotenv').config(); // Cargar variables de entorno
const mysql = require('mysql2/promise'); // Usa la versión con soporte para promesas
const fs = require('fs');
const path = require('path');

// Crear el pool de conexiones
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

async function initializeDatabase() {
    try {
        const sqlPath = path.join(__dirname, 'db_gestor.sql'); // Cambia la ruta según corresponda
        const sql = fs.readFileSync(sqlPath, 'utf8');

        const conn = await connection.getConnection();
        await conn.query(sql);
        conn.release();

        console.log('✅ Base de datos creada o reiniciada exitosamente.');
    } catch (err) {
        console.error('❌ Error al inicializar la base de datos:', err.message);
    }
}

// Ejecutar la inicialización de la base de datos al arrancar el servidor
initializeDatabase();

module.exports = connection;
