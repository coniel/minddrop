import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { snapshotMockFiles } from '@minddrop/file-system/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  DatabaseFixtures,
  Deleted,
  HostileCase,
  MockFs,
  Vanished,
  cleanup,
  cleanupTestSqlDatabase,
  expectKeysUnchanged,
  indexThenBreak,
  setupHostileWorkspace,
  snapshotIndex,
  writeHostileWorkspace,
} from '../../test-utils';
import { initializeDatabasesBackend } from './initializeDatabasesBackend';

const { workspace_1 } = WorkspaceFixtures;
const {
  hostileCase_caseOnlyNames,
  hostileCase_sidecarConflictMarkers,
  hostileCase_sidecarConflictMarkers_editedEntry,
  hostileCase_truncatedConfig,
  hostileCase_unicodeNormalization,
  hostileCases,
  parentDir,
} = DatabaseFixtures;

describe('initializeDatabasesBackend against a hostile workspace', () => {
  beforeEach(setupHostileWorkspace);

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  describe('on a schema rebuild', () => {
    // Leave out the sidecar conflict cases. They are pinned below as one.
    // A rebuild reads every entry whether it was edited or not.
    it.each(
      hostileCases.filter(
        (hostileCase) =>
          hostileCase !== hostileCase_sidecarConflictMarkers &&
          hostileCase !== hostileCase_sidecarConflictMarkers_editedEntry,
      ),
    )(
      'neither deletes nor rewrites a file in a workspace with $description',
      async (hostileCase) => {
        // Write the broken workspace
        const files = writeBrokenWorkspace(hostileCase);

        // Rebuild the index from the broken workspace
        await rebuild();

        // Expect every file to be unchanged
        expectKeysUnchanged(files, snapshotMockFiles(MockFs), Deleted);
      },
    );

    it.each([hostileCase_caseOnlyNames, hostileCase_unicodeNormalization])(
      'indexes one entry under its stored name in a workspace with $description',
      async (hostileCase) => {
        // Write the broken workspace
        const files = writeBrokenWorkspace(hostileCase);

        // Expect the write to have gone into the existing entry file.
        // Otherwise the test would pass vacuously.
        expect(files[hostileCase.healthyFiles[0].path]).toBe(
          hostileCase.brokenFiles[0].textContent,
        );

        // Rebuild the index from the broken workspace
        await rebuild();

        // Snapshot the index's keys
        const indexKeys = Object.keys(snapshotIndex());

        // Expect the index to have that one entry
        expect(indexKeys).toContain(indexKey(hostileCase.healthyFiles[0].path));
        expect(indexKeys).not.toContain(
          indexKey(hostileCase.brokenFiles[0].path),
        );
      },
    );

    // Checks the setup of the pin below, which passes on any error
    it('rebuilds the index from a workspace with git conflict markers in a sidecar', async () => {
      // Write the broken workspace
      const files = writeBrokenWorkspace(hostileCase_sidecarConflictMarkers);

      // Expect the broken files to be on disk
      expectBrokenFiles(files, hostileCase_sidecarConflictMarkers);

      // Rebuild the index from the broken workspace
      await rebuild();
    });

    // Pins Issue 32: An unparseable entry sidecar is read as no metadata,
    // then overwritten. Remove .fails once fixed.
    it.fails(
      'leaves a sidecar with git conflict markers untouched',
      async () => {
        // Write the broken workspace
        const files = writeBrokenWorkspace(hostileCase_sidecarConflictMarkers);

        // Rebuild the index from the broken workspace
        await rebuild();

        // Expect every file to be unchanged
        expectKeysUnchanged(files, snapshotMockFiles(MockFs), Deleted);
      },
    );
  });

  describe('from the index', () => {
    it.each(hostileCases)(
      'neither deletes nor rewrites a file in a workspace with $description',
      async (hostileCase) => {
        // Index the healthy workspace, then break it
        const { files } = await indexThenBreak(hostileCase);

        // Launch again onto the index the first launch left behind
        await initializeDatabasesBackend(workspace_1.id, parentDir);

        // Expect every file to be unchanged
        expectKeysUnchanged(files, snapshotMockFiles(MockFs), Deleted);
      },
    );

    // Leave out the truncated config case, pinned below
    it.each(
      hostileCases.filter(
        (hostileCase) => hostileCase !== hostileCase_truncatedConfig,
      ),
    )(
      'keeps every indexed database and entry under its ID in a workspace with $description',
      async (hostileCase) => {
        // Index the healthy workspace, then break it
        const { index } = await indexThenBreak(hostileCase);

        // Launch again onto the index the first launch left behind
        await initializeDatabasesBackend(workspace_1.id, parentDir);

        // Expect every indexed ID to be unchanged
        expectKeysUnchanged(index, snapshotIndex(), Vanished);
      },
    );

    it.each([hostileCase_caseOnlyNames, hostileCase_unicodeNormalization])(
      'keeps one entry under its stored name in a workspace with $description',
      async (hostileCase) => {
        // Index the healthy workspace, then break it
        const { index, files } = await indexThenBreak(hostileCase);

        // Expect the write to have gone into the existing entry file.
        // Otherwise the test would pass vacuously.
        expect(files[hostileCase.healthyFiles[0].path]).toBe(
          hostileCase.brokenFiles[0].textContent,
        );

        // Launch again onto the index the first launch left behind
        await initializeDatabasesBackend(workspace_1.id, parentDir);

        // Expect the index to have that one entry as before
        expect(snapshotIndex()).toEqual(index);
      },
    );

    // Checks the setup of the pin below, which passes on any error
    it('launches onto the index of a workspace broken with a truncated database config', async () => {
      // Index the healthy workspace, then break it
      const { files } = await indexThenBreak(hostileCase_truncatedConfig);

      // Expect the broken files to be on disk
      expectBrokenFiles(files, hostileCase_truncatedConfig);

      // Expect the launch onto the index to complete
      await expect(
        initializeDatabasesBackend(workspace_1.id, parentDir),
      ).resolves.toMatchObject({ schemaChanged: false });
    });

    // Pins Issue 27: An unparseable database config makes background sync
    // delete the database from the index. Startup drops the database
    // through the same failed config read. Remove .fails once fixed.
    it.fails(
      'keeps a database and its entries indexed when its config is truncated',
      async () => {
        // Index the healthy workspace, then break it
        const { index } = await indexThenBreak(hostileCase_truncatedConfig);

        // Launch again onto the index the first launch left behind
        await initializeDatabasesBackend(workspace_1.id, parentDir);

        // Expect every indexed ID to be unchanged
        expectKeysUnchanged(index, snapshotIndex(), Vanished);
      },
    );
  });
});

