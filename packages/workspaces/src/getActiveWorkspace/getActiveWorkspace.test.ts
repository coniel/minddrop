import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { WorkspaceNotFoundError } from '../errors';
import { cleanup, setup, workspace_1 } from '../test-utils';
import { getActiveWorkspace } from './getActiveWorkspace';

describe('getActiveWorkspace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the active workspace', () => {
    expect(getActiveWorkspace()).toEqual(workspace_1);
  });

  it('throws if there is no active workspace', () => {
    // Clear the active workspace
    ActiveWorkspaceStore.set('id', null);

    expect(() => getActiveWorkspace()).toThrow(WorkspaceNotFoundError);
  });

  it('returns null if there is no active workspace and throwOnNotFound is false', () => {
    // Clear the active workspace
    ActiveWorkspaceStore.set('id', null);

    expect(getActiveWorkspace(false)).toBeNull();
  });
});
