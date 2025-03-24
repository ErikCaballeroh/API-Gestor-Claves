const connection = require('../db/connection');

exports.getAllUsuarios = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await connection.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(rows[0])
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