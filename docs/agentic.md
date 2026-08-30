# Agentic CLI

## Overview

The `agentic` command-line tool manages the distribution of agents and commands to your projects. It ensures your OpenCode setup stays synchronized with the latest agent configurations.

## Installation

```bash
# From the agentic repository
bun install
bun link  # Makes 'agentic' available globally
```

## Commands

### `agentic pull [project-path]`

Pulls the latest agents and commands to a project's `.opencode` directory, or to a global/custom OpenCode config directory with `-g`/`--config-dir`.

**Usage:**
```bash
# Pull to current directory (auto-detects project)
cd ~/projects/my-app
agentic pull

# Pull to specific project
agentic pull ~/projects/my-app

# Pull ignoring YAML frontmatter changes
agentic pull --ignore-frontmatter

# Pull to the global config directory
agentic pull -g

# Pull to a custom config directory
agentic pull --config-dir ~/.config/opencode/profiles/agentic
```

**Options:**
- `-g, --global`: Pull to the global OpenCode config directory (resolved via `OPENCODE_CONFIG_DIR` or `~/.config/opencode`) instead of a project's `.opencode`
- `--config-dir <path>`: Pull to a specific config directory, overriding the global default
- `--ignore-frontmatter`: Ignore YAML frontmatter in Markdown (.md) files when comparing and preserve target frontmatter during pull

**What it does:**
- Creates the target directory if it doesn't exist
- Copies all files from `agent/` and `command/` directories
- Preserves directory structure
- Reports progress for each file copied
- When `--ignore-frontmatter` is used: preserves existing frontmatter in target .md files

**Output:**
```
📦 Pulling to: /home/user/projects/my-app/.opencode

📁 Found 3 file(s) to update

  ✓ Added: agent/codebase-analyzer.md
  ✓ Updated: command/research.md

✅ Updated 2 files
```

### `agentic status [project-path]`

Checks synchronization status between your project and the agentic repository.

**Usage:**
```bash
# Check status of current directory
cd ~/projects/my-app
agentic status

# Check status of specific project
agentic status ~/projects/my-app

# Check status ignoring YAML frontmatter changes
agentic status --ignore-frontmatter

# Check status of the global config directory
agentic status -g

# Check status of a custom config directory
agentic status --config-dir ~/.config/opencode/profiles/agentic
```

**Options:**
- `-g, --global`: Check the global OpenCode config directory (resolved via `OPENCODE_CONFIG_DIR` or `~/.config/opencode`) instead of a project's `.opencode`
- `--config-dir <path>`: Check a specific config directory, overriding the global default
- `--ignore-frontmatter`: Ignore YAML frontmatter in Markdown (.md) files when comparing

**What it does:**
- Compares files in `.opencode` (or the global/custom config directory) with source repository
- Identifies missing, outdated, or extra files
- Uses SHA-256 hashing for content comparison
- When `--ignore-frontmatter` is used: treats files with only frontmatter changes as up-to-date

**Output:**
```
📊 Status for: /home/user/projects/my-app/.opencode

✅ agent/codebase-analyzer.md
⚠️  command/research.md (outdated)
❌ command/execute.md (missing)

📋 Summary:
  ✅ Up-to-date: 1
  ⚠️  Outdated: 1
  ❌ Missing: 1

⚠️  2 files need updating
Run 'agentic pull' to sync the files
```

### `agentic metadata`

Displays project metadata for use in research documentation.

**Usage:**
```bash
agentic metadata
```

**What it does:**
- Collects current date/time with timezone
- Retrieves git information (commit hash, branch, repository name)
- Generates timestamp for filename formatting

**Output Example:**
```
Current Date/Time (TZ): 01/15/2025 14:30:45 EST
<git_commit>abc123def456789...</git_commit>
<branch>feature/oauth-implementation</branch>
<repository>my-app</repository>
<last_updated>2025-01-15</last_updated>
<date>2025-01-15</date>
```

**Use Cases:**
- Populating research document frontmatter
- Creating timestamped filenames
- Recording project state for documentation
- Tracking when analysis was performed

