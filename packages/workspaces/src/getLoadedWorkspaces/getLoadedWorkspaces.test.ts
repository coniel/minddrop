import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LoadedWorkspacesStore } from '../LoadedWorkspacesStore';
import { cleanup, setup, workspace_1, workspace_2 } from '../test-utils';
import { getLoadedWorkspaces } from './getLoadedWorkspaces';

describe('getLoadedWorkspaces', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the loaded workspaces in the order they loaded', () => {
    LoadedWorkspacesStore.set('ids', [workspace_2.id, workspace_1.id]);

    expect(getLoadedWorkspaces()).toEqual([workspace_2, workspace_1]);
  });

  it('returns an empty array when no workspace is loaded', () => {
    expect(getLoadedWorkspaces()).toEqual([]);
  });
});
