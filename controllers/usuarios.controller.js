const CryptoJS = require("crypto-js");
const connection = require("../db/connection");
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.getAllUsuarios = async (req, res) => {
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
        `);

        const usuarios = rows.map(u => {
            const decryptedPassword = CryptoJS.AES.decrypt(u.clave, SECRET_KEY).toString(CryptoJS.enc.Utf8);

            return {
                id_usuario: u.id_usuario,
                nombre: u.nombre,
                email: u.email,
                clave: decryptedPassword,
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

        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getUsuarioById = async (req, res) => {
    const { id } = req.params;

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
            WHERE u.id_usuario = ?
        `, [id]);

        const usuarios = rows.map(u => {
            const decryptedPassword = CryptoJS.AES.decrypt(u.clave, SECRET_KEY).toString(CryptoJS.enc.Utf8);

            return {
                id_usuario: u.id_usuario,
                nombre: u.nombre,
                email: u.email,
                clave: decryptedPassword,
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

exports.createUsuario = async (req, res) => {
    try {
        const { nombre, email, clave, id_rol, id_familia } = req.body;
        if (!nombre || !email || !clave || !id_rol || !id_familia) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }
        const [result] = await connection.query(
            'INSERT INTO usuarios (nombre, email, clave, id_rol, id_familia) values(?, ?, ?, ?, ?)',
            [nombre, email, clave, id_rol, id_familia]
        )
        res.status(201).json({ id: result.insertId, nombre, email, clave, id_rol, id_familia });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, clave, id_rol, id_familia } = req.body;
        if (!nombre || !email || !clave || !id_rol || !id_familia) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }
        const [result] = await connection.query(
            'UPDATE usuarios SET nombre = ?, email = ?, clave = ?, id_rol = ?, id_familia = ? WHERE id_usuario = ?',
            [nombre, email, clave, id_rol, id_familia, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}