const db = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    // req.user comes from the auth middleware
    const result = await db.query(
      'SELECT id, name, email, role, coins, created_at FROM users WHERE id = $1',
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
      'UPDATE users SET is_verified = TRUE WHERE id = $1 AND role = $2 RETURNING id, name, is_verified',
      [instructorId, 'instructor']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Instructeur non trouvé' });
    }

    res.status(200).json({ message: 'Instructeur vérifié avec succès', instructor: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la vérification de l'instructeur" });
  }
};
