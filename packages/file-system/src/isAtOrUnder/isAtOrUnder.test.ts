import { describe, expect, it } from 'vitest';
import { isAtOrUnder } from './isAtOrUnder';

describe('isAtOrUnder', () => {
  it('returns true for the directory path itself', () => {
    expect(isAtOrUnder('Workspace/Notes', 'Workspace/Notes')).toBe(true);
  });

  it('returns true for a path directly inside the directory', () => {
    expect(isAtOrUnder('Workspace/Notes/Note.md', 'Workspace/Notes')).toBe(
      true,
    );
  });

  it('returns true for a path nested below the directory', () => {
    expect(
      isAtOrUnder('Workspace/Notes/Archive/Note.md', 'Workspace/Notes'),
    ).toBe(true);
  });

  it('returns false for a sibling whose name starts with the directory name', () => {
    expect(isAtOrUnder('Workspace/Notes 2/Note.md', 'Workspace/Notes')).toBe(
      false,
    );
  });

  it("returns false for the directory's parent", () => {
    expect(isAtOrUnder('Workspace', 'Workspace/Notes')).toBe(false);
  });

  it('returns false for a path outside the directory', () => {
    expect(isAtOrUnder('Other/Notes/Note.md', 'Workspace/Notes')).toBe(false);
  });
});
