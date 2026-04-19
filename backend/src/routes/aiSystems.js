const express = require('express');
const { pool } = require('../utils/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/ai-systems
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ai_systems WHERE organization_id = $1 ORDER BY created_at DESC',
      [req.user.organization_id]
    );
    res.json({ systems: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/ai-systems/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ai_systems WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ system: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/ai-systems
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, use_case, input_data_types, output_decisions, risk_level, human_in_loop, deployment_type, description } = req.body;
    if (!name) return res.status(400).json({ error: 'System name required' });

    const result = await pool.query(
      `INSERT INTO ai_systems (organization_id, name, use_case, input_data_types, output_decisions, risk_level, human_in_loop, deployment_type, description, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.user.organization_id, name, use_case, input_data_types || [], output_decisions, risk_level || 'medium', human_in_loop !== false, deployment_type, description, req.user.id]
    );

    await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1,$2,$3,$4)',
      [req.user.id, 'created_ai_system', 'ai_system', result.rows[0].id]);

    res.status(201).json({ system: result.rows[0] });
  } catch (err) {
    console.error('Create AI system error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/ai-systems/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, use_case, input_data_types, output_decisions, risk_level, human_in_loop, deployment_type, description, status } = req.body;
    const result = await pool.query(
      `UPDATE ai_systems SET name=$1, use_case=$2, input_data_types=$3, output_decisions=$4, risk_level=$5, human_in_loop=$6, deployment_type=$7, description=$8, status=$9, updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [name, use_case, input_data_types, output_decisions, risk_level, human_in_loop, deployment_type, description, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ system: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/ai-systems/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM ai_systems WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
