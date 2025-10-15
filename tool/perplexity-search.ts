import { tool } from '@opencode-ai/plugin';

export default tool({
  description: 'Search using Perplexity API with specified model.',
  args: {
    query: tool.schema.string().min(1).max(2000, 'Query must be 2000 characters or less'),
    model: tool.schema.enum(['sonar-pro', 'sonar-reasoning-pro', 'sonar-deep-research']).default('sonar-pro')
  },
  async execute(args) {
    const { query, model } = args;

    // Model-specific configuration
    const temperature = model === 'sonar-pro' ? 0.2
      : model === 'sonar-reasoning-pro' ? 0.3
        : 0.4;

    // Environment variable validation
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      throw new Error('PERPLEXITY_API_KEY required. Get one at https://www.perplexity.ai/settings/api');
    }

    if (!apiKey.startsWith('pplx-')) {
      throw new Error('PERPLEXITY_API_KEY should start with "pplx-". Get a valid key at https://www.perplexity.ai/settings/api');
    }

    // API request to Perplexity
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: query }],
        temperature,
        search_mode: 'academic',
        media_response: {
          overrides: {
            return_videos: false,
            return_images: false
          }
        },
        ...(model === 'sonar-deep-research' && { reasoning_effort: 'high' })
      })
    });

    // Handle HTTP status codes
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Check your PERPLEXITY_API_KEY at https://www.perplexity.ai/settings/api');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait before making another request.');
      } else if (response.status >= 500) {
        throw new Error(`Perplexity server error: ${response.status} ${response.statusText}`);
      } else {
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
      }
    }

    const data: any = await response.json();
    let content = data.choices[0].message.content;

    // Extract and format citations
    if (data.search_results?.length > 0) {
      content += "\n\nCitations:\n";
      data.search_results.forEach((result: any, i: number) => {
        const citation = `[${i + 1}] ${result.title} - ${result.url}`;
        content += citation + '\n';
      });
    }

    return content;
  }
});