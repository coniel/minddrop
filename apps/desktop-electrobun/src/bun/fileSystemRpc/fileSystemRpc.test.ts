import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'bun:test';
import { readdirSync, statSync } from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { FsWatchEventKind } from '@minddrop/file-system';
import { mockElectrobun } from '../test-utils/mockElectrobun';
import { waitForCondition } from '../test-utils/waitForCondition';

mockElectrobun();

const { fileSystemRpcHandlers, setWatchEventSender } = await import(
  './fileSystemRpc'
);

// Number of files rewritten by the crash test
const crashTestFileCount = 4;
// Size of the files rewritten by the crash test. Large enough that a
// write in progress can be observed.
const crashTestFileSize = 4 * 1024 * 1024;
// Number of times the crash test crashes the rewrite
const crashTestAttempts = 3;

// Permission checks do not apply to root, so a path cannot be made
// unreadable when running as root.
const runsAsRoot = process.getuid?.() === 0;
// The crash test spawns and kills processes writing hundreds of
// megabytes, so it only runs when asked for.
const runsCrashTests = Boolean(process.env.MINDDROP_CRASH_TESTS);

// Milliseconds to collect the remaining watch events of a move for,
// once its first event arrives
const watchSettleTime = 100;

let tempDir: string;

describe('fileSystemRpcHandlers', () => {
  beforeEach(async () => {
    tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'minddrop-fs-rpc-'));
  });

  afterEach(async () => {
    // Clear the watch event sender
    setWatchEventSender(() => {});

    // Restore permissions a test may have removed so the directory
    // can be deleted.
    await fsp.chmod(path.join(tempDir, 'locked'), 0o755).catch(() => {});
    await fsp.rm(tempDir, { recursive: true, force: true });
  });

  describe('fsExists', () => {
    // Kept apart from the pin below, which passes on any failure
    (runsAsRoot ? it.skip : it)(
      'sets up a path which cannot be checked',
      async () => {
        const filePath = await arrangeUncheckablePath();

        await expect(fsp.stat(filePath)).rejects.toMatchObject({
          code: 'EACCES',
        });
      },
    );

    // Pins Issue 42: fsExists returns false on any stat error. Remove
    // .failing once fixed.
    (runsAsRoot ? it.skip : it.failing)(
      'rejects when a path cannot be checked rather than reporting it as missing',
      async () => {
        const filePath = await arrangeUncheckablePath();

        await expect(
          fileSystemRpcHandlers.fsExists({ path: filePath }),
        ).rejects.toMatchObject({ code: 'EACCES' });
      },
    );
  });

  describe('fsWatch', () => {
    // Kept apart from the pin below, which passes on any failure. A
    // move the watcher never reports fails this test instead of
    // passing as the pinned bug.
    it('reports a directory moved into a watched directory', async () => {
      const kinds = await watchDirectoryMove();

      expect(kinds).not.toEqual([]);
    });

    // Pins Issue 40: The desktop adapter never emits a 'create' watch
    // kind. Remove .failing once fixed.
    it.failing(
      "reports a directory moved into a watched directory as 'create'",
      async () => {
        const kinds = await watchDirectoryMove();

        expect(kinds).toContain('create');
      },
    );
  });

  describe('fsWriteTextFiles', () => {
    // The outcomes of the crashed rewrites
    const crashes: CrashedRewrite[] = [];
    // The directory the crashed rewrites run in
    let crashDir: string;

    beforeAll(async () => {
      if (!runsCrashTests) {
        return;
      }

      crashDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'minddrop-crash-'));

      // Crash a rewrite several times, as a kill can land just after
      // a write rather than during it.
      for (let attempt = 0; attempt < crashTestAttempts; attempt++) {
        const attemptDir = path.join(crashDir, `attempt ${attempt}`);
        await fsp.mkdir(attemptDir);

        crashes.push(await crashRewrite(attemptDir));
      }
    }, 60000);

    afterAll(async () => {
      if (crashDir) {
        await fsp.rm(crashDir, { recursive: true, force: true });
      }
    });

    // Kept apart from the pin below, which passes on any failure. A
    // rewrite which finished or failed on its own fails this test
    // instead of passing as the pinned bug.
    (runsCrashTests ? it : it.skip)('kills every rewrite mid-write', () => {
      expect(crashes).toHaveLength(crashTestAttempts);
      expect(crashes.every((crash) => crash.killedMidWrite)).toBe(true);
    });

    // Pins Issue 41: Text writes truncate the destination in place.
    // Remove .failing once fixed.
    (runsCrashTests ? it.failing : it.skip)(
      'leaves every file with either its old or its new contents when the process is killed mid-write',
      () => {
        expect(crashes.flatMap((crash) => crash.damagedPaths)).toEqual([]);
      },
    );
  });
});

