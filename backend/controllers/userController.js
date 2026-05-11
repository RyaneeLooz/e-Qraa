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
