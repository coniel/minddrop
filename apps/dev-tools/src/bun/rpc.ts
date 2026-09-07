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
import {
  deleteReviewedHash,
  hashFileContent,
  readReviewedHashes,
  updateReviewedHash,
} from './reviewedFiles';

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
 * Runs a git command without blocking the event loop, so requests
 * keep being answered while it runs.
 *
 * @param args - The git arguments.
 * @param cwd - The checkout to run in.
 * @returns The command's stdout, or null when it exits with an error.
 */
async function runGit(args: string[], cwd: string): Promise<string | null> {
  const gitProcess = Bun.spawn(['git', ...args], {
    cwd,
    stdout: 'pipe',
    stderr: 'ignore',
  });
  // Drain stdout before waiting on exit so a large output cannot
  // fill the pipe and stall the process
  const output = await new Response(gitProcess.stdout).text();
  const exitCode = await gitProcess.exited;

  if (exitCode !== 0) {
    return null;
  }

  return output;
}

/**
 * Runs a git command and returns its non-empty output lines, or no
 * lines when it exits with an error.
 */
async function readGitLines(args: string[], cwd: string): Promise<string[]> {
  const output = await runGit(args, cwd);

  if (output === null) {
    return [];
  }

  return output.trim().split('\n').filter(Boolean);
}

/**
 * Gets file content at a specific git ref using git show.
 */
async function getFileAtRef(ref: string, path: string): Promise<string> {
  const content = await runGit(['show', `${ref}:${path}`], REPO_ROOT);

  // File didn't exist at that ref
  return content ?? '';
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
 * Lists the names of the agent worktrees registered with git.
 */
async function listWorktreeNames(): Promise<string[]> {
  const lines = await readGitLines(
    ['worktree', 'list', '--porcelain'],
    REPO_ROOT,
  );
  const names: string[] = [];

  // Each worktree entry starts with its path line
  for (const line of lines) {
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
async function getMergeBase(root: string): Promise<string | null> {
  const output = await runGit(['merge-base', MAIN_BRANCH, 'HEAD'], root);

  if (output === null) {
    return null;
  }

  return output.trim();
}

/**
 * A checkout to scan for changes and the ref to diff it against.
 */
interface ChangeScan {
  /**
   * The checkout's working tree root.
   */
  root: string;

  /**
   * Name of the agent worktree, or null for the main checkout.
   */
  worktree: string | null;

  /**
   * The git ref the checkout is diffed against.
   */
  ref: string;
}

/**
 * Lists the files changed in a checkout relative to a ref: modified,
 * staged, committed and not yet tracked by git.
 */
async function listChangedFiles(scan: ChangeScan): Promise<string[]> {
  const [diffed, untracked] = await Promise.all([
    readGitLines(['diff', '--name-only', scan.ref], scan.root),
    readGitLines(['ls-files', '--others', '--exclude-standard'], scan.root),
  ]);

  return [...new Set([...diffed, ...untracked])];
}

/**
 * Gets files changed in the main checkout or any agent worktree that
 * aren't listed in a manifest for the same checkout. Worktrees are
 * diffed against their merge base with main so synced-in commits from
 * other work do not show as changes.
 */
async function getUntrackedChanges(): Promise<UntrackedChange[]> {
  const manifests = readAllManifests();

  // Collect the files already in manifests, keyed by checkout
  const manifestedFiles = new Set<string>();

  for (const manifest of manifests) {
    for (const file of manifest.files) {
      manifestedFiles.add(`${manifest.worktree ?? ''}:${file}`);
    }
  }

  // Scan the main checkout against HEAD
  const scans: ChangeScan[] = [
    { root: REPO_ROOT, worktree: null, ref: 'HEAD' },
  ];

  // Scan every worktree against its merge base with main
  const worktrees = await listWorktreeNames();
  const mergeBases = await Promise.all(
    worktrees.map((worktree) => getMergeBase(`${WORKTREES_DIR}/${worktree}`)),
  );

  worktrees.forEach((worktree, index) => {
    const mergeBase = mergeBases[index];

    if (mergeBase) {
      scans.push({
        root: `${WORKTREES_DIR}/${worktree}`,
        worktree,
        ref: mergeBase,
      });
    }
  });

  const changedFilesPerScan = await Promise.all(scans.map(listChangedFiles));
  const changes: UntrackedChange[] = [];

  scans.forEach((scan, index) => {
    // Keep the files not covered by a manifest for this checkout
    for (const path of changedFilesPerScan[index]) {
      if (manifestedFiles.has(`${scan.worktree ?? ''}:${path}`)) {
        continue;
      }

      changes.push({ path, worktree: scan.worktree, baseRef: scan.ref });
    }
  });

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
async function getFileStatuses(
  baseRef: string,
  worktree: string | null,
): Promise<Record<string, 'added' | 'modified' | 'deleted'>> {
  const statuses: Record<string, 'added' | 'modified' | 'deleted'> = {};
  const root = getWorktreeRoot(worktree);

  // Get statuses relative to the base ref, and the untracked files
  // which count as added
  const [statusLines, untrackedLines] = await Promise.all([
    readGitLines(['diff', '--name-status', baseRef], root),
    readGitLines(['ls-files', '--others', '--exclude-standard'], root),
  ]);

  for (const line of statusLines) {
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

  for (const line of untrackedLines) {
    statuses[line] = 'added';
  }

  return statuses;
}

/**
 * Gets the reviewed files of every work group, dropping the ones whose
 * content changed since they were reviewed so they need reviewing again.
 */
function getReviewedFiles(): Record<string, string[]> {
  const reviewed: Record<string, string[]> = {};

  for (const manifest of readAllManifests()) {
    const hashes = readReviewedHashes(manifest.slug);
    const worktree = manifest.worktree ?? null;

    reviewed[manifest.slug] = Object.keys(hashes).filter(
      (path) =>
        hashFileContent(getCurrentFile(path, worktree)) === hashes[path],
    );
  }

  return reviewed;
}

/**
 * Records a file as reviewed at its current content, or clears its
 * reviewed state.
 */
function setFileReviewed(slug: string, path: string, reviewed: boolean): void {
  if (!reviewed) {
    deleteReviewedHash(slug, path);

    return;
  }

  const manifest = readAllManifests().find(
    (candidate) => candidate.slug === slug,
  );

  // The work group may have been removed since the file was opened
  if (!manifest) {
    return;
  }

  const content = getCurrentFile(path, manifest.worktree ?? null);

  updateReviewedHash(slug, path, hashFileContent(content));
}

/**
 * Counts the open comments on each file of every work group.
 */
function getOpenCommentCounts(): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {};

  for (const manifest of readAllManifests()) {
    const perFile: Record<string, number> = {};

    for (const comment of readReviewComments(manifest.slug)) {
      // General comments belong to no file
      if (comment.file === null || comment.status !== 'open') {
        continue;
      }

      perFile[comment.file] = (perFile[comment.file] ?? 0) + 1;
    }

    counts[manifest.slug] = perFile;
  }

  return counts;
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

  getReviewedFiles: async () => {
    return getReviewedFiles();
  },

  setFileReviewed: async ({
    slug,
    path,
    reviewed,
  }: {
    slug: string;
    path: string;
    reviewed: boolean;
  }) => {
    setFileReviewed(slug, path, reviewed);
  },

  getOpenCommentCounts: async () => {
    return getOpenCommentCounts();
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
