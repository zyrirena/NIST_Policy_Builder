// NIST AI RMF Policy Templates Engine
// Based on: https://airc.nist.gov/airmf-resources/playbook/

const NIST_RMF_FRAMEWORK = {
  govern: {
    title: 'GOVERN',
    description: 'Policies, processes, procedures, and practices across the organization related to the mapping, measuring, and managing of AI risks are in place, transparent, and implemented effectively.',
    subcategories: {
      'GV-1': {
        title: 'Governance Structure',
        description: 'Legal and regulatory requirements involving AI are understood, managed, and documented.',
        controls: [
          'Establish AI governance committee with cross-functional representation',
          'Define clear roles and responsibilities for AI risk management (RACI)',
          'Document AI governance policies and review annually',
          'Ensure board-level oversight of AI initiatives',
        ]
      },
      'GV-2': {
        title: 'Risk Management Process',
        description: 'AI risk management processes are established, applied, and integrated into the organization.',
        controls: [
          'Implement formal AI risk assessment process aligned with enterprise risk management',
          'Define risk appetite and tolerance for AI systems',
          'Establish risk escalation procedures',
          'Integrate AI risk into existing risk management frameworks',
        ]
      },
      'GV-3': {
        title: 'Workforce Diversity & Culture',
        description: 'Workforce diversity, equity, inclusion, and accessibility processes are prioritized.',
        controls: [
          'Ensure diverse representation in AI development teams',
          'Provide AI ethics training to all staff involved in AI lifecycle',
          'Foster a culture of responsible AI development',
          'Establish channels for reporting AI concerns without retaliation',
        ]
      },
      'GV-4': {
        title: 'Organizational Commitments',
        description: 'Organizational teams are committed to a culture that considers and communicates AI risk.',
        controls: [
          'Publish organizational AI principles and values',
          'Communicate AI risk management expectations to all stakeholders',
          'Allocate resources for AI risk management activities',
          'Engage external stakeholders in AI governance',
        ]
      },
    }
  },
  map: {
    title: 'MAP',
    description: 'Context is established and understood. Risks related to the AI system are identified.',
    subcategories: {
      'MP-1': {
        title: 'Context & Scope',
        description: 'Context is established and understood.',
        controls: [
          'Document intended purpose and scope of each AI system',
          'Identify all stakeholders affected by the AI system',
          'Map data flows and dependencies',
          'Document deployment context and constraints',
        ]
      },
      'MP-2': {
        title: 'Risk Identification',
        description: 'Categorization of the AI system is performed.',
        controls: [
          'Classify AI systems by risk tier (low, medium, high, critical)',
          'Identify potential harms and impacts on individuals and groups',
          'Assess fairness and bias risks across protected classes',
          'Document data provenance and quality risks',
        ]
      },
      'MP-3': {
        title: 'Benefit & Cost Analysis',
        description: 'AI system benefits and costs are understood.',
        controls: [
          'Document expected benefits and value proposition',
          'Quantify potential costs of failure or misuse',
          'Assess environmental impact of AI system',
          'Compare AI approach vs. non-AI alternatives',
        ]
      },
      'MP-4': {
        title: 'Impact Assessment',
        description: 'Risks and impacts are assessed and documented.',
        controls: [
          'Conduct Algorithmic Impact Assessment (AIA)',
          'Document impacts on civil rights and civil liberties',
          'Assess impacts on vulnerable populations',
          'Evaluate cascading and systemic risks',
        ]
      },
    }
  },
  measure: {
    title: 'MEASURE',
    description: 'AI risks are assessed, analyzed, or tracked. Metrics and methodologies are established.',
    subcategories: {
      'MS-1': {
        title: 'Risk Assessment',
        description: 'Appropriate methods and metrics are identified and applied.',
        controls: [
          'Define quantitative and qualitative risk metrics',
          'Establish performance benchmarks and thresholds',
          'Implement bias detection and measurement tools',
          'Conduct regular validity and reliability testing',
        ]
      },
      'MS-2': {
        title: 'Evaluation & Validation',
        description: 'AI systems are evaluated for trustworthy characteristics.',
        controls: [
          'Test for accuracy, fairness, and robustness',
          'Conduct adversarial testing and red-teaming',
          'Validate model performance across demographic groups',
          'Document evaluation results and maintain evaluation records',
        ]
      },
      'MS-3': {
        title: 'Risk Tracking',
        description: 'AI risks are tracked over time.',
        controls: [
          'Implement continuous performance monitoring',
          'Track model drift and data distribution changes',
          'Monitor for emergent risks and unintended behaviors',
          'Maintain risk register and update regularly',
        ]
      },
      'MS-4': {
        title: 'Feedback Integration',
        description: 'Feedback about efficacy of measurement is collected and integrated.',
        controls: [
          'Establish feedback loops from end users and affected parties',
          'Incorporate incident reports into measurement processes',
          'Review and update metrics based on operational experience',
          'Benchmark against industry best practices',
        ]
      },
    }
  },
  manage: {
    title: 'MANAGE',
    description: 'AI risks are prioritized, responded to, and resources are allocated based on assessed impact.',
    subcategories: {
      'MG-1': {
        title: 'Risk Prioritization',
        description: 'AI risks based on assessments and other analytical output are prioritized, responded to, and managed.',
        controls: [
          'Prioritize risks based on likelihood and impact',
          'Develop risk treatment plans (mitigate, accept, transfer, avoid)',
          'Allocate resources proportional to risk level',
          'Establish risk response timelines and accountability',
        ]
      },
      'MG-2': {
        title: 'Risk Treatment',
        description: 'Strategies to maximize AI benefits and minimize negative impacts are planned, prepared, implemented, documented, and informed by input from relevant stakeholders.',
        controls: [
          'Implement technical safeguards (guardrails, human-in-the-loop)',
          'Deploy bias mitigation techniques',
          'Establish data governance controls',
          'Implement privacy-preserving measures',
        ]
      },
      'MG-3': {
        title: 'Incident Response',
        description: 'AI risks and benefits from third-party entities are managed.',
        controls: [
          'Develop AI-specific incident response procedures',
          'Establish escalation paths for AI failures',
          'Conduct post-incident reviews and lessons learned',
          'Maintain communication protocols for affected parties',
        ]
      },
      'MG-4': {
        title: 'Continuous Improvement',
        description: 'Risk treatments, including response and recovery, and communication plans for the identified and measured AI risks are documented and monitored regularly.',
        controls: [
          'Schedule periodic AI system reviews and re-assessments',
          'Update policies based on regulatory changes',
          'Implement decommissioning procedures',
          'Track and report on improvement initiatives',
        ]
      },
    }
  }
};

