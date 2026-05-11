const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const upload = require('../config/multer');

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
  courseController.createCourse
);

router.delete('/:id', auth, courseController.deleteCourse);

module.exports = router;
