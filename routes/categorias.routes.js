const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.controller');

// Definir las rutas y asociarlas con los controladores
router.get('/', categoriasController.getAllCategorias);
router.get('/:id', categoriasController.getCategoriaById);
router.post('/', categoriasController.createCategoria);
router.put('/:id', categoriasController.updateCategoria);
router.delete('/:id', categoriasController.deleteCategoria);

module.exports = router;
