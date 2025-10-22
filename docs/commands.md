# Commands

## Overview

Commands are high-level workflows that orchestrate agents to accomplish complex development tasks. They are invoked directly in OpenCode sessions using the slash (/) prefix.

## How Commands Work

The Agentic system distributes command files to your project:

1. **Source**: Command files live in the `command/` directory of the Agentic repository
2. **Distribution**: Running `agentic pull` copies them to `.opencode/command/` in your project
3. **Recognition**: OpenCode automatically recognizes these files and makes them available as slash commands
4. **Invocation**: The filename (without .md) becomes the command name

Example:
- `command/research.md` → `.opencode/command/research.md` → Available as `/research`
- `command/plan.md` → `.opencode/command/plan.md` → Available as `/plan`

## Available Commands

### architecture command (`/architecture`)

**Purpose**: Initialize or refine architecture documentation for a project.

**Syntax**: `/architecture`

**Example**:
```
/architecture
```

**Process**:
1. Checks if thoughts/architecture/ exists and contains files
2. If exists: Offers to refine docs based on codebase analysis
3. If not: Guides user through creating foundational docs
4. Spawns specialized agents for codebase/documentation analysis
5. Creates core documents (overview, system-architecture, domain-model, testing-strategy, development-workflow, persistence)
6. Optionally creates specialized docs (api-design, cli-design, event-bus)

**Output**: `thoughts/architecture/*.md` files

### research command (`/research`)

**Purpose**: Comprehensive analysis of codebase and documentation.

**Syntax**: `/research [ticket-file] [additional-instructions]`

**Example**:
```
/research thoughts/tickets/eng-123.md - find all authentication code and analyze the current OAuth implementation
```

**Process**:
1. Reads ticket and mentioned files
2. Spawns codebase-locator agents for discovery
3. Spawns analyzer agents for deep dives
4. Searches thoughts/ for historical context
5. Synthesizes findings into research document

**Output**: `thoughts/research/YYYY-MM-DD_topic.md`

### plan command (`/plan`)

**Purpose**: Create detailed implementation specifications.

**Syntax**: `/plan [ticket-file] [research-file]`

**Example**:
```
/plan thoughts/tickets/eng-123.md thoughts/research/2025-01-15_oauth-research.md
```

**Process**:
1. Reads ticket and research
2. Spawns agents to verify current state
3. Interactively develops approach with user
4. Creates phased implementation plan
5. Defines success criteria

**Output**: `thoughts/plans/descriptive-name.md`

### execute command (`/execute`)

**Purpose**: Implement an approved plan.

**Syntax**: `/execute [plan-file]`

**Example**:
```
/execute thoughts/plans/oauth-implementation.md
```

**Process**:
1. Reads complete plan
2. Implements each phase sequentially
3. Runs verification after phases
4. Updates progress checkmarks
5. Handles mismatches adaptively

**Output**: Modified source code files

### commit command (`/commit`)

**Purpose**: Create meaningful git commits.

**Syntax**: `/commit`

**Example**:
```
/commit
```

**Process**:
1. Reviews all staged and unstaged changes
2. Analyzes purpose and impact
3. Drafts commit message
4. Creates git commit
5. Handles pre-commit hooks

**Output**: Git commit with descriptive message

### review command (`/review`)

**Purpose**: Validate implementation against plan.

**Syntax**: `/review [plan-file]`

**Example**:
```
/review thoughts/plans/oauth-implementation.md
```

**Process**:
1. Compares implementation to plan
2. Verifies success criteria
3. Identifies deviations
4. Documents findings
5. Provides recommendations

**Output**: `thoughts/reviews/YYYY-MM-DD_review.md`

## Command Structure

Each command consists of:

### Configuration Header
```yaml
---
description: Brief description of command purpose
---
```

### Instructions
Detailed prompt that:
- Defines the task
- Outlines process steps
- Specifies output format
- Provides guidelines

### Placeholders
- `$ARGUMENTS` - User-provided arguments
- File paths and parameters

## Command Execution Flow

### 1. Initial Context
- Read mentioned files completely
- Understand requirements
- Plan approach

### 2. Agent Orchestration
- Spawn appropriate agents
- Coordinate parallel execution
- Wait for all results
- Synthesize findings

### 3. User Interaction
- Present findings or proposals
- Ask clarifying questions
- Iterate based on feedback
- Confirm before proceeding

### 4. Output Generation
- Create specified documents
- Update existing files
- Report completion status

## Command Best Practices

### For Users

1. **Provide context**: Include relevant files and clear instructions
2. **Review outputs**: Don't blindly accept results
3. **Iterate**: Use follow-up questions to refine
4. **Fresh contexts**: Start new sessions for each phase

### For Command Design

1. **Clear phases**: Break complex tasks into steps
2. **Parallel agents**: Maximize efficiency
3. **User checkpoints**: Get confirmation at key points
4. **Structured output**: Use consistent formats

## Creating Custom Commands

### Basic Template
```markdown
---
description: What this command does
---

# Command Name

Brief overview of the command's purpose.

## Steps to follow:

1. **Step Name**
   - Specific action
   - Expected outcome

2. **Step Name**
   - Specific action
   - Expected outcome

## Output Format

Description of what will be produced.

## Important Notes

- Key guidelines
- Common pitfalls
- Best practices

<placeholder>$ARGUMENTS</placeholder>
```

### Naming Convention
- Use descriptive verbs: `research.md`, `analyze.md`
- Keep names short and memorable
- Avoid special characters

### Agent Integration
```markdown
3. **Spawn research tasks**:
   - Use **codebase-locator** to find relevant files
   - Use **codebase-analyzer** to understand implementation
   - Use **thoughts-locator** to find documentation
```

## Command Invocation

### In OpenCode

Commands are invoked with a slash prefix:
```
/command-name arguments
```

### Arguments
- File paths: `thoughts/tickets/eng-123.md`
- Instructions: Text after dash (`-`)
- Multiple files: Space-separated

### Context Management
- Each command typically starts fresh
- Commands pass compressed context
- Maintains conversation flow

## Command Patterns

### Research Pattern
```
Read inputs → Spawn discovery → Spawn analysis → Synthesize → Document
```

### Planning Pattern
```
Read context → Understand current → Propose approach → Iterate → Finalize
```

### Implementation Pattern
```
Read plan → Implement phase → Verify → Update progress → Repeat
```

### Review Pattern
```
Read plan → Check implementation → Compare → Document → Recommend
```

## Troubleshooting Commands

### Command not recognized
- Ensure command file exists in `.opencode/command/`
- Check file naming matches invocation
- Run `agentic pull` to update

### Unexpected behavior
- Review command instructions
- Check agent responses
- Verify file paths exist

### Performance issues
- Break into smaller commands
- Use more specific instructions
- Start with fresh context

## Command Limitations

### Single Response
- Commands complete in one execution
- Cannot maintain state between invocations
- Use documents for persistence

### Tool Boundaries
- Limited to available tools
- Cannot modify own configuration
- Must work within OpenCode constraints

### Context Size
- Large files may exceed limits
- Complex commands may need splitting
- Use compression via agents

## Future Commands

Potential additions:
- `/test` - Run and analyze tests
- `/deploy` - Handle deployment tasks
- `/refactor` - Systematic refactoring
- `/document` - Generate documentation

## Related Documentation
- [Agents](./agents.md)
- [Workflow](./workflow.md)
- [Usage Guide](./usage.md)
- [Thoughts Directory](./thoughts.md)