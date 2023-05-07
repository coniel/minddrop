import { describe, it, expect, beforeAll, vi } from 'vitest';
import { MockFsAdapter } from '@minddrop/test-utils';
import { Fs, registerFileSystemAdapter } from '@minddrop/core';
import { mdContentTopic, tokenContentTopic } from '../test-utils';
import { writeMarkdownFile } from './writeMarkdownFile';

describe('writeMarkdownFile', () => {
  beforeAll(() => {
    registerFileSystemAdapter(MockFsAdapter);
  });

  it('writes mardown file content from tokens', async () => {
    vi.spyOn(Fs, 'writeTextFile');

    await writeMarkdownFile('/foo.md', tokenContentTopic);

    expect(Fs.writeTextFile).toHaveBeenCalledWith('/foo.md', mdContentTopic);
  });
});
