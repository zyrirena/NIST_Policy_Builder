const express = require('express');
const { pool } = require('../utils/db');
const { authenticateToken } = require('../middleware/auth');
const { generatePolicies, generateChecklist, generateRACIMatrix, calculateMaturityScore, generateMonitoringPlan, estimateRiskCost, NIST_RMF_FRAMEWORK } = require('../services/policyEngine');
const { generatePDFReport } = require('../services/pdfGenerator');

const router = express.Router();

// POST /api/policies/generate/:systemId
router.post('/generate/:systemId', authenticateToken, async (req, res) => {
  try {
    const sysResult = await pool.query('SELECT * FROM ai_systems WHERE id = $1', [req.params.systemId]);
    if (sysResult.rows.length === 0) return res.status(404).json({ error: 'AI System not found' });
    const aiSystem = sysResult.rows[0];

    const orgResult = await pool.query('SELECT * FROM organizations WHERE id = $1', [aiSystem.organization_id]);
    if (orgResult.rows.length === 0) return res.status(404).json({ error: 'Organization not found' });
    const organization = orgResult.rows[0];

    // Generate policies
    const policies = generatePolicies(aiSystem, organization);

    // Delete old policies for this system
    await pool.query('DELETE FROM policies WHERE ai_system_id = $1', [aiSystem.id]);

    // Insert new policies
    for (const p of policies) {
      await pool.query(
        'INSERT INTO policies (ai_system_id, organization_id, title, category, subcategory, content, risk_level, industry, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [aiSystem.id, organization.id, p.title, p.category, p.subcategory, p.content, p.risk_level, p.industry, req.user.id]
      );
    }

    // Generate checklist
    const checklist = generateChecklist(aiSystem, organization);
    const raciMatrix = generateRACIMatrix(organization);
    const monitoringPlan = generateMonitoringPlan(aiSystem);
    const riskEstimate = estimateRiskCost(aiSystem, organization);

    // Save monitoring plan
    await pool.query('DELETE FROM monitoring_plans WHERE ai_system_id = $1', [aiSystem.id]);
    for (const m of monitoringPlan) {
      await pool.query(
        'INSERT INTO monitoring_plans (ai_system_id, metric_name, metric_type, frequency, threshold, responsible_party) VALUES ($1,$2,$3,$4,$5,$6)',
        [aiSystem.id, m.metric_name, m.metric_type, m.frequency, m.threshold, m.responsible_party]
      );
    }

    await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1,$2,$3,$4)',
      [req.user.id, 'generated_policies', 'ai_system', aiSystem.id]);

    res.json({
      policies,
      checklist,
      raciMatrix,
      monitoringPlan,
      riskEstimate,
      message: 'Policies generated successfully'
    });
  } catch (err) {
    console.error('Generate policies error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/policies/:systemId
router.get('/:systemId', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM policies WHERE ai_system_id = $1 ORDER BY category, subcategory',
      [req.params.systemId]
    );
    res.json({ policies: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/policies/framework/info
router.get('/framework/info', authenticateToken, async (req, res) => {
  res.json({ framework: NIST_RMF_FRAMEWORK });
});

// POST /api/policies/pdf/:systemId
router.post('/pdf/:systemId', authenticateToken, async (req, res) => {
  try {
    const sysResult = await pool.query('SELECT * FROM ai_systems WHERE id = $1', [req.params.systemId]);
    if (sysResult.rows.length === 0) return res.status(404).json({ error: 'AI System not found' });
    const aiSystem = sysResult.rows[0];

    const orgResult = await pool.query('SELECT * FROM organizations WHERE id = $1', [aiSystem.organization_id]);
    const organization = orgResult.rows[0];

    const polResult = await pool.query('SELECT * FROM policies WHERE ai_system_id = $1 ORDER BY category, subcategory', [aiSystem.id]);
    const policies = polResult.rows;

    const gapResult = await pool.query('SELECT * FROM gap_analyses WHERE ai_system_id = $1', [aiSystem.id]);
    const gapAnalysis = gapResult.rows;

    const matResult = await pool.query('SELECT * FROM maturity_scores WHERE ai_system_id = $1', [aiSystem.id]);
    const maturityScores = {};
    for (const m of matResult.rows) {
      maturityScores[m.category] = m.score;
    }
    maturityScores.overall = Object.values(maturityScores).length > 0
      ? Math.round((Object.values(maturityScores).reduce((a, b) => a + b, 0) / Object.values(maturityScores).length) * 10) / 10
      : 2;

    const monResult = await pool.query('SELECT * FROM monitoring_plans WHERE ai_system_id = $1', [aiSystem.id]);
    const alertResult = await pool.query('SELECT * FROM regulatory_alerts WHERE organization_id = $1', [organization.id]);

    const checklist = generateChecklist(aiSystem, organization);
    const raciMatrix = generateRACIMatrix(organization);
    const riskEstimate = estimateRiskCost(aiSystem, organization);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="NIST-AI-RMF-Report-${aiSystem.name.replace(/\s+/g, '-')}.pdf"`);

    generatePDFReport({
      organization,
      aiSystem,
      policies,
      gapAnalysis,
      maturityScores,
      monitoringPlan: monResult.rows,
      regulatoryAlerts: alertResult.rows,
      checklist,
      raciMatrix,
      riskEstimate,
    }, res);

  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

module.exports = router;
