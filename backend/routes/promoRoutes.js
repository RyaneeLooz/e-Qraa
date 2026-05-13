const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.use(auth);

// Admin: Manage promos
router.get('/', checkRole(['admin']), promoController.getPromos);
router.post('/', checkRole(['admin']), promoController.createPromo);

// Student: Use promo
router.post('/use', promoController.usePromo);

module.exports = router;
