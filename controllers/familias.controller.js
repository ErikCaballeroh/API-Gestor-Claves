const connection = require('../db/connection');

exports.getAllFamilias = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM familias');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getFamiliaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await connection.query('SELECT * FROM familias where id_familia = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createFamilia = async (req, res) => {
    const { nombre } = req.body;
    const userId = req.session.user.id;
    if (!nombre) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const [result] = await connection.query('INSERT INTO familias (nombre_familia, id_jefe) values(?, ?)', [nombre, userId]);
        res.status(201).json({ id: result.insertId, nombre, jefe: userId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateFamilia = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, jefe } = req.body;
        if (!nombre || !jefe) {
            return res.status(400).json({ message: 'Se requieren nombre y jefe para actualizar' });
        }
        const [result] = await connection.query(
            'UPDATE familias SET nombre_familia = ?, id_jefe = ? WHERE id_familia = ?',
            [nombre, jefe, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Familia no encontrada' });
        }
        res.json({ message: 'Familia actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteFamilia = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.query('DELETE FROM familias WHERE id_familia = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