/**
 * Creates a file inside a directory, then makes the directory
 * unsearchable so that stat fails on the file with EACCES.
 *
 * @returns The file's path.
 */
async function arrangeUncheckablePath(): Promise<string> {
  // Create a file inside a directory
  const lockedDir = path.join(tempDir, 'locked');
  const filePath = path.join(lockedDir, 'Entry.md');
  await fsp.mkdir(lockedDir);
  await fsp.writeFile(filePath, 'Content');

  // Make the directory unsearchable
  await fsp.chmod(lockedDir, 0o000);

  return filePath;
}

/**
 * Moves a directory into a watched directory and collects the kinds of
 * the events reported for it.
 *
 * @returns The kinds of the events reported for the moved directory.
 * @throws {Error} If no event is reported for the moved directory.
 */
async function watchDirectoryMove(): Promise<FsWatchEventKind[]> {
  // Create the watched directory, and a directory with an entry
  // outside it.
  const watchedDir = path.join(tempDir, 'watched');
  const outsideDir = path.join(tempDir, 'outside');
  await fsp.mkdir(watchedDir);
  await fsp.mkdir(path.join(outsideDir, 'Foo'), { recursive: true });
  await fsp.writeFile(path.join(outsideDir, 'Foo', 'Foo.md'), 'Content');

  // Collect the kinds of events reported for the moved directory
  const movedDirPath = path.join(watchedDir, 'Foo');
  const kinds: FsWatchEventKind[] = [];
  setWatchEventSender((event) => {
    if (event.paths.includes(movedDirPath)) {
      kinds.push(event.kind);
    }
  });

  // Watch the watched directory
  const id = await fileSystemRpcHandlers.fsWatch({
    paths: [watchedDir],
    recursive: true,
  });

  try {
    // Move the directory into the watched directory
    await fsp.rename(path.join(outsideDir, 'Foo'), movedDirPath);

    // Wait for the move to be reported, then for the rest of its
    // events to arrive.
    await waitForCondition(() => kinds.length > 0);
    await Bun.sleep(watchSettleTime);
  } finally {
    // Stop watching
    await fileSystemRpcHandlers.fsUnwatch({ id });
  }

  return kinds;
}

/**
 * The outcome of a crashed rewrite.
 */
interface CrashedRewrite {
  /**
   * Whether the rewriting process was killed while a write was in
   * progress.
   */
  killedMidWrite: boolean;

  /**
   * The paths of the files left with neither their old nor their new
   * contents.
   */
  damagedPaths: string[];
}

/**
 * Rewrites the files of a directory in a child process and kills it
 * mid-write.
 *
 * @param dir - The directory to rewrite files in.
 * @returns Whether the process was killed mid-write, and the files it
 *   damaged.
 */
async function crashRewrite(dir: string): Promise<CrashedRewrite> {
  // Fill the files with their old contents
  const oldContents = 'a'.repeat(crashTestFileSize);
  const newContents = 'b'.repeat(crashTestFileSize);
  const filePaths = Array.from({ length: crashTestFileCount }, (_, index) =>
    path.join(dir, `Entry ${index}.md`),
  );
  await Promise.all(
    filePaths.map((filePath) => fsp.writeFile(filePath, oldContents)),
  );

  // Rewrite the files in a child process
  const child = Bun.spawn([
    process.execPath,
    path.join(import.meta.dir, '../test-utils/writeTextFilesProcess.ts'),
    dir,
    'b',
  ]);
  // Track when the child exits
  let childExited = false;
  child.exited.then(() => {
    childExited = true;
  });

  // Poll the files until a write is seen in progress or the child exits
  let writeInProgress = false;

  while (!childExited && !writeInProgress) {
    writeInProgress = hasWriteInProgress(dir);
    await Bun.sleep(0);
  }

  // Kill the child
  child.kill('SIGKILL');
  await child.exited;

  // Find the files left with neither their old nor their new contents
  const damagedPaths: string[] = [];

  for (const filePath of filePaths) {
    const contents = await fsp.readFile(filePath, 'utf8');

    // Check if the file has neither its old nor its new contents
    if (contents !== oldContents && contents !== newContents) {
      damagedPaths.push(filePath);
    }
  }

  return {
    killedMidWrite: writeInProgress && child.signalCode === 'SIGKILL',
    damagedPaths,
  };
}

/**
 * Checks whether any file in a directory differs in size from the
 * crash test's file size, as a file being written does.
 *
 * @param dir - The directory to check.
 * @returns Whether a file is being written.
 */
function hasWriteInProgress(dir: string): boolean {
  // Stat synchronously, as an asynchronous round trip can miss a
  // write in progress. A file renamed away since the listing is
  // skipped.
  return readdirSync(dir).some((name) => {
    const stats = statSync(path.join(dir, name), { throwIfNoEntry: false });

    return stats !== undefined && stats.size !== crashTestFileSize;
  });
}
