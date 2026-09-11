import { describe, expect, it } from 'vitest';
import { BaseDirectory, Fs } from '@minddrop/file-system';
import { workspace_1 } from '../../test-utils';
import { resolveWorkspaceDataDirPath } from './resolveWorkspaceDataDirPath';

describe('resolveWorkspaceDataDirPath', () => {
  it('returns the workspace directory inside the app data workspaces directory', () => {
    expect(resolveWorkspaceDataDirPath(workspace_1.id)).toBe(
      `${Fs.resolveBaseDirPath(BaseDirectory.AppData)}/workspaces/${workspace_1.id}`,
    );
  });
});
