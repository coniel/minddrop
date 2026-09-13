import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LoadedWorkspacesStore } from '../LoadedWorkspacesStore';
import { cleanup, setup, workspace_1, workspace_2 } from '../test-utils';
import { isWorkspaceLoaded } from './isWorkspaceLoaded';

describe('isWorkspaceLoaded', () => {
  beforeEach(() => {
    setup();

    LoadedWorkspacesStore.set('ids', [workspace_1.id]);
  });

  afterEach(cleanup);

  it('returns true for a loaded workspace', () => {
    expect(isWorkspaceLoaded(workspace_1.id)).toBe(true);
  });

  it('returns false for a workspace that is not loaded', () => {
    expect(isWorkspaceLoaded(workspace_2.id)).toBe(false);
  });
});
