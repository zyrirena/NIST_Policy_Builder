const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create test user
    const passwordHash = await bcrypt.hash('Test1234!', 12);
    
    const userResult = await client.query(`
      INSERT INTO users (email, password_hash, full_name, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET password_hash = $2
      RETURNING id
    `, ['test@demo.com', passwordHash, 'Test User', 'admin']);

    const userId = userResult.rows[0].id;

    // Create demo organization
    const orgResult = await client.query(`
      INSERT INTO organizations (name, industry, size, geography, regulatory_exposure, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, ['Acme AI Corp', 'Healthcare', '100-500', 'United States', 
        ['HIPAA', 'EU AI Act', 'NYC Local Law 144'], userId]);

    const orgId = orgResult.rows[0].id;

    // Link user to org
    await client.query('UPDATE users SET organization_id = $1 WHERE id = $2', [orgId, userId]);

    // Create demo AI system
    const sysResult = await client.query(`
      INSERT INTO ai_systems (organization_id, name, use_case, input_data_types, output_decisions, risk_level, human_in_loop, deployment_type, description, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [orgId, 'Patient Triage AI', 'Automated patient triage and priority assessment in emergency departments',
        ['medical_records', 'vital_signs', 'patient_history'], 'Triage priority level (1-5) and recommended department routing',
        'high', true, 'on-premise', 'AI system that assists ER staff in triaging patients based on symptoms, vital signs, and medical history.',
        'active', userId]);

    const sysId = sysResult.rows[0].id;

    // Seed regulatory alerts
    const alerts = [
      { title: 'EU AI Act: High-Risk AI System Classification', description: 'Your AI system may be classified as high-risk under the EU AI Act Annex III. Healthcare AI systems that influence clinical decisions require conformity assessment, CE marking, and ongoing monitoring. Ensure compliance by August 2026.', severity: 'high', regulation: 'EU AI Act', geography: 'European Union', industry: 'Healthcare' },
      { title: 'NYC Local Law 144: Bias Audit Required', description: 'If your AI system is used for employment decisions in NYC, a bias audit by an independent auditor is required annually. Publish audit results on your website.', severity: 'medium', regulation: 'NYC Local Law 144', geography: 'New York City', industry: 'All' },
      { title: 'HIPAA: AI and Protected Health Information', description: 'AI systems processing PHI must comply with HIPAA Security and Privacy Rules. Ensure all AI model training data is de-identified or processed under a BAA.', severity: 'high', regulation: 'HIPAA', geography: 'United States', industry: 'Healthcare' },
      { title: 'Colorado AI Act: Algorithmic Discrimination Prevention', description: 'Colorado SB 24-205 requires deployers of high-risk AI to perform impact assessments and notify consumers. Effective February 2026.', severity: 'medium', regulation: 'Colorado AI Act', geography: 'Colorado', industry: 'All' },
    ];

    for (const a of alerts) {
      await client.query(`
        INSERT INTO regulatory_alerts (organization_id, ai_system_id, title, description, severity, regulation, geography, industry)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [orgId, sysId, a.title, a.description, a.severity, a.regulation, a.geography, a.industry]);
    }

    // Seed maturity scores
    const categories = ['govern', 'map', 'measure', 'manage'];
    for (const cat of categories) {
      const score = Math.floor(Math.random() * 3) + 1;
      await client.query(`
        INSERT INTO maturity_scores (organization_id, ai_system_id, category, score, details)
        VALUES ($1, $2, $3, $4, $5)
      `, [orgId, sysId, cat, score, JSON.stringify({ areas: [`${cat} area assessed`] })]);
    }

    // Seed gap analysis questions
    const gaps = [
      { cat: 'govern', q: 'Does the organization have a documented AI governance policy?', a: 'covered' },
      { cat: 'govern', q: 'Is there an AI ethics board or committee?', a: 'missing' },
      { cat: 'govern', q: 'Are roles and responsibilities for AI oversight defined?', a: 'needs_improvement' },
      { cat: 'map', q: 'Are all AI systems inventoried and categorized by risk?', a: 'covered' },
      { cat: 'map', q: 'Are stakeholders identified for each AI system?', a: 'needs_improvement' },
      { cat: 'map', q: 'Is there a process for mapping AI impacts on individuals?', a: 'missing' },
      { cat: 'measure', q: 'Are performance metrics defined for AI systems?', a: 'covered' },
      { cat: 'measure', q: 'Is bias testing conducted regularly?', a: 'missing' },
      { cat: 'measure', q: 'Are AI system outputs validated by domain experts?', a: 'needs_improvement' },
      { cat: 'manage', q: 'Is there an incident response plan for AI failures?', a: 'missing' },
      { cat: 'manage', q: 'Are there processes for decommissioning AI systems?', a: 'missing' },
      { cat: 'manage', q: 'Is continuous monitoring in place for deployed AI?', a: 'needs_improvement' },
    ];

    for (const g of gaps) {
      await client.query(`
        INSERT INTO gap_analyses (ai_system_id, organization_id, category, question, answer)
        VALUES ($1, $2, $3, $4, $5)
      `, [sysId, orgId, g.cat, g.q, g.a]);
    }

    // Create an auditor user
    const auditorHash = await bcrypt.hash('Auditor1234!', 12);
    await client.query(`
      INSERT INTO users (email, password_hash, full_name, role, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['auditor@demo.com', auditorHash, 'Audit User', 'auditor', orgId]);

    await client.query('COMMIT');
    console.log('✅ Database seeded successfully!');
    console.log('📧 Test user: test@demo.com / Test1234!');
    console.log('📧 Auditor user: auditor@demo.com / Auditor1234!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

module.exports = { seed };
