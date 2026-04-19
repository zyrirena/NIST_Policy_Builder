const express = require('express');
const { pool } = require('../utils/db');
const { authenticateToken } = require('../middleware/auth');
const { calculateMaturityScore, estimateRiskCost } = require('../services/policyEngine');

const router = express.Router();

// ===== GAP ANALYSIS =====

// GET /api/gap-analysis/:systemId
router.get('/gap-analysis/:systemId', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gap_analyses WHERE ai_system_id = $1 ORDER BY category',
      [req.params.systemId]
    );
    res.json({ gaps: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/gap-analysis/:systemId
router.post('/gap-analysis/:systemId', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { category, question, answer, notes }
    
    // Delete existing
    await pool.query('DELETE FROM gap_analyses WHERE ai_system_id = $1', [req.params.systemId]);

    for (const a of answers) {
      await pool.query(
        'INSERT INTO gap_analyses (ai_system_id, organization_id, category, question, answer, notes) VALUES ($1,$2,$3,$4,$5,$6)',
        [req.params.systemId, req.user.organization_id, a.category, a.question, a.answer, a.notes]
      );
    }

    // Recalculate maturity
    const gapResult = await pool.query('SELECT * FROM gap_analyses WHERE ai_system_id = $1', [req.params.systemId]);
    const scores = calculateMaturityScore(gapResult.rows);

    // Update maturity scores
    await pool.query('DELETE FROM maturity_scores WHERE ai_system_id = $1', [req.params.systemId]);
    for (const [cat, score] of Object.entries(scores)) {
      if (cat !== 'overall') {
        await pool.query(
          'INSERT INTO maturity_scores (organization_id, ai_system_id, category, score) VALUES ($1,$2,$3,$4)',
          [req.user.organization_id, req.params.systemId, cat, Math.round(score)]
        );
      }
    }

    res.json({ gaps: gapResult.rows, maturityScores: scores });
  } catch (err) {
    console.error('Gap analysis error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== REGULATORY ALERTS =====

// GET /api/alerts
router.get('/alerts', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM regulatory_alerts WHERE organization_id = $1 ORDER BY severity DESC, created_at DESC',
      [req.user.organization_id]
    );
    res.json({ alerts: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/alerts/:id/read
router.put('/alerts/:id/read', authenticateToken, async (req, res) => {
  try {
    await pool.query('UPDATE regulatory_alerts SET is_read = true WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== DASHBOARD =====

// GET /api/dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const orgId = req.user.organization_id;
    if (!orgId) return res.json({ dashboard: { systems: 0, policies: 0, alerts: 0, tasks: 0 } });

    const [systems, policies, alerts, tasks, gaps, maturity] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM ai_systems WHERE organization_id = $1', [orgId]),
      pool.query('SELECT COUNT(*) as count FROM policies WHERE organization_id = $1', [orgId]),
      pool.query('SELECT COUNT(*) as count, severity FROM regulatory_alerts WHERE organization_id = $1 GROUP BY severity', [orgId]),
      pool.query('SELECT COUNT(*) as count, status FROM tasks WHERE organization_id = $1 GROUP BY status', [orgId]),
      pool.query(`SELECT category, answer, COUNT(*) as count FROM gap_analyses WHERE organization_id = $1 GROUP BY category, answer`, [orgId]),
      pool.query('SELECT category, score FROM maturity_scores WHERE organization_id = $1 ORDER BY assessed_at DESC', [orgId]),
    ]);

    // Risk heatmap data
    const riskSystems = await pool.query(
      'SELECT name, risk_level, status FROM ai_systems WHERE organization_id = $1',
      [orgId]
    );

    // Gap analysis summary
    const gapSummary = { covered: 0, missing: 0, needs_improvement: 0 };
    for (const g of gaps.rows) {
      if (gapSummary[g.answer] !== undefined) {
        gapSummary[g.answer] = parseInt(g.count);
      }
    }

    // Alert summary
    const alertSummary = { high: 0, medium: 0, low: 0, total: 0 };
    for (const a of alerts.rows) {
      alertSummary[a.severity] = parseInt(a.count);
      alertSummary.total += parseInt(a.count);
    }

    // Maturity summary
    const maturitySummary = {};
    for (const m of maturity.rows) {
      maturitySummary[m.category] = m.score;
    }

    res.json({
      dashboard: {
        systemCount: parseInt(systems.rows[0]?.count || 0),
        policyCount: parseInt(policies.rows[0]?.count || 0),
        alertSummary,
        taskSummary: tasks.rows.reduce((acc, t) => { acc[t.status] = parseInt(t.count); return acc; }, {}),
        gapSummary,
        maturitySummary,
        riskHeatmap: riskSystems.rows,
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== TASKS =====

// GET /api/tasks
router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.full_name as assignee_name FROM tasks t 
       LEFT JOIN users u ON t.assigned_to = u.id 
       WHERE t.organization_id = $1 ORDER BY t.created_at DESC`,
      [req.user.organization_id]
    );
    res.json({ tasks: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks
router.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, assigned_to, priority, due_date, category, ai_system_id } = req.body;
    const result = await pool.query(
      `INSERT INTO tasks (ai_system_id, organization_id, title, description, assigned_to, assigned_by, priority, due_date, category)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [ai_system_id, req.user.organization_id, title, description, assigned_to, req.user.id, priority || 'medium', due_date, category]
    );
    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/tasks/:id
router.put('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { status, title, description } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET status = COALESCE($1, status), title = COALESCE($2, title), description = COALESCE($3, description), updated_at = NOW() WHERE id = $4 RETURNING *',
      [status, title, description, req.params.id]
    );
    res.json({ task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== COMMENTS =====

// GET /api/comments/:entityType/:entityId
router.get('/comments/:entityType/:entityId', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.full_name as author_name FROM comments c 
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.entity_type = $1 AND c.entity_id = $2 ORDER BY c.created_at ASC`,
      [req.params.entityType, req.params.entityId]
    );
    res.json({ comments: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/comments
router.post('/comments', authenticateToken, async (req, res) => {
  try {
    const { entity_type, entity_id, content } = req.body;
    const result = await pool.query(
      'INSERT INTO comments (entity_type, entity_id, user_id, content) VALUES ($1,$2,$3,$4) RETURNING *',
      [entity_type, entity_id, req.user.id, content]
    );
    res.status(201).json({ comment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== MONITORING PLANS =====

// GET /api/monitoring/:systemId
router.get('/monitoring/:systemId', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM monitoring_plans WHERE ai_system_id = $1 ORDER BY created_at',
      [req.params.systemId]
    );
    res.json({ plans: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== DOCUMENTS =====

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// POST /api/documents/upload
router.post('/documents/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const { ai_system_id, tags, linked_control } = req.body;
    const result = await pool.query(
      `INSERT INTO documents (ai_system_id, organization_id, filename, original_name, file_path, file_type, file_size, tags, linked_control, uploaded_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [ai_system_id, req.user.organization_id, req.file.filename, req.file.originalname, req.file.path,
       req.file.mimetype, req.file.size, tags ? JSON.parse(tags) : [], linked_control, req.user.id]
    );
    res.status(201).json({ document: result.rows[0] });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET /api/documents
router.get('/documents', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT d.*, u.full_name as uploader_name FROM documents d LEFT JOIN users u ON d.uploaded_by = u.id WHERE d.organization_id = $1 ORDER BY d.created_at DESC',
      [req.user.organization_id]
    );
    res.json({ documents: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/documents/download/:id
router.get('/documents/download/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM documents WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const doc = result.rows[0];
    res.download(doc.file_path, doc.original_name);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== ACTIVITY LOG =====

// GET /api/activity
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT al.*, u.full_name as user_name FROM activity_logs al 
       LEFT JOIN users u ON al.user_id = u.id 
       WHERE al.user_id IN (SELECT id FROM users WHERE organization_id = $1)
       ORDER BY al.created_at DESC LIMIT 50`,
      [req.user.organization_id]
    );
    res.json({ activities: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== MATURITY =====

// GET /api/maturity/:systemId
router.get('/maturity/:systemId', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM maturity_scores WHERE ai_system_id = $1',
      [req.params.systemId]
    );
    const scores = {};
    for (const r of result.rows) {
      scores[r.category] = r.score;
    }
    if (Object.keys(scores).length > 0) {
      scores.overall = Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length) * 10) / 10;
    }
    res.json({ maturity: scores });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
