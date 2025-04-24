const connection = require('../db/connection');

exports.getAllClaves = async (req, res) => {
    const { user } = req.session;
    let rows;

    try {
        if (user.rol.id === 1) {
            [rows] = await connection.query(`
                SELECT 
                    cla.*,
                    cat.id_categoria,
                    cat.nombre_categoria  
                FROM claves cla
                LEFT JOIN categorias cat ON cla.id_categoria = cat.id_categoria
            `);
        } else {
            [rows] = await connection.query(`
                SELECT 
                    cla.*,
                    cat.id_categoria, 
                    cat.nombre_categoria  
                FROM claves cla
                LEFT JOIN categorias cat ON cla.id_categoria = cat.id_categoria
                WHERE cla.id_usuario = ?
                `, [user.id]
            );
        }

        const claves = rows.map(clave => ({
            id_clave: clave.id_clave,
            nombre_clave: clave.nombre_clave,
            sitio: clave.sitio,
            usuario: clave.usuario,
            clave: clave.clave,
            categoria: {
                id: clave.id_categoria,
                nombre: clave.nombre_categoria
            },
            compartir: clave.compartir,
            id_usuario: clave.id_usuario,
        }));

        res.json(claves);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getClaveById = async (req, res) => {
    const { id } = req.params;
    const { user } = req.session;

    try {
        [rows] = await connection.query(`
            SELECT 
                cla.* ,
                cat.id_categoria, 
                cat.nombre_categoria  
            FROM claves cla
            LEFT JOIN categorias cat ON cla.id_categoria = cat.id_categoria
            WHERE cla.id_clave = ? AND cla.id_usuario = ?
            `, [id, user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado o no autorizado' });
        }

        const claves = rows.map(clave => ({
            id_clave: clave.id_clave,
            nombre_clave: clave.nombre_clave,
            sitio: clave.sitio,
            usuario: clave.usuario,
            clave: clave.clave,
            categoria: {
                id: clave.id_categoria,
                nombre: clave.nombre_categoria
            },
            compartir: clave.compartir,
            id_usuario: clave.id_usuario,
        }));

        res.json(claves[0]);
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
    const { id } = req.params;
    const { nombre, sitio, clave, categoria, compartir } = req.body;
    let result;

    if (!nombre || !sitio || !clave || !categoria || compartir === null) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        if (user.rol.id === 1) {
            [result] = await connection.query(
                'UPDATE claves SET nombre_clave = ?, sitio = ?, clave = ?, id_categoria = ?, compartir = ? WHERE id_clave = ?',
                [nombre, sitio, clave, categoria, compartir, id]
            );
        } else {
            [result] = await connection.query(
                'UPDATE claves SET nombre_clave = ?, sitio = ?, clave = ?, id_categoria = ?, compartir = ? WHERE id_clave = ? AND id_usuario = ?',
                [nombre, sitio, clave, categoria, compartir, id, user.id]
            );
        }

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
