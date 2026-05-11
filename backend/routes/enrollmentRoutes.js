const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');

router.post('/', auth, enrollmentController.enrollInCourse);
router.get('/my-courses', auth, enrollmentController.getMyCourses);

module.exports = router;
