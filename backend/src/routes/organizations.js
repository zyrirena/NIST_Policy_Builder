const express = require('express');
const { pool } = require('../utils/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/organizations/mine
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    if (!req.user.organization_id) {
      return res.json({ organization: null });
    }
    const result = await pool.query('SELECT * FROM organizations WHERE id = $1', [req.user.organization_id]);
    res.json({ organization: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/organizations
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, industry, size, geography, regulatory_exposure } = req.body;
    if (!name) return res.status(400).json({ error: 'Organization name required' });

    const result = await pool.query(
      'INSERT INTO organizations (name, industry, size, geography, regulatory_exposure, created_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, industry, size, geography, regulatory_exposure || [], req.user.id]
    );

    // Link user to org
    await pool.query('UPDATE users SET organization_id = $1 WHERE id = $2', [result.rows[0].id, req.user.id]);

    res.status(201).json({ organization: result.rows[0] });
  } catch (err) {
    console.error('Create org error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/organizations/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, industry, size, geography, regulatory_exposure } = req.body;
    const result = await pool.query(
      'UPDATE organizations SET name=$1, industry=$2, size=$3, geography=$4, regulatory_exposure=$5, updated_at=NOW() WHERE id=$6 RETURNING *',
      [name, industry, size, geography, regulatory_exposure || [], req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ organization: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
