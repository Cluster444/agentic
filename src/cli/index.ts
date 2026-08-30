#!/usr/bin/env bun

import { parseArgs } from "util";
import { pull } from "./pull";
import { status } from "./status";
import { metadata } from "./metadata";
import { init } from "./init";
import { config } from "./config";
import packageJson from "../../package.json";

let values: any;
let positionals: string[];

try {
  const parsed = parseArgs({
    args: Bun.argv,
    options: {
      help: {
        type: "boolean",
        short: "h",
        default: false,
      },
      version: {
        type: "boolean",
        default: false,
      },
      global: {
        type: "boolean",
        short: "g",
        default: false,
      },
      "thoughts-dir": {
        type: "string",
      },
      "agent-model": {
        type: "string",
      },
      "ignore-frontmatter": {
        type: "boolean",
        default: false,
      },
      "config-dir": {
        type: "string",
      },
    },
    strict: true,
    allowPositionals: true,
  });
  values = parsed.values;
  positionals = parsed.positionals;
} catch (error: any) {
  if (error.code === "ERR_PARSE_ARGS_UNKNOWN_OPTION") {
    console.error(`Error: ${error.message}`);
    console.error("Run 'agentic --help' for usage information");
    process.exit(1);
  }
  throw error;
}

// Remove the first two positionals (bun and script path)
const args = positionals.slice(2);
const command = args[0];

// Handle --version flag
if (values.version) {
  console.log(`Agentic ${packageJson.version}`);
  process.exit(0);
}

// Handle help (both --help flag and help command)
if (values.help || command === "help" || !command) {
  console.log(`
agentic - Manage opencode agents and commands

Usage:
  agentic <command> [options]

Commands:
  init [project-path]    Initialize agentic in a project with config and thoughts directory
  pull [project-path]    Pull agents and commands to a project's .opencode directory
  status [project-path]  Check which files are up-to-date or outdated
  config [project-path]  Get or set configuration values using dot syntax
  metadata               Display project metadata for research documentation
  version                Show the version of agentic
  help                   Show this help message

Options:
  -h, --help             Show this help message
  -g, --global           Use the global OpenCode config directory (OPENCODE_CONFIG_DIR or ~/.config/opencode) instead of .opencode directory
  --config-dir <path>    Use a custom config directory instead of the default global one
  --version              Show the version of agentic
  --thoughts-dir         Specify thoughts directory (for init command)
  --agent-model          Specify model for subagents (for status and pull commands)
  --ignore-frontmatter   Ignore YAML frontmatter in Markdown when comparing and preserve target frontmatter during pull

Examples:
  agentic init                       # Initialize in current directory
  agentic init ~/projects/my-app     # Initialize in specific project
  agentic pull ~/projects/my-app
  agentic pull                       # Auto-detect project from current dir
  agentic pull -g                    # Pull to global config dir (OPENCODE_CONFIG_DIR or ~/.config/opencode)
  agentic pull --config-dir ~/.config/opencode/profiles/agentic
  agentic status ~/projects/my-app
  agentic status                     # Auto-detect project from current dir
  agentic status -g                  # Check status of global config dir (OPENCODE_CONFIG_DIR or ~/.config/opencode)
  agentic status --config-dir ~/.config/opencode/profiles/agentic
  agentic config                     # Show current configuration
  agentic config agent.model         # Show current agent model
  agentic config agent.model opus-4-1 # Set agent model to opus-4-1
  agentic metadata                   # Display project metadata
`);
  process.exit(0);
}

switch (command) {
  case "init":
    const initPath = args[1];
    await init(initPath, values["thoughts-dir"]);
    break;
  case "pull":
  case "status":
    const projectPath = args[1];
    if (values.global && projectPath) {
      console.error("Error: Cannot use --global flag with a project path");
      process.exit(1);
    }

    if (command === "pull") {
      await pull(
        projectPath,
        values.global,
        values["agent-model"],
        values["ignore-frontmatter"],
        values["config-path"],
      );
    } else if (command === "status") {
      await status(
        projectPath,
        values.global,
        values["agent-model"],
        values["ignore-frontmatter"],
      );
    }
    break;
  case "config":
    // For config command, args[1] is the key, args[2] is the value, args[3] could be project path
    const configKey = args[1];
    const configValue = args[2];
    const configProjectPath = args[3]; // Optional project path override
    await config(configProjectPath, configKey, configValue);
    break;
  case "metadata":
    await metadata();
    break;
  case "version":
    console.log(`Agentic ${packageJson.version}`);
    break;
  case "help":
    // Already handled above, but included for completeness
    break;
  default:
    console.error(`Error: Unknown command '${command}'`);
    console.error("Run 'agentic --help' for usage information");
    process.exit(1);
}
