const checkRole = (...rolesPermitidos) => {
    return (req, res, next) => {
        const usuario = req.session.user;

        if (!usuario) {
            return res.status(401).json({ message: "No autenticado" });
        }

        if (!rolesPermitidos.includes(usuario.rol.id)) {
            return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
        }

        next();
    };
};

module.exports = checkRole;