import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { snapshotMockFiles } from '@minddrop/file-system/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  DatabaseFixtures,
  Deleted,
  MockFs,
  Vanished,
  cleanup,
  cleanupTestSqlDatabase,
  expectHostileFilesSideBySide,
  expectKeysUnchanged,
  indexThenBreak,
  setupHostileWorkspace,
  snapshotIndex,
  writeHostileWorkspace,
} from '../../test-utils';
import { initializeDatabasesBackend } from './initializeDatabasesBackend';

// Make every mock file system in this file case-sensitive, as on Linux
vi.mock('@minddrop/file-system/test-utils', async (importOriginal) =>
  (
    await import('../../test-utils/mockCaseSensitiveFileSystem')
  ).mockCaseSensitiveFileSystem(importOriginal),
);

const { workspace_1 } = WorkspaceFixtures;
const {
  hostileCase_caseOnlyNames,
  hostileCase_unicodeNormalization,
  parentDir,
} = DatabaseFixtures;

// The cases describing two files on a case-sensitive file system
const caseSensitiveCases = [
  hostileCase_caseOnlyNames,
  hostileCase_unicodeNormalization,
];

describe('initializeDatabasesBackend against a hostile workspace on a case-sensitive file system', () => {
  beforeEach(setupHostileWorkspace);

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it.each(caseSensitiveCases)(
    'neither deletes nor rewrites a file on a schema rebuild in a workspace with $description',
    async (hostileCase) => {
      // Write the healthy files, then break them
      writeHostileWorkspace(hostileCase);
      MockFs.addFiles(hostileCase.brokenFiles);

      // Snapshot the broken files
      const files = snapshotMockFiles(MockFs);

      // Expect the broken file to sit beside the healthy one
      expectHostileFilesSideBySide(files, hostileCase);

      // Rebuild the index from the broken workspace
      const { schemaChanged } = await initializeDatabasesBackend(
        workspace_1.id,
        parentDir,
      );

      // Expect the index to have been rebuilt, and every file to be
      // unchanged.
      expect(schemaChanged).toBe(true);
      expectKeysUnchanged(files, snapshotMockFiles(MockFs), Deleted);
    },
  );

  it.each(caseSensitiveCases)(
    'neither deletes nor rewrites a file from the index in a workspace with $description',
    async (hostileCase) => {
      // Index the healthy workspace, then break it
      const { files } = await indexThenBreak(hostileCase);

      // Expect the broken file to sit beside the healthy one
      expectHostileFilesSideBySide(files, hostileCase);

      // Launch again onto the index the first launch left behind
      await initializeDatabasesBackend(workspace_1.id, parentDir);

      // Expect every file to be unchanged
      expectKeysUnchanged(files, snapshotMockFiles(MockFs), Deleted);
    },
  );

  it.each(caseSensitiveCases)(
    'keeps every indexed database and entry under its ID from the index in a workspace with $description',
    async (hostileCase) => {
      // Index the healthy workspace, then break it
      const { index, files } = await indexThenBreak(hostileCase);

      // Expect the broken file to sit beside the healthy one
      expectHostileFilesSideBySide(files, hostileCase);

      // Launch again onto the index the first launch left behind
      await initializeDatabasesBackend(workspace_1.id, parentDir);

      // Expect every indexed ID to be unchanged
      expectKeysUnchanged(index, snapshotIndex(), Vanished);
    },
  );
});
