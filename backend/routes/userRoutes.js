const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

const upload = require('../config/multer');

// All routes here require authentication
router.use(auth);

// Profile management
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
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
