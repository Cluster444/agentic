# Usage Guide

## Overview

The Agentic workflow system provides a structured approach to AI-assisted software development. It consists of specialized agents and commands that work together to help you research, plan, implement, and review code changes systematically.

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/agentic.git
cd agentic
bun install
bun link  # Makes 'agentic' command available globally
```

### Setting Up a Project

Navigate to your project and pull the agents and commands:

```bash
cd ~/projects/my-app
agentic pull
```

This creates a `.opencode` directory in your project containing all the agents and commands.

### Verifying Setup

Check the status of your agents and commands:

```bash
agentic status
```

This shows which files are up-to-date, outdated, or missing.

## Development Workflow

The Agentic system follows a structured workflow for implementing features or fixing issues:

### 1. Create a Ticket

Create a ticket file in `thoughts/tickets/` describing what needs to be done:

```markdown
# thoughts/tickets/feature-123.md

## Feature: Add User Authentication

### Description
Implement OAuth-based user authentication with Google provider.

### Requirements
- Support Google OAuth 2.0
- Store user sessions
- Provide login/logout endpoints
```

### 2. Research Phase

Start a new OpenCode session and use the **research** command:

```
/research thoughts/tickets/feature-123.md - analyze the authentication system and find all relevant code
```

This produces a research document in `thoughts/research/` with findings about:
- Current implementation details
- Relevant files and components
- Architecture patterns to follow
- Integration points
- External best practices (when web research is enabled)

### 3. Planning Phase

Create an implementation plan using the **plan** command:

```
/plan thoughts/tickets/feature-123.md thoughts/research/2025-01-15_auth-research.md
```

This creates a detailed plan in `thoughts/plans/` with:
- Phased implementation approach
- Specific file changes
- Success criteria
- Testing strategy

### 4. Implementation Phase

Execute the plan using the **execute** command:

```
/execute thoughts/plans/auth-implementation.md
```

The agent will:
- Implement each phase of the plan
- Run tests and verification
- Update progress checkmarks in the plan

### 5. Commit Phase

Once implementation is complete, use the **commit** command:

```
/commit
```

The agent will:
- Review all changes
- Generate a meaningful commit message
- Create the git commit

### 6. Review Phase

Validate that the implementation matches the plan using the **review** command:

```
/review thoughts/plans/auth-implementation.md
```

This ensures:
- All planned changes were implemented
- No unintended drift occurred
- Success criteria are met

## Key Concepts

### Context Windows

Each phase should typically start with a fresh OpenCode context window to maximize performance and quality. The agents use context compression to pass only essential information between phases.

### Thoughts Directory

The `thoughts/` directory maintains project knowledge:
- `architecture/` - System design and decisions
- `tickets/` - Work items and feature requests
- `research/` - Analysis and findings
- `plans/` - Implementation specifications
- `reviews/` - Post-implementation validation

### Agents vs Commands

- **Commands** (research, plan, execute, etc.) are high-level workflows you invoke directly in OpenCode using slash notation (e.g., `/research`)
- **Agents** are specialized sub-tasks that commands use internally for specific operations

### How Commands Work

When you run `agentic pull`, files from the `command/` directory are copied to `.opencode/command/` in your project. Each file becomes available as a slash command in OpenCode:

- `command/research.md` → Available as `/research`
- `command/plan.md` → Available as `/plan`
- `command/execute.md` → Available as `/execute`
- `command/commit.md` → Available as `/commit`
- `command/review.md` → Available as `/review`

OpenCode automatically recognizes these files and makes them available as slash commands using the filename (without the .md extension).

## Best Practices

1. **Review Each Phase**: Don't blindly accept agent output. Review research and plans before proceeding.

2. **Start Fresh**: Begin each major phase with a new context window for best results.

3. **Be Specific**: Provide clear, detailed tickets to get better research and plans.

4. **Trust but Verify**: The system helps maintain quality, but human review is essential.

5. **Iterate**: Use follow-up questions to refine research and plans before implementation.

## Next Steps

- Learn about the [Agentic CLI](./agentic.md)
- Understand [workflow phases](./workflow.md) in detail
- Explore [agents](./agents.md) and [commands](./commands.md)
- Set up your [thoughts directory](./thoughts.md)