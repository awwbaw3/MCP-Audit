// Normalized & Enhanced: src/readme.ts
// Version: 20250417
// Summary: Parses README.md goals and compares them to project structure for alignment.

import fs from 'fs';
import path from 'path';

/**
 * Extracts bullet-pointed goals from a README file under ## Goals or ### Goals
 */
export function extractGoalsFromReadme(readmePath: string): string[] {
  if (!fs.existsSync(readmePath)) return [];

  const content = fs.readFileSync(readmePath, 'utf-8');
  const lines = content.split('\n');

  const goals: string[] = [];
  let insideGoals = false;

  for (const line of lines) {
    if (/^###+ Goals/i.test(line)) {
      insideGoals = true;
      continue;
    }

    if (insideGoals) {
      if (/^###+/.test(line)) break;
      if (/^\s*-\s+/.test(line)) {
        goals.push(line.replace(/^\s*-\s+/, '').trim());
      }
    }
  }

  return goals;
}

/**
 * Attempts to validate if goals are reflected in file names.
 */
export function validateGoalsAgainstFiles(goals: string[], files: string[]): string[] {
  return goals.map(goal => {
    const matched = files.some(f => f.toLowerCase().includes(goal.toLowerCase().split(' ')[0]));
    return matched
      ? `✅ Goal "${goal}" appears implemented`
      : `❌ Goal "${goal}" not detected in codebase`;
  });
}
