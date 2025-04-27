const express = require('express');
const router = express.Router();
const familiasController = require('../controllers/familias.controller');

// Definir las rutas y asociarlas con los controladores
router.get('/', familiasController.getAllFamilias);
router.get('/claves', familiasController.getClavesFamilia);
router.get('/:id', familiasController.getFamiliaById);
router.post('/', familiasController.createFamilia);
router.put('/:id', familiasController.updateFamilia);
router.delete('/:id', familiasController.deleteFamilia);

module.exports = router;
