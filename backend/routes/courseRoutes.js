const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const upload = require('../config/multer');

const courseValidation = [
  body('title').notEmpty().withMessage('Le titre est requis').trim().escape(),
  body('description').optional().trim().escape(),
  body('price').isNumeric().withMessage('Le prix doit être un nombre'),
  body('category').notEmpty().withMessage('La catégorie est requise').trim().escape(),
  validate
];

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Protected routes
router.post('/', 
  auth, 
  checkRole(['instructor', 'admin']), 
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]), 
  courseValidation,
  courseController.createCourse
);

router.put('/:id', 
  auth, 
  checkRole(['instructor', 'admin']), 
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]), 
  courseValidation,
  courseController.updateCourse
);

router.delete('/:id', auth, courseController.deleteCourse);

module.exports = router;
