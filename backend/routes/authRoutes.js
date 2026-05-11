const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validator');

// Validation rules for Register
const registerValidation = [
  body('name').notEmpty().withMessage('Le nom est requis').trim().escape(),
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit faire au moins 6 caractères')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir au moins un chiffre'),
  body('role').optional().isIn(['student', 'instructor']).withMessage('Rôle invalide'),
  validate
];

// Validation rules for Login
const loginValidation = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').notEmpty().withMessage('Mot de passe requis'),
  validate
];

// Validation for Forgot Password
const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  validate
];

// Validation for Reset Password
const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token requis'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit faire au moins 6 caractères'),
  validate
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);

module.exports = router;
