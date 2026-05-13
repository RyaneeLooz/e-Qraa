const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const upload = require('../config/multer');

// Public routes (No auth required)
router.get('/instructors', userController.getInstructors);
router.get('/leaderboard', userController.getLeaderboard);

// All routes below require authentication
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

// Admin routes
router.get('/admin/all', checkRole(['admin']), userController.getAllUsers);

// Admin: Manage instructors

// Admin: Manage instructors
router.get('/admin/pending-instructors', checkRole(['admin']), userController.getPendingInstructors);
router.put('/admin/verify-instructor/:instructorId', checkRole(['admin']), userController.verifyInstructor);

module.exports = router;
