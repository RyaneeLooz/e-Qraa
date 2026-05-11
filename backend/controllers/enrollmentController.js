const db = require('../config/db');

// @desc    Enroll a student in a course
// @route   POST /api/enrollments
// @access  Private (Student)
exports.enrollInCourse = async (req, res) => {
  const client = await db.query('BEGIN'); // Using a transaction
  try {
    const { course_id } = req.body;
    const student_id = req.user.id;

    // 1. Check if course exists
    const courseResult = await db.query('SELECT * FROM courses WHERE id = $1', [course_id]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    const course = courseResult.rows[0];

    // 2. Check if already enrolled
    const enrollmentCheck = await db.query(
      'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [student_id, course_id]
    );
    if (enrollmentCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Vous êtes déjà inscrit à ce cours' });
    }

    // 3. Handle Payment
    if (course.price > 0) {
      // Check student balance
      const studentResult = await db.query('SELECT coins FROM users WHERE id = $1', [student_id]);
      const studentCoins = studentResult.rows[0].coins;

      if (studentCoins < course.price) {
        return res.status(400).json({ error: 'Solde de Coins insuffisant' });
      }

      // Deduct coins from student
      await db.query('UPDATE users SET coins = coins - $1 WHERE id = $2', [course.price, student_id]);

      // Calculate instructor share (80%)
      const instructorShare = Math.floor(course.price * 0.8);
      await db.query('UPDATE users SET coins = coins + $1 WHERE id = $2', [instructorShare, course.instructor_id]);
    }

    // 4. Create enrollment record
    await db.query(
      'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)',
      [student_id, course_id]
    );

    await db.query('COMMIT');
    res.status(201).json({ message: 'Inscription réussie', course_id });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'inscription au cours" });
  }
};

// @desc    Get student's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
exports.getMyCourses = async (req, res) => {
  try {
    const student_id = req.user.id;
    const result = await db.query(
      'SELECT courses.*, users.name as instructor_name FROM enrollments JOIN courses ON enrollments.course_id = courses.id JOIN users ON courses.instructor_id = users.id WHERE enrollments.student_id = $1',
      [student_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération de vos cours' });
  }
};
