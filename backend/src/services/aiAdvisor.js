const Anthropic = require('@anthropic-ai/sdk').default;

const SYSTEM_PROMPT = `You are an expert AI governance advisor specializing in the NIST AI Risk Management Framework (AI RMF). You help organizations build, implement, and improve their AI governance policies.

Your expertise covers:
- NIST AI RMF functions: GOVERN, MAP, MEASURE, MANAGE
- Industry-specific AI regulations: HIPAA, EU AI Act, FDA AI/ML guidance, CCPA, FERPA, SR 11-7, NYC Local Law 144, Colorado AI Act
- AI ethics, fairness, bias mitigation, and responsible AI practices
- Risk assessment methodologies for AI systems
- Maturity model assessments for AI governance programs

When advising:
1. Be specific and actionable - give concrete steps, not vague guidance
2. Reference specific NIST AI RMF subcategories (GV-1, MP-2, MS-3, MG-4, etc.) when relevant
3. Consider the organization's industry, size, and risk profile
4. Flag regulatory compliance requirements that may apply
5. Provide prioritized recommendations when asked

Format responses in clear markdown with headers and bullet points for readability. Keep responses focused and practical.`;

class AIAdvisor {
  constructor() {
    this.client = null;
    this.available = false;

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        this.available = true;
        console.log('✅ Claude AI Advisor initialized');
      } catch (err) {
        console.warn('⚠️ Claude AI Advisor failed to initialize:', err.message);
      }
    } else {
      console.log('ℹ️ Claude AI Advisor disabled (no ANTHROPIC_API_KEY)');
    }
  }

  isAvailable() {
    return this.available;
  }

  async ask(userMessage, context = {}) {
    if (!this.available) {
      throw new Error('AI Advisor is not configured. Add ANTHROPIC_API_KEY to enable.');
    }

    // Build context-aware prompt
    let contextBlock = '';
    if (context.organization) {
      contextBlock += `\n\nOrganization Context:\n- Name: ${context.organization.name}\n- Industry: ${context.organization.industry || 'Not specified'}\n- Size: ${context.organization.size || 'Not specified'}\n- Geography: ${context.organization.geography || 'Not specified'}\n- Regulatory Exposure: ${(context.organization.regulatory_exposure || []).join(', ') || 'None specified'}`;
    }
    if (context.aiSystem) {
      contextBlock += `\n\nAI System Context:\n- Name: ${context.aiSystem.name}\n- Use Case: ${context.aiSystem.use_case || 'Not specified'}\n- Risk Level: ${context.aiSystem.risk_level || 'medium'}\n- Human-in-the-Loop: ${context.aiSystem.human_in_loop ? 'Yes' : 'No'}\n- Data Types: ${(context.aiSystem.input_data_types || []).join(', ') || 'Not specified'}`;
    }
    if (context.gapSummary) {
      contextBlock += `\n\nGap Analysis Summary:\n${context.gapSummary}`;
    }
    if (context.maturityScores) {
      contextBlock += `\n\nMaturity Scores:\n${JSON.stringify(context.maturityScores, null, 2)}`;
    }

    const fullMessage = contextBlock
      ? `${userMessage}\n\n---\n[Context provided for reference]${contextBlock}`
      : userMessage;

    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: fullMessage }],
      });

      return {
        response: response.content[0].text,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
        },
      };
    } catch (err) {
      console.error('AI Advisor error:', err.message);
      throw new Error(`AI Advisor error: ${err.message}`);
    }
  }

  async reviewPolicy(policyContent, context = {}) {
    const prompt = `Review the following AI governance policy and provide:
1. **Strengths** - What the policy does well
2. **Gaps** - What's missing or insufficient
3. **Recommendations** - Specific improvements to make
4. **Regulatory Risks** - Any compliance concerns based on the organization's context

Policy Content:
${policyContent}`;

    return this.ask(prompt, context);
  }

  async suggestRemediations(gaps, context = {}) {
    const gapList = gaps.map(g =>
      `- [${g.category.toUpperCase()}] ${g.question}: ${g.answer}`
    ).join('\n');

    const prompt = `Based on the following gap analysis results, provide prioritized remediation recommendations. For each gap marked as "missing" or "needs_improvement", suggest specific actions, timelines, and responsible parties.

Gap Analysis Results:
${gapList}`;

    return this.ask(prompt, context);
  }
}

// Singleton
const advisor = new AIAdvisor();
module.exports = advisor;
