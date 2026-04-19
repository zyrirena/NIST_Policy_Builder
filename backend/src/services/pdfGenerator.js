const PDFDocument = require('pdfkit');
const { NIST_RMF_FRAMEWORK } = require('./policyEngine');

const COLORS = {
  primary: '#5B6ABF',
  secondary: '#7C8FD4',
  accent: '#A8D8B9',
  warning: '#F4C57A',
  danger: '#E8A0A0',
  text: '#2D3748',
  textLight: '#718096',
  bg: '#F7FAFC',
  white: '#FFFFFF',
  headerBg: '#4A5899',
};

function generatePDFReport(data, outputStream) {
  const { organization, aiSystem, policies, gapAnalysis, maturityScores, monitoringPlan, regulatoryAlerts, checklist, raciMatrix, riskEstimate } = data;

  const doc = new PDFDocument({ 
    size: 'A4', 
    margin: 50,
    bufferPages: true,
    info: {
      Title: `NIST AI RMF Policy Report - ${aiSystem.name}`,
      Author: organization.name,
      Subject: 'AI Governance Policy Report',
    }
  });

  doc.pipe(outputStream);

  // --- COVER PAGE ---
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#4A5899');
  
  doc.fontSize(12).fillColor('#A8D8B9').text('NIST AI RISK MANAGEMENT FRAMEWORK', 50, 180, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(32).fillColor('#FFFFFF').text('AI Governance', { align: 'center' });
  doc.fontSize(32).text('Policy Report', { align: 'center' });
  doc.moveDown(1);
  doc.moveTo(150, doc.y).lineTo(450, doc.y).lineWidth(2).strokeColor('#A8D8B9').stroke();
  doc.moveDown(1);
  doc.fontSize(16).fillColor('#D4DAF0').text(aiSystem.name, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(12).text(organization.name, { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('#A0AEC0').text(`Industry: ${organization.industry || 'General'}`, { align: 'center' });
  doc.text(`Risk Level: ${(aiSystem.risk_level || 'medium').toUpperCase()}`, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });
  
  doc.fontSize(9).fillColor('#718096').text('Built with NIST AI RMF Policy Builder', 50, doc.page.height - 80, { align: 'center' });

  // --- TABLE OF CONTENTS ---
  doc.addPage();
  drawPageHeader(doc, 'Table of Contents');
  doc.moveDown(1);
  
  const tocItems = [
    '1. Executive Summary',
    '2. AI System Overview',
    '3. Risk Assessment',
    '4. Policy Recommendations (GOVERN)',
    '5. Policy Recommendations (MAP)',
    '6. Policy Recommendations (MEASURE)',
    '7. Policy Recommendations (MANAGE)',
    '8. Gap Analysis Summary',
    '9. Maturity Assessment',
    '10. Action Checklist',
    '11. RACI Matrix',
    '12. Monitoring Plan',
    '13. Regulatory Alerts',
    '14. Cost & Risk Estimation',
  ];

  for (const item of tocItems) {
    doc.fontSize(12).fillColor(COLORS.text).text(item, 70, doc.y, { continued: false });
    doc.moveDown(0.3);
  }

  // --- EXECUTIVE SUMMARY ---
  doc.addPage();
  drawPageHeader(doc, '1. Executive Summary');
  doc.moveDown(1);

  doc.fontSize(11).fillColor(COLORS.text);
  doc.text(`This report presents the AI governance policy framework for "${aiSystem.name}" operated by ${organization.name}. The framework is aligned with the NIST AI Risk Management Framework (AI RMF) and tailored to the ${organization.industry || 'general'} industry.`);
  doc.moveDown(0.5);
  doc.text(`The AI system has been classified as ${(aiSystem.risk_level || 'medium').toUpperCase()} risk. ${aiSystem.human_in_loop ? 'Human-in-the-loop controls are in place.' : 'This system operates autonomously without human-in-the-loop controls, requiring additional safeguards.'}`);
  doc.moveDown(0.5);

  if (maturityScores) {
    const overall = maturityScores.overall || 2.5;
    doc.text(`Current organizational AI maturity score: ${overall}/5.0. ${overall < 3 ? 'Significant improvements are recommended across multiple areas.' : 'The organization demonstrates foundational AI governance capabilities with room for enhancement.'}`);
  }

  // Key findings box
  doc.moveDown(1);
  drawInfoBox(doc, 'Key Findings', [
    `AI System: ${aiSystem.name} (${aiSystem.deployment_type || 'Standard'} deployment)`,
    `Risk Classification: ${(aiSystem.risk_level || 'Medium').toUpperCase()}`,
    `Industry: ${organization.industry || 'General'}`,
    `Human-in-the-Loop: ${aiSystem.human_in_loop ? 'Yes' : 'No'}`,
    `Regulatory Exposure: ${(organization.regulatory_exposure || []).join(', ') || 'Standard'}`,
  ]);

  // --- AI SYSTEM OVERVIEW ---
  doc.addPage();
  drawPageHeader(doc, '2. AI System Overview');
  doc.moveDown(1);

  const sysDetails = [
    ['System Name', aiSystem.name],
    ['Use Case', aiSystem.use_case || 'Not specified'],
    ['Input Data Types', (aiSystem.input_data_types || []).join(', ') || 'Not specified'],
    ['Output Decisions', aiSystem.output_decisions || 'Not specified'],
    ['Risk Level', (aiSystem.risk_level || 'medium').toUpperCase()],
    ['Human-in-the-Loop', aiSystem.human_in_loop ? 'Yes' : 'No'],
    ['Deployment Type', aiSystem.deployment_type || 'Not specified'],
    ['Status', aiSystem.status || 'Draft'],
  ];

  drawTable(doc, ['Attribute', 'Details'], sysDetails);

  if (aiSystem.description) {
    doc.moveDown(1);
    doc.fontSize(12).fillColor(COLORS.primary).text('System Description', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor(COLORS.text).text(aiSystem.description);
  }

  // --- RISK ASSESSMENT ---
  doc.addPage();
  drawPageHeader(doc, '3. Risk Assessment');
  doc.moveDown(1);

  if (riskEstimate) {
    doc.fontSize(11).fillColor(COLORS.text).text('Based on the organization profile, AI system characteristics, and regulatory environment, the following risk estimates have been calculated:');
    doc.moveDown(0.5);

    const riskData = [
      ['Estimated Non-Compliance Cost', riskEstimate.estimated_non_compliance_cost],
      ['Operational Risk Exposure', riskEstimate.operational_risk_exposure],
      ['Recommended Annual Investment', riskEstimate.recommended_investment],
    ];
    drawTable(doc, ['Metric', 'Estimate'], riskData);

    doc.moveDown(0.5);
    doc.fontSize(10).fillColor(COLORS.textLight).text('Contributing Factors:');
    for (const f of (riskEstimate.factors || [])) {
      doc.text(`  • ${f}`);
    }
  }

  // --- POLICY RECOMMENDATIONS ---
  const categoryOrder = ['govern', 'map', 'measure', 'manage'];
  let sectionNum = 4;

  for (const catKey of categoryOrder) {
    doc.addPage();
    const catPolicies = (policies || []).filter(p => p.category === catKey);
    const framework = NIST_RMF_FRAMEWORK[catKey];
    
    drawPageHeader(doc, `${sectionNum}. Policy Recommendations (${framework.title})`);
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor(COLORS.textLight).text(framework.description);
    doc.moveDown(0.5);

    for (const policy of catPolicies) {
      if (doc.y > 680) doc.addPage();
      
      doc.fontSize(11).fillColor(COLORS.primary).text(policy.title, { underline: true });
      doc.moveDown(0.3);
      
      // Parse content and render
      const lines = policy.content.split('\n').filter(l => l.trim());
      for (const line of lines) {
        if (doc.y > 700) doc.addPage();
        
        if (line.startsWith('## ')) {
          continue; // Skip duplicate headers
        } else if (line.startsWith('### ')) {
          doc.fontSize(10).fillColor(COLORS.secondary).text(line.replace('### ', ''));
        } else if (line.startsWith('- ')) {
          doc.fontSize(9).fillColor(COLORS.text).text(`  • ${line.replace('- ', '')}`, { indent: 10 });
        } else if (line.startsWith('**')) {
          doc.fontSize(9).fillColor(COLORS.text).text(line.replace(/\*\*/g, ''), { bold: true });
        } else {
          doc.fontSize(9).fillColor(COLORS.text).text(line);
        }
      }
      doc.moveDown(0.5);
    }
    sectionNum++;
  }

  // --- GAP ANALYSIS ---
  doc.addPage();
  drawPageHeader(doc, `${sectionNum}. Gap Analysis Summary`);
  sectionNum++;
  doc.moveDown(1);

  if (gapAnalysis && gapAnalysis.length > 0) {
    const gapData = gapAnalysis.map(g => {
      let status = '❓';
      if (g.answer === 'covered') status = '✅ Covered';
      else if (g.answer === 'missing') status = '❌ Missing';
      else if (g.answer === 'needs_improvement') status = '⚠️ Needs Improvement';
      return [(g.category || '').toUpperCase(), g.question, status];
    });

    drawTable(doc, ['Category', 'Control Question', 'Status'], gapData, [80, 300, 100]);

    // Summary counts
    doc.moveDown(1);
    const covered = gapAnalysis.filter(g => g.answer === 'covered').length;
    const missing = gapAnalysis.filter(g => g.answer === 'missing').length;
    const needsImpr = gapAnalysis.filter(g => g.answer === 'needs_improvement').length;

    drawInfoBox(doc, 'Gap Analysis Summary', [
      `✅ Covered: ${covered} controls`,
      `❌ Missing: ${missing} controls`,
      `⚠️ Needs Improvement: ${needsImpr} controls`,
      `Coverage Rate: ${Math.round((covered / gapAnalysis.length) * 100)}%`,
    ]);
  } else {
    doc.fontSize(11).fillColor(COLORS.textLight).text('No gap analysis data available. Complete the gap analysis questionnaire to see results.');
  }

  // --- MATURITY ASSESSMENT ---
  doc.addPage();
  drawPageHeader(doc, `${sectionNum}. Maturity Assessment`);
  sectionNum++;
  doc.moveDown(1);

  if (maturityScores) {
    const matData = Object.entries(maturityScores)
      .filter(([k]) => k !== 'overall')
      .map(([cat, score]) => {
        let level = 'Initial';
        if (score >= 4.5) level = 'Optimizing (Level 5)';
        else if (score >= 3.5) level = 'Managed (Level 4)';
        else if (score >= 2.5) level = 'Defined (Level 3)';
        else if (score >= 1.5) level = 'Developing (Level 2)';
        else level = 'Initial (Level 1)';
        return [cat.toUpperCase(), `${score}/5.0`, level];
      });

    drawTable(doc, ['Category', 'Score', 'Maturity Level'], matData);

    doc.moveDown(0.5);
    doc.fontSize(12).fillColor(COLORS.primary).text(`Overall Maturity Score: ${maturityScores.overall}/5.0`);
  }

  // --- CHECKLIST ---
  doc.addPage();
  drawPageHeader(doc, `${sectionNum}. Action Checklist`);
  sectionNum++;
  doc.moveDown(1);

  if (checklist && checklist.length > 0) {
    const checkData = checklist.map(c => [
      (c.category || '').toUpperCase(),
      c.item,
      c.priority.toUpperCase(),
      '☐',
    ]);
    drawTable(doc, ['Category', 'Action Item', 'Priority', 'Done'], checkData, [70, 280, 70, 40]);
  }

  // --- RACI MATRIX ---
  if (raciMatrix && raciMatrix.length > 0) {
    doc.addPage();
    drawPageHeader(doc, `${sectionNum}. RACI Matrix`);
    sectionNum++;
    doc.moveDown(1);

    const raciData = raciMatrix.map(r => [
      r.activity, r.responsible, r.accountable, r.consulted, r.informed
    ]);
    drawTable(doc, ['Activity', 'Responsible', 'Accountable', 'Consulted', 'Informed'], raciData, [120, 80, 80, 100, 80]);
  }

  // --- MONITORING PLAN ---
  if (monitoringPlan && monitoringPlan.length > 0) {
    doc.addPage();
    drawPageHeader(doc, `${sectionNum}. Continuous Monitoring Plan`);
    sectionNum++;
    doc.moveDown(1);

    const monData = monitoringPlan.map(m => [
      m.metric_name, m.frequency, m.threshold, m.responsible_party
    ]);
    drawTable(doc, ['Metric', 'Frequency', 'Threshold', 'Responsible'], monData, [120, 70, 180, 100]);
  }

  // --- REGULATORY ALERTS ---
  if (regulatoryAlerts && regulatoryAlerts.length > 0) {
    doc.addPage();
    drawPageHeader(doc, `${sectionNum}. Regulatory Alerts`);
    sectionNum++;
    doc.moveDown(1);

    for (const alert of regulatoryAlerts) {
      if (doc.y > 680) doc.addPage();
      
      const severityColor = alert.severity === 'high' ? '#E53E3E' : alert.severity === 'medium' ? '#DD6B20' : '#38A169';
      doc.rect(doc.x, doc.y, 5, 40).fill(severityColor);
      doc.fontSize(11).fillColor(COLORS.text).text(alert.title, doc.x + 15, doc.y - 38, { width: 460 });
      doc.moveDown(0.2);
      doc.fontSize(9).fillColor(COLORS.textLight).text(`${alert.regulation || ''} | ${alert.geography || ''}`, doc.x + 15);
      doc.moveDown(0.2);
      doc.fontSize(9).fillColor(COLORS.text).text(alert.description || '', doc.x + 15, doc.y, { width: 450 });
      doc.moveDown(1);
    }
  }

  // --- RISK ESTIMATION ---
  if (riskEstimate) {
    doc.addPage();
    drawPageHeader(doc, `${sectionNum}. Cost & Risk Estimation`);
    sectionNum++;
    doc.moveDown(1);

    drawInfoBox(doc, 'Financial Risk Summary', [
      `Estimated Non-Compliance Cost: ${riskEstimate.estimated_non_compliance_cost}`,
      `Operational Risk Exposure: ${riskEstimate.operational_risk_exposure}`,
      `Recommended Annual Investment: ${riskEstimate.recommended_investment}`,
    ]);
  }

  // --- FOOTER ON ALL PAGES ---
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor(COLORS.textLight)
      .text(`${organization.name} | NIST AI RMF Policy Report | Page ${i + 1} of ${pages.count}`,
        50, doc.page.height - 30, { align: 'center', width: doc.page.width - 100 });
  }

  doc.end();
  return doc;
}

function drawPageHeader(doc, title) {
  doc.rect(0, 0, doc.page.width, 60).fill(COLORS.headerBg);
  doc.fontSize(18).fillColor(COLORS.white).text(title, 50, 20);
  doc.y = 80;
}

function drawInfoBox(doc, title, items) {
  const startY = doc.y;
  const boxHeight = 20 + items.length * 18;
  
  doc.roundedRect(50, startY, 495, boxHeight, 5).fill('#EBF4FF');
  doc.fontSize(11).fillColor(COLORS.primary).text(title, 60, startY + 8);
  
  let y = startY + 25;
  for (const item of items) {
    doc.fontSize(9).fillColor(COLORS.text).text(item, 70, y);
    y += 16;
  }
  doc.y = startY + boxHeight + 10;
}

function drawTable(doc, headers, rows, colWidths) {
  const tableWidth = 495;
  const defaultWidths = headers.map(() => Math.floor(tableWidth / headers.length));
  const widths = colWidths || defaultWidths;
  const startX = 50;
  let y = doc.y;

  // Header row
  doc.rect(startX, y, tableWidth, 22).fill(COLORS.primary);
  let x = startX + 5;
  for (let i = 0; i < headers.length; i++) {
    doc.fontSize(8).fillColor(COLORS.white).text(headers[i], x, y + 6, { width: widths[i] - 10 });
    x += widths[i];
  }
  y += 22;

  // Data rows
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const rowHeight = 20;
    
    if (y + rowHeight > 720) {
      doc.addPage();
      y = 80;
    }

    const bgColor = r % 2 === 0 ? '#F7FAFC' : COLORS.white;
    doc.rect(startX, y, tableWidth, rowHeight).fill(bgColor);
    
    x = startX + 5;
    for (let i = 0; i < row.length; i++) {
      doc.fontSize(7.5).fillColor(COLORS.text).text(String(row[i] || ''), x, y + 5, { width: widths[i] - 10, height: rowHeight - 5, ellipsis: true });
      x += widths[i];
    }
    y += rowHeight;
  }

  doc.y = y + 5;
}

module.exports = { generatePDFReport };
