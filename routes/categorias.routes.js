const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.controller');
const { checkRole } = require('../middlewares');

// Definir las rutas y asociarlas con los controladores
router.get('/', categoriasController.getAllCategorias);
router.get('/:id', categoriasController.getCategoriaById);
router.post('/', checkRole(1), categoriasController.createCategoria);
router.put('/:id', checkRole(1), categoriasController.updateCategoria);
router.delete('/:id', checkRole(1), categoriasController.deleteCategoria);

module.exports = router;