const INDUSTRY_POLICIES = {
  Healthcare: {
    regulations: ['HIPAA', 'FDA AI/ML Guidelines', '21st Century Cures Act', 'EU MDR'],
    additionalControls: [
      'Ensure HIPAA compliance for all PHI processed by AI',
      'Obtain FDA clearance for clinical decision support AI',
      'Maintain clinical validation documentation',
      'Implement patient consent mechanisms for AI-assisted care',
      'Ensure AI outputs are reviewed by licensed clinicians',
    ],
    riskFactors: ['Patient safety', 'Clinical accuracy', 'Health equity', 'Data privacy'],
    complianceNotes: 'Healthcare AI systems that influence clinical decisions are subject to stringent regulatory oversight. FDA has published specific guidance for AI/ML-based Software as a Medical Device (SaMD).'
  },
  Finance: {
    regulations: ['SR 11-7', 'ECOA', 'FCRA', 'GDPR', 'Basel III'],
    additionalControls: [
      'Comply with model risk management guidance (SR 11-7)',
      'Ensure fair lending compliance for credit decisions',
      'Maintain model inventory and validation documentation',
      'Implement explainability for adverse action notices',
      'Conduct disparate impact analysis',
    ],
    riskFactors: ['Financial harm', 'Discrimination', 'Market manipulation', 'Systemic risk'],
    complianceNotes: 'Financial AI systems must comply with existing consumer protection laws. Model risk management expects thorough validation and ongoing monitoring.'
  },
  Business: {
    regulations: ['FTC Act Section 5', 'CCPA/CPRA', 'State AI Laws'],
    additionalControls: [
      'Ensure transparency in AI-powered business decisions',
      'Comply with consumer data protection regulations',
      'Implement AI impact assessments for employment decisions',
      'Maintain audit trails for AI-driven operations',
    ],
    riskFactors: ['Consumer harm', 'Unfair practices', 'Data misuse', 'Reputational risk'],
    complianceNotes: 'Business AI applications should follow FTC guidance on AI and algorithmic decision-making, focusing on transparency and fairness.'
  },
  Wellness: {
    regulations: ['FTC Health Claims', 'HIPAA (if applicable)', 'State Consumer Protection'],
    additionalControls: [
      'Validate health and wellness claims made by AI',
      'Ensure AI recommendations are evidence-based',
      'Implement user consent for health data processing',
      'Provide clear disclaimers about AI limitations',
    ],
    riskFactors: ['User safety', 'Misinformation', 'Privacy', 'Vulnerable populations'],
    complianceNotes: 'Wellness AI must be careful about health claims and ensure recommendations do not constitute medical advice without proper oversight.'
  },
  Education: {
    regulations: ['FERPA', 'COPPA', 'State Student Privacy Laws'],
    additionalControls: [
      'Comply with FERPA for student data protection',
      'Implement COPPA safeguards for users under 13',
      'Ensure AI does not discriminate in educational outcomes',
      'Maintain transparency with parents and guardians',
    ],
    riskFactors: ['Student privacy', 'Educational equity', 'Age-appropriate content', 'Algorithmic bias'],
    complianceNotes: 'Educational AI must prioritize student privacy and equitable access. Special protections apply for minors.'
  },
  Government: {
    regulations: ['EO 14110', 'OMB M-24-10', 'NIST AI RMF', 'AIA Requirements'],
    additionalControls: [
      'Comply with Executive Order 14110 on AI Safety',
      'Follow OMB guidance on AI governance in federal agencies',
      'Conduct mandatory Algorithmic Impact Assessments',
      'Ensure public transparency and accountability',
      'Maintain AI use case inventories per OMB requirements',
    ],
    riskFactors: ['Civil rights', 'Public trust', 'National security', 'Equitable access'],
    complianceNotes: 'Government AI use is subject to Executive Orders and OMB directives requiring risk management, impact assessments, and public transparency.'
  },
};

