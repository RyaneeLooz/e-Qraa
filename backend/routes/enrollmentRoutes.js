const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.post('/', auth, enrollmentController.enrollInCourse);
router.get('/my-courses', auth, enrollmentController.getMyCourses);
router.get('/instructor-stats', auth, checkRole(['instructor']), enrollmentController.getInstructorStats);
router.get('/admin-stats', auth, checkRole(['admin']), enrollmentController.getAdminStats);

module.exports = router;
