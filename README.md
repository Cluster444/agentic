# Agentic

[![npm version](https://badge.fury.io/js/agentic-cli.svg)](https://www.npmjs.com/package/agentic-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Modular AI agents and commands for structured software development with OpenCode.**

## What It Does

Agentic is a context engineering tool that assists [OpenCode](https://github.com/sst/opencode) in producing reliable software improvements.
Agentic is a workflow management system for AI-assisted software development using OpenCode. It provides:

* **Context Management**: Organized "thoughts" directory structure for storing architecture docs, research, plans, and reviews
* **Modular AI Agents & Commands**: Pre-configured prompts and specialized subagents that enhance [OpenCode](https://github.com/sst/opencode)'s capabilities through task decomposition and context compression
* **Structured Development Workflow**: A phased approach (Research → Plan → Execute → Commit → Review) for handling tickets and features
* **Distribution System**: A CLI tool to distribute agent/command configurations to projects via `.opencode` directories

## Purpose

The system aims to:
- Make AI-assisted development more systematic and reproducible
- Reduce context window usage through specialized subagents
- Maintain project knowledge over time (architecture decisions, research, implementation history)
- Provide guardrails for AI agents through structured workflows

## Quick Start

### Installation

#### From bun/npm (Recommended)

```bash
npm install -g agentic-cli
# or
bun add -g agentic-cli
```

#### From Source

```bash
git clone https://github.com/Cluster444/agentic.git
cd agentic
bun run build
bun install
bun link  # Makes 'agentic' command available globally
```

### Deploy globally

This will pull all agents/commands into your global `~/.config/opencode/` directory.

```bash
agentic pull -g
```

### Deploy to Your Project

This will pull all agents/commands into a local `.opencode` directory.

```bash
cd ~/projects/my-app
agentic pull
```

### Development Workflow

1. **(Optional)** Use the **architecture** command to establish or refine foundational architecture documentation
2. Use the **ticket** command to work with the agent to build out ticket details
3. Use the **research** command to analyze the codebase from the ticket details
4. Use the **plan** command to generate an implementation plan for the ticket using the research
5. Use the **execute** command to implement the changes
6. Use the **commit** command to commit your work
7. Use the **review** command to verify the implementation

Between each phase it is important to inspect the output from each phase and ensure that it is actually in alignment with what you want the project do be and the direction it is going. Errors in these files will cascade to the next phase and produce code that is not what you wanted.

In OpenCode, these commands are invoked with a slash: `/architecture`, `/ticket`, `/research`, `/plan`, `/execute`, etc.
Most of these commands want the ticket in question that you want to review, exceptions are architecture, ticket itself, and commit/review. Architecture guides you through creating or refining foundational docs. Ticket you give an actual prompt that describes what you're trying to do, and commit/review are meant to work in the context window that you ran execute in so that it has all of the details of how the process itself went.

## Documentation

### Getting Started
- [Usage Guide](./docs/usage.md) - Complete guide to using Agentic
- [Development Workflow](./docs/workflow.md) - Detailed workflow phases

### Core Components
- [Agentic CLI](./docs/agentic.md) - Command-line tool reference
- [Commands](./docs/commands.md) - Available OpenCode commands
- [Agents](./docs/agents.md) - Specialized AI subagents

### Project Structure
- [Thoughts Directory](./docs/thoughts.md) - Knowledge management system
- [Architecture Docs](./docs/architecture.md) - System design documentation

## Requirements

- [Bun](https://bun.sh) runtime
- [OpenCode](https://github.com/opencodeco/opencode) CLI
- Git

## Contributing

This project is in active development. Contributions, ideas, and feedback are welcome!

## License

MIT License - see [LICENSE](./LICENSE) file for details
