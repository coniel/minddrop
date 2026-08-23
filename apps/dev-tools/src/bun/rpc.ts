import { existsSync, readFileSync, readdirSync, unlinkSync } from 'node:fs';
import type { Manifest, ManifestWithSlug } from '../types';

// Resolve repo root dynamically via git (import.meta.dir points to
// the build output at runtime, not the source tree)
const REPO_ROOT = Bun.spawnSync(['git', 'rev-parse', '--show-toplevel'])
  .stdout.toString()
  .trim();
// Shared dev data dir, lives outside the repo so all agent
// worktrees read and write the same manifests
const DEV_DIR = `${process.env.HOME}/Documents/MindDrop 2/dev`;
const CHANGES_DIR = `${DEV_DIR}/changes`;
// Plans live in the workspace as a MindDrop database
const PLANS_DIR = `${process.env.HOME}/Documents/MindDrop 2/Dev plans`;
// Plan statuses which are no longer active work
const ARCHIVED_PLAN_STATUSES = ['Completed', 'Abandoned'];

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
 * Resolves the working tree root for a worktree name. Falls back to
 * the main checkout when unset or when the worktree no longer exists.
 */
function getWorktreeRoot(worktree: string | null | undefined): string {
  // No worktree recorded, use the main checkout
  if (!worktree) {
    return REPO_ROOT;
  }

  const worktreePath = `${REPO_ROOT}/.claude/worktrees/${worktree}`;

  // Worktree may have been removed since the manifest was written
  if (!existsSync(worktreePath)) {
    return REPO_ROOT;
  }

  return worktreePath;
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
 * Gets the current file content from the given worktree's disk.
 */
function getCurrentFile(path: string, worktree: string | null): string {
  const fullPath = `${getWorktreeRoot(worktree)}/${path}`;

  if (!existsSync(fullPath)) {
    return '';
  }

  return readFileSync(fullPath, 'utf-8');
}

/**
 * Runs a git command and adds each output line to the target set.
 */
function collectGitOutput(
  command: string[],
  target: Set<string>,
  cwd: string,
): void {
  const result = Bun.spawnSync(command, { cwd });

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

  // Scan the main checkout against HEAD, and each manifest's
  // worktree against its baseRef so WIP-committed changes show too
  const scans = new Map<string, { root: string; ref: string }>();

  scans.set(`${REPO_ROOT}:HEAD`, { root: REPO_ROOT, ref: 'HEAD' });

  for (const manifest of manifests) {
    const root = getWorktreeRoot(manifest.worktree);

    if (root !== REPO_ROOT) {
      scans.set(`${root}:${manifest.baseRef}`, {
        root,
        ref: manifest.baseRef,
      });
    }
  }

  const allChangedFiles = new Set<string>();

  for (const scan of scans.values()) {
    // Get changes vs the scan ref (modified + staged + committed)
    collectGitOutput(
      ['git', 'diff', '--name-only', scan.ref],
      allChangedFiles,
      scan.root,
    );

    // Get new files not yet tracked by git
    collectGitOutput(
      ['git', 'ls-files', '--others', '--exclude-standard'],
      allChangedFiles,
      scan.root,
    );
  }

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
 * Reads all active plan entries from the plans database, omitting
 * completed and abandoned ones.
 */
function readAllPlans(): { name: string; filename: string }[] {
  if (!existsSync(PLANS_DIR)) {
    return [];
  }

  const entries = readdirSync(PLANS_DIR);

  return entries
    .filter((entry) => entry.endsWith('.md'))
    .filter((filename) => {
      const status = readPlanProperty(filename, 'Status');

      return !ARCHIVED_PLAN_STATUSES.includes(status);
    })
    .map((filename) => ({
      name: extractPlanTitle(filename),
      filename,
    }));
}

/**
 * Returns a plan's display title, falling back to a formatted
 * version of its filename.
 */
function extractPlanTitle(filename: string): string {
  const title = readPlanProperty(filename, 'Title');

  if (title) {
    return title;
  }

  // Fallback: remove extension, replace dashes with spaces, title-case
  return filename
    .replace('.md', '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Reads a single-line property value from a plan's frontmatter.
 * Returns an empty string when the property is absent.
 */
function readPlanProperty(filename: string, property: string): string {
  let content: string;

  try {
    content = readFileSync(`${PLANS_DIR}/${filename}`, 'utf-8');
  } catch {
    return '';
  }

  // Properties only exist inside a leading frontmatter block
  if (!content.startsWith('---\n')) {
    return '';
  }

  const frontmatterEnd = content.indexOf('\n---\n', 4);

  if (frontmatterEnd === -1) {
    return '';
  }

  const frontmatter = content.slice(4, frontmatterEnd);
  const match = frontmatter.match(new RegExp(`^${property}:[ \\t]*(.+)$`, 'm'));

  if (!match) {
    return '';
  }

  // Values may be quoted when they contain YAML control characters
  return match[1].trim().replace(/^"(.*)"$/, '$1');
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
 * Returns the git status for all changed files relative to a base
 * ref, diffed in the given worktree or the main checkout.
 */
function getFileStatuses(
  baseRef: string,
  worktree: string | null,
): Record<string, 'added' | 'modified' | 'deleted'> {
  const statuses: Record<string, 'added' | 'modified' | 'deleted'> = {};
  const root = getWorktreeRoot(worktree);

  // Get statuses relative to the base ref
  const result = Bun.spawnSync(['git', 'diff', '--name-status', baseRef], {
    cwd: root,
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
    { cwd: root },
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

  getCurrentFileContent: async ({
    path,
    worktree,
  }: {
    path: string;
    worktree: string | null;
  }) => {
    return getCurrentFile(path, worktree);
  },

  getUntrackedChanges: async () => {
    return getUntrackedChanges();
  },

  deleteManifest: async ({ slug }: { slug: string }) => {
    deleteManifest(slug);
  },

  getFileStatuses: async ({
    baseRef,
    worktree,
  }: {
    baseRef: string;
    worktree: string | null;
  }) => {
    return getFileStatuses(baseRef, worktree);
  },

  getPlans: async () => {
    return readAllPlans();
  },

  getPlanContent: async ({ filename }: { filename: string }) => {
    return getPlanContent(filename);
  },
};
