const connection = require('../db/connection');

exports.getAllClaves = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM claves');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getClaveById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await connection.query('SELECT * FROM claves WHERE id_clave = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createClave = async (req, res) => {
    try {
        const { nombre, sitio, clave, categoria, compartir } = req.body;
        if (!nombre || !sitio || !clave || !categoria || !compartir) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }
        const [result] = await connection.query(
            'INSERT INTO claves (nombre_clave, sitio, clave, id_categoria, compartir, id_usuario) VALUES (?, ?, ?, ?, ?,1)',
            [nombre, sitio, clave, categoria, compartir]
        );
        res.status(201).json({ id: result.insertId, nombre, sitio, clave, categoria, compartir });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateClave = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: 'Se requieren name y description para actualizar' });
        }
        const [result] = await connection.query(
            'UPDATE items SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item no encontrado' });
        }
        res.json({ message: 'Item actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteClave = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.query('DELETE FROM claves WHERE id_clave = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
