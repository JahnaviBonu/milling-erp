const express = require('express');
const db = require('../database');

const router = express.Router();

// GET /api/batches
// Optional query params: ?grain_type=...&status=...
router.get('/', (req, res) => {
  try {
    const { grain_type, status } = req.query;

    const conditions = [];
    const params = {};

    if (grain_type) {
      conditions.push('grain_type = @grain_type');
      params.grain_type = grain_type;
    }

    if (status) {
      conditions.push('status = @status');
      params.status = status;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const stmt = db.prepare(`
      SELECT *
      FROM batches
      ${whereClause}
      ORDER BY date DESC, id DESC
    `);

    const batches = stmt.all(params);
    res.json(batches);
  } catch (err) {
    console.error('Error fetching batches:', err);
    res.status(500).json({ error: 'Failed to fetch batches' });
  }
});

// GET /api/batches/:id
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid batch id' });
    }

    const stmt = db.prepare('SELECT * FROM batches WHERE id = ?');
    const batch = stmt.get(id);

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    res.json(batch);
  } catch (err) {
    console.error('Error fetching batch:', err);
    res.status(500).json({ error: 'Failed to fetch batch' });
  }
});

// POST /api/batches
router.post('/', (req, res) => {
  try {
    const {
      batch_number,
      date,
      grain_type,
      input_mt,
      output_mt,
      ash_content,
      moisture_pct,
      protein_pct,
      grade,
      status,
      operator_name,
      notes
    } = req.body;

    const input = Number(input_mt);
    const output = Number(output_mt);

    if (!input || input <= 0 || isNaN(input) || isNaN(output)) {
      return res.status(400).json({ error: 'Invalid input_mt or output_mt' });
    }

    const extraction_rate = (output / input) * 100.0;

    const insert = db.prepare(`
      INSERT INTO batches (
        batch_number, date, grain_type, input_mt, output_mt,
        extraction_rate, ash_content, moisture_pct, protein_pct,
        grade, status, operator_name, notes
      ) VALUES (
        @batch_number, @date, @grain_type, @input_mt, @output_mt,
        @extraction_rate, @ash_content, @moisture_pct, @protein_pct,
        @grade, @status, @operator_name, @notes
      )
    `);

    const result = insert.run({
      batch_number,
      date,
      grain_type,
      input_mt: input,
      output_mt: output,
      extraction_rate,
      ash_content,
      moisture_pct,
      protein_pct,
      grade,
      status,
      operator_name,
      notes
    });

    const created = db.prepare('SELECT * FROM batches WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating batch:', err);
    res.status(500).json({ error: 'Failed to create batch' });
  }
});

// PUT /api/batches/:id
router.put('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid batch id' });
    }

    const existing = db.prepare('SELECT * FROM batches WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    const {
      batch_number = existing.batch_number,
      date = existing.date,
      grain_type = existing.grain_type,
      input_mt = existing.input_mt,
      output_mt = existing.output_mt,
      ash_content = existing.ash_content,
      moisture_pct = existing.moisture_pct,
      protein_pct = existing.protein_pct,
      grade = existing.grade,
      status = existing.status,
      operator_name = existing.operator_name,
      notes = existing.notes
    } = req.body || {};

    const input = Number(input_mt);
    const output = Number(output_mt);

    if (!input || input <= 0 || isNaN(input) || isNaN(output)) {
      return res.status(400).json({ error: 'Invalid input_mt or output_mt' });
    }

    const extraction_rate = (output / input) * 100.0;

    const update = db.prepare(`
      UPDATE batches
      SET
        batch_number = @batch_number,
        date = @date,
        grain_type = @grain_type,
        input_mt = @input_mt,
        output_mt = @output_mt,
        extraction_rate = @extraction_rate,
        ash_content = @ash_content,
        moisture_pct = @moisture_pct,
        protein_pct = @protein_pct,
        grade = @grade,
        status = @status,
        operator_name = @operator_name,
        notes = @notes
      WHERE id = @id
    `);

    update.run({
      id,
      batch_number,
      date,
      grain_type,
      input_mt: input,
      output_mt: output,
      extraction_rate,
      ash_content,
      moisture_pct,
      protein_pct,
      grade,
      status,
      operator_name,
      notes
    });

    const updated = db.prepare('SELECT * FROM batches WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error('Error updating batch:', err);
    res.status(500).json({ error: 'Failed to update batch' });
  }
});

// DELETE /api/batches/:id
router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid batch id' });
    }

    const del = db.prepare('DELETE FROM batches WHERE id = ?');
    const result = del.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting batch:', err);
    res.status(500).json({ error: 'Failed to delete batch' });
  }
});

module.exports = router;
