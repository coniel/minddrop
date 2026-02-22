import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspacesLoadedEvent } from '../events';
import { MockFs, cleanup, setup, workspaces } from '../test-utils';
import { getWorkspacesConfigFilePath } from '../utils';
import { initializeWorkspaces } from './initializeWorkspaces';

describe('initializeWorkspaces', () => {
  beforeEach(() => setup({ loadWorkspaces: false }));

  afterEach(cleanup);

  it('creates the workspaces config file if it does not exist', async () => {
    // Remove the workspaces config file
    MockFs.removeFile(getWorkspacesConfigFilePath());

    await initializeWorkspaces();

    expect(MockFs.exists(getWorkspacesConfigFilePath())).toBe(true);
  });

  it('loads workspaces into the store', async () => {
    await initializeWorkspaces();

    expect(WorkspacesStore.getAll()).toEqual(workspaces);
  });

  it('dispatches a workspaces loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(WorkspacesLoadedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(workspaces);
        done();
      });

      initializeWorkspaces();
    }));
});
