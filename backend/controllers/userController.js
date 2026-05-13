const db = require('../config/db');
const sendEmail = require('../config/mailer');

exports.getProfile = async (req, res) => {
  try {
    // req.user comes from the auth middleware
    const result = await db.query(
      'SELECT id, name, email, role, coins, bio, avatar_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, bio, university, specialty } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET name = COALESCE($1, name), bio = COALESCE($2, bio), university = COALESCE($3, university), specialty = COALESCE($4, specialty) WHERE id = $5 RETURNING id, name, bio, university, specialty',
      [name, bio, university, specialty, req.user.id]
    );
    res.status(200).json({ message: 'Profil mis à jour', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Veuillez sélectionner une image' });
    }

    const avatar_url = `/uploads/avatars/${req.file.filename}`;
    
    // Optional: Delete old avatar from disk here

    const result = await db.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING avatar_url',
      [avatar_url, req.user.id]
    );

    res.status(200).json({ message: 'Photo de profil mise à jour', avatar_url: result.rows[0].avatar_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'upload de l'avatar" });
  }
};

exports.updateCoins = async (req, res) => {
  const { amount } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET coins = coins + $1 WHERE id = $2 RETURNING coins',
      [amount, req.user.id]
    );
    res.status(200).json({ message: 'Solde mis à jour', coins: result.rows[0].coins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des coins' });
  }
};

// ADMIN: Get all instructors pending verification
exports.getPendingInstructors = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, specialty, id_card_number, created_at FROM users WHERE role = 'instructor' AND is_verified = FALSE"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des instructeurs en attente' });
  }
};

// ADMIN: Verify an instructor
exports.verifyInstructor = async (req, res) => {
  const { instructorId } = req.params;
  try {
    const result = await db.query(
      'UPDATE users SET is_verified = TRUE WHERE id = $1 AND role = $2 RETURNING id, name, email, is_verified',
      [instructorId, 'instructor']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Instructeur non trouvé' });
    }

    const instructor = result.rows[0];

    // Notify instructor via email
    const subject = 'Votre compte instructeur a été validé ! - e-Qraa';
    const message = `
      <h1>Félicitations ${instructor.name} !</h1>
      <p>Votre compte instructeur sur la plateforme e-Qraa a été validé par l'administration.</p>
      <p>Vous pouvez dès à présent commencer à publier vos cours et partager votre savoir.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" target="_blank">Accéder à mon tableau de bord</a>
    `;

    try {
      await sendEmail(instructor.email, subject, 'Votre compte a été validé', message);
    } catch (mailErr) {
      console.error('Erreur envoi email validation:', mailErr);
      // We don't fail the request if email fails, but we log it
    }

    res.status(200).json({ message: 'Instructeur vérifié avec succès', instructor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la vérification de l'instructeur" });
  }
};

// @desc    Get all verified instructors with stats
// @route   GET /api/users/instructors
// @access  Public
exports.getInstructors = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id, u.name, u.bio, u.avatar_url, u.university, u.specialty,
        COUNT(DISTINCT c.id) as courses_count,
        COUNT(DISTINCT e.student_id) as students_count,
        COALESCE(AVG(NULLIF(0, 0)), 4.8) as rating
      FROM users u
      LEFT JOIN courses c ON u.id = c.instructor_id
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE u.role = 'instructor' AND u.is_verified = TRUE
      GROUP BY u.id
      ORDER BY students_count DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des formateurs' });
  }
};

// @desc    Get student leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id, u.name, u.university,
        COUNT(e.course_id) * 100 as points
      FROM users u
      JOIN enrollments e ON u.id = e.student_id
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY points DESC
      LIMIT 10
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération du classement' });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users/admin/all
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, coins, is_verified, created_at FROM users ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};