function generatePolicies(aiSystem, organization) {
  const industry = organization.industry || 'Business';
  const riskLevel = aiSystem.risk_level || 'medium';
  const industryConfig = INDUSTRY_POLICIES[industry] || INDUSTRY_POLICIES.Business;
  const policies = [];

  for (const [catKey, category] of Object.entries(NIST_RMF_FRAMEWORK)) {
    for (const [subKey, sub] of Object.entries(category.subcategories)) {
      let content = `## ${sub.title} (${subKey})\n\n`;
      content += `**Framework Category:** ${category.title}\n`;
      content += `**Description:** ${sub.description}\n\n`;
      content += `### Required Controls\n\n`;

      for (const ctrl of sub.controls) {
        content += `- ${ctrl}\n`;
      }

      // Add industry-specific controls
      if (catKey === 'govern' && industryConfig.additionalControls.length > 0) {
        content += `\n### Industry-Specific Controls (${industry})\n\n`;
        for (const ctrl of industryConfig.additionalControls.slice(0, 3)) {
          content += `- ${ctrl}\n`;
        }
      }

      // Risk-level-specific additions
      if (riskLevel === 'high' || riskLevel === 'critical') {
        content += `\n### High-Risk Requirements\n\n`;
        content += `- Implement enhanced oversight and review procedures\n`;
        content += `- Require human approval for consequential decisions\n`;
        content += `- Conduct independent third-party audits annually\n`;
        content += `- Maintain comprehensive documentation for regulatory inspection\n`;
      }

      // Compliance notes
      content += `\n### Applicable Regulations\n\n`;
      content += `${industryConfig.regulations.join(', ')}\n\n`;
      content += `**Note:** ${industryConfig.complianceNotes}\n`;

      policies.push({
        title: `${subKey}: ${sub.title}`,
        category: catKey,
        subcategory: subKey,
        content,
        risk_level: riskLevel,
        industry,
      });
    }
  }

  return policies;
}

