import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { MockFsAdapter } from '@minddrop/test-utils';
import { Fs, registerFileSystemAdapter } from '@minddrop/core';
import { Markdown } from '@minddrop/markdown';
import {
  setup,
  cleanup,
  core,
  workspaceRootPath,
  Topic_1,
  Topic_Untitled,
  Topic_Untitled_1,
  Topic_2,
} from '../test-utils';
import { renameTopic } from './renameTopic';
import { getTopic } from '../getTopic';

const markdownContent = `# Original title

## Heading 2

Some text
`;

describe('renameTopic', () => {
  beforeEach(() => {
    setup();

    // Mock Markdown.updateFileHeading to prevent file not found error
    vi.spyOn(Markdown, 'updateFileHeading').mockImplementation(async () => {});

    registerFileSystemAdapter({
      ...MockFsAdapter,
      readTextFile: vi.fn().mockResolvedValue(markdownContent),
      exists: vi
        .fn()
        .mockImplementation(
          (path) =>
            new Promise((resolve) =>
              resolve(
                path === Topic_1.path ||
                  path === Topic_2.path ||
                  path === Topic_Untitled.path ||
                  path === Topic_Untitled_1.path,
              ),
            ),
        ),
    });
  });

  afterEach(cleanup);

  it('renames the topic markdown file', async () => {
    vi.spyOn(Fs, 'renameFile');

    // Rename Topic Untitled to 'New title'
    await renameTopic(core, Topic_Untitled.path, 'New title');

    // Should rename the markdown file
    expect(Fs.renameFile).toHaveBeenCalledWith(
      Topic_Untitled.path,
      `${workspaceRootPath}/New title.md`,
    );
  });

  it('uses incremental name when renaming topic markdown file', async () => {
    vi.spyOn(Fs, 'renameFile');

    // Rename a topic to a name which is already taken
    await renameTopic(core, Topic_Untitled.path, Topic_Untitled_1.title);

    // Should rename the markdown file using an incremental suffix
    expect(Fs.renameFile).toHaveBeenCalledWith(
      Topic_Untitled.path,
      `${workspaceRootPath}/${Topic_Untitled_1.title} 1.md`,
    );
  });

  it('updates the topic markdown title', async () => {
    // Rename a topic to a name which is already taken
    await renameTopic(core, Topic_Untitled.path, Topic_Untitled_1.title);

    // Should update the markdown title using an incremental suffix
    expect(Markdown.updateFileHeading).toHaveBeenCalledWith(
      `${workspaceRootPath}/${Topic_Untitled_1.title} 1.md`,
      `${Topic_Untitled_1.title} 1`,
    );
  });

  it('returns the new markdown file path', async () => {
    // Rename Topic Untitled to 'New title'
    const path = await renameTopic(core, Topic_Untitled.path, 'New title');

    // Should return the new markdown file path
    expect(path).toEqual(`${workspaceRootPath}/New title.md`);
  });

  it('updates the topic in the topics store', async () => {
    // Rename Topic Untitled to 'New title'
    const newPath = await renameTopic(core, Topic_Untitled.path, 'New title');

    // Should update the topic in the store
    expect(getTopic(newPath)).toEqual({
      ...Topic_Untitled,
      path: newPath,
      title: 'New title',
    });
  });

  it('dispatches a `topics:topic:update` event', async () =>
    new Promise<void>(async (done) => {
      let newPath = '';

      // Listen to 'topics:topic:update' events
      core.addEventListener('topics:topic:upate', (payload) => {
        // Payload data should contain original/updated topic
        expect(payload.data).toEqual({
          before: Topic_Untitled,
          after: {
            ...Topic_Untitled,
            path: newPath,
            title: 'New title',
          },
        });
        done();
      });

      // Rename Topic Untitled to 'New title'
      newPath = await renameTopic(core, Topic_Untitled.path, 'New title');
    }));

  describe('directory topic', () => {
    it('renames the topic directory and file', async () => {
      vi.spyOn(Fs, 'renameFile');

      // Rename Topic 1 (dir) to 'New title'
      await renameTopic(core, Topic_1.path, 'New title');

      // Should rename the directory
      expect(Fs.renameFile).toHaveBeenCalledWith(
        Topic_1.path,
        `${workspaceRootPath}/New title`,
      );
      // Should rename the file, now found inside the
      // new directory path.
      expect(Fs.renameFile).toHaveBeenCalledWith(
        `${workspaceRootPath}/New title/${Topic_1.title}.md`,
        `${workspaceRootPath}/New title/New title.md`,
      );
    });

    it('uses incremental name when renaming topic directory', async () => {
      vi.spyOn(Fs, 'renameFile');

      // Rename Topic 1 (dir) to 'Topic 2', which is already
      // taken by another directory topic.
      await renameTopic(core, Topic_1.path, Topic_2.title);

      // Should rename the directory with an incremental suffix
      expect(Fs.renameFile).toHaveBeenCalledWith(
        Topic_1.path,
        `${Topic_2.path} 1`,
      );
      // Should rename the file, now found inside the
      // new directory path, with an incremental suffix.
      expect(Fs.renameFile).toHaveBeenCalledWith(
        `${Topic_2.path} 1/${Topic_1.title}.md`,
        `${Topic_2.path} 1/${Topic_2.title} 1.md`,
      );
    });

    it('returns the new directory path', async () => {
      // Rename Topic Untitled to 'New title'
      const path = await renameTopic(core, Topic_1.path, 'New title');

      // Should return the new directory path
      expect(path).toEqual(`${workspaceRootPath}/New title`);
    });

    it('updates the topic in the topics store', async () => {
      // Rename Topic 1 to 'New title'
      const newPath = await renameTopic(core, Topic_1.path, 'New title');

      // Should update the topic in the store
      expect(getTopic(newPath)).toEqual({
        ...Topic_1,
        path: newPath,
        title: 'New title',
      });
    });

    it('dispatches a `topics:topic:update` event', async () =>
      new Promise<void>(async (done) => {
        let newPath = '';

        // Listen to 'topics:topic:update' events
        core.addEventListener('topics:topic:upate', (payload) => {
          // Payload data should contain original/updated topic
          expect(payload.data).toEqual({
            before: Topic_1,
            after: {
              ...Topic_1,
              path: newPath,
              title: 'New title',
            },
          });
          done();
        });

        // Rename Topic 1 to 'New title'
        newPath = await renameTopic(core, Topic_1.path, 'New title');
      }));
  });
});
