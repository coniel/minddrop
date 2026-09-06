import { existsSync, readFileSync, readdirSync, unlinkSync } from 'node:fs';
import type {
  Manifest,
  ManifestWithSlug,
  NewReviewComment,
  ReviewCommentChanges,
  UntrackedChange,
} from '../types';
import {
  createReviewComment,
  deleteReviewComment,
  deleteReviewCommentsDir,
  readReviewComments,
  updateReviewComment,
} from './reviewComments';

// Resolve repo root dynamically via git (import.meta.dir points to
// the build output at runtime, not the source tree)
const REPO_ROOT = Bun.spawnSync(['git', 'rev-parse', '--show-toplevel'])
  .stdout.toString()
  .trim();
// Shared dev data dir, lives outside the repo so all agent
// worktrees read and write the same manifests
const DEV_DIR = `${process.env.HOME}/Documents/MindDrop 2/dev`;
const CHANGES_DIR = `${DEV_DIR}/changes`;
// Agent session worktrees live inside the repo
const WORKTREES_DIR = `${REPO_ROOT}/.claude/worktrees`;
// The branch worktree changes are measured against
const MAIN_BRANCH = 'main';

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
 * Lists the names of the agent worktrees registered with git.
 */
function listWorktreeNames(): string[] {
  const result = Bun.spawnSync(['git', 'worktree', 'list', '--porcelain'], {
    cwd: REPO_ROOT,
  });

  if (result.exitCode !== 0) {
    return [];
  }

  const names: string[] = [];

  // Each worktree entry starts with its path line
  for (const line of result.stdout.toString().split('\n')) {
    if (!line.startsWith(`worktree ${WORKTREES_DIR}/`)) {
      continue;
    }

    names.push(line.slice(`worktree ${WORKTREES_DIR}/`.length));
  }

  return names;
}

/**
 * Resolves the commit a worktree branch diverged from main at, so only
 * the branch's own work counts as changed rather than everything main
 * gained since the branch last synced.
 */
function getMergeBase(root: string): string | null {
  const result = Bun.spawnSync(['git', 'merge-base', MAIN_BRANCH, 'HEAD'], {
    cwd: root,
  });

  if (result.exitCode !== 0) {
    return null;
  }

  return result.stdout.toString().trim();
}

/**
 * Gets files changed in the main checkout or any agent worktree that
 * aren't listed in a manifest for the same checkout. Worktrees are
 * diffed against their merge base with main so synced-in commits from
 * other work do not show as changes.
 */
function getUntrackedChanges(): UntrackedChange[] {
  const manifests = readAllManifests();

  // Collect the files already in manifests, keyed by checkout
  const manifestedFiles = new Set<string>();

  for (const manifest of manifests) {
    for (const file of manifest.files) {
      manifestedFiles.add(`${manifest.worktree ?? ''}:${file}`);
    }
  }

  // Scan the main checkout against HEAD
  const scans: { root: string; worktree: string | null; ref: string }[] = [
    { root: REPO_ROOT, worktree: null, ref: 'HEAD' },
  ];

  // Scan every worktree against its merge base with main
  for (const worktree of listWorktreeNames()) {
    const root = `${WORKTREES_DIR}/${worktree}`;
    const mergeBase = getMergeBase(root);

    if (mergeBase) {
      scans.push({ root, worktree, ref: mergeBase });
    }
  }

  const changes: UntrackedChange[] = [];

  for (const scan of scans) {
    const changedFiles = new Set<string>();

    // Get changes vs the scan ref (modified + staged + committed)
    collectGitOutput(
      ['git', 'diff', '--name-only', scan.ref],
      changedFiles,
      scan.root,
    );

    // Get new files not yet tracked by git
    collectGitOutput(
      ['git', 'ls-files', '--others', '--exclude-standard'],
      changedFiles,
      scan.root,
    );

    // Keep the files not covered by a manifest for this checkout
    for (const path of changedFiles) {
      if (manifestedFiles.has(`${scan.worktree ?? ''}:${path}`)) {
        continue;
      }

      changes.push({ path, worktree: scan.worktree, baseRef: scan.ref });
    }
  }

  return changes;
}

/**
 * Deletes a manifest file by slug along with its review comments.
 */
function deleteManifest(slug: string): void {
  const manifestPath = `${CHANGES_DIR}/${slug}.json`;

  if (existsSync(manifestPath)) {
    unlinkSync(manifestPath);
  }

  deleteReviewCommentsDir(slug);
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

  getReviewComments: async ({ slug }: { slug: string }) => {
    return readReviewComments(slug);
  },

  createReviewComment: async ({
    slug,
    comment,
  }: {
    slug: string;
    comment: NewReviewComment;
  }) => {
    return createReviewComment(slug, comment);
  },

  updateReviewComment: async ({
    slug,
    id,
    changes,
  }: {
    slug: string;
    id: string;
    changes: ReviewCommentChanges;
  }) => {
    updateReviewComment(slug, id, changes);
  },

  deleteReviewComment: async ({ slug, id }: { slug: string; id: string }) => {
    deleteReviewComment(slug, id);
  },
};
