import { describe, expect, it } from 'vitest';
import { resolveEntryFilePath } from './resolveEntryFilePath';

describe('resolveEntryFilePath', () => {
  it('wraps the entry in a per-entry directory for entry storage', () => {
    expect(
      resolveEntryFilePath('/workspace/Objects', 'entry', 'Test Entry', 'md'),
    ).toBe('/workspace/Objects/Test Entry/Test Entry.md');
  });

  it('keeps the entry loose in the database root for root storage', () => {
    expect(
      resolveEntryFilePath('/workspace/Objects', 'root', 'Test Entry', 'md'),
    ).toBe('/workspace/Objects/Test Entry.md');
  });

  it('keeps the entry loose in the database root for common storage', () => {
    expect(
      resolveEntryFilePath('/workspace/Objects', 'common', 'Test Entry', 'md'),
    ).toBe('/workspace/Objects/Test Entry.md');
  });

  it('keeps the entry loose in the database root for property storage', () => {
    expect(
      resolveEntryFilePath(
        '/workspace/Objects',
        'property',
        'Test Entry',
        'md',
      ),
    ).toBe('/workspace/Objects/Test Entry.md');
  });
});
