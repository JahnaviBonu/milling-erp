require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./database');
const seed = require('./seed');

const batchesRouter = require('./routes/batches');
const procurementRouter = require('./routes/procurement');
const silosRouter = require('./routes/silos');
const authRouter = require('./routes/auth');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://milling-erp.vercel.app'
    : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/batches', batchesRouter);
app.use('/api/procurement', procurementRouter);
app.use('/api/silos', silosRouter);
app.use('/api/auth', authRouter);

// KPIs route
app.get('/api/kpis', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT
        IFNULL(SUM(input_mt), 0) AS total_input_mt,
        IFNULL(SUM(output_mt), 0) AS total_output_mt,
        AVG(extraction_rate) AS avg_extraction_rate,
        COUNT(*) AS total_batches,
        SUM(CASE WHEN status = 'Passed' THEN 1 ELSE 0 END) AS passed_batches
      FROM batches
    `);

    const row = stmt.get();

    let qc_pass_rate = null;
    if (row.total_batches > 0) {
      qc_pass_rate = (row.passed_batches * 100.0) / row.total_batches;
    }

    res.json({
      total_input_mt: row.total_input_mt,
      total_output_mt: row.total_output_mt,
      avg_extraction_rate: row.avg_extraction_rate,
      qc_pass_rate,
      total_batches: row.total_batches
    });
  } catch (err) {
    console.error('Error fetching KPIs:', err);
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

// Monthly summary route
app.get('/api/monthly-summary', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT
        strftime('%Y-%m', date) AS year_month,
        SUM(input_mt) AS total_input_mt,
        SUM(output_mt) AS total_output_mt
      FROM batches
      WHERE date IS NOT NULL AND date != ''
      GROUP BY year_month
      ORDER BY year_month
    `);

    const rows = stmt.all();

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const summary = rows.map((row) => {
      const [yearStr, monthStr] = row.year_month.split('-');
      const year = parseInt(yearStr, 10);
      const monthIndex = parseInt(monthStr, 10) - 1;
      const monthLabel = `${monthNames[monthIndex]} ${year}`;

      return {
        month: monthLabel,
        input: row.total_input_mt || 0,
        output: row.total_output_mt || 0
      };
    });

    res.json(summary);
  } catch (err) {
    console.error('Error fetching monthly summary:', err);
    res.status(500).json({ error: 'Failed to fetch monthly summary' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;

// Seed database on startup (safe - only seeds if tables are empty)
seed();

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
