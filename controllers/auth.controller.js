const bcrypt = require("bcryptjs");
const connection = require("../db/connection");

exports.register = async (req, res) => {
    const { nombre, email, clave } = req.body;
    if (!nombre || !email || !clave) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await connection.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(clave, 10);

        // Guardar el usuario en la base de datos
        const [result] = await connection.query(
            'INSERT INTO usuarios (nombre, email, clave, id_rol) values(?, ?, ?, ?)',
            [nombre, email, hashedPassword, 2]
        )

        res.status(201).json({ message: "Usuario registrado exitosamente", id_usuario: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await connection.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = rows[0];

        // Comparar la contraseña hasheada
        const passwordMatch = await bcrypt.compare(password, user.clave);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Guardar usuario en la sesión (sin la contraseña por seguridad)
        req.session.user = { id: user.id_usuario, nombre: user.nombre, email: user.email, rol: user.id_rol, familia: user.id_familia };

        res.json({ message: "Inicio de sesión exitoso", user: req.session.user });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Error al cerrar sesión" });
        res.clearCookie("connect.sid");
        res.json({ message: "Sesión cerrada" });
    });
};

exports.getSession = (req, res) => {
    if (req.session.user) {
        res.json({ session: req.session.user });
    } else {
        res.status(401).json({ message: "No hay sesión activa" });
    }
};
