const db = require('../config/db');

// @desc    Enroll a student in a course
// @route   POST /api/enrollments
// @access  Private (Student)
exports.enrollInCourse = async (req, res) => {
  const client = await db.connect(); // Get a dedicated client from the pool
  try {
    await client.query('BEGIN');
    const { course_id } = req.body;
    const student_id = req.user.id;

    // 1. Check if course exists
    const courseResult = await client.query('SELECT * FROM courses WHERE id = $1', [course_id]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    const course = courseResult.rows[0];

    // 2. Check if already enrolled
    const enrollmentCheck = await client.query(
      'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [student_id, course_id]
    );
    if (enrollmentCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Vous êtes déjà inscrit à ce cours' });
    }

    // 3. Handle Payment
    if (course.price > 0) {
      // Check student balance
      const studentResult = await client.query('SELECT coins FROM users WHERE id = $1', [student_id]);
      const studentCoins = studentResult.rows[0].coins;

      if (studentCoins < course.price) {
        return res.status(400).json({ error: 'Solde de Coins insuffisant' });
      }

      // Deduct coins from student
      await client.query('UPDATE users SET coins = coins - $1 WHERE id = $2', [course.price, student_id]);

      // Calculate instructor share (80%)
      const instructorShare = Math.floor(course.price * 0.8);
      await client.query('UPDATE users SET coins = coins + $1 WHERE id = $2', [instructorShare, course.instructor_id]);
    }

    // 4. Create enrollment record
    await client.query(
      'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)',
      [student_id, course_id]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Inscription réussie', course_id });
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'inscription au cours" });
  } finally {
    if (client) client.release(); // Always release the client back to the pool
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

// @desc    Get instructor dashboard statistics
// @route   GET /api/enrollments/instructor-stats
// @access  Private (Instructor)
exports.getInstructorStats = async (req, res) => {
  try {
    const instructor_id = req.user.id;

    // Total students enrolled in all instructor's courses
    const studentCountResult = await db.query(
      'SELECT COUNT(e.student_id) as total_students FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE c.instructor_id = $1',
      [instructor_id]
    );

    // Total courses
    const courseCountResult = await db.query(
      'SELECT COUNT(*) as total_courses FROM courses WHERE instructor_id = $1',
      [instructor_id]
    );

    // Earnings are already in the user's coins, but we can summarize sales here
    // Let's get the sum of (price * 0.8) for all enrollments
    const earningsResult = await db.query(
      'SELECT SUM(c.price * 0.8) as total_earnings FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE c.instructor_id = $1',
      [instructor_id]
    );

    res.status(200).json({
      total_students: parseInt(studentCountResult.rows[0].total_students),
      total_courses: parseInt(courseCountResult.rows[0].total_courses),
      total_earnings: Math.floor(parseFloat(earningsResult.rows[0].total_earnings || 0))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};

// @desc    Get admin platform stats
// @route   GET /api/enrollments/admin-stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
  try {
    // Total commission (20% of all paid enrollments)
    const commissionResult = await db.query(
      'SELECT SUM(c.price * 0.2) as total_commission FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE c.price > 0'
    );

    const userCountResult = await db.query('SELECT COUNT(*) FROM users');
    const courseCountResult = await db.query('SELECT COUNT(*) FROM courses');

    res.status(200).json({
      total_commission: Math.floor(parseFloat(commissionResult.rows[0].total_commission || 0)),
      total_users: parseInt(userCountResult.rows[0].count),
      total_courses: parseInt(courseCountResult.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des stats globales' });
  }
};
