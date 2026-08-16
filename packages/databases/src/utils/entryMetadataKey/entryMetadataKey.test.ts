import { describe, expect, it } from 'vitest';
import { entryMetadataKey } from './entryMetadataKey';

describe('entryMetadataKey', () => {
  it('returns the entry file name without its extension', () => {
    expect(entryMetadataKey('/workspace/Objects/Test Entry.md')).toBe(
      'Test Entry',
    );
  });

  it('returns the same key for an entry stored in its own subdirectory', () => {
    // Entry-based property storage nests the entry in a directory
    // named after it, which identifies the same entry
    expect(
      entryMetadataKey('/workspace/Objects/Test Entry/Test Entry.md'),
    ).toBe('Test Entry');
  });

  it('keeps dots within the entry name', () => {
    expect(entryMetadataKey('/workspace/Objects/v1.2 Notes.md')).toBe(
      'v1.2 Notes',
    );
  });
});
