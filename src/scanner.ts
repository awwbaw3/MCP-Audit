// Normalized & Enhanced: src/scanner.ts
// Version: 20250417
// Summary: Recursively scans project files, skipping Expo/React Native boilerplate, supports duplicate detection and glob pattern matching

import fs from 'fs';
import path from 'path';
import minimatch from 'minimatch';

const EXCLUDED_DIRS = [
  'node_modules', '.git', 'ios', 'android', 'build', 'dist', '.expo'
];

const EXCLUDED_FILES = ['.env', '.DS_Store'];

/**
 * Recursively scan project files and return a flat list of relative file paths.
 * Automatically skips common boilerplate folders/files (e.g., node_modules, .expo).
 */
export function scanProjectFiles(dir: string, basePath = ''): string[] {
  const files: string[] = [];
  const fullPath = path.join(dir, basePath);

  if (!fs.existsSync(fullPath)) return files;

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  for (const entry of entries) {
    if (EXCLUDED_DIRS.includes(entry.name) || EXCLUDED_FILES.includes(entry.name)) continue;

    const relativePath = path.join(basePath, entry.name);
    const fullEntryPath = path.join(dir, relativePath);

    if (entry.isDirectory()) {
      files.push(...scanProjectFiles(dir, relativePath));
    } else {
      files.push(relativePath.replace(/\\/g, '/'));
    }
  }

  return files;
}

/**
 * Detects duplicate filenames in the scanned project files.
 */
export function findDuplicates(files: string[]): string[] {
  const seen = new Map<string, number>();
  const duplicates: string[] = [];

  for (const file of files) {
    const key = path.basename(file);
    seen.set(key, (seen.get(key) || 0) + 1);
  }

  for (const [key, count] of seen.entries()) {
    if (count > 1) {
      duplicates.push(`⚠️ Duplicate file: ${key} (${count} instances)`);
    }
  }

  return duplicates;
}

/**
 * Checks whether a file path matches a given glob pattern.
 */
export function matchesGlob(pattern: string, filePath: string): boolean {
  return minimatch(filePath, pattern);
}
