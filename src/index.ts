// Normalized & Enhanced: src/index.ts
// Version: 20250417
// Summary: Main CLI entry point that runs a full MCP audit with scanning, validation, and reporting.

import path from 'path';
import { scanProjectFiles, findDuplicates } from './scanner';
import { parseMcpRules, validateRulesAgainstFiles } from './mcp';
import { extractGoalsFromReadme, validateGoalsAgainstFiles } from './readme';
import { generateReport } from './report';

const args = process.argv.slice(2);
const projectPath = args[0] || process.cwd();
const outputFormat = args.includes('--json') ? 'json' : 'markdown';

(async () => {
  const allFiles = scanProjectFiles(projectPath);
  const duplicates = findDuplicates(allFiles);

  const mcpRules = parseMcpRules(path.join(projectPath, 'mcp-suite'));
  const mcpResults = validateRulesAgainstFiles(mcpRules, allFiles);

  const readmePath = path.join(projectPath, 'README.md');
  const declaredGoals = extractGoalsFromReadme(readmePath);
  const goalResults = validateGoalsAgainstFiles(declaredGoals, allFiles);

  const report = generateReport({
    format: outputFormat,
    mcpResults,
    goalResults,
    duplicates,
  });

  const outputFile = `mcp-audit-report.${outputFormat === 'json' ? 'json' : 'md'}`;
  require('fs').writeFileSync(outputFile, report);
  console.log(`✅ Audit complete. Output written to ${outputFile}`);
})();

/*
=======================================
📘 MCP-Audit Usage Instructions
=======================================

🧪 To run the audit locally:

1. Clone the MCP-Audit repository:
   git clone https://github.com/awwbaw3/MCP-Audit.git
   cd MCP-Audit
   npm install

2. Run audit on another project folder:
   npx ts-node src/index.ts /path/to/target/project

3. To generate JSON instead of Markdown:
   npx ts-node src/index.ts /path/to/project --json

🧰 To use as a GitHub Action in another repo:

Add this to `.github/workflows/mcp-audit.yml` in your target project:

name: MCP Audit

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Clone MCP-Audit Tool
        run: |
          git clone https://github.com/awwbaw3/MCP-Audit.git
          cd MCP-Audit && npm install
      - name: Run MCP Audit
        run: |
          npx ts-node MCP-Audit/src/index.ts .
      - name: Upload Audit Report
        uses: actions/upload-artifact@v3
        with:
          name: mcp-audit-report
          path: mcp-audit-report.md
*/
