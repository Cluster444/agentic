---
description: Initialize architecture documentation for a new project. Creates foundational design documents in thoughts/architecture/ directory.
---

# Initialize Architecture Documentation

You are creating the foundational architecture documentation structure for a project. These documents guide both human developers and AI agents throughout the development lifecycle by serving as the single source of truth for design decisions, technical constraints, and system behavior.

## Steps to follow:

### 1. Check for existing architecture

Check if `thoughts/architecture/` directory exists and contains files.

If files exist:
- List existing files to the user
- Ask: "Architecture documentation already exists. Would you like to (1) Skip and keep existing, (2) Add missing files only, or (3) Regenerate all files?"
- Proceed based on user choice

If directory doesn't exist, proceed to create it.

### 2. Gather project context

Ask focused questions to understand the project:

1. What is this project? (Brief description of purpose and scope)
2. What is the primary tech stack? (Languages, frameworks, key libraries)
3. Does this project have: APIs, CLI, event-driven components, or other interfaces?

Keep questions minimal and focused. Use responses to determine which documents to create.

### 3. Create architecture directory structure

Create `thoughts/architecture/` directory if it doesn't exist.

### 4. Generate core architecture documents

Create these **required** documents with appropriate placeholder content:

**thoughts/architecture/overview.md** - High-level navigation guide
- Synopsis of each architecture document
- How documents relate to each other
- Quick reference for project structure

**thoughts/architecture/system-architecture.md** - Technical infrastructure
- Programming languages and usage patterns
- Frameworks, libraries, dependencies
- Infrastructure components (databases, caches, queues, etc.)
- Build and deployment tooling
- Development environment requirements
- Configuration management

**thoughts/architecture/domain-model.md** - Business logic and features
- Core domain concepts and entities
- Business rules and constraints
- Key workflows and processes
- Data relationships
- Domain terminology

**thoughts/architecture/testing-strategy.md** - Testing approach
- Unit testing conventions and tools
- Integration testing patterns
- End-to-end testing approach
- Test data management
- Quality gates and coverage targets

**thoughts/architecture/development-workflow.md** - Development process
- Ticket workflow (research → plan → execute → review)
- Code review standards
- Branching strategy
- CI/CD pipeline
- Documentation maintenance

**thoughts/architecture/persistence.md** - Data storage
- Storage technologies and versions
- Schema design principles
- Migration strategy
- Caching approach
- Backup and recovery procedures

### 5. Generate optional documents based on context

Based on user's responses in step 2, create applicable optional documents:

**thoughts/architecture/api-design.md** (if project has APIs)
- Endpoint design patterns
- Authentication and authorization
- Versioning strategy
- Request/response formats
- Error handling conventions

**thoughts/architecture/cli-design.md** (if project has CLI)
- Command structure
- Configuration approach
- Output formatting
- Error handling

**thoughts/architecture/event-bus.md** (if project uses events)
- Event types and schemas
- Publishing and subscription patterns
- Error handling and retries

### 6. Populate documents with project-specific content

For each document created:

1. Use a consistent template structure:
```markdown
# [Document Title]

> This document describes [specific purpose]. Last updated: [date]

## Overview

[Brief description of this document's role in the architecture]

## [Section 1]

[Content based on user's project context]

## [Section 2]

[Content based on user's project context]

## TODO

- [ ] [Specific decision or detail needed]
- [ ] [Another item requiring future clarification]

## Related Documentation

- [Link to related architecture document]
```

2. Use placeholder text that prompts users to fill in specifics:
   - "Describe the primary programming language and version"
   - "List key frameworks and explain their usage"
   - "Document database choice and rationale"

3. Include concrete examples only where universally applicable
4. Add TODO sections for project-specific decisions
5. Cross-reference related documents

### 7. Present completion summary

Show user what was created:

```markdown
Architecture documentation initialized in thoughts/architecture/

Core documents created:
  ✓ overview.md - Architecture navigation guide
  ✓ system-architecture.md - Technical infrastructure
  ✓ domain-model.md - Business logic and features
  ✓ testing-strategy.md - Testing approach
  ✓ development-workflow.md - Development process
  ✓ persistence.md - Data storage design

Optional documents created:
  ✓ api-design.md (if applicable)
  ✓ cli-design.md (if applicable)
  ✓ event-bus.md (if applicable)

Next steps:
1. Review each document and fill in TODO sections
2. Replace placeholder text with project-specific details
3. Update documents as architectural decisions are made
4. These docs will be referenced by /research, /plan, and /execute commands
```

Use the todowrite tool to create a structured task list for the 7 steps above, marking each as pending initially.

## Important Guidelines

### Document Content Strategy

**Use placeholders and prompts, not examples:**
- Template text should guide users to add their own details
- Avoid technology-specific examples unless universal
- Use phrases like "Describe your approach to..." or "Document the..."
- Include TODO checklists for items requiring decisions

**Be architecture-agnostic:**
- Don't assume web apps, APIs, or specific patterns
- Adapt document generation to project type
- Create only relevant optional documents
- Scale complexity to project size

**Focus on guidance:**
- Each document should teach what to document
- Explain why each section matters
- Provide structure without dictating content
- Enable users to make informed decisions

### File Management

- Use Write tool to create new files
- Use List tool to check existing files
- Never overwrite without explicit user confirmation
- Preserve any existing user content

### User Interaction

- Keep initial questions minimal (3-4 max)
- Confirm before creating/overwriting files
- Present clear summaries of actions taken
- Be ready to iterate if user requests changes

### Integration with Workflow

These documents are referenced by:
- `/research` - Discovers architectural constraints
- `/plan` - Uses architecture as implementation guide  
- `/execute` - Follows architectural patterns
- `/review` - Validates alignment with architecture

$ARGUMENTS