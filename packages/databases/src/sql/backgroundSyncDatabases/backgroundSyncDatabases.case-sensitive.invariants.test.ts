import { afterEach, beforeEach, describe, it, vi } from 'vitest';
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
} from '../../test-utils';
import { backgroundSyncDatabases } from './backgroundSyncDatabases';

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

describe('backgroundSyncDatabases against a hostile workspace on a case-sensitive file system', () => {
  beforeEach(setupHostileWorkspace);

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it.each(caseSensitiveCases)(
    'keeps both files in a workspace with $description',
    async (hostileCase) => {
      // Index the healthy workspace, then break it
      const { files } = await indexThenBreak(hostileCase);

      // Expect the broken file to sit beside the healthy one
      expectHostileFilesSideBySide(files, hostileCase);

      // Sync the broken workspace
      await backgroundSyncDatabases(workspace_1.id, parentDir);

      // Expect every file to be unchanged
      expectKeysUnchanged(files, snapshotMockFiles(MockFs), Deleted);
    },
  );

  it.each(caseSensitiveCases)(
    'keeps every indexed database and entry under its ID in a workspace with $description',
    async (hostileCase) => {
      // Index the healthy workspace, then break it
      const { index, files } = await indexThenBreak(hostileCase);

      // Expect the broken file to sit beside the healthy one
      expectHostileFilesSideBySide(files, hostileCase);

      // Sync the broken workspace
      await backgroundSyncDatabases(workspace_1.id, parentDir);

      // Expect every indexed ID to be unchanged
      expectKeysUnchanged(index, snapshotIndex(), Vanished);
    },
  );
});
