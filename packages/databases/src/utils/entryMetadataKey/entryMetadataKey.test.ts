import { describe, expect, it } from 'vitest';
import { entryMetadataKey } from './entryMetadataKey';

describe('entryMetadataKey', () => {
  it('strips the database path prefix from the entry path', () => {
    // A standard entry path inside its database directory
    expect(
      entryMetadataKey(
        '/workspace/Objects/Test Entry.md',
        '/workspace/Objects',
      ),
    ).toBe('Test Entry.md');
  });

  it('preserves nested paths after the database prefix', () => {
    // Entries stored in their own subdirectory keep the nested path
    expect(
      entryMetadataKey(
        '/workspace/Objects/Test Entry/Test Entry.md',
        '/workspace/Objects',
      ),
    ).toBe('Test Entry/Test Entry.md');
  });

  it('falls back to the full entry path when the prefix is absent', () => {
    // A path that does not start with the database path is returned as-is
    expect(
      entryMetadataKey('/workspace/Other/Entry.md', '/workspace/Objects'),
    ).toBe('/workspace/Other/Entry.md');
  });
});
