# Agents

## Overview

Agents are specialized AI assistants that perform focused tasks within the Agentic workflow. They are invoked by commands to handle specific aspects of research, analysis, and code exploration.

## Agent Types

### Codebase Agents

#### codebase-locator
**Purpose**: Find WHERE files and components live in the codebase.

**Capabilities**:
- Searches for files by keyword
- Identifies directory patterns
- Groups files by purpose
- Returns structured file lists

**Use Cases**:
- Finding all files related to a feature
- Discovering test locations
- Mapping code organization

#### codebase-analyzer
**Purpose**: Understand HOW specific code works.

**Capabilities**:
- Analyzes implementation details
- Traces data flow
- Identifies dependencies
- Explains code logic

**Use Cases**:
- Understanding existing implementations
- Analyzing complex functions
- Tracing system behavior

#### codebase-pattern-finder
**Purpose**: Find similar implementations and patterns.

**Capabilities**:
- Locates usage examples
- Identifies coding patterns
- Finds similar features
- Provides concrete code examples

**Use Cases**:
- Finding patterns to follow
- Discovering existing solutions
- Learning codebase conventions

### Thoughts Agents

#### thoughts-locator
**Purpose**: Discover relevant documents in thoughts/ directory.

**Capabilities**:
- Searches documentation by topic
- Finds related research
- Identifies architectural decisions
- Excludes archive/ directory

**Use Cases**:
- Finding historical context
- Discovering related work
- Understanding decisions

#### thoughts-analyzer
**Purpose**: Extract insights from specific thought documents.

**Capabilities**:
- Deep analysis of documents
- Synthesizes key points
- Identifies connections
- Extracts actionable information

**Use Cases**:
- Understanding architecture
- Reviewing past research
- Extracting requirements

### Web Agent

#### web-search-researcher
**Purpose**: Perform intelligent web research with automatic caching and fallback mechanisms.

**Capabilities**:
- Searches using Perplexity API with model selection based on query complexity
- Caches research in `thoughts/docs/` to avoid duplicate API calls (90-day freshness check)
- Automatically falls back to alternative search tools or webfetch if Perplexity unavailable
- Provides properly cited research with source URLs

**Models Used**:
- `sonar-pro`: Simple factual queries (fastest, most cost-effective)
- `sonar-reasoning-pro`: Complex comparisons and reasoning tasks
- `sonar-deep-research`: Comprehensive research requiring in-depth analysis

**Use Cases**:
- Researching external libraries and frameworks
- Finding best practices and design patterns
- Gathering documentation from authoritative sources
- Understanding industry standards and conventions

**Requirements**:
- `PERPLEXITY_API_KEY` environment variable
- Tool dependencies installed (`bun install` in `.opencode/`)
- Custom tools enabled in OpenCode

**Fallback Strategy**:
1. Primary: Perplexity API with intelligent model selection
2. Secondary: Alternative web search tools (from MCP servers)
3. Tertiary: Direct webfetch for single URLs
4. Reports which method was used in research metadata

## Agent Coordination

### Parallel Execution

Agents can run in parallel for efficiency:
```
Phase 1: Discovery (parallel)
- codebase-locator: Find relevant files
- thoughts-locator: Find relevant docs

Phase 2: Analysis (parallel, after Phase 1)
- codebase-analyzer: Analyze found code
- thoughts-analyzer: Analyze found docs
```

### Sequential Dependencies

Some agents depend on others:
1. **Locators first**: Find what exists
2. **Analyzers second**: Deep dive on findings
3. **Pattern finders**: When seeking examples

## Agent Configuration

Each agent has a markdown configuration file with:

### Frontmatter
```yaml
---
description: Agent purpose and capabilities
mode: subagent
model: anthropic/claude-opus-4-1
temperature: 0.1
tools:
  grep: true
  glob: true
  list: true
  read: false
  write: false
---
```

### Instructions
Detailed prompt explaining:
- Core responsibilities
- Search strategies
- Output format
- Guidelines and constraints

## How Commands Use Agents

### Research Command
1. Spawns codebase-locator to find files
2. Spawns thoughts-locator for documentation
3. May spawn analyzers for deep dives
4. Synthesizes all findings

### Plan Command
1. Uses codebase-locator for context
2. Uses codebase-analyzer for understanding
3. Uses pattern-finder for examples
4. Creates implementation plan

## Agent Best Practices

### For Commands

1. **Spawn appropriately**: Use the right agent for each task
2. **Batch operations**: Run parallel agents when possible
3. **Wait for completion**: Always wait for all agents
4. **Verify results**: Check agent outputs make sense

### For Agent Design

1. **Single responsibility**: Each agent has one clear job
2. **Structured output**: Return organized, parseable results
3. **File references**: Include specific paths and line numbers
4. **Tool restrictions**: Only enable necessary tools

## Creating Custom Agents

### Structure
```markdown
---
description: Clear, concise description
mode: subagent
model: model-identifier
temperature: 0.1  # Lower for deterministic tasks
tools:
  # Enable only needed tools
---

# Agent Name

## Core Responsibilities
What this agent does

## Strategy
How it accomplishes its goals

## Output Format
What it returns

## Guidelines
Important rules and constraints
```

### Naming Convention
- Use descriptive names: `domain-action.md`
- Examples: `codebase-locator.md`, `test-runner.md`

### Tool Selection
- **Read-only agents**: grep, glob, list, read
- **Modification agents**: write, edit, patch
- **Utility agents**: bash, webfetch

## Agent Limitations

### Context Boundaries
- Agents are stateless
- Cannot communicate between instances
- Single response only
- No follow-up interactions

### Tool Restrictions
- Limited to configured tools
- Cannot modify their own configuration
- Cannot spawn other agents
- Must complete in single execution

## Debugging Agents

### Common Issues

1. **Agent returns unexpected results**
   - Check search terms in prompt
   - Verify directory focus
   - Review output format requirements

2. **Agent takes too long**
   - Reduce search scope
   - Be more specific in prompt
   - Break into smaller tasks

3. **Agent misses information**
   - Check if using right agent type
   - Verify search patterns
   - Consider follow-up search

## Agent Evolution

### Versioning
- Agents evolve with workflow needs
- Updates distributed via `agentic pull`
- Backward compatibility maintained

### Customization
- Modify agents for project needs
- Override in local `.opencode/`
- Share improvements upstream

## Related Documentation
- [Commands](./commands.md)
- [Workflow](./workflow.md)
- [Agentic CLI](./agentic.md)