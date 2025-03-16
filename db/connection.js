// db.js (con promesas)
const mysql = require('mysql2/promise'); // Usa la versión con soporte para promesas

const connection = mysql.createPool({
    host: 'localhost',     // Dirección del servidor MySQL
    user: 'root',          // Usuario de la base de datos
    password: '', // Contraseña del usuario
    database: 'gestor_claves', // Nombre de la base de datos
    port: 3306,            // Puerto de MySQL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;