#!/usr/bin/env bun

import { $ } from "bun";
import path from "path";
import fs from "fs/promises";

const version = process.env.AGENTIC_VERSION;
if (!version) {
  throw new Error("AGENTIC_VERSION environment variable is required");
}

console.log(`=== Publishing agentic-cli v${version} ===\n`);

// Save current git tree state for potential rollback
// const tree = await $`git add . && git write-tree`.text().then(x => x.trim());

// Update version in package.json
console.log("Updating package.json version...");
const pkgPath = path.join(process.cwd(), "package.json");
let pkg = await fs.readFile(pkgPath, "utf-8");
pkg = pkg.replace(/"version": "[^"]+"/, `"version": "${version}"`);
await fs.writeFile(pkgPath, pkg);
console.log(`  Updated package.json to v${version}`);

// Run bun install to update lockfile
console.log("Running bun install...");
await $`bun install`.quiet();

// Platform configurations
const platforms = [
  { name: "darwin-x64", os: "darwin", cpu: "x64", bun: "darwin-x64" },
  { name: "darwin-arm64", os: "darwin", cpu: "arm64", bun: "darwin-arm64" },
  { name: "linux-x64", os: "linux", cpu: "x64", bun: "linux-x64" },
  { name: "linux-arm64", os: "linux", cpu: "arm64", bun: "linux-arm64" },
];

// Create dist directory
const distDir = path.join(process.cwd(), "dist");
await fs.mkdir(distDir, { recursive: true });

// Build binaries for each platform
console.log("\nBuilding binaries...");
for (const platform of platforms) {
  console.log(`  Building ${platform.name}...`);
  const outfile = `./dist/agentic-${platform.name}/bin/agentic`;
  await $`bun build ./src/cli/index.ts --compile --target=bun-${platform.bun} --outfile ${outfile}`;
}

// Create platform-specific packages
console.log("\nCreating platform packages...");
for (const platform of platforms) {
  const pkgDir = path.join(distDir, `agentic-${platform.name}`);

  // Create package.json for platform package
  const platformPkg = {
    name: `agentic-${platform.name}`,
    version: version,
    os: [platform.os],
    cpu: [platform.cpu],
  };

  await fs.writeFile(
    path.join(pkgDir, "package.json"),
    JSON.stringify(platformPkg, null, 2)
  );

  // Copy agent and command directories to platform package
  const dirsToCopy = ["agent", "command", "tool", "docs", "dependencies"];
  for (const dir of dirsToCopy) {
    const srcDir = path.join(process.cwd(), dir);
    const destDir = path.join(pkgDir, dir);
    if (await fs.stat(srcDir).catch(() => null)) {
      await $`cp -r ${srcDir} ${destDir}`;
    }
  }

  console.log(`  Created ${platform.name} package`);
}

// Create main package
console.log("\nCreating main package...");
const mainPkgDir = path.join(distDir, "agentic-cli");
await fs.mkdir(mainPkgDir, { recursive: true });
await fs.mkdir(path.join(mainPkgDir, "bin"), { recursive: true });

// Read base package.json
const basePkg = JSON.parse(await fs.readFile("package.json", "utf-8"));

// Create main package.json with optionalDependencies
const mainPkg = {
  name: "agentic-cli",
  version: version,
  description: basePkg.description,
  bin: {
    agentic: "./bin/agentic"
  },
  keywords: basePkg.keywords,
  author: basePkg.author,
  license: basePkg.license,
  repository: basePkg.repository,
  bugs: basePkg.bugs,
  homepage: basePkg.homepage,
  optionalDependencies: Object.fromEntries(
    platforms.map(p => [`agentic-${p.name}`, version])
  ),
};

await fs.writeFile(
  path.join(mainPkgDir, "package.json"),
  JSON.stringify(mainPkg, null, 2)
);



// Create shell wrapper script
const shellWrapper = `#!/bin/sh
set -e

if [ -n "\$AGENTIC_BIN_PATH" ]; then
    resolved="\$AGENTIC_BIN_PATH"
else
    # Get the real path of this script, resolving any symlinks
    script_path="\$0"
    while [ -L "\$script_path" ]; do
        link_target="\$(readlink "\$script_path")"
        case "\$link_target" in
            /*) script_path="\$link_target" ;;
            *) script_path="\$(dirname "\$script_path")/\$link_target" ;;
        esac
    done
    script_dir="\$(dirname "\$script_path")"
    script_dir="\$(cd "\$script_dir" && pwd)"
    
    # Map platform names
    case "\$(uname -s)" in
        Darwin) platform="darwin" ;;
        Linux) platform="linux" ;;
        *) platform="\$(uname -s | tr '[:upper:]' '[:lower:]')" ;;
    esac
    
    # Map architecture names  
    case "\$(uname -m)" in
        x86_64|amd64) arch="x64" ;;
        aarch64) arch="arm64" ;;
        armv7l) arch="arm" ;;
        *) arch="\$(uname -m)" ;;
    esac
    
    name="agentic-\${platform}-\${arch}"
    binary="agentic"
    
    # Search for the binary starting from real script location
    resolved=""
    current_dir="$script_dir"
    while [ "$current_dir" != "/" ]; do
        candidate="$current_dir/../../$name/bin/$binary"
        if [ -f "$candidate" ]; then
            resolved="$candidate"
            break
        fi
        current_dir="$(dirname "$current_dir")"
    done
    
    if [ -z "\$resolved" ]; then
        printf "It seems that your package manager failed to install the right version of the agentic CLI for your platform. You can try manually installing the \\"%s\\" package\\n" "\$name" >&2
        exit 1
    fi
fi

# Handle SIGINT gracefully
trap '' INT

# Execute the binary with all arguments
exec "\$resolved" "\$@"
`;

