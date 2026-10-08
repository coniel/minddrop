import { describe, expect, it } from 'vitest';
import { clearMockContents } from './clearMockContents';

describe('clearMockContents', () => {
  it("deletes a file's value", () => {
    const contents = { 'dir/a.md': 'a', 'dir/b.md': 'b' };

    clearMockContents(contents, 'dir/a.md');

    expect(contents).toEqual({ 'dir/b.md': 'b' });
  });

  it("deletes the values below a directory's path", () => {
    const contents = { 'dir/a.md': 'a', 'dir/sub/b.md': 'b', 'other.md': 'c' };

    clearMockContents(contents, 'dir');

    expect(contents).toEqual({ 'other.md': 'c' });
  });

  it('leaves values under a sibling whose name starts with the path', () => {
    const contents = { 'dir/a.md': 'a', 'dir 2/a.md': 'other' };

    clearMockContents(contents, 'dir');

    expect(contents).toEqual({ 'dir 2/a.md': 'other' });
  });
});
