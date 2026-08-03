import { describe, expect, it } from 'vitest';
import { entryMetadataKey } from './entryMetadataKey';

describe('entryMetadataKey', () => {
  it('strips the database ID prefix from the entry ID', () => {
    // A standard database-prefixed entry ID
    expect(entryMetadataKey('Objects/Test Entry.md', 'Objects')).toBe(
      'Test Entry.md',
    );
  });

  it('preserves nested paths after the database prefix', () => {
    // Entries stored in their own subdirectory keep the nested path
    expect(
      entryMetadataKey('Objects/Test Entry/Test Entry.md', 'Objects'),
    ).toBe('Test Entry/Test Entry.md');
  });

  it('falls back to the full entry ID when the prefix is absent', () => {
    // An ID that does not start with the database prefix is returned as-is
    expect(entryMetadataKey('Other/Entry.md', 'Objects')).toBe(
      'Other/Entry.md',
    );
  });
});