This command is particularly useful when creating research documents, as it provides all the metadata needed for proper documentation tracking.

### `agentic help`

Displays usage information.

```bash
agentic help
agentic --help
agentic -h
```

### `agentic version`

Shows the installed version of agentic.

```bash
agentic version
agentic --version
```

## Global and custom config directories

By default, `pull` and `status` operate on a project's `.opencode` directory. Use `-g/--global` to operate on the global OpenCode config directory instead, or `--config-dir <path>` to target an explicit directory (for example, an OpenCode profile).

The target config directory is resolved with the following precedence:

1. `--config-dir <path>` — explicit flag, highest priority
2. `OPENCODE_CONFIG_DIR` — environment variable, used when the global config lives somewhere other than the default
3. `~/.config/opencode` — the default global location

**Examples:**

```bash
# Global deployment (uses OPENCODE_CONFIG_DIR if defined, otherwise ~/.config/opencode)
agentic pull -g
agentic status -g

# Custom config directory (e.g. an OpenCode profile)
agentic pull --config-dir ~/.config/opencode/profiles/agentic
agentic status --config-dir ~/.config/opencode/profiles/agentic
```

**Notes:**

- `--config-dir` cannot be combined with a project path
- When both `-g` and `--config-dir` are given, `--config-dir` takes precedence
- `-g` and `--config-dir` bypass project auto-detection entirely

## Auto-detection

The CLI uses intelligent project detection:

1. **With path argument**: Uses the provided path directly
2. **Without argument**: Searches upward from current directory for `.opencode`
3. **Stops at**: Home directory boundary (won't search outside `$HOME`)
4. **With `-g`/`--config-dir`**: Bypasses detection and targets the global/custom config directory directly

## Configuration

Per-project configuration is read from `.opencode/agentic.json`:

```json
{
  "thoughts": "thoughts",
  "agents": {
    "model": "opencode/grok-code"
  }
}
```

- `thoughts`: relative path to the project's thoughts directory (used by `init`)
- `agents.model`: default agent model applied to agents during `pull` and `status`

The agent model is resolved with the following priority:

1. `--agent-model` (CLI flag)
2. `agents.model` in `agentic.json`
3. No model substitution

The directories synced by `pull` and `status` (`agent` and `command`) are currently fixed in the source.

## Error Handling

The CLI provides clear error messages:

- **No .opencode found**: Suggests running from project directory or specifying path
- **Invalid directory**: Reports if specified path doesn't exist
- **Outside home**: Alerts when auto-detection is outside home directory

## File Management

### Hashing
Uses Bun's built-in SHA-256 hasher for fast, reliable file comparison.

### Directory Walking
Recursively processes all files in configured directories while preserving structure.

### Safe Operations
- Never deletes files
- Only overwrites during `pull` operation
- Reports all changes clearly

## Development

### Running from Source

```bash
# Without installing globally
bun run src/cli/index.ts pull ~/projects/my-app
```

### TypeScript Support

The CLI is written in TypeScript with full type safety:
```bash
bun run typecheck  # Verify types
```

### Adding New Commands

1. Create new command file in `src/cli/`
2. Export async function that handles the command
3. Add case in `src/cli/index.ts` switch statement
4. Update help text

## Best Practices

1. **Regular Updates**: Run `agentic status` periodically to check for updates
2. **Project Setup**: Run `agentic pull` immediately after cloning a project
3. **Version Control**: Add `.opencode/` to `.gitignore` (agents are distributed separately)
4. **Automation**: Consider adding `agentic pull` to project setup scripts

## Troubleshooting

### Command not found
- Ensure you ran `bun link` in the agentic repository
- Check that `~/.bun/bin` is in your PATH

### No .opencode directory found
- Ensure you're in a project directory
- Or specify the project path explicitly

### Files showing as outdated
- Run `agentic pull` to update
- Check if you have local modifications

## Future Enhancements

Planned improvements include:
- Project initialization command
- Selective agent/command installation
- Update notifications
- Dry-run mode for pull command

## Related Documentation
- [Usage Guide](./usage.md)
- [Agents](./agents.md)
- [Commands](./commands.md)