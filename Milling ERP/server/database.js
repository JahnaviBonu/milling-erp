const path = require('path');
const Database = require('better-sqlite3');

// Resolve database file path in the current (server) directory
const dbPath = path.join(__dirname, 'milling.db');

// Open (or create) the SQLite database
const db = new Database(dbPath);

// Enable Write-Ahead Logging for better concurrency and durability
db.pragma('journal_mode = WAL');

// Enforce foreign key constraints
db.pragma('foreign_keys = ON');

// Wrap schema setup in a transaction for atomicity
db.transaction(() => {
  // batches table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_number TEXT,
      date TEXT,
      grain_type TEXT,
      input_mt REAL,
      output_mt REAL,
      extraction_rate REAL,
      ash_content REAL,
      moisture_pct REAL,
      protein_pct REAL,
      grade TEXT,
      status TEXT DEFAULT 'Pending',
      operator_name TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // procurement table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS procurement (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grain_type TEXT,
      supplier_name TEXT,
      target_mt REAL,
      procured_mt REAL DEFAULT 0,
      cost_per_mt REAL,
      lead_time_days INTEGER,
      order_date TEXT,
      expected_delivery TEXT,
      priority TEXT DEFAULT 'Normal',
      status TEXT DEFAULT 'Pending',
      quarter TEXT
    )
  `).run();

  // silos table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS silos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      silo_name TEXT UNIQUE,
      capacity_mt REAL,
      current_mt REAL DEFAULT 0,
      grain_type TEXT,
      last_updated TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // quality_tests table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS quality_tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_id INTEGER REFERENCES batches(id),
      test_date TEXT,
      tester_name TEXT,
      ash_result REAL,
      moisture_result REAL,
      protein_result REAL,
      passed INTEGER DEFAULT 1
    )
  `).run();

  // users table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password_hash TEXT,
      role TEXT DEFAULT 'viewer',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
})();

module.exports = db;
