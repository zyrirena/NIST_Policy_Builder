const express = require('express');
const router = express.Router();
const { authenticateToken: authenticate } = require('../middleware/auth');
const advisor = require('../services/aiAdvisor');
const { pool } = require('../utils/db');

// GET /api/advisor/status - Check if AI advisor is available
router.get('/status', (req, res) => {
  res.json({ available: advisor.isAvailable() });
});

// POST /api/advisor/ask - Ask the AI advisor a question
router.post('/ask', authenticate, async (req, res) => {
  try {
    const { message, systemId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Build context from user's data
    const context = {};

    // Get organization
    if (req.user.organization_id) {
      const orgResult = await pool.query(
        'SELECT * FROM organizations WHERE id = $1', [req.user.organization_id]
      );
      if (orgResult.rows[0]) context.organization = orgResult.rows[0];
    }

    // Get AI system if specified
    if (systemId) {
      const sysResult = await pool.query(
        'SELECT * FROM ai_systems WHERE id = $1 AND organization_id = $2',
        [systemId, req.user.organization_id]
      );
      if (sysResult.rows[0]) context.aiSystem = sysResult.rows[0];

      // Get gap analysis summary
      const gapResult = await pool.query(
        'SELECT category, question, answer FROM gap_analyses WHERE ai_system_id = $1',
        [systemId]
      );
      if (gapResult.rows.length > 0) {
        const summary = gapResult.rows.map(g =>
          `[${g.category}] ${g.question}: ${g.answer || 'not assessed'}`
        ).join('\n');
        context.gapSummary = summary;
      }

      // Get maturity scores
      const matResult = await pool.query(
        'SELECT category, score FROM maturity_scores WHERE ai_system_id = $1',
        [systemId]
      );
      if (matResult.rows.length > 0) {
        context.maturityScores = {};
        matResult.rows.forEach(m => { context.maturityScores[m.category] = m.score; });
      }
    }

    const result = await advisor.ask(message, context);

    // Log the activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, details) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'ai_advisor_query', 'advisor', JSON.stringify({ message: message.substring(0, 200), tokens: result.usage })]
    );

    res.json(result);
  } catch (err) {
    console.error('Advisor error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/advisor/review-policy - Review a generated policy
router.post('/review-policy', authenticate, async (req, res) => {
  try {
    const { policyContent, systemId } = req.body;
    if (!policyContent) return res.status(400).json({ error: 'Policy content is required' });

    const context = {};
    if (req.user.organization_id) {
      const orgResult = await pool.query('SELECT * FROM organizations WHERE id = $1', [req.user.organization_id]);
      if (orgResult.rows[0]) context.organization = orgResult.rows[0];
    }
    if (systemId) {
      const sysResult = await pool.query('SELECT * FROM ai_systems WHERE id = $1', [systemId]);
      if (sysResult.rows[0]) context.aiSystem = sysResult.rows[0];
    }

    const result = await advisor.reviewPolicy(policyContent, context);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/advisor/remediation - Get remediation suggestions for gaps
router.post('/remediation', authenticate, async (req, res) => {
  try {
    const { systemId } = req.body;
    if (!systemId) return res.status(400).json({ error: 'System ID is required' });

    const gapResult = await pool.query(
      'SELECT category, question, answer FROM gap_analyses WHERE ai_system_id = $1',
      [systemId]
    );
    if (gapResult.rows.length === 0) {
      return res.status(404).json({ error: 'No gap analysis found for this system' });
    }

    const context = {};
    if (req.user.organization_id) {
      const orgResult = await pool.query('SELECT * FROM organizations WHERE id = $1', [req.user.organization_id]);
      if (orgResult.rows[0]) context.organization = orgResult.rows[0];
    }
    const sysResult = await pool.query('SELECT * FROM ai_systems WHERE id = $1', [systemId]);
    if (sysResult.rows[0]) context.aiSystem = sysResult.rows[0];

    const result = await advisor.suggestRemediations(gapResult.rows, context);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
