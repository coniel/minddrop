import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, workspace1 } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { getWorkspace } from './getWorkspace';

describe('getWorkspace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested workspace if it exists', () => {
    // Add a workspace to the store
    WorkspacesStore.getState().add(workspace1);

    // Should return workspace from the store
    expect(getWorkspace(workspace1.path)).toEqual(workspace1);
  });

  it('returns null if the workspace does not exist', () => {
    // Get a missing workspace, should return null
    expect(getWorkspace('foo')).toBeNull();
  });
});
