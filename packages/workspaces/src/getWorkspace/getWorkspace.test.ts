import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceNotFoundError } from '../errors';
import { cleanup, setup, workspace_1 } from '../test-utils';
import { getWorkspace } from './getWorkspace';

describe('getWorkspace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the workspace does not exist', () => {
    expect(() => getWorkspace('non-existent-workspace')).toThrow(
      WorkspaceNotFoundError,
    );
  });

  it('returns the workspace if it exists', () => {
    expect(getWorkspace(workspace_1.id)).toEqual(workspace_1);
  });
});
