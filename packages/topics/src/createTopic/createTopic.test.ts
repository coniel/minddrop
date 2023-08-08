import { MockFsAdapter } from '@minddrop/test-utils';
import {
  registerFileSystemAdapter,
  InvalidParameterError,
} from '@minddrop/core';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { setup, cleanup, core } from '../test-utils';
import { TopicsStore } from '../TopicsStore';
import { createTopic } from './createTopic';

vi.mock('uuid', () => ({
  v4: () => 'uuid',
}));

const PATH = '/foo';
const TOPIC = {
  title: 'Untitled',
  path: `${PATH}/Untitled.md`,
  isDir: false,
  subtopics: [],
  content: {
    title: 'Untitled',
    markdown: '# Untitled\n\n---\n\n---\n\n',
    columns: [
      { id: 'uuid', drops: [] },
      { id: 'uuid', drops: [] },
      { id: 'uuid', drops: [] },
    ],
  },
};

describe('createTopic', () => {
  beforeEach(() => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi.fn().mockImplementation(
        (path: string) =>
          // We want topic destination path to exist but not
          // new topic directory/file path to exist.
          new Promise((resolve) => resolve(path === PATH)),
      ),
    });
  });

  beforeEach(setup);

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('throws if the path does not exist', async () => {
    // Pretend path does not exist
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi.fn().mockResolvedValue(false),
    });

    // Should throw an InvalidParameterError
    await expect(createTopic(core, PATH)).rejects.toThrowError(
      InvalidParameterError,
    );
  });

  it('returns the topic', async () => {
    // Create a new topic
    const topic = await createTopic(core, PATH);

    // Should return the new topic
    expect(topic).toEqual(TOPIC);
  });

  it('creates the topic markdown file', async () => {
    // Create a topic as a directory
    await createTopic(core, PATH);

    // Should create the topic markdown file using the topic
    // name as the file name and markdown header.
    expect(MockFsAdapter.writeTextFile).toHaveBeenCalledWith(
      `${PATH}/Untitled.md`,
      TOPIC.content.markdown,
    );
  });

  it('uses incremental file name', async () => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi.fn().mockImplementation(
        (path: string) =>
          // We want topic destination path and default
          // new topic file path to exist.
          new Promise((resolve) =>
            resolve(path === PATH || path === `${PATH}/Untitled.md`),
          ),
      ),
    });

    // Pretend 'Untitled.md' file already exists
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi
        .fn()
        .mockImplementation(
          (path) => path === PATH || path == `${PATH}/Untitled.md`,
        ),
    });

    // Create a topic
    await createTopic(core, PATH);

    // Should create the topic file as 'Untitled 1.md'
    expect(MockFsAdapter.writeTextFile).toHaveBeenCalledWith(
      `${PATH}/Untitled 1.md`,
      '# Untitled 1\n\n---\n\n---\n\n',
    );
  });

  it('adds the topic to the topics store', async () => {
    // Clear the topics store
    TopicsStore.getState().clear();

    // Create a topic
    await createTopic(core, PATH);

    // Topic should exist in the store
    expect(TopicsStore.getState().topics[0]).toEqual(TOPIC);
  });

  it('dispatches a `topics:topic:create` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'topics:topic:create' events
      core.addEventListener('topics:topic:create', (payload) => {
        // Payload data should be the topic
        expect(payload.data).toEqual(TOPIC);
        core.removeAllEventListeners();
        done();
      });

      // Create a topic
      createTopic(core, PATH);
    }));

  describe('create as directory', () => {
    it('creates a directory using incremental path', async () => {
      registerFileSystemAdapter({
        ...MockFsAdapter,
        exists: vi.fn().mockImplementation(
          (path: string) =>
            // We want topic destination path and default
            // new topic directory path to exist.
            new Promise((resolve) =>
              resolve(path === PATH || path === `${PATH}/Untitled`),
            ),
        ),
      });

      // Create a topic as a directory
      await createTopic(core, PATH, true);

      // Should create a directory at the specified path
      expect(MockFsAdapter.createDir).toHaveBeenCalledWith(
        `${PATH}/Untitled 1`,
      );
    });

    it('creates the topic markdown file inside the new directory using incremental filename', async () => {
      registerFileSystemAdapter({
        ...MockFsAdapter,
        exists: vi.fn().mockImplementation(
          (path: string) =>
            // We want topic destination path and default
            // new topic directory path to exist.
            new Promise((resolve) =>
              resolve(path === PATH || path === `${PATH}/Untitled`),
            ),
        ),
      });

      // Create a topic as a directory
      await createTopic(core, PATH, true);

      // Should create the topic markdown file inside the new directory
      expect(MockFsAdapter.writeTextFile).toHaveBeenCalledWith(
        `${PATH}/Untitled 1/Untitled 1.md`,
        '# Untitled 1\n\n---\n\n---\n\n',
      );
    });
  });
});
