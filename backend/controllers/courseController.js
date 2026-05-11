const db = require('../config/db');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Instructor only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const instructor_id = req.user.id;

    // Check if instructor is verified
    const userResult = await db.query('SELECT is_verified FROM users WHERE id = $1', [instructor_id]);
    if (!userResult.rows[0].is_verified) {
      return res.status(403).json({ error: "Votre compte n'est pas encore vérifié par l'administration." });
    }

    // Handle files
    const thumbnail_url = req.files?.thumbnail ? `/uploads/thumbnails/${req.files.thumbnail[0].filename}` : null;
    const video_url = req.files?.video ? `/uploads/videos/${req.files.video[0].filename}` : null;

    // Economic logic: category "Scolaire" or "Universitaire" are free
    let finalPrice = price;
    if (category.toLowerCase().includes('scolaire') || category.toLowerCase().includes('universitaire')) {
      finalPrice = 0;
    }

    const result = await db.query(
      'INSERT INTO courses (title, description, price, category, thumbnail_url, video_url, instructor_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, finalPrice, category, thumbnail_url, video_url, instructor_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du cours' });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let query = 'SELECT courses.*, users.name as instructor_name FROM courses JOIN users ON courses.instructor_id = users.id WHERE 1=1';
    let params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (minPrice) {
      params.push(minPrice);
      query += ` AND price >= $${params.length}`;
    }

    if (maxPrice) {
      params.push(maxPrice);
      query += ` AND price <= $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des cours' });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT courses.*, users.name as instructor_name, users.bio as instructor_bio FROM courses JOIN users ON courses.instructor_id = users.id WHERE courses.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération du cours' });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Owner or Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor_id = req.user.id;
    const role = req.user.role;

    // Check ownership
    const courseResult = await db.query('SELECT instructor_id FROM courses WHERE id = $1', [id]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    if (courseResult.rows[0].instructor_id !== instructor_id && role !== 'admin') {
      return res.status(403).json({ error: 'Action non autorisée' });
    }

    await db.query('DELETE FROM courses WHERE id = $1', [id]);
    res.status(200).json({ message: 'Cours supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression du cours' });
  }
};
