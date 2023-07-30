import { describe, it, expect, beforeEach, vi } from 'vitest';
import { parseMarkdownFile } from './parseMarkdownFile';
import {
  InvalidParameterError,
  registerFileSystemAdapter,
} from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { mdContentTopic } from '../test-utils';
import { parseMarkdown } from '../parseMarkdown/parseMarkdown';

describe('parseMarkdownFile', () => {
  beforeEach(() => {
    registerFileSystemAdapter(MockFsAdapter);
  });

  it('throws if the file does not exist', () => {
    expect(() => parseMarkdownFile('/foo.md')).rejects.toThrowError(
      InvalidParameterError,
    );
  });

  it('returns the parsed markdown', async () => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi.fn().mockResolvedValue(true),
      readTextFile: vi.fn().mockResolvedValue(mdContentTopic),
    });

    const parsed = parseMarkdown(mdContentTopic);

    // Parse a markdown file
    const tokens = await parseMarkdownFile('/foo.md');

    // Should return content as tokens
    expect(JSON.stringify(tokens)).toEqual(JSON.stringify(parsed));
  });
});
