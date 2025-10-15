import { join, resolve } from "node:path";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

interface AgenticConfig {
  thoughts: string;
  agents: {
    model: string;
  };
}

export async function init(projectPath?: string, thoughtsDirOverride?: string): Promise<void> {
  const isInteractive = !thoughtsDirOverride;
  const rl = isInteractive ? readline.createInterface({ input, output }) : null;

  try {
    // Resolve the project path
    const targetPath = projectPath ? resolve(projectPath) : process.cwd();
    const opencodeDir = join(targetPath, ".opencode");
    const configPath = join(opencodeDir, "agentic.json");

    // Check if already initialized
    if (existsSync(configPath)) {
      if (isInteractive && rl) {
        const overwrite = await rl.question(
          "Agentic is already initialized in this project. Do you want to reinitialize? (y/N): "
        );

        if (overwrite.toLowerCase() !== "y") {
          console.log("Initialization cancelled.");
          return;
        }
      } else {
        console.log("Agentic is already initialized. Reinitializing...");
      }
    }

    console.log("\n🚀 Initializing Agentic for your project...\n");

    // Create .opencode directory if it doesn't exist
    if (!existsSync(opencodeDir)) {
      mkdirSync(opencodeDir, { recursive: true });
      console.log(`✅ Created .opencode directory`);
    }

    // Determine thoughts directory location
    let thoughtsDir: string;
    if (thoughtsDirOverride) {
      thoughtsDir = thoughtsDirOverride;
      console.log(`Using thoughts directory: ${thoughtsDir}`);
    } else if (rl) {
      const defaultThoughtsDir = "thoughts";
      const thoughtsPrompt = `Where would you like to store your thoughts? (default: ${defaultThoughtsDir}): `;
      const thoughtsInput = await rl.question(thoughtsPrompt);
      thoughtsDir = thoughtsInput.trim() || defaultThoughtsDir;
    } else {
      thoughtsDir = "thoughts";
    }

    // Resolve thoughts directory path
    const thoughtsPath = join(targetPath, thoughtsDir);

    // Create thoughts directory structure
    const thoughtsSubDirs = [
      "architecture",
      "tickets",
      "research",
      "plans",
      "reviews",
      "docs"
    ];

    if (!existsSync(thoughtsPath)) {
      mkdirSync(thoughtsPath, { recursive: true });
      console.log(`✅ Created ${thoughtsDir} directory`);
    }

    for (const subDir of thoughtsSubDirs) {
      const subDirPath = join(thoughtsPath, subDir);
      if (!existsSync(subDirPath)) {
        mkdirSync(subDirPath, { recursive: true });
        console.log(`   ✅ Created ${thoughtsDir}/${subDir}`);
      }
    }

    // Create config object
    const config: AgenticConfig = {
      thoughts: thoughtsDir,
      agents: {
        model: "sonic-fast"
      }
    };

    // Write config file
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`\n✅ Created agentic.json configuration file`);

    // Create a README in thoughts directory
    const readmePath = join(thoughtsPath, "README.md");
    if (!existsSync(readmePath)) {
      const readmeContent = `# Thoughts Directory

This directory contains structured documentation for your project:

## Directory Structure

- **architecture/** - System architecture documentation and design decisions
- **tickets/** - Task tickets, feature requests, and bug reports
- **research/** - Research notes, investigations, and findings
- **plans/** - Project plans, roadmaps, and implementation strategies
- **reviews/** - Code reviews, retrospectives, and assessments
- **docs/** - External web research and documentation from authoritative sources

## Usage

These directories are used by Agentic to organize and retrieve contextual information about your project.
`;

      writeFileSync(readmePath, readmeContent);
      console.log(`✅ Created ${thoughtsDir}/README.md`);
    }

    console.log("\n🎉 Agentic initialization complete!");
    console.log(`\nConfiguration saved to: ${configPath}`);
    console.log(`Thoughts directory created at: ${thoughtsPath}`);

    console.log("\n💡 Next steps:");
    console.log("   1. Run 'agentic pull' to deploy agents, commands, and tools");
    console.log("   2. Navigate to .opencode/ and run 'bun install' to install tool dependencies");
    console.log("   3. Set PERPLEXITY_API_KEY environment variable for web research features");

  } finally {
    if (rl) {
      rl.close();
    }
  }
}