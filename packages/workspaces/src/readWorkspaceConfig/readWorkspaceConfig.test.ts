import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceNotFoundError } from '../errors';
import { cleanup, setup, workspace_1 } from '../test-utils';
import { readWorkspaceConfig } from './readWorkspaceConfig';

describe('readWorkspaceConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the workspace does not exist', async () => {
    await expect(() =>
      readWorkspaceConfig('missing-workspace'),
    ).rejects.toThrow(WorkspaceNotFoundError);
  });

  it('returns null if the workspace does not exist', async () => {
    const result = await readWorkspaceConfig('missing-workspace', false);

    expect(result).toBeNull();
  });

  it('reads the workspace config from the file system', async () => {
    const workspace = await readWorkspaceConfig(workspace_1.path);

    expect(workspace).toEqual(workspace_1);
  });
});
