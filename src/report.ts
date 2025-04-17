// Normalized & Enhanced: src/report.ts
// Version: 20250417
// Summary: Compiles audit results into markdown or JSON report format for output or GitHub CI pipelines.

interface ReportInput {
  format: 'markdown' | 'json';
  mcpResults: string[];
  goalResults: string[];
  duplicates: string[];
}

/**
 * Builds a readable audit report from all validator results.
 */
export function generateReport(input: ReportInput): string {
  if (input.format === 'json') {
    return JSON.stringify(input, null, 2);
  }

  return `# MCP Audit Report\n
## ✅ Rule Compliance
${input.mcpResults.length ? input.mcpResults.join('\n') : 'All MCP rules satisfied.'}

## 📚 README Goals
${input.goalResults.length ? input.goalResults.join('\n') : 'All declared goals appear implemented.'}

## 🔁 Duplicate Files
${input.duplicates.length ? input.duplicates.join('\n') : 'No duplicates detected.'}
`;
}
