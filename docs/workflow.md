# Development Workflow

## Overview

The Agentic workflow provides a structured, phase-based approach to software development with AI assistance. Each phase builds on the previous one, creating a comprehensive trail of decisions and implementations.

## Workflow Phases

### 0. Architecture Setup (Optional)

**Purpose**: Establish foundational architecture documentation.

**Command**: `/architecture`

**Process**:
1. Determines if creating new or refining existing docs
2. Interviews user about project structure and decisions
3. Creates comprehensive architecture documents
4. Provides foundation for all subsequent phases

**Output**: `thoughts/architecture/*.md`

**Key Points**:
- Recommended for new projects or major refactors
- Can be refined as implementation evolves
- Referenced by research, plan, and execute commands
- Serves as single source of truth for design decisions

### 1. Research Phase

**Purpose**: Understand the codebase and gather context for implementation.

**Command**: `/research [ticket-file] [additional-context]`

**Process**:
1. Reads ticket requirements
2. Spawns specialized agents to explore codebase
3. Searches thoughts directory for historical context
4. Synthesizes findings into a research document

**Output**: `thoughts/research/YYYY-MM-DD_topic.md`

**Key Points**:
- Always review research for accuracy
- Research is timestamped for temporal context
- Can be extended with follow-up questions
- Forms the foundation for planning

### 2. Planning Phase

**Purpose**: Create detailed implementation specifications.

**Command**: `/plan [ticket-file] [research-file]`

**Process**:
1. Analyzes ticket and research
2. Explores codebase for patterns and constraints
3. Develops phased implementation approach
4. Defines success criteria

**Output**: `thoughts/plans/descriptive-name.md`

**Key Points**:
- Interactive process with user feedback
- Breaks work into manageable phases
- Includes both automated and manual verification
- Must resolve all questions before finalizing

### 3. Implementation Phase

**Purpose**: Execute the plan with code changes.

**Command**: `/execute [plan-file]`

**Process**:
1. Reads complete plan
2. Implements each phase sequentially
3. Runs verification after each phase
4. Updates progress checkmarks in plan

**Key Points**:
- Follows plan while adapting to reality
- Stops and asks when encountering mismatches
- Maintains forward momentum
- Verifies work at natural stopping points

### 4. Commit Phase

**Purpose**: Create atomic, well-documented git commits.

**Command**: `/commit`

**Process**:
1. Reviews all changes
2. Analyzes purpose and impact
3. Drafts meaningful commit message
4. Creates git commit

**Key Points**:
- Focuses on "why" not just "what"
- Follows repository conventions
- Handles pre-commit hooks
- Never pushes automatically

### 5. Review Phase

**Purpose**: Validate implementation against plan.

**Command**: `/review [plan-file]`

**Process**:
1. Compares implementation to plan
2. Identifies any drift or deviations
3. Verifies success criteria
4. Documents findings

**Output**: `thoughts/reviews/YYYY-MM-DD_review.md`

**Key Points**:
- Ensures plan was followed correctly
- Documents any necessary deviations
- Validates both automated and manual criteria
- Provides closure for the ticket

## Context Management

### Fresh Context Windows

Each phase should typically start fresh to:
- Maximize inference quality
- Reduce token usage
- Avoid context pollution
- Improve response speed

### Context Compression

Agents automatically compress context by:
- Extracting only essential information
- Summarizing findings
- Focusing on actionable details
- Preserving file references

## Decision Flow

```
Architecture Setup (Optional)
    ↓
Ticket Created
    ↓
Research Phase → Research Document
    ↓
Planning Phase → Implementation Plan
    ↓
Implementation Phase → Code Changes
    ↓
Commit Phase → Git History
    ↓
Review Phase → Review Document
    ↓
Ticket Closed
```

## Best Practices

### Start with Clear Tickets

Good tickets include:
- Clear problem statement
- Specific requirements
- Success criteria
- Relevant context

### Review at Each Phase

Don't skip reviews:
- Research: Verify findings are accurate
- Plan: Ensure approach is sound
- Implementation: Check code quality
- Commit: Review message accuracy
- Review: Confirm completeness

### Use Iterative Refinement

Each phase can be refined:
- Ask follow-up questions during research
- Request plan adjustments before implementation
- Fix issues during implementation
- Amend commits if needed

### Document Deviations

When implementation differs from plan:
- Stop and communicate the issue
- Document why the change was needed
- Update plan or get approval
- Include in review documentation

## Common Patterns

### Feature Development
1. Research existing patterns and architecture
2. Plan with multiple implementation phases
3. Implement incrementally with testing
4. Commit with feature-focused message
5. Review against requirements

### Bug Fixes
1. Research to understand root cause
2. Plan minimal, targeted fix
3. Implement with regression tests
4. Commit with issue reference
5. Review for completeness

### Refactoring
1. Research current implementation thoroughly
2. Plan incremental, safe changes
3. Implement with extensive testing
4. Commit with clear rationale
5. Review for behavior preservation

### Performance Optimization
1. Research bottlenecks and measurements
2. Plan targeted improvements
3. Implement with benchmarks
4. Commit with performance data
5. Review impact and trade-offs

## Handling Edge Cases

### Incomplete Research
- Run follow-up research commands
- Append to existing research document
- Update metadata and timestamps

### Plan Conflicts
- Stop implementation immediately
- Document the conflict clearly
- Get guidance before proceeding
- Update plan if needed

### Failed Verification
- Fix issues before proceeding
- Re-run verification
- Document any workarounds
- Include in review notes

### Urgent Changes
- Can skip some phases if needed
- Document why process was shortened
- Return to full process when possible
- Create retroactive documentation

## Quality Gates

Each phase has quality requirements:

### Research Quality
- Covers all relevant areas
- Includes specific file references
- Identifies patterns and constraints
- Answers ticket questions

### Plan Quality
- Phases are properly scoped
- Success criteria are measurable
- Approach follows patterns
- No unresolved questions

### Implementation Quality
- Follows plan structure
- Tests pass
- Code follows conventions
- Changes are focused

### Commit Quality
- Message explains why
- Scope is appropriate
- Tests are included
- No sensitive data

### Review Quality
- All criteria verified
- Deviations documented
- Completeness confirmed
- Lessons captured

## Related Documentation
- [Usage Guide](./usage.md)
- [Commands](./commands.md)
- [Thoughts Directory](./thoughts.md)
- [Architecture](./architecture.md)
