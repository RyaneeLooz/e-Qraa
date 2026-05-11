const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const upload = require('../config/multer');

// All routes here require authentication
router.use(auth);

// Profile management
const profileValidation = [
  body('name').optional().notEmpty().withMessage('Le nom ne peut pas être vide').trim().escape(),
  body('bio').optional().trim().escape(),
  body('university').optional().trim().escape(),
  body('specialty').optional().trim().escape(),
  validate
];

router.get('/profile', userController.getProfile);
router.put('/profile', profileValidation, userController.updateProfile);
router.post('/avatar', upload.single('avatar'), userController.uploadAvatar);

// Update my coins (Exemple : via un code promo)
router.post('/add-coins', userController.updateCoins);

// Exemple de route protégée par rôle : seul un admin peut voir tous les utilisateurs
router.get('/admin/all', checkRole(['admin']), async (req, res) => {
  const db = require('../config/db');
  const result = await db.query('SELECT id, name, email, role FROM users');
  res.json(result.rows);
});

// Admin: Manage instructors
router.get('/admin/pending-instructors', checkRole(['admin']), userController.getPendingInstructors);
router.put('/admin/verify-instructor/:instructorId', checkRole(['admin']), userController.verifyInstructor);

module.exports = router;
