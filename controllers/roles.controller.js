const connection = require('../db/connection');

exports.getAllRoles = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM roles');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getRolById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await connection.query('SELECT * FROM roles WHERE id_rol = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Role no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createRol = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }
        const [result] = await connection.query('INSERT INTO roles (nombre_rol) VALUES (?)', [nombre]);
        res.status(201).json({ id: result.insertId, nombre });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ message: 'Se requieren todos los campos para actualizar' });
        }

        const [result] = await connection.query(
            'UPDATE roles SET nombre_rol = ? WHERE id_rol = ?', [nombre, id]
        )
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' })
        }
        res.json({ message: 'Rol actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteRol = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.query('DELETE FROM roles WHERE id_rol = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json({ message: 'Rol eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}