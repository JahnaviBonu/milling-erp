const express = require('express');
const db = require('../database');

const router = express.Router();

// GET /api/procurement
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT *
      FROM procurement
      ORDER BY order_date DESC, id DESC
    `);
    const records = stmt.all();
    res.json(records);
  } catch (err) {
    console.error('Error fetching procurement records:', err);
    res.status(500).json({ error: 'Failed to fetch procurement records' });
  }
});

// POST /api/procurement
router.post('/', (req, res) => {
  try {
    const {
      grain_type,
      supplier_name,
      target_mt,
      procured_mt = 0,
      cost_per_mt,
      lead_time_days,
      order_date,
      expected_delivery,
      priority = 'Normal',
      status = 'Pending',
      quarter
    } = req.body;

    const insert = db.prepare(`
      INSERT INTO procurement (
        grain_type,
        supplier_name,
        target_mt,
        procured_mt,
        cost_per_mt,
        lead_time_days,
        order_date,
        expected_delivery,
        priority,
        status,
        quarter
      ) VALUES (
        @grain_type,
        @supplier_name,
        @target_mt,
        @procured_mt,
        @cost_per_mt,
        @lead_time_days,
        @order_date,
        @expected_delivery,
        @priority,
        @status,
        @quarter
      )
    `);

    const result = insert.run({
      grain_type,
      supplier_name,
      target_mt,
      procured_mt,
      cost_per_mt,
      lead_time_days,
      order_date,
      expected_delivery,
      priority,
      status,
      quarter
    });

    const created = db.prepare('SELECT * FROM procurement WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating procurement record:', err);
    res.status(500).json({ error: 'Failed to create procurement record' });
  }
});

// PUT /api/procurement/:id
router.put('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid procurement id' });
    }

    const existing = db.prepare('SELECT * FROM procurement WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Procurement record not found' });
    }

    const {
      grain_type = existing.grain_type,
      supplier_name = existing.supplier_name,
      target_mt = existing.target_mt,
      procured_mt = existing.procured_mt,
      cost_per_mt = existing.cost_per_mt,
      lead_time_days = existing.lead_time_days,
      order_date = existing.order_date,
      expected_delivery = existing.expected_delivery,
      priority = existing.priority,
      status = existing.status,
      quarter = existing.quarter
    } = req.body || {};

    const update = db.prepare(`
      UPDATE procurement
      SET
        grain_type = @grain_type,
        supplier_name = @supplier_name,
        target_mt = @target_mt,
        procured_mt = @procured_mt,
        cost_per_mt = @cost_per_mt,
        lead_time_days = @lead_time_days,
        order_date = @order_date,
        expected_delivery = @expected_delivery,
        priority = @priority,
        status = @status,
        quarter = @quarter
      WHERE id = @id
    `);

    update.run({
      id,
      grain_type,
      supplier_name,
      target_mt,
      procured_mt,
      cost_per_mt,
      lead_time_days,
      order_date,
      expected_delivery,
      priority,
      status,
      quarter
    });

    const updated = db.prepare('SELECT * FROM procurement WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error('Error updating procurement record:', err);
    res.status(500).json({ error: 'Failed to update procurement record' });
  }
});

// DELETE /api/procurement/:id
router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid procurement id' });
    }

    const del = db.prepare('DELETE FROM procurement WHERE id = ?');
    const result = del.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Procurement record not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting procurement record:', err);
    res.status(500).json({ error: 'Failed to delete procurement record' });
  }
});

module.exports = router;
