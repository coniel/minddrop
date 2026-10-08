import { expect } from 'vitest';
import { snapshotMockFiles } from '@minddrop/file-system/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { initializeDatabasesBackend } from '../sql/initializeDatabasesBackend';
import { parentDir } from './fixtures/databases.fixtures';
import { HostileCase } from './fixtures/hostile-workspace.fixtures';
import { MockFs } from './setup-tests';
import { snapshotIndex } from './snapshotIndex';
import { writeHostileWorkspace } from './writeHostileWorkspace';

const { workspace_1 } = WorkspaceFixtures;

export interface IndexThenBreakResult {
  /**
   * The index as built from the healthy workspace.
   */
  index: Record<string, string>;

  /**
   * The workspace's file contents once broken, keyed by path.
   */
  files: Record<string, string>;
}

/**
 * Indexes a case's healthy workspace, then breaks it.
 *
 * @param hostileCase - The case whose workspace to index and break.
 * @returns The index of the healthy workspace and the broken files.
 */
export async function indexThenBreak(
  hostileCase: HostileCase,
): Promise<IndexThenBreakResult> {
  // Index the healthy workspace
  writeHostileWorkspace(hostileCase);
  await initializeDatabasesBackend(workspace_1.id, parentDir);

  // Snapshot the healthy workspace's index
  const index = snapshotIndex();

  // Expect every healthy entry to be indexed. Otherwise the test would
  // pass vacuously.
  hostileCase.healthyFiles
    .filter(({ path }) => path.endsWith('.md'))
    .forEach(({ path }) => {
      expect(index).toHaveProperty([path.slice(parentDir.length + 1)]);
    });

  // Break the workspace
  MockFs.addFiles(hostileCase.brokenFiles);

  // Return the index and a snapshot of the broken files
  return { index, files: snapshotMockFiles(MockFs) };
}
