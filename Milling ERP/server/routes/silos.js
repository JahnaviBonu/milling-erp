const express = require('express');
const db = require('../database');

const router = express.Router();

// GET /api/silos
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT *
      FROM silos
      ORDER BY silo_name ASC
    `);
    const silos = stmt.all();
    res.json(silos);
  } catch (err) {
    console.error('Error fetching silos:', err);
    res.status(500).json({ error: 'Failed to fetch silos' });
  }
});

// PUT /api/silos/:id - update current_mt and last_updated
router.put('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid silo id' });
    }

    const existing = db.prepare('SELECT * FROM silos WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Silo not found' });
    }

    const { current_mt } = req.body;
    const current = Number(current_mt);

    if (isNaN(current) || current < 0) {
      return res.status(400).json({ error: 'Invalid current_mt value' });
    }

    const update = db.prepare(`
      UPDATE silos
      SET current_mt = @current_mt,
          last_updated = CURRENT_TIMESTAMP
      WHERE id = @id
    `);

    update.run({ id, current_mt: current });

    const updated = db.prepare('SELECT * FROM silos WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error('Error updating silo:', err);
    res.status(500).json({ error: 'Failed to update silo' });
  }
});

module.exports = router;
