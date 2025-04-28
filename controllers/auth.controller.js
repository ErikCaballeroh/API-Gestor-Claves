const CryptoJS = require("crypto-js");
const connection = require("../db/connection");
require('dotenv').config();

// Clave secreta para cifrar y descifrar (guárdala en variables de entorno en producción)
const SECRET_KEY = process.env.SECRET_KEY;

exports.register = async (req, res) => {
    const { nombre, email, clave } = req.body;
    if (!nombre || !email || !clave) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }
    console.log(req.body);

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await connection.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // Encriptar la contraseña con AES
        const encryptedPassword = CryptoJS.AES.encrypt(clave, SECRET_KEY).toString();

        // Guardar el usuario en la base de datos
        const [result] = await connection.query(
            'INSERT INTO usuarios (nombre, email, clave, id_rol) values(?, ?, ?, ?)',
            [nombre, email, encryptedPassword, 2]
        );

        res.status(201).json({ message: "Usuario registrado exitosamente", id_usuario: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await connection.query(`
            SELECT 
                u.*, 
                r.nombre_rol as rol_nombre, 
                f.nombre_familia as familia_nombre 
            FROM usuarios u
            LEFT JOIN roles r ON u.id_rol = r.id_rol
            LEFT JOIN familias f ON u.id_familia = f.id_familia
            WHERE u.email = ?
        `, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = rows[0];

        // Desencriptar la contraseña
        const decryptedPassword = CryptoJS.AES.decrypt(user.clave, SECRET_KEY).toString(CryptoJS.enc.Utf8);

        if (password !== decryptedPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const rol = {
            id: user.id_rol,
            nombre: user.rol_nombre
        };

        const familia = user.id_familia ? {
            id: user.id_familia,
            nombre: user.familia_nombre
        } : null;

        req.session.user = {
            id: user.id_usuario,
            nombre: user.nombre,
            email: user.email,
            rol: rol,
            familia: familia
        };

        res.json({ message: "Inicio de sesión exitoso", user: req.session.user });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Error al cerrar sesión" });
        res.clearCookie("connect.sid");
        res.json({ message: "Sesión cerrada" });
    });
};

exports.getSession = (req, res) => {
    if (req.session.user) {
        res.json({ session: req.session.user });
    } else {
        res.status(401).json({ message: "No hay sesión activa" });
    }
};

exports.getUsuarioByCorreo = async (req, res) => {
    const { correo } = req.params;

    try {
        const [rows] = await connection.query(`
            SELECT 
                u.id_usuario,
                u.nombre,
                u.email,
                u.clave,
                r.id_rol,
                r.nombre_rol,
                f.id_familia,
                f.nombre_familia,
                f.id_jefe
            FROM usuarios u 
            LEFT JOIN roles r ON u.id_rol = r.id_rol
            LEFT JOIN familias f ON u.id_familia = f.id_familia
            WHERE u.email = ?
        `, [correo]);

        const usuarios = rows.map(u => {
            const decryptedPassword = CryptoJS.AES.decrypt(u.clave, SECRET_KEY).toString(CryptoJS.enc.Utf8);

            return {
                id_usuario: u.id_usuario,
                nombre: u.nombre,
                email: u.email,
                rol: {
                    id: u.id_rol,
                    nombre: u.nombre_rol,
                },
                familia: {
                    id: u.id_familia,
                    nombre: u.nombre_familia,
                    jefe: u.id_jefe,
                }
            }
        });
        res.json(usuarios[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}