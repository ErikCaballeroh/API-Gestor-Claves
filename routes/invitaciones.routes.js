const express = require('express');
const router = express.Router();
const invitacionesController = require('../controllers/invitaciones.controller');

// Definir las rutas y asociarlas con los controladores
router.get('/', invitacionesController.getAllInvitaciones);
router.get('/:id', invitacionesController.getInvitacionById);
router.post('/', invitacionesController.createInvitacion);
router.post('/aceptar/:token', invitacionesController.aceptarInvitacion);
router.put('/:id', invitacionesController.updateInvitacion);
router.delete('/:id', invitacionesController.deleteInvitacion);

module.exports = router;
