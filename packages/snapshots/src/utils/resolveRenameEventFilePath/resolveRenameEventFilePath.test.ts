import { describe, expect, it } from 'vitest';
import { Paths } from '@minddrop/utils';
import { RenameEvent } from '../../types';
import { resolveRenameEventFilePath } from './resolveRenameEventFilePath';

// Pin the workspace path rather than relying on the mock file
// system's default
Paths.workspace = 'path/to/workspaces/Workspace 1';

const renamesDirPath = 'path/to/workspaces/Workspace 1/.minddrop/renames';

const event: RenameEvent = {
  timestamp: new Date('2026-08-17T09:14:02.311Z'),
  from: 'Books/Book',
  to: 'Books/My Book',
  kind: 'entry',
};

describe('resolveRenameEventFilePath', () => {
  it('combines the timestamp and new name slug', () => {
    expect(resolveRenameEventFilePath(event)).toBe(
      `${renamesDirPath}/20260817T091402311Z-my-book.json`,
    );
  });

  it('slugifies names containing dots whole', () => {
    // Dots are name characters, not extension separators
    expect(
      resolveRenameEventFilePath({ ...event, to: 'Books/Notes v2.1' }),
    ).toBe(`${renamesDirPath}/20260817T091402311Z-notes-v2-1.json`);
  });

  it('falls back to a generic slug for unusable names', () => {
    expect(resolveRenameEventFilePath({ ...event, to: '***' })).toBe(
      `${renamesDirPath}/20260817T091402311Z-rename.json`,
    );
  });
});
