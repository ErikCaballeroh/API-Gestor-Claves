const express = require('express');
const router = express.Router();
const clavesController = require('../controllers/claves.controller');

// Definir las rutas y asociarlas con los controladores
router.get('/', clavesController.getAllClaves);
router.get('/:id', clavesController.getClaveById);
router.post('/', clavesController.createClave);
router.put('/:id', clavesController.updateClave);
router.delete('/:id', clavesController.deleteClave);

module.exports = router;
