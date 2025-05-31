const express = require('express');
const router = express.Router();
const pool = require('../../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM manufacturers');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении производителей:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
