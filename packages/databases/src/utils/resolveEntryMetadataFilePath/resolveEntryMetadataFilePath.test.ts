import { describe, expect, it } from 'vitest';
import { resolveEntryMetadataFilePath } from './resolveEntryMetadataFilePath';

describe('resolveEntryMetadataFilePath', () => {
  it('returns the sidecar path keyed by the entry file name', () => {
    expect(
      resolveEntryMetadataFilePath(
        '/workspace/Objects',
        '/workspace/Objects/Test Entry.md',
      ),
    ).toBe('/workspace/Objects/.minddrop/metadata/Test Entry.json');
  });

  it('returns the same path for an entry stored in its own subdirectory', () => {
    // Entry-based property storage nests the entry in a directory
    // named after it, which identifies the same entry
    expect(
      resolveEntryMetadataFilePath(
        '/workspace/Objects',
        '/workspace/Objects/Test Entry/Test Entry.md',
      ),
    ).toBe('/workspace/Objects/.minddrop/metadata/Test Entry.json');
  });
});