await fs.writeFile(
  path.join(mainPkgDir, "bin", "agentic"),
  shellWrapper,
  { mode: 0o755 }
);

// Copy other necessary files to main package
const filesToCopy = ["LICENSE", "README.md"];
for (const file of filesToCopy) {
  if (await fs.stat(file).catch(() => null)) {
    await fs.copyFile(file, path.join(mainPkgDir, file));
  }
}

// Copy agent and command directories
const dirsToCopy = ["agent", "command", "tool", "docs", "dependencies"];
for (const dir of dirsToCopy) {
  const srcDir = path.join(process.cwd(), dir);
  const destDir = path.join(mainPkgDir, dir);
  if (await fs.stat(srcDir).catch(() => null)) {
    await $`cp -r ${srcDir} ${destDir}`;
  }
}

// Publish all packages to npm
console.log("\nPublishing to npm...");

// Publish platform packages first
for (const platform of platforms) {
  const pkgDir = path.join(distDir, `agentic-${platform.name}`);
  console.log(`  Publishing agentic-${platform.name}...`);
  await $`cd ${pkgDir} && npm publish --access public`;
}

// Publish main package
console.log("  Publishing agentic-cli...");
await $`cd ${mainPkgDir} && npm publish --access public`;

console.log(`\n✓ Successfully published all packages to npm\n`);

// Create zip files for GitHub release
console.log("Creating release artifacts...");
for (const platform of platforms) {
  const binDir = path.join(distDir, `agentic-${platform.name}`, "bin");
  await $`cd ${binDir} && zip -r ../../agentic-${platform.name}.zip *`.quiet();
  console.log(`  Created ${platform.name}.zip`);
}

// Commit version changes
console.log("\nCommitting version changes...");
await $`git add package.json bun.lock`;
await $`git commit -m "release: v${version}"`;

// Create and push tag
console.log("Creating git tag...");
await $`git tag v${version}`;

// Push to origin
console.log("Pushing to origin...");
try {
  await $`git push origin HEAD --tags --no-verify`;
} catch (e) {
  console.log("  Warning: Could not push to origin (might be in CI environment)");
}

// Get commits for release notes
console.log("\nGenerating release notes...");
let releaseNotes = "## What's Changed\n\n";

// Try to get previous release tag for comparison
let previousReleaseTag: string | null = null;
try {
  const response = await fetch("https://api.github.com/repos/Cluster444/agentic/releases/latest", {
    headers: process.env.GITHUB_TOKEN ? {
      "Authorization": `token ${process.env.GITHUB_TOKEN}`
    } : {}
  });
  if (response.ok) {
    const data = await response.json() as { tag_name: string };
    previousReleaseTag = data.tag_name;
  }
} catch (e) {
  console.log("  No previous release found");
}

if (previousReleaseTag) {
  try {
    // Get commits between releases
    const response = await fetch(
      `https://api.github.com/repos/Cluster444/agentic/compare/${previousReleaseTag}...v${version}`,
      {
        headers: process.env.GITHUB_TOKEN ? {
          "Authorization": `token ${process.env.GITHUB_TOKEN}`
        } : {}
      }
    );

    if (response.ok) {
      const data = await response.json() as { commits: Array<{ commit: { message: string } }> };
      const commits = data.commits || [];

      const notes = commits
        .map(commit => {
          const msg = commit.commit.message.split('\n')[0]; // First line only
          return `- ${msg}`;
        })
        .filter(msg => {
          const lower = msg.toLowerCase();
          return !lower.includes("release:") &&
            !lower.includes("chore:") &&
            !lower.includes("ci:") &&
            !lower.includes("wip:") &&
            !lower.includes("docs:") &&
            !lower.includes("doc:");
        });

      if (notes.length > 0) {
        releaseNotes += notes.join('\n');
      } else {
        releaseNotes += "Various improvements and bug fixes";
      }
    }
  } catch (e) {
    console.log("  Could not fetch commit comparison");
    releaseNotes += "See commit history for changes";
  }
} else {
  releaseNotes += "Initial release of Agentic CLI";
}

releaseNotes += `\n\n**Full Changelog**: https://github.com/Cluster444/agentic/compare/${previousReleaseTag || 'main'}...v${version}`;

// Create GitHub release
console.log("Creating GitHub release...");
try {
  await $`gh release create v${version} --title "v${version}" --notes ${releaseNotes} ./dist/*.zip`;
  console.log(`  Created GitHub release v${version}`);
} catch (e) {
  console.log("  Warning: Could not create GitHub release (might need gh auth or GITHUB_TOKEN)");
  console.log("  You can manually create the release at: https://github.com/Cluster444/agentic/releases/new");
}

console.log(`\n✨ Release v${version} completed successfully!`);