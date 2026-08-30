import { mkdir, copyFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";
import {
  resolveProjectPath,
  findOutOfSyncFiles,
  findAgenticInstallDir,
  processAgentTemplate,
  resolveAgentModel,
} from "./utils";

function extractYamlFrontmatter(text: string): {
  frontmatter: string | null;
  body: string;
} {
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) {
    return { frontmatter: null, body: text };
  }

  const lines = text.split("\n");
  let endIndex = -1;

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return { frontmatter: null, body: text };
  }

  const frontmatter = lines.slice(0, endIndex + 1).join("\n");
  const body = lines.slice(endIndex + 1).join("\n");

  return { frontmatter, body };
}

function mergeMdPreservingTargetFrontmatter(
  targetText: string,
  sourceText: string,
): string {
  const target = extractYamlFrontmatter(targetText);
  const source = extractYamlFrontmatter(sourceText);

  if (target.frontmatter) {
    return target.frontmatter + "\n" + source.body;
  } else {
    return source.body;
  }
}

export async function pull(
  projectPath: string | undefined,
  useGlobal: boolean = false,
  agentModel?: string,
  ignoreFrontmatter: boolean = false,
  configPath?: string,
) {
  // Resolve the project path (will exit if invalid)
  const resolvedProjectPath = resolveProjectPath(
    projectPath,
    useGlobal,
    configPath,
  );

  // Determine target directory
  const targetBase = useGlobal
    ? resolvedProjectPath
    : join(resolvedProjectPath, ".opencode");

  console.log(`📦 Pulling to: ${targetBase}`);

  // Resolve the agent model with proper priority
  const resolvedModel = await resolveAgentModel(
    agentModel,
    resolvedProjectPath,
  );

  // Find all out-of-sync files
  const syncStatus = await findOutOfSyncFiles(
    targetBase,
    agentModel,
    resolvedProjectPath,
    ignoreFrontmatter,
  );
  const sourceDir = findAgenticInstallDir();

  // Filter files that need action (only missing or outdated)
  const filesToCopy = syncStatus.filter(
    (f) => f.status === "missing" || f.status === "outdated",
  );

  if (filesToCopy.length === 0) {
    console.log("\n✨ All files are already up-to-date!");
    return;
  }

  console.log(`\n📁 Found ${filesToCopy.length} file(s) to update\n`);

  // Copy missing or outdated files
  for (const file of filesToCopy) {
    const sourceFile = join(sourceDir, file.path);
    const targetFile = join(targetBase, file.path);
    const targetDir = dirname(targetFile);

    // Create directory if it doesn't exist
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
    }

    const isAgentMarkdown =
      file.path.startsWith("agent/") && file.path.endsWith(".md");
    const isMarkdown = file.path.endsWith(".md");

    if (isAgentMarkdown) {
      const sourceContent = await processAgentTemplate(
        sourceFile,
        resolvedModel,
      );
      if (file.status === "missing") {
        await writeFile(targetFile, sourceContent, "utf-8");
      } else if (
        ignoreFrontmatter &&
        isMarkdown &&
        file.status === "outdated"
      ) {
        const targetText = await Bun.file(targetFile).text();
        const merged = mergeMdPreservingTargetFrontmatter(
          targetText,
          sourceContent,
        );
        await writeFile(targetFile, merged, "utf-8");
      } else {
        await writeFile(targetFile, sourceContent, "utf-8");
      }
    } else if (ignoreFrontmatter && isMarkdown && file.status === "outdated") {
      const sourceText = await Bun.file(sourceFile).text();
      const targetText = await Bun.file(targetFile).text();
      const merged = mergeMdPreservingTargetFrontmatter(targetText, sourceText);
      await writeFile(targetFile, merged, "utf-8");
    } else {
      // Copy the file normally for missing files or non-md files
      await copyFile(sourceFile, targetFile);
    }

    const action = file.status === "missing" ? "Added" : "Updated";
    console.log(`  ✓ ${action}: ${file.path}`);
  }

  console.log(
    `\n✅ Updated ${filesToCopy.length} file${filesToCopy.length === 1 ? "" : "s"}`,
  );
}
