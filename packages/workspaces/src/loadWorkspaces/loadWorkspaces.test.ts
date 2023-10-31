import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { MockFsAdapter } from '@minddrop/test-utils';
import { registerFileSystemAdapter } from '@minddrop/core';
import { setup, cleanup, missingWorkspace, workspace1 } from '../test-utils';
import { loadWorkspaces } from './loadWorkspaces';
import { WorkspacesStore } from '../WorkspacesStore';
import { Events } from '@minddrop/events';

// Pretend workspace contains topics
vi.mock('@minddrop/topics', () => ({
  Topics: {
    getFrom: () => [
      { path: workspace1.topics[0] },
      { path: workspace1.topics[1] },
    ],
  },
}));

const workspacesConfigFileContens = JSON.stringify({
  paths: [workspace1.path, missingWorkspace.path],
});

const exists = vi.fn();
const readTextFile = vi.fn();
const readDir = vi.fn();

describe('loadWorkspaces', () => {
  beforeEach(() => {
    setup();

    readTextFile.mockResolvedValue(workspacesConfigFileContens);
    // Pretend that workspace 2 does not exist
    exists.mockImplementation(
      (path: string) =>
        new Promise((resolve) => resolve(path !== missingWorkspace.path)),
    );
    // Pretend that workspace 1 cotains topics
    readDir.mockResolvedValueOnce(
      workspace1.topics.map((topicPath) => ({ path: topicPath })),
    );

    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists,
      readTextFile,
      readDir,
    });
  });

  afterEach(cleanup);

  it('throws if the workspaces config could not be read', () => {
    // Pretend workspaces file does not exist
    exists.mockResolvedValueOnce(false);

    expect(() => loadWorkspaces()).rejects.toThrow();
  });

  it('loads workspaces into the store', async () => {
    // Load the workspaces
    await loadWorkspaces();

    // Store should contain the workspaces
    expect(WorkspacesStore.getState().workspaces).toEqual([
      workspace1,
      missingWorkspace,
    ]);
  });

  it('dispatches a `workspaces:load` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:load' events
      Events.addListener('workspaces:load', 'test', (payload) => {
        // Payload data should be the workspaces
        expect(payload.data).toEqual([workspace1, missingWorkspace]);
        done();
      });

      // Load workspaces
      loadWorkspaces();
    }));
});
