const connection = require('../db/connection');

exports.getAllCategorias = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM categorias');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await connection.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }
        const [result] = await connection.query(
            'INSERT INTO categorias (nombre_categoria) VALUES (?)',
            [nombre]
        );
        res.status(201).json({ id: result.insertId, nombre });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ message: 'Datos incompletos para actualizar' });
        }
        const [result] = await connection.query(
            'UPDATE categorias SET nombre_categoria = ? WHERE id_categoria = ?',
            [nombre, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
