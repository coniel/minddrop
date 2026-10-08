import { describe, expect, it } from 'vitest';
import { copyMockContents } from './copyMockContents';

describe('copyMockContents', () => {
  it("copies a file's value to the copy's path", () => {
    const contents = { 'dir/a.md': 'a' };

    copyMockContents(contents, 'dir/a.md', 'dir/b.md');

    expect(contents).toEqual({ 'dir/a.md': 'a', 'dir/b.md': 'a' });
  });

  it("copies the values below a directory's path", () => {
    const contents = { 'dir/a.md': 'a', 'dir/sub/b.md': 'b' };

    copyMockContents(contents, 'dir', 'copy');

    expect(contents).toEqual({
      'dir/a.md': 'a',
      'dir/sub/b.md': 'b',
      'copy/a.md': 'a',
      'copy/sub/b.md': 'b',
    });
  });

  it('leaves values under a sibling whose name starts with the path', () => {
    const contents = { 'dir/a.md': 'a', 'dir 2/a.md': 'other' };

    copyMockContents(contents, 'dir', 'copy');

    expect(contents).toEqual({
      'dir/a.md': 'a',
      'dir 2/a.md': 'other',
      'copy/a.md': 'a',
    });
  });
});