function generateChecklist(aiSystem, organization) {
  const industry = organization.industry || 'Business';
  const riskLevel = aiSystem.risk_level || 'medium';
  const items = [];

  // Governance checklist
  items.push(
    { category: 'govern', item: 'Establish AI governance committee', priority: 'high', status: 'pending' },
    { category: 'govern', item: 'Document AI governance policy', priority: 'high', status: 'pending' },
    { category: 'govern', item: 'Define roles and responsibilities (RACI)', priority: 'high', status: 'pending' },
    { category: 'govern', item: 'Conduct AI ethics training', priority: 'medium', status: 'pending' },
    { category: 'govern', item: 'Publish AI principles', priority: 'medium', status: 'pending' },
  );

  // Map checklist
  items.push(
    { category: 'map', item: 'Document AI system purpose and scope', priority: 'high', status: 'pending' },
    { category: 'map', item: 'Identify all stakeholders', priority: 'high', status: 'pending' },
    { category: 'map', item: 'Classify risk level', priority: 'high', status: 'pending' },
    { category: 'map', item: 'Conduct Algorithmic Impact Assessment', priority: 'high', status: 'pending' },
    { category: 'map', item: 'Map data flows and dependencies', priority: 'medium', status: 'pending' },
  );

  // Measure checklist
  items.push(
    { category: 'measure', item: 'Define performance metrics and thresholds', priority: 'high', status: 'pending' },
    { category: 'measure', item: 'Implement bias detection tools', priority: 'high', status: 'pending' },
    { category: 'measure', item: 'Conduct fairness testing across demographics', priority: 'high', status: 'pending' },
    { category: 'measure', item: 'Set up continuous monitoring', priority: 'medium', status: 'pending' },
    { category: 'measure', item: 'Establish feedback mechanisms', priority: 'medium', status: 'pending' },
  );

  // Manage checklist
  items.push(
    { category: 'manage', item: 'Develop risk treatment plans', priority: 'high', status: 'pending' },
    { category: 'manage', item: 'Create incident response procedures', priority: 'high', status: 'pending' },
    { category: 'manage', item: 'Implement human-in-the-loop controls', priority: riskLevel === 'high' ? 'critical' : 'high', status: 'pending' },
    { category: 'manage', item: 'Schedule periodic re-assessments', priority: 'medium', status: 'pending' },
    { category: 'manage', item: 'Document decommissioning procedures', priority: 'low', status: 'pending' },
  );

  return items;
}

function generateRACIMatrix(organization) {
  return [
    { activity: 'AI Governance Policy Development', responsible: 'AI Ethics Lead', accountable: 'CTO/CISO', consulted: 'Legal, Compliance', informed: 'All Staff' },
    { activity: 'Risk Assessment', responsible: 'AI Risk Manager', accountable: 'AI Ethics Lead', consulted: 'Data Scientists, Domain Experts', informed: 'Executive Leadership' },
    { activity: 'Bias Testing & Fairness', responsible: 'ML Engineers', accountable: 'AI Ethics Lead', consulted: 'DEI Team, Legal', informed: 'Product Owners' },
    { activity: 'Model Validation', responsible: 'ML Engineers', accountable: 'CTO', consulted: 'Domain Experts, QA', informed: 'Stakeholders' },
    { activity: 'Incident Response', responsible: 'DevOps/SRE', accountable: 'CISO', consulted: 'Legal, PR', informed: 'Executive Leadership' },
    { activity: 'Regulatory Compliance', responsible: 'Compliance Officer', accountable: 'CLO', consulted: 'AI Ethics Lead, Product', informed: 'All Staff' },
    { activity: 'Continuous Monitoring', responsible: 'MLOps Team', accountable: 'AI Risk Manager', consulted: 'Data Engineers', informed: 'Product Owners' },
    { activity: 'Stakeholder Communication', responsible: 'Product Manager', accountable: 'CEO', consulted: 'PR, Legal', informed: 'All Stakeholders' },
  ];
}

