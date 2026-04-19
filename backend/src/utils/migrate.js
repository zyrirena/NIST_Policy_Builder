const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin','user','auditor')),
        organization_id UUID,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Organizations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        industry VARCHAR(100),
        size VARCHAR(50),
        geography VARCHAR(255),
        regulatory_exposure TEXT[],
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Add FK for users -> organizations
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_users_org') THEN
          ALTER TABLE users ADD CONSTRAINT fk_users_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `);

    // AI Systems table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_systems (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        use_case TEXT,
        input_data_types TEXT[],
        output_decisions TEXT,
        risk_level VARCHAR(50) DEFAULT 'medium' CHECK (risk_level IN ('low','medium','high','critical')),
        human_in_loop BOOLEAN DEFAULT true,
        deployment_type VARCHAR(100),
        description TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Policies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS policies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ai_system_id UUID REFERENCES ai_systems(id) ON DELETE CASCADE,
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        category VARCHAR(50) CHECK (category IN ('govern','map','measure','manage')),
        subcategory VARCHAR(100),
        content TEXT NOT NULL,
        risk_level VARCHAR(50),
        industry VARCHAR(100),
        status VARCHAR(50) DEFAULT 'draft',
        version INTEGER DEFAULT 1,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Gap Analysis table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gap_analyses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ai_system_id UUID REFERENCES ai_systems(id) ON DELETE CASCADE,
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        category VARCHAR(50),
        question TEXT NOT NULL,
        answer VARCHAR(50) CHECK (answer IN ('covered','missing','needs_improvement',NULL)),
        notes TEXT,
        remediation TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Documents / Evidence vault
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ai_system_id UUID REFERENCES ai_systems(id) ON DELETE SET NULL,
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        filename VARCHAR(500) NOT NULL,
        original_name VARCHAR(500),
        file_path TEXT NOT NULL,
        file_type VARCHAR(100),
        file_size INTEGER,
        tags TEXT[],
        linked_control VARCHAR(255),
        version INTEGER DEFAULT 1,
        uploaded_by UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Tasks table (collaboration)
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ai_system_id UUID REFERENCES ai_systems(id) ON DELETE CASCADE,
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        assigned_to UUID REFERENCES users(id),
        assigned_by UUID REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','in_progress','review','completed')),
        priority VARCHAR(50) DEFAULT 'medium',
        due_date DATE,
        category VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        user_id UUID REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Regulatory alerts
    await client.query(`
      CREATE TABLE IF NOT EXISTS regulatory_alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        ai_system_id UUID REFERENCES ai_systems(id) ON DELETE SET NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        severity VARCHAR(50) DEFAULT 'medium',
        regulation VARCHAR(255),
        geography VARCHAR(255),
        industry VARCHAR(100),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Activity log
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        action VARCHAR(255) NOT NULL,
        entity_type VARCHAR(100),
        entity_id UUID,
        details JSONB,
        ip_address VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Maturity scores
    await client.query(`
      CREATE TABLE IF NOT EXISTS maturity_scores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        ai_system_id UUID REFERENCES ai_systems(id) ON DELETE CASCADE,
        category VARCHAR(50),
        score INTEGER CHECK (score >= 1 AND score <= 5),
        details JSONB,
        assessed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Monitoring plans
    await client.query(`
      CREATE TABLE IF NOT EXISTS monitoring_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ai_system_id UUID REFERENCES ai_systems(id) ON DELETE CASCADE,
        metric_name VARCHAR(255) NOT NULL,
        metric_type VARCHAR(100),
        frequency VARCHAR(100),
        threshold TEXT,
        responsible_party VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        next_review DATE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Database migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate().catch(() => process.exit(1));
