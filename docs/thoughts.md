# Thoughts Directory Structure

## Overview

The `thoughts/` directory is your project's knowledge base, containing all documentation, research, plans, and decisions. It serves as persistent memory for both human developers and AI agents.

## Directory Structure

```
thoughts/
├── architecture/     # System design and decisions
├── tickets/         # Work items and feature requests
├── research/        # Analysis and findings
├── plans/          # Implementation specifications
├── reviews/        # Post-implementation validation
├── docs/           # External web research cache
└── archive/        # Outdated documents (excluded from searches)
```

## Directory Purposes

### architecture/

**Purpose**: Foundational design documents that guide development.

**Common Files**:
- `overview.md` - High-level system outline
- `system-architecture.md` - Technical infrastructure
- `domain-model.md` - Business logic and features
- `testing-strategy.md` - Testing approaches
- `development-workflow.md` - Process documentation
- `persistence.md` - Data storage design

**Usage**:
- Referenced during research phase
- Updated when architecture evolves
- Source of truth for design decisions

### tickets/

**Purpose**: Track work items, issues, and feature requests.

**File Format**: `[type]-[number].md` (e.g., `eng-123.md`, `bug-456.md`)

**Content Structure**:
```markdown
# [Type]-[Number]: [Title]

## Description
What needs to be done and why

## Requirements
- Specific requirement 1
- Specific requirement 2

## Success Criteria
- How to verify completion

## Context
Any relevant background information
```

**Usage**:
- Starting point for research phase
- Defines scope and requirements
- Will sync with external trackers (future)

### research/

**Purpose**: Store findings from codebase and thoughts analysis.

**File Format**: `YYYY-MM-DD_topic.md`

**Content Structure**:
- YAML frontmatter with metadata
- Summary of findings
- Detailed analysis with file references
- Architecture insights
- Historical context from thoughts
- Open questions

**Usage**:
- Input for planning phase
- Historical reference
- Knowledge accumulation

### plans/

**Purpose**: Detailed implementation specifications.

**File Format**: `descriptive-name.md`

**Content Structure**:
- Overview and approach
- Phased implementation steps
- Specific code changes
- Success criteria (automated and manual)
- Testing strategy
- References to ticket and research

**Usage**:
- Guide for implementation phase
- Track progress with checkmarks
- Source for review phase

### reviews/

**Purpose**: Post-implementation validation and documentation.

**File Format**: `YYYY-MM-DD_review.md`

**Content Structure**:
- Implementation summary
- Deviations from plan
- Verification results
- Lessons learned
- Recommendations

**Usage**:
- Closes the loop on tickets
- Documents implementation reality
- Captures improvements for future

### docs/

**Purpose**: Cache external web research to avoid duplicate API calls and preserve sources.

**File Format**: `YYYY-MM-DD_topic.md`

**Content Structure**:
- Research metadata (date, method, query)
- Summary of findings
- Detailed information with citations
- Source URLs for verification

**Usage**:
- Automatically populated by `web-search-researcher` agent
- Checked before new web searches (90-day freshness)
- Referenced during research and planning phases
- Provides authoritative external sources

**Important Notes**:
- Created automatically when web research is performed
- Can use Perplexity API key to populate
- Falls under same search patterns as other thoughts directories

### archive/

**Purpose**: Store outdated documents that are no longer relevant.

**Important Notes**:
- **Excluded from all searches** by AI agents
- Contains misleading or outdated information
- Kept for historical record only
- Subject to future deletion

**When to Archive**:
- Code has significantly changed
- Architecture has evolved
- Requirements were cancelled
- Information is superseded

## File Naming Conventions

### Timestamps
Use ISO format: `YYYY-MM-DD` (e.g., `2025-01-15`)

### Descriptive Names
- Use kebab-case: `user-authentication-plan.md`
- Be specific: `oauth-google-implementation.md`
- Avoid generic names: ~~`plan1.md`~~

### Type Prefixes
- `eng-` for engineering tasks
- `bug-` for bug fixes
- `feat-` for features
- `arch-` for architecture changes

## Frontmatter Standards

Research and review documents use YAML frontmatter:

```yaml
---
date: 2025-01-15T10:30:00Z
researcher: Opus
git_commit: abc123def456
branch: feature/oauth
repository: my-app
topic: "Google OAuth Implementation"
tags: [auth, oauth, security]
status: complete
last_updated: 2025-01-15
last_updated_by: Opus
---
```

## Search Behavior

### How Agents Search

1. **thoughts-locator**: Finds relevant documents by topic
2. **thoughts-analyzer**: Extracts insights from specific documents
3. **Archive exclusion**: Never searches archive/ directory

### Search Priority

1. **architecture/** - System design truth
2. **research/** - Recent analysis
3. **plans/** and **reviews/** - Implementation history
4. **tickets/** - Upcoming work
5. ~~**archive/**~~ - Never searched

## Best Practices

### Organization

1. **Keep files focused**: One topic per document
2. **Use clear names**: Immediately understandable
3. **Archive regularly**: Move outdated docs
4. **Cross-reference**: Link related documents

### Content Quality

1. **Be specific**: Include file paths and line numbers
2. **Date everything**: Add timestamps to documents
3. **Explain decisions**: Document the "why"
4. **Update metadata**: Keep frontmatter current

### Maintenance

1. **Regular reviews**: Quarterly architecture review
2. **Archive outdated**: Move irrelevant docs
3. **Update references**: Fix broken links
4. **Consolidate**: Merge related documents

## Working with Thoughts

### Creating New Documents

1. Choose appropriate directory
2. Use naming conventions
3. Include required frontmatter
4. Cross-reference related docs

### Updating Existing Documents

1. Update `last_updated` fields
2. Add update notes
3. Preserve historical context
4. Consider archiving if major changes

### Archiving Documents

1. Move to `archive/` directory
2. Add archive note to top:
   ```markdown
   > **ARCHIVED**: [Date] - [Reason]
   ```
3. Update any references
4. Consider creating successor document

## Integration with Workflow

### Research Phase
- Searches all thoughts (except archive)
- Creates new research documents
- References architecture for context

### Planning Phase
- Reads research and tickets
- May reference previous plans
- Creates new plan documents

### Review Phase
- Compares implementation to plan
- Creates review documents
- May trigger architecture updates

## Common Patterns

### Feature Development
```
tickets/feat-123.md
  ↓
research/2025-01-15_oauth-research.md
  ↓
plans/oauth-implementation.md
  ↓
reviews/2025-01-20_oauth-review.md
```

### Architecture Evolution
```
architecture/v1/system-architecture.md
  ↓
tickets/arch-001.md
  ↓
architecture/v2/system-architecture.md
  ↓
archive/architecture/v1/
```

### Bug Investigation
```
tickets/bug-456.md
  ↓
research/2025-01-15_memory-leak.md
  ↓
plans/memory-leak-fix.md
  ↓
reviews/2025-01-16_memory-fix-review.md
```

## Tips for Effective Thoughts

1. **Start Small**: Begin with basic architecture docs
2. **Build Over Time**: Add documents as needed
3. **Stay Current**: Update regularly
4. **Be Ruthless**: Archive aggressively
5. **Cross-Link**: Connect related information

## Related Documentation
- [Architecture](./architecture.md)
- [Workflow](./workflow.md)
- [Commands](./commands.md)
- [Usage Guide](./usage.md)