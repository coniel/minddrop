import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { snapshotMockFiles } from '@minddrop/file-system/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  DatabaseFixtures,
  Deleted,
  MockFs,
  Vanished,
  cleanup,
  cleanupTestSqlDatabase,
  expectKeysUnchanged,
  indexThenBreak,
  setupHostileWorkspace,
  snapshotIndex,
} from '../../test-utils';
import { backgroundSyncDatabases } from './backgroundSyncDatabases';

const { workspace_1 } = WorkspaceFixtures;
const {
  hostileCase_caseOnlyNames,
  hostileCase_sidecarConflictMarkers_editedEntry,
  hostileCase_unicodeNormalization,
  hostileCase_truncatedConfig,
  hostileCases,
  parentDir,
} = DatabaseFixtures;

describe('backgroundSyncDatabases against a hostile workspace', () => {
  beforeEach(setupHostileWorkspace);

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  // Leave out the edited entry's sidecar conflict case, pinned below
  it.each(
    hostileCases.filter(
      (hostileCase) =>
        hostileCase !== hostileCase_sidecarConflictMarkers_editedEntry,
    ),
  )(
    'neither deletes nor rewrites a file in a workspace with $description',
    async (hostileCase) => {
      // Index the healthy workspace, then break it
      const { files } = await indexThenBreak(hostileCase);

      // Sync the broken workspace
      await backgroundSyncDatabases(workspace_1.id, parentDir);

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

      // Sync the broken workspace
      await backgroundSyncDatabases(workspace_1.id, parentDir);

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

      // Sync the broken workspace
      await backgroundSyncDatabases(workspace_1.id, parentDir);

      // Expect the index to have that one entry as before
      expect(snapshotIndex()).toEqual(index);
    },
  );

  // Checks the setup of the pins below, which pass on any error
  it.each([
    hostileCase_sidecarConflictMarkers_editedEntry,
    hostileCase_truncatedConfig,
  ])(
    'indexes a workspace, breaks it with $description, then syncs it',
    async (hostileCase) => {
      // Index the healthy workspace, then break it
      const { files } = await indexThenBreak(hostileCase);

      // Expect the broken files to be on disk
      hostileCase.brokenFiles.forEach(({ path, textContent }) => {
        expect(files[path]).toBe(textContent);
      });

      // Expect the sync to complete
      await expect(
        backgroundSyncDatabases(workspace_1.id, parentDir),
      ).resolves.toBeDefined();
    },
  );

  // Pins Issue 32: An unparseable entry sidecar is read as no metadata,
  // then overwritten. Remove .fails once fixed.
  it.fails(
    'leaves a sidecar with git conflict markers untouched when its entry was also edited',
    async () => {
      // Index the healthy workspace, then break it
      const { files } = await indexThenBreak(
        hostileCase_sidecarConflictMarkers_editedEntry,
      );

      // Sync the broken workspace
      await backgroundSyncDatabases(workspace_1.id, parentDir);

      // Expect every file to be unchanged
      expectKeysUnchanged(files, snapshotMockFiles(MockFs), Deleted);
    },
  );

  // Pins Issue 27: An unparseable database config makes background sync
  // delete the database from the index. Remove .fails once fixed.
  it.fails(
    'keeps a database and its entries indexed when its config is truncated',
    async () => {
      // Index the healthy workspace, then break it
      const { index } = await indexThenBreak(hostileCase_truncatedConfig);

      // Sync the broken workspace
      await backgroundSyncDatabases(workspace_1.id, parentDir);

      // Expect every indexed ID to be unchanged
      expectKeysUnchanged(index, snapshotIndex(), Vanished);
    },
  );
});
