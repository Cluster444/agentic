import { join } from "node:path";
import { resolveProjectPath, findOutOfSyncFiles, checkDependencyStatus } from "./utils";

export async function status(
  projectPath: string | undefined,
  useGlobal: boolean = false,
  agentModel?: string,
  ignoreFrontmatter: boolean = false,
) {
  // Resolve the project path (will exit if invalid)
  const resolvedProjectPath = resolveProjectPath(projectPath, useGlobal);
  
  // Determine target directory
  const targetBase = useGlobal 
    ? resolvedProjectPath 
    : join(resolvedProjectPath, ".opencode");
  
  console.log(`📊 Status for: ${targetBase}\n`);
  
  // Find all files and their sync status
  const syncStatus = await findOutOfSyncFiles(targetBase, agentModel, resolvedProjectPath, ignoreFrontmatter);
  
  // Count by status
  const upToDateCount = syncStatus.filter(f => f.status === 'up-to-date').length;
  const outdatedCount = syncStatus.filter(f => f.status === 'outdated').length;
  const missingCount = syncStatus.filter(f => f.status === 'missing').length;
  
  // Display files by status
  for (const file of syncStatus) {
    if (file.status === 'up-to-date') {
      console.log(`  ✓ ${file.path}`);
    } else if (file.status === 'outdated') {
      console.log(`  ⚠️  ${file.path} (outdated)`);
    } else if (file.status === 'missing') {
      console.log(`  ❌ ${file.path} (missing)`);
    }
  }
  
  // Summary
  console.log("\n📋 Summary:");
  console.log(`  ✅ Up-to-date: ${upToDateCount}`);
  console.log(`  ⚠️  Outdated: ${outdatedCount}`);
  console.log(`  ❌ Missing: ${missingCount}`);
  
  const totalIssues = outdatedCount + missingCount;
  if (totalIssues === 0) {
    console.log("\n✨ All agentic files are up-to-date!");
  } else {
    console.log(`\n⚠️  ${totalIssues} file${totalIssues === 1 ? "" : "s"} need${totalIssues === 1 ? "s" : ""} updating`);
    console.log("Run 'agentic pull' to sync the files");
  }
  
  // Check dependency status if not using global config
  if (!useGlobal) {
    const depStatus = await checkDependencyStatus(resolvedProjectPath);
    
    console.log("\n🔧 Tool Dependencies:");
    console.log(`  ${depStatus.packageJsonExists ? "✓" : "❌"} package.json`);
    console.log(`  ${depStatus.nodeModulesExists ? "✓" : "❌"} node_modules`);
    console.log(`  ${depStatus.pluginInstalled ? "✓" : "❌"} @opencode-ai/plugin`);
    console.log(`  ${depStatus.perplexityApiKeySet ? "✓" : "❌"} PERPLEXITY_API_KEY`);
    
    const depIssues = [
      !depStatus.packageJsonExists,
      !depStatus.nodeModulesExists,
      !depStatus.pluginInstalled,
      !depStatus.perplexityApiKeySet,
    ].filter(Boolean).length;
    
    if (depIssues > 0) {
      console.log(`\n⚠️  ${depIssues} dependency issue${depIssues === 1 ? "" : "s"} found`);
      if (!depStatus.nodeModulesExists) {
        console.log("💡 Run 'bun install' or 'npm install' in the .opencode directory to install tool dependencies");
      }
      if (!depStatus.perplexityApiKeySet) {
        console.log("💡 Set PERPLEXITY_API_KEY environment variable for web research features");
      }
    }
  }
}