/**
 * Writes a case's workspace in its broken state.
 *
 * @param hostileCase - The case whose workspace to write.
 * @returns The broken workspace's file contents, keyed by path.
 */
function writeBrokenWorkspace(
  hostileCase: HostileCase,
): Record<string, string> {
  // Write the healthy files, then break them
  writeHostileWorkspace(hostileCase);
  MockFs.addFiles(hostileCase.brokenFiles);

  // Snapshot the broken files
  return snapshotMockFiles(MockFs);
}

/**
 * Expects a case's broken files to be among the given file contents.
 *
 * @param files - The workspace's file contents, keyed by path.
 * @param hostileCase - The case whose broken files to expect.
 */
function expectBrokenFiles(
  files: Record<string, string>,
  hostileCase: HostileCase,
): void {
  hostileCase.brokenFiles.forEach(({ path, textContent }) => {
    expect(files[path]).toBe(textContent);
  });
}

/**
 * Resolves the key under which the index snapshot holds an entry file.
 *
 * @param path - The entry file's path.
 * @returns The entry's index snapshot key.
 */
function indexKey(path: string): string {
  // Make the path relative to the workspace
  return path.slice(parentDir.length + 1);
}

/**
 * Initializes the backend onto a fresh index. This rebuilds the index
 * from the file system.
 */
async function rebuild(): Promise<void> {
  // Initialize the backend
  const { schemaChanged } = await initializeDatabasesBackend(
    workspace_1.id,
    parentDir,
  );

  // Expect the index to be rebuilt. Otherwise the test would pass
  // vacuously.
  expect(schemaChanged).toBe(true);
}
