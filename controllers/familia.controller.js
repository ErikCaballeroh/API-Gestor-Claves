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
    try {
        const { nombre, jefe } = req.params;
        const [rows] = connection.query('INSERT INTO familias (nombre_familia, id_jefe) values(?, ?)', [nombre, jefe]);
        
    } catch (err) {

    }
}