function calculateMaturityScore(gapAnalysis) {
  const categories = { govern: [], map: [], measure: [], manage: [] };
  
  for (const gap of gapAnalysis) {
    if (categories[gap.category]) {
      let score = 0;
      if (gap.answer === 'covered') score = 5;
      else if (gap.answer === 'needs_improvement') score = 3;
      else if (gap.answer === 'missing') score = 1;
      categories[gap.category].push(score);
    }
  }

  const result = {};
  for (const [cat, scores] of Object.entries(categories)) {
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      result[cat] = Math.round(avg * 10) / 10;
    } else {
      result[cat] = 1;
    }
  }

  result.overall = Math.round(
    (Object.values(result).reduce((a, b) => a + b, 0) / Object.keys(result).length) * 10
  ) / 10;

  return result;
}

function generateMonitoringPlan(aiSystem) {
  const plans = [
    { metric_name: 'Model Accuracy', metric_type: 'performance', frequency: 'Weekly', threshold: 'Below 95% triggers review', responsible_party: 'ML Engineering' },
    { metric_name: 'Prediction Drift', metric_type: 'drift', frequency: 'Daily', threshold: 'PSI > 0.2 triggers retraining', responsible_party: 'MLOps' },
    { metric_name: 'Fairness Metrics (Demographic Parity)', metric_type: 'fairness', frequency: 'Monthly', threshold: 'Disparity ratio > 0.8', responsible_party: 'AI Ethics Lead' },
    { metric_name: 'Data Quality Score', metric_type: 'data_quality', frequency: 'Daily', threshold: 'Below 90% triggers investigation', responsible_party: 'Data Engineering' },
    { metric_name: 'System Latency', metric_type: 'performance', frequency: 'Real-time', threshold: 'P99 > 500ms triggers alert', responsible_party: 'DevOps' },
    { metric_name: 'User Feedback Score', metric_type: 'feedback', frequency: 'Monthly', threshold: 'Below 3.5/5 triggers review', responsible_party: 'Product Manager' },
    { metric_name: 'Incident Rate', metric_type: 'safety', frequency: 'Weekly', threshold: 'Any critical incident triggers immediate review', responsible_party: 'CISO' },
  ];

  if (aiSystem.risk_level === 'high' || aiSystem.risk_level === 'critical') {
    plans.push(
      { metric_name: 'Adversarial Robustness', metric_type: 'security', frequency: 'Quarterly', threshold: 'Any vulnerability triggers remediation', responsible_party: 'Security Team' },
      { metric_name: 'Regulatory Compliance Check', metric_type: 'compliance', frequency: 'Quarterly', threshold: 'Any non-compliance triggers escalation', responsible_party: 'Compliance Officer' },
    );
  }

  return plans;
}

function estimateRiskCost(aiSystem, organization) {
  const riskMultipliers = { low: 1, medium: 2.5, high: 5, critical: 10 };
  const sizeMultipliers = { '1-50': 0.5, '50-100': 1, '100-500': 2, '500-1000': 3, '1000+': 5 };
  
  const riskMult = riskMultipliers[aiSystem.risk_level] || 2.5;
  const sizeMult = sizeMultipliers[organization.size] || 1;
  const baseCost = 50000;

  return {
    estimated_non_compliance_cost: `$${(baseCost * riskMult * sizeMult).toLocaleString()} - $${(baseCost * riskMult * sizeMult * 3).toLocaleString()}`,
    operational_risk_exposure: riskMult > 3 ? 'High' : riskMult > 1.5 ? 'Medium' : 'Low',
    recommended_investment: `$${(baseCost * riskMult * sizeMult * 0.1).toLocaleString()} - $${(baseCost * riskMult * sizeMult * 0.3).toLocaleString()} annually`,
    factors: [
      `Risk Level: ${aiSystem.risk_level}`,
      `Organization Size: ${organization.size}`,
      `Industry: ${organization.industry}`,
      `Regulatory Exposure: ${(organization.regulatory_exposure || []).join(', ') || 'Standard'}`,
    ]
  };
}

module.exports = {
  NIST_RMF_FRAMEWORK,
  INDUSTRY_POLICIES,
  generatePolicies,
  generateChecklist,
  generateRACIMatrix,
  calculateMaturityScore,
  generateMonitoringPlan,
  estimateRiskCost,
};
