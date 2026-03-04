const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        console.error('Error comparing password:', err);
        return res.status(500).json({ error: 'Authentication failed' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        console.error('JWT_SECRET is not set');
        return res.status(500).json({ error: 'Server configuration error' });
      }

      const token = jwt.sign(payload, secret, { expiresIn: '24h' });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, role = 'viewer' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const password_hash = bcrypt.hashSync(password, 10);

    const insert = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (@name, @email, @password_hash, @role)
    `);

    const result = insert.run({ name, email, password_hash, role });

    const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?')
      .get(result.lastInsertRowid);

    res.status(201).json(user);
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
