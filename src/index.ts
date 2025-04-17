// File: src/index.ts
import fs from 'fs';
import path from 'path';
import { parseMcpRules, validateAgainstMcp } from './mcp';
import { readReadmeGoals, validateAgainstReadme } from './readme';
import { scanProjectFiles, findDuplicates } from './scanner';
import { generateMarkdownReport } from './report';

interface AuditOptions {
  projectPath: string;
  output: 'markdown' | 'json';
}

export async function runAudit(options: AuditOptions) {
  const { projectPath, output } = options;

  const mcpDir = path.join(projectPath, 'mcp-suite');
  const readmePath = path.join(projectPath, 'README.md');

  const rules = parseMcpRules(mcpDir);
  const readmeGoals = readReadmeGoals(readmePath);
  const projectFiles = scanProjectFiles(projectPath);

  const mcpResults = validateAgainstMcp(rules, projectFiles);
  const readmeResults = validateAgainstReadme(readmeGoals, projectFiles);
  const duplicateResults = findDuplicates(projectFiles);

  const report = generateMarkdownReport(mcpResults, readmeResults, duplicateResults);

  if (output === 'markdown') {
    fs.writeFileSync(path.join(projectPath, 'mcp-audit-report.md'), report);
    console.log('✅ Audit complete: mcp-audit-report.md generated');
  } else {
    fs.writeFileSync(path.join(projectPath, 'mcp-audit-report.json'), JSON.stringify({
      mcpResults,
      readmeResults,
      duplicateResults
    }, null, 2));
    console.log('✅ Audit complete: mcp-audit-report.json generated');
  }
} 

// CLI Entry
if (require.main === module) {
  const args = process.argv.slice(2);
  runAudit({
    projectPath: args[0] || process.cwd(),
    output: args.includes('--json') ? 'json' : 'markdown'
  });
}
