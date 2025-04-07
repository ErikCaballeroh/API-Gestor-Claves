const connection = require('../db/connection');

exports.getAllClaves = async (req, res) => {
    const { user } = req.session;

    try {
        let rows;

        if (user.rol === 1) {
            [rows] = await connection.query('SELECT * FROM claves');
        } else {
            [rows] = await connection.query('SELECT * FROM claves WHERE id_usuario = ?', [user.id]);
        }

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getClaveById = async (req, res) => {
    const { id } = req.params;
    const { user } = req.session;

    try {
        const [rows] = await connection.query(
            'SELECT * FROM claves WHERE id_clave = ? AND id_usuario = ?',
            [id, user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado o no autorizado' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createClave = async (req, res) => {
    const { user } = req.session;

    try {
        const { nombre, sitio, clave, categoria, compartir } = req.body;
        if (!nombre || !sitio || !clave || !categoria || !compartir) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }
        const [result] = await connection.query(
            'INSERT INTO claves (nombre_clave, sitio, clave, id_categoria, compartir, id_usuario) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, sitio, clave, categoria, compartir, user.id]
        );
        res.status(201).json({ id: result.insertId, nombre, sitio, clave, categoria, compartir, usuario: user.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateClave = async (req, res) => {
    const { user } = req.session;

    try {
        const { id } = req.params;
        const { nombre, sitio, clave, categoria, compartir } = req.body;
        if (!nombre || !sitio || !clave || !categoria || !compartir) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }
        const [result] = await connection.query(
            'UPDATE claves SET nombre_clave = ?, sitio = ?, clave = ?, id_categoria = ?, compartir = ? WHERE id_clave = ? and id_usuario = ?',
            [nombre, sitio, clave, categoria, compartir, id, user.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Clave no encontrada o no autorizada' });
        }
        res.json({ message: 'Clave actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteClave = async (req, res) => {
    const { user } = req.session;

    try {
        const { id } = req.params;
        const [result] = await connection.query('DELETE FROM claves WHERE id_clave = ? and id_usuario = ?', [id, user.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado o no autorizado' });
        }
        res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
