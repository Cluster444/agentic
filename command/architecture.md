---
description: Initialize architecture documentation for a new project. Creates foundational design documents in thoughts/architecture/ directory.
---

# Initialize Architecture Documentation

You are creating the foundational architecture documentation structure for a project. These documents guide both human developers and AI agents throughout the development lifecycle by serving as the single source of truth for design decisions, technical constraints, and system behavior.

## Steps to follow:

### 1. Determine execution mode

Check if `thoughts/architecture/` directory exists and contains files.

**PATH A - If architecture files exist (REFINE MODE):**
- List existing files to the user
- Inform: "Architecture documentation found. I can analyze the codebase and update these documents to align with current implementation."
- Ask: "Would you like to: (1) Skip refinement, (2) Refine existing documents based on codebase analysis?"
- If user chooses refinement, proceed to **Step 2A: Refine Existing Architecture**
- If user skips, exit gracefully

**PATH B - If no architecture files exist (CREATE MODE):**
- Inform: "No architecture documentation found. I'll help you create it."
- Proceed to **Step 2B: Gather Project Context**

---

### 2A. Refine Existing Architecture (PATH A only)

**Phase 1 - Locate (Codebase & Architecture):**
- Spawn **codebase-locator** agents in parallel to discover:
  - Main application entry points
  - Key module and component locations
  - Infrastructure configuration files
  - Testing setup and conventions
- Spawn **thoughts-locator** agent to analyze existing architecture documents
- **WAIT** for all locator agents to complete

**Phase 2 - Find Patterns (Codebase only):**
- Based on locator results, spawn **codebase-pattern-finder** agents in parallel to identify:
  - Architectural patterns in use
  - Testing patterns and conventions
  - API/CLI design patterns (if applicable)
  - Data persistence patterns
- **WAIT** for all pattern-finder agents to complete

**Phase 3 - Analyze (Codebase & Architecture):**
- Spawn **codebase-analyzer** agents in parallel to understand:
  - Current system architecture and stack
  - Domain model implementation
  - Development workflow artifacts
  - Persistence layer details
- Spawn **thoughts-analyzer** agent to extract key insights from existing architecture docs
- **WAIT** for all analyzer agents to complete

**Synthesize and Update:**
- Compare codebase reality with existing architecture documentation
- Identify discrepancies, outdated information, and missing details
- Present findings to user with specific update recommendations
- Ask: "I found [N] areas where documentation differs from implementation. Update all, select specific documents, or cancel?"
- Update selected documents with current codebase information
- Preserve user-added content and TODOs where applicable
- Add update timestamp and changelog notes to modified documents
- Skip to **Step 7: Present Completion Summary**

---

### 2B. Gather Project Context (PATH B only)

**Broad Discovery Phase:**

Ask minimal high-level questions first:

1. What is this project's primary purpose and domain? (e.g., "API for managing e-commerce orders", "CLI tool for data analysis")
2. What technology stack is in use? (Languages, frameworks, key libraries)

**Determine Document Scope:**

Based on responses, determine which architectural documents are necessary:
- Core documents (always created): overview, system-architecture, domain-model, testing-strategy, development-workflow, persistence
- Optional documents (conditionally created):
  - `api-design.md` if project has REST/GraphQL APIs
  - `cli-design.md` if project has CLI interface
  - `event-bus.md` if project uses event-driven architecture

**Focused Follow-up Phase:**

For each document to be created, ask targeted questions:

For `system-architecture.md`:
- What versions of key technologies are in use?
- Are there specific infrastructure dependencies (databases, caches, message queues)?
- What build/deployment tooling is configured?

For `domain-model.md`:
- What are the core business entities?
- Are there critical business rules or constraints?
- What are the main user workflows?

For `persistence.md`:
- What data storage technologies are in use?
- Is there a migration strategy in place?
- Are there caching or performance considerations?

For optional documents (only if applicable):
- API: Authentication approach? Versioning strategy? Error handling patterns?
- CLI: Command structure? Configuration approach? Output formats?
- Events: Event types? Publishing patterns? Error handling?

Keep follow-up questions focused and skip those where answers are obvious from earlier responses.

### 3. Create architecture directory structure (PATH B only)

Create `thoughts/architecture/` directory.

### 4. Generate core architecture documents (PATH B only)

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

### 5. Generate optional documents based on context (PATH B only)

Based on user's responses in step 2B, create applicable optional documents:

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

### 6. Populate documents with project-specific content (PATH B only)

For each document created:

1. Use a consistent template structure:
```markdown
# [Document Title]

> This document describes [specific purpose]. Last updated: [date]

## Overview

[Brief description of this document's role in the architecture]

## [Section 1]

[Content based on user's project context from step 2B]

## [Section 2]

[Content based on user's project context from step 2B]

## TODO

- [ ] [Specific decision or detail needed]
- [ ] [Another item requiring future clarification]

## Related Documentation

- [Link to related architecture document]
```

2. Use responses from step 2B to populate content:
   - Incorporate technology stack details
   - Document infrastructure dependencies mentioned
   - Include business entities and workflows described
   - Reflect build/deployment tooling discussed

3. Use placeholder text only for areas not covered in interview:
   - "Describe [specific aspect not yet discussed]"
   - "Document [decision to be made later]"

4. Add TODO sections for project-specific decisions still needed
5. Cross-reference related documents

### 7. Present completion summary

**For PATH A (Refine Mode):**
```markdown
Architecture documentation updated in thoughts/architecture/

Documents refined:
  ✓ [list of updated documents with brief change summary]

Changes made:
  - [summary of key updates]
  - [alignment improvements]

Next steps:
1. Review updated content for accuracy
2. Address any new TODO items added
3. Continue iterating as implementation evolves
```

**For PATH B (Create Mode):**
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
2. Refine details as implementation progresses
3. Update documents as architectural decisions are made
4. These docs will be referenced by /research, /plan, and /execute commands
```

Use the todowrite tool to create a structured task list, marking each as pending initially. Task list will vary based on execution path.

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

- **PATH A (Refine):** Present findings and ask for confirmation before updating
- **PATH B (Create):** Keep initial questions minimal (2 broad questions), follow with focused questions
- Confirm before creating/overwriting files
- Present clear summaries of actions taken
- Be ready to iterate if user requests changes

### Execution Path Requirements

**PATH A - Refine Mode Requirements:**
- Must use sub-agents in three phases: Locate → Find Patterns → Analyze
- Must spawn agents in parallel within each phase (never mix agent types across phases)
- Must compare codebase reality to documentation before proposing updates
- Must preserve user content and maintain document structure
- Must add timestamps and change notes to updated documents

**PATH B - Create Mode Requirements:**
- Must start with broad questions before determining document scope
- Must ask focused follow-up questions only for selected documents
- Must populate documents with user-provided information from interviews
- Must use placeholders only for information not gathered in interview
- Must create only core + applicable optional documents based on project type

### Integration with Workflow

These documents are referenced by:
- `/research` - Discovers architectural constraints
- `/plan` - Uses architecture as implementation guide  
- `/execute` - Follows architectural patterns
- `/review` - Validates alignment with architecture

$ARGUMENTS