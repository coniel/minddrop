import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceNotFoundError } from '../../errors';
import { cleanup, setup, workspace_1, workspace_2 } from '../../test-utils';
import { resolveWorkspacePath } from './resolveWorkspacePath';

describe('resolveWorkspacePath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the path of the given workspace', () => {
    expect(resolveWorkspacePath(workspace_2.id)).toBe(workspace_2.path);
  });

  it('returns the path of the active workspace when none is given', () => {
    expect(resolveWorkspacePath()).toBe(workspace_1.path);
  });

  it('throws if the workspace does not exist', () => {
    expect(() => resolveWorkspacePath('missing')).toThrow(
      WorkspaceNotFoundError,
    );
  });
});
