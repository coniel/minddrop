import { describe, it, expect, beforeAll, vi } from 'vitest';
import { MockFsAdapter } from '@minddrop/test-utils';
import { Fs, registerFileSystemAdapter } from '@minddrop/core';
import { writeMarkdownFile } from './writeMarkdownFile';
import { parseMarkdown } from '../parseMarkdown';

const markdown = '# Title\n';

describe('writeMarkdownFile', () => {
  beforeAll(() => {
    registerFileSystemAdapter(MockFsAdapter);
  });

  it('writes mardown file content from tokens', async () => {
    vi.spyOn(Fs, 'writeTextFile');

    await writeMarkdownFile('/foo.md', parseMarkdown(markdown));

    expect(Fs.writeTextFile).toHaveBeenCalledWith('/foo.md', markdown);
  });
});
