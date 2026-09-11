import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Paths } from '@minddrop/utils';
import { WorkspaceNotFoundError } from '../../errors';
import { cleanup, setup, workspace_2 } from '../../test-utils';
import { resolveWorkspaceConfigDirPath } from './resolveWorkspaceConfigDirPath';

describe('resolveWorkspaceConfigDirPath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the hidden directory inside the workspace', () => {
    expect(resolveWorkspaceConfigDirPath(workspace_2.id)).toBe(
      `${workspace_2.path}/${Paths.hiddenDirName}`,
    );
  });

  it('throws if the workspace does not exist', () => {
    expect(() => resolveWorkspaceConfigDirPath('missing')).toThrow(
      WorkspaceNotFoundError,
    );
  });
});
