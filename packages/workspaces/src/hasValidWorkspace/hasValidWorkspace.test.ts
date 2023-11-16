import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, missingWorkspace, workspace1 } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { hasValidWorkspace } from './hasValidWorkspace';

describe('hasValidWorkspace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns false if there are no workspaces', () => {
    // WorkspacesStore contains no workspaces, should
    // return false
    expect(hasValidWorkspace()).toBe(false);
  });

  it('returns false if none of the workspaces exist', () => {
    // Load a missing workspace into the store
    WorkspacesStore.getState().add(missingWorkspace);

    // WorkspacesStore contains only missing workspaces,
    // should return false.
    expect(hasValidWorkspace()).toBe(false);
  });

  it('returns true if at least one of the workspaces exists', () => {
    // Load a missing and a valid workspace into the store
    WorkspacesStore.getState().load([missingWorkspace, workspace1]);

    // WorkspacesStore contains a valid workspace, should
    // return true.
    expect(hasValidWorkspace()).toBe(true);
  });
});
