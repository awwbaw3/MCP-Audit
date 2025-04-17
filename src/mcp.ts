// Normalized & Enhanced: src/mcp.ts
// Version: 20250417
// Summary: Loads and parses MCP rules from .mcp and .yaml files, validates against actual file structure using glob support.

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { matchesGlob } from './scanner';

export interface McpRule {
  type: 'requiredFile' | 'forbiddenFile' | 'requiredFolder';
  path: string;
  description?: string;
}

/**
 * Parse all .mcp and .yaml files from a folder and return a normalized list of rules.
 */
export function parseMcpRules(folderPath: string): McpRule[] {
  const files = fs.readdirSync(folderPath);
  const rules: McpRule[] = [];

  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const content = fs.readFileSync(fullPath, 'utf-8');

    if (file.endsWith('.yaml') || file.endsWith('.yml')) {
      const yamlRules = yaml.load(content) as McpRule[] || [];
      rules.push(...yamlRules);
    } else if (file.endsWith('.mcp')) {
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.startsWith('Required:')) {
          rules.push({ type: 'requiredFile', path: line.replace('Required:', '').trim() });
        } else if (line.startsWith('Forbidden:')) {
          rules.push({ type: 'forbiddenFile', path: line.replace('Forbidden:', '').trim() });
        } else if (line.startsWith('RequiredFolder:')) {
          rules.push({ type: 'requiredFolder', path: line.replace('RequiredFolder:', '').trim() });
        }
      }
    }
  }

  return rules;
}

/**
 * Validate the rules against the scanned file list.
 */
export function validateRulesAgainstFiles(rules: McpRule[], files: string[]): string[] {
  const results: string[] = [];

  for (const rule of rules) {
    const matches = files.some(file => matchesGlob(rule.path, file));

    if (rule.type === 'requiredFile' && !matches) {
      results.push(`❌ Missing required file: ${rule.path}`);
    }

    if (rule.type === 'requiredFolder' && !matches) {
      results.push(`❌ Missing required folder: ${rule.path}`);
    }

    if (rule.type === 'forbiddenFile' && matches) {
      results.push(`🚫 Forbidden file found: ${rule.path}`);
    }
  }

  return results;
}
