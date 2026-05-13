const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const { body } = require('express-validator');
const validate = require('../middleware/validator');

const enrollmentValidation = [
  body('course_id').isInt().withMessage('ID de cours invalide'),
  validate
];

router.post('/', auth, enrollmentValidation, enrollmentController.enrollInCourse);
router.get('/my-courses', auth, enrollmentController.getMyCourses);
router.get('/instructor-stats', auth, checkRole(['instructor']), enrollmentController.getInstructorStats);
router.get('/admin-stats', auth, checkRole(['admin']), enrollmentController.getAdminStats);
router.get('/check/:course_id', auth, enrollmentController.checkEnrollment);

module.exports = router;
