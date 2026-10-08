import { describe, expect, it } from 'vitest';
import { rekeyMockContents } from './rekeyMockContents';

describe('rekeyMockContents', () => {
  it("moves a file's value to its new path", () => {
    const contents = { 'dir/a.md': 'a' };

    rekeyMockContents(contents, 'dir/a.md', 'dir/b.md');

    expect(contents).toEqual({ 'dir/b.md': 'a' });
  });

  it("moves the values below a directory's path", () => {
    const contents = { 'dir/a.md': 'a', 'dir/sub/b.md': 'b' };

    rekeyMockContents(contents, 'dir', 'moved');

    expect(contents).toEqual({ 'moved/a.md': 'a', 'moved/sub/b.md': 'b' });
  });

  it('leaves values under a sibling whose name starts with the path', () => {
    const contents = { 'dir/a.md': 'a', 'dir 2/a.md': 'other' };

    rekeyMockContents(contents, 'dir', 'moved');

    expect(contents).toEqual({ 'moved/a.md': 'a', 'dir 2/a.md': 'other' });
  });

  it('keeps the value when moved to the same key', () => {
    const contents = { 'dir/a.md': 'a' };

    rekeyMockContents(contents, 'dir/a.md', 'dir/a.md');

    expect(contents).toEqual({ 'dir/a.md': 'a' });
  });
});
