import { tool } from '@opencode-ai/plugin';

export default tool({
  description: 'Simple heuristic to recommend which Perplexity model to use.',
  args: {
    query: tool.schema.string().min(1, 'Query cannot be empty')
  },
  async execute(args) {
    const { query } = args;
    // Validate query input and provide clear error messages
    if (!query?.trim()) {
      throw new Error('Query cannot be empty');
    }

    const q = query.toLowerCase();

    function buildPattern(keywords: string[]): RegExp {
      const escaped = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      return new RegExp('\\b(' + escaped.join('|') + ')\\b', 'i');
    }

    const researchPattern = buildPattern([
      'analyze', 'analysis', 'investigate', 'investigation', 'comprehensive', 'in-depth', 'detailed analysis',
      'trends in', 'future of', 'evolution of', 'state of', 'review of',
      'survey of', 'systematic', 'thorough', 'extensive', 'deep dive'
    ]);

    const complexPattern = buildPattern([
      'how', 'why', 'explain', 'compare', 'contrast', 'difference between',
      'pros and cons', 'advantage', 'advantages', 'disadvantage', 'disadvantages',
      'benefit', 'benefits', 'drawback', 'drawbacks',
      'relationship between', 'impact of', 'effect of', 'cause', 'reason'
    ]);

    const technicalPattern = buildPattern([
      'algorithm', 'algorithms', 'framework', 'frameworks', 'architecture',
      'implementation', 'implementations', 'protocol', 'protocols',
      'methodology', 'methodologies', 'technique', 'techniques', 'approach', 'approaches',
      'system', 'systems', 'model', 'models', 'theory', 'theories',
      'concept', 'concepts', 'principle', 'principles', 'mechanism', 'mechanisms',
      'process', 'processes', 'procedure', 'procedures',
      'typescript', 'javascript', 'vue', 'python', 'react', 'node', 'api',
      'dataset', 'datasets', 'database', 'databases', 'machine learning', 'ai',
      'blockchain', 'cloud', 'devops'
    ]);

    const temporalPattern = buildPattern([
      'latest', 'current', 'recent', 'now', 'today', 'this year', 'new',
      'update', 'updated', 'updates', 'modern', 'contemporary', 'up-to-date', 'fresh', 'live'
    ]);

    // Simple rule-based classification (hierarchical if/then rules)

    // 1. Research keywords → deep research model
    if (researchPattern.test(q)) {
      return `Recommended model: sonar-deep-research\nReasoning: Research/analysis keywords detected`;
    }

    // 2. Complex reasoning → reasoning model
    if (complexPattern.test(q)) {
      return `Recommended model: sonar-reasoning-pro\nReasoning: Complex reasoning keywords detected`;
    }

    // 3. Technical + temporal (current tech) → reasoning model
    if (technicalPattern.test(q) && temporalPattern.test(q)) {
      return `Recommended model: sonar-reasoning-pro\nReasoning: Technical query with temporal context`;
    }

    // 4. Default to simple model
    return `Recommended model: sonar-pro\nReasoning: Simple factual query`;
  }
});