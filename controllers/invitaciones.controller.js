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
    const familiaId = req.session.user.familia.id;

    try {
        const { fecha_vencimiento } = req.body;
        if (!fecha_vencimiento) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }

        // Generar un token único
        const token = crypto.randomBytes(32).toString('hex');

        const [result] = await connection.query(
            'INSERT INTO invitaciones (id_familia, token, fecha_vencimiento) VALUES (?, ?, ?)',
            [familiaId, token, fecha_vencimiento]
        );
        res.status(201).json({ id: result.insertId, familia: familiaId, token, fecha_vencimiento });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.aceptarInvitacion = async (req, res) => {
    try {
        const { token } = req.params;
        const userId = req.session.user.id; // Suponiendo que estás usando un middleware de autenticación y el ID del usuario está en req.user

        // Buscar la invitación por token
        const [rows] = await connection.query(
            'SELECT * FROM invitaciones WHERE token = ?',
            [token]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Invitación no válida' });
        }

        const invitacion = rows[0];

        // Verificar si la invitación está vencida
        const ahora = new Date();
        const vencimiento = new Date(invitacion.fecha_vencimiento);
        if (vencimiento < ahora) {
            return res.status(400).json({ message: 'La invitación ha expirado' });
        }

        // Agregar al usuario a la familia
        await connection.query(
            'UPDATE usuarios SET id_familia = ? WHERE id_usuario = ?',
            [invitacion.id_familia, userId]
        );

        const [familias] = await connection.query(
            'SELECT * FROM familias WHERE id_familia = ?', [invitacion.id_familia]
        )

        const familia = familias[0];

        req.session.user.familia = {
            id: familia.id_familia,
            nombre: familia.nombre_familia,
        };

        // Eliminar la invitación para que no se pueda usar de nuevo (opcional)
        await connection.query(
            'DELETE FROM invitaciones WHERE token = ?',
            [token]
        );

        res.json({ message: 'Te has unido exitosamente a la familia' });
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
