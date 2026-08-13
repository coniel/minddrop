import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup, workspace_1 } from '../../test-utils';
import { resolveWorkspaceConfigFilePath } from '../resolveWorkspaceConfigFilePath';
import { isWorkspaceDirectory } from './isWorkspaceDirectory';

const nonWorkspacePath = 'path/to/not-a-workspace';

describe('isWorkspaceDirectory', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns true for a workspace directory', async () => {
    expect(await isWorkspaceDirectory(workspace_1.path)).toBe(true);
  });

  it('returns false for a directory without a workspace config', async () => {
    // Add a directory containing an unrelated file
    MockFs.addFiles([`${nonWorkspacePath}/note.md`]);

    expect(await isWorkspaceDirectory(nonWorkspacePath)).toBe(false);
  });

  it('returns false when the workspace config cannot be parsed', async () => {
    // Add a directory containing an invalid workspace config
    MockFs.addFiles([
      {
        path: resolveWorkspaceConfigFilePath(nonWorkspacePath),
        textContent: 'not json',
      },
    ]);

    expect(await isWorkspaceDirectory(nonWorkspacePath)).toBe(false);
  });
});
