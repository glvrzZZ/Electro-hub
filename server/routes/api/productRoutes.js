const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');

// Правильный путь к контроллеру
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById); // Исправлен путь

module.exports = router;