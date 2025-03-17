const connection = require('../db/connection');
const crypto = require('crypto');

exports.getAllInvitaciones = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM invitaciones');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getInvitacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await connection.query('SELECT * FROM invitaciones WHERE id_invitacion = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Invitación no encontrada' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createInvitacion = async (req, res) => {
    try {
        const { id_familia, fecha_vencimiento } = req.body;
        if (!id_familia || !fecha_vencimiento) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }

        // Generar un token único
        const token = crypto.randomBytes(32).toString('hex');

        const [result] = await connection.query(
            'INSERT INTO invitaciones (id_familia, token, fecha_vencimiento) VALUES (?, ?, ?)',
            [id_familia, token, fecha_vencimiento]
        );
        res.status(201).json({ id: result.insertId, id_familia, token, fecha_vencimiento });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateInvitacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_familia, fecha_vencimiento } = req.body;
        if (!id_familia || !fecha_vencimiento) {
            return res.status(400).json({ message: 'Se requieren todos los campos para actualizar' });
        }
        const [result] = await connection.query(
            'UPDATE invitaciones SET id_familia = ?, fecha_vencimiento = ? WHERE id_invitacion = ?',
            [id_familia, fecha_vencimiento, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Invitación no encontrada' });
        }
        res.json({ message: 'Invitación actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteInvitacion = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.query('DELETE FROM invitaciones WHERE id_invitacion = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Invitación no encontrada' });
        }
        res.json({ message: 'Invitación eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
