import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { setup, cleanup, Topic_1, Topic_1_1 } from '../test-utils';
import { getTopicMarkdownFilePath } from './getTopicMarkdownFilePath';

const exists = vi.fn();

const dirTopicPath = Topic_1.path;
const dirTopicMdFilePath = `${Topic_1.path}/${Topic_1.title}.md`;
const mdFileTopicPath = Topic_1_1.path;

describe('getTopicMarkdownFilePath', () => {
  beforeEach(() => {
    setup();

    // Pretend topic dir/file exists
    exists.mockResolvedValue(true);

    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists,
    });
  });

  afterEach(() => {
    cleanup();

    vi.resetAllMocks();
  });

  it('returns the path as is if it is a mardown file path', () => {
    // Get the markdown file path for a markdown file topic
    const mdFilePath = getTopicMarkdownFilePath(mdFileTopicPath);

    // Should return the topic path as is
    expect(mdFilePath).toBe(mdFileTopicPath);
  });

  it('returns the topic markdown file path if it is a directory topic', () => {
    // Get the markdown file path for a directory topic
    const mdFilePath = getTopicMarkdownFilePath(dirTopicPath);

    // Should return the path to the topic's markdown file
    expect(mdFilePath).toBe(dirTopicMdFilePath);
  });
});
