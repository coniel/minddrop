import { existsSync, readFileSync, readdirSync, unlinkSync } from 'node:fs';
import type { Manifest, ManifestWithSlug } from '../types';

// Resolve repo root dynamically via git (import.meta.dir points to
// the build output at runtime, not the source tree)
const REPO_ROOT = Bun.spawnSync(['git', 'rev-parse', '--show-toplevel'])
  .stdout.toString()
  .trim();
const CHANGES_DIR = `${REPO_ROOT}/dev/changes`;
const PLANS_DIR = `${REPO_ROOT}/dev/plans`;

/**
 * Reads and parses all manifest JSON files from the changes directory.
 */
function readAllManifests(): ManifestWithSlug[] {
  if (!existsSync(CHANGES_DIR)) {
    return [];
  }

  const entries = readdirSync(CHANGES_DIR);
  const manifests: ManifestWithSlug[] = [];

  for (const entry of entries) {
    if (!entry.endsWith('.json')) {
      continue;
    }

    try {
      const content = readFileSync(`${CHANGES_DIR}/${entry}`, 'utf-8');
      const manifest = JSON.parse(content) as Manifest;
      const slug = entry.replace('.json', '');
      manifests.push({ ...manifest, slug });
    } catch {
      // Skip malformed manifest files
    }
  }

  return manifests;
}

/**
 * Gets file content at a specific git ref using git show.
 */
function getFileAtRef(ref: string, path: string): string {
  const result = Bun.spawnSync(['git', 'show', `${ref}:${path}`], {
    cwd: REPO_ROOT,
  });

  if (result.exitCode !== 0) {
    // File didn't exist at that ref
    return '';
  }

  return result.stdout.toString();
}

/**
 * Gets the current file content from disk.
 */
function getCurrentFile(path: string): string {
  const fullPath = `${REPO_ROOT}/${path}`;

  if (!existsSync(fullPath)) {
    return '';
  }

  return readFileSync(fullPath, 'utf-8');
}

/**
 * Runs a git command and adds each output line to the target set.
 */
function collectGitOutput(command: string[], target: Set<string>): void {
  const result = Bun.spawnSync(command, { cwd: REPO_ROOT });

  if (result.exitCode === 0) {
    const lines = result.stdout.toString().trim().split('\n').filter(Boolean);

    for (const line of lines) {
      target.add(line);
    }
  }
}

/**
 * Gets files with uncommitted changes or untracked by git
 * that aren't listed in any manifest.
 */
function getUntrackedChanges(): string[] {
  const manifests = readAllManifests();

  // Collect all files that are already in manifests
  const manifestedFiles = new Set<string>();

  for (const manifest of manifests) {
    for (const file of manifest.files) {
      manifestedFiles.add(file);
    }
  }

  const allChangedFiles = new Set<string>();

  // Get uncommitted changes vs HEAD (modified + staged)
  collectGitOutput(['git', 'diff', '--name-only', 'HEAD'], allChangedFiles);

  // Get new files not yet tracked by git
  collectGitOutput(
    ['git', 'ls-files', '--others', '--exclude-standard'],
    allChangedFiles,
  );

  // Filter out files that are already in manifests
  return [...allChangedFiles].filter((file) => !manifestedFiles.has(file));
}

/**
 * Deletes a manifest file by slug.
 */
function deleteManifest(slug: string): void {
  const manifestPath = `${CHANGES_DIR}/${slug}.json`;

  if (existsSync(manifestPath)) {
    unlinkSync(manifestPath);
  }
}

/**
 * Adds a file to an existing manifest.
 */
function addFileToManifest(slug: string, file: string): void {
  const manifestPath = `${CHANGES_DIR}/${slug}.json`;

  if (!existsSync(manifestPath)) {
    throw new Error(`Manifest "${slug}" does not exist.`);
  }

  const content = readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(content) as Manifest;

  if (!manifest.files.includes(file)) {
    manifest.files.push(file);
    Bun.write(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  }
}

/**
 * Reads all plan markdown files from the plans directory.
 */
function readAllPlans(): { name: string; filename: string }[] {
  if (!existsSync(PLANS_DIR)) {
    return [];
  }

  const entries = readdirSync(PLANS_DIR);

  return entries
    .filter((entry) => entry.endsWith('.md'))
    .map((filename) => ({
      name: extractPlanHeading(filename),
      filename,
    }));
}

/**
 * Extracts the first markdown heading from a plan file.
 * Falls back to a formatted version of the filename.
 */
function extractPlanHeading(filename: string): string {
  try {
    const content = readFileSync(`${PLANS_DIR}/${filename}`, 'utf-8');
    const match = content.match(/^#\s+(.+)$/m);

    if (match) {
      return match[1].trim();
    }
  } catch {
    // Fall back to filename-based name
  }

  // Fallback: remove extension, replace dashes with spaces, title-case
  return filename
    .replace('.md', '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Reads and returns the content of a plan file.
 */
function getPlanContent(filename: string): string {
  const fullPath = `${PLANS_DIR}/${filename}`;

  if (!existsSync(fullPath)) {
    return '';
  }

  return readFileSync(fullPath, 'utf-8');
}

/**
 * Returns the git status for all changed files relative to a base ref.
 */
function getFileStatuses(
  baseRef: string,
): Record<string, 'added' | 'modified' | 'deleted'> {
  const statuses: Record<string, 'added' | 'modified' | 'deleted'> = {};

  // Get statuses relative to the base ref
  const result = Bun.spawnSync(['git', 'diff', '--name-status', baseRef], {
    cwd: REPO_ROOT,
  });

  if (result.exitCode === 0) {
    const lines = result.stdout.toString().trim().split('\n').filter(Boolean);

    for (const line of lines) {
      const status = line[0];
      const path = line.slice(1).trim();

      if (status === 'A') {
        statuses[path] = 'added';
      } else if (status === 'D') {
        statuses[path] = 'deleted';
      } else {
        statuses[path] = 'modified';
      }
    }
  }

  // Also mark untracked files as added
  const untrackedResult = Bun.spawnSync(
    ['git', 'ls-files', '--others', '--exclude-standard'],
    { cwd: REPO_ROOT },
  );

  if (untrackedResult.exitCode === 0) {
    const lines = untrackedResult.stdout
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean);

    for (const line of lines) {
      statuses[line] = 'added';
    }
  }

  return statuses;
}

/**
 * All RPC request handlers for the dev review app.
 */
export const rpcHandlers = {
  getManifests: async () => {
    return readAllManifests();
  },

  getFileContent: async ({ ref, path }: { ref: string; path: string }) => {
    return getFileAtRef(ref, path);
  },

  getCurrentFileContent: async ({ path }: { path: string }) => {
    return getCurrentFile(path);
  },

  getUntrackedChanges: async () => {
    return getUntrackedChanges();
  },

  addFileToManifest: async ({ slug, file }: { slug: string; file: string }) => {
    addFileToManifest(slug, file);
  },

  deleteManifest: async ({ slug }: { slug: string }) => {
    deleteManifest(slug);
  },

  getFileStatuses: async ({ baseRef }: { baseRef: string }) => {
    return getFileStatuses(baseRef);
  },

  getPlans: async () => {
    return readAllPlans();
  },

  getPlanContent: async ({ filename }: { filename: string }) => {
    return getPlanContent(filename);
  },
};
