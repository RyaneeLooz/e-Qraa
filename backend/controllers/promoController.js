const db = require('../config/db');

// @desc    Get all promo codes (Admin)
// @route   GET /api/promos
// @access  Private (Admin)
exports.getPromos = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM promo_codes ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des codes promo' });
  }
};

// @desc    Create a promo code (Admin)
// @route   POST /api/promos
// @access  Private (Admin)
exports.createPromo = async (req, res) => {
  const { code, coins, max_uses } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO promo_codes (code, coins, max_uses) VALUES ($1, $2, $3) RETURNING *',
      [code.toUpperCase(), coins, max_uses]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du code promo' });
  }
};

// @desc    Use a promo code (Student)
// @route   POST /api/promos/use
// @access  Private
exports.usePromo = async (req, res) => {
  const { code } = req.body;
  const user_id = req.user.id;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1. Check if promo exists and is active
    const promoResult = await client.query('SELECT * FROM promo_codes WHERE code = $1 AND status = $2', [code.toUpperCase(), 'Actif']);
    if (promoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Code promo invalide ou expiré' });
    }
    const promo = promoResult.rows[0];

    // 2. Check if usage limit reached
    if (promo.used_count >= promo.max_uses) {
      await client.query('UPDATE promo_codes SET status = $1 WHERE id = $2', ['Expiré', promo.id]);
      await client.query('COMMIT');
      return res.status(400).json({ error: 'Ce code promo a atteint sa limite d\'utilisation' });
    }

    // 3. (Optional) Check if user already used it (requires another table, skip for simplicity as per current DB)

    // 4. Credit user
    await client.query('UPDATE users SET coins = coins + $1 WHERE id = $2', [promo.coins, user_id]);

    // 5. Increment usage
    await client.query('UPDATE promo_codes SET used_count = used_count + 1 WHERE id = $2', [promo.id]);

    await client.query('COMMIT');
    res.status(200).json({ message: `Succès ! ${promo.coins} Coins ajoutés à votre compte`, coins: promo.coins });
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'utilisation du code promo' });
  } finally {
    if (client) client.release();
  }
};
