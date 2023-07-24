import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { MockFsAdapter } from '@minddrop/test-utils';
import { FileNotFoundError, registerFileSystemAdapter } from '@minddrop/core';
import { setup, cleanup, workspace2, workspace1, core } from '../test-utils';
import { loadWorkspaces } from './loadWorkspaces';
import { WorkspacesStore } from '../WorkspacesStore';

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
  paths: [workspace1.path, workspace2.path],
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
        new Promise((resolve) => resolve(path !== workspace2.path)),
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

  it('throws if the workspaces config file does not exist', () => {
    // Pretend file does not exist
    exists.mockResolvedValueOnce(false);

    expect(() => loadWorkspaces(core)).rejects.toThrowError(FileNotFoundError);
  });

  it('throws if the config file fails to parse', () => {
    // Return invalid JSON as config file content
    readTextFile.mockResolvedValueOnce('foo');

    expect(() => loadWorkspaces(core)).rejects.toThrow();
  });

  it('loads workspaces into the store', async () => {
    // Load the workspaces
    await loadWorkspaces(core);

    // Store should contain the workspaces
    expect(WorkspacesStore.getState().workspaces).toEqual([
      workspace1,
      workspace2,
    ]);
  });

  it('dispatches a `topics:load` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:load' events
      core.addEventListener('workspaces:load', (payload) => {
        // Payload data should be the workspaces
        expect(payload.data).toEqual([workspace1, workspace2]);
        done();
      });

      // Load workspaces
      loadWorkspaces(core);
    }));
});
