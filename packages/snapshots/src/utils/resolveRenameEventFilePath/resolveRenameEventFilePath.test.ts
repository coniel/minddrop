import { describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { RenameEvent } from '../../types';
import { resolveRenameEventFilePath } from './resolveRenameEventFilePath';

const { workspace_1 } = WorkspaceFixtures;

const renamesDirPath = 'path/to/workspaces/Workspace 1/.minddrop/renames';

const event: RenameEvent = {
  timestamp: new Date('2026-08-17T09:14:02.311Z'),
  from: 'Books/Book',
  to: 'Books/My Book',
  kind: 'entry',
};

describe('resolveRenameEventFilePath', () => {
  it('combines the timestamp and new name slug', () => {
    expect(resolveRenameEventFilePath(event, workspace_1.path)).toBe(
      `${renamesDirPath}/20260817T091402311Z-my-book.json`,
    );
  });

  it('slugifies names containing dots whole', () => {
    // Dots are name characters, not extension separators
    expect(
      resolveRenameEventFilePath(
        { ...event, to: 'Books/Notes v2.1' },
        workspace_1.path,
      ),
    ).toBe(`${renamesDirPath}/20260817T091402311Z-notes-v2-1.json`);
  });

  it('falls back to a generic slug for unusable names', () => {
    expect(
      resolveRenameEventFilePath({ ...event, to: '***' }, workspace_1.path),
    ).toBe(`${renamesDirPath}/20260817T091402311Z-rename.json`);
  });
});
