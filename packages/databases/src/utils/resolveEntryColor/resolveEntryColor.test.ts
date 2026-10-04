import { describe, expect, it } from 'vitest';
import { entryTemplatesDatabase, objectEntry1 } from '../../test-utils';
import { Database, Entry } from '../../types';
import { resolveEntryColor } from './resolveEntryColor';

// A database coloring entries by its 'Status' select property
const selectColoredDatabase: Database = {
  ...entryTemplatesDatabase,
  colorProperty: 'Status',
};

// An entry in the select colored database
const baseEntry: Entry = {
  ...objectEntry1,
  database: entryTemplatesDatabase.id,
  properties: {},
  metadata: {},
};

describe('resolveEntryColor', () => {
  it('resolves the meta color when no color property is set', () => {
    const entry: Entry = {
      ...baseEntry,
      metadata: { color: 'red' },
    };

    expect(resolveEntryColor(entryTemplatesDatabase, entry)).toBe('red');
  });

  it('resolves null when the entry has no color', () => {
    expect(resolveEntryColor(entryTemplatesDatabase, baseEntry)).toBeNull();
  });

  it("resolves the select value's option color", () => {
    const entry: Entry = {
      ...baseEntry,
      properties: { Status: 'Done' },
    };

    expect(resolveEntryColor(selectColoredDatabase, entry)).toBe('green');
  });

  it('uses the first value of multiselect values', () => {
    const entry: Entry = {
      ...baseEntry,
      properties: { Status: ['Todo', 'Done'] },
    };

    expect(resolveEntryColor(selectColoredDatabase, entry)).toBe('blue');
  });

  it('ignores the meta color while a select source is active', () => {
    const entry: Entry = {
      ...baseEntry,
      metadata: { color: 'red' },
    };

    expect(resolveEntryColor(selectColoredDatabase, entry)).toBeNull();
  });

  it('resolves null for unknown select values', () => {
    const entry: Entry = {
      ...baseEntry,
      properties: { Status: 'Unknown' },
    };

    expect(resolveEntryColor(selectColoredDatabase, entry)).toBeNull();
  });

  it('falls back to the meta color when the color property no longer resolves', () => {
    const entry: Entry = {
      ...baseEntry,
      metadata: { color: 'purple' },
    };

    expect(
      resolveEntryColor(
        { ...selectColoredDatabase, colorProperty: 'Missing' },
        entry,
      ),
    ).toBe('purple');
  });

  describe('with a declared color property', () => {
    // A database declaring the Color property
    const colorPropertyDatabase: Database = {
      ...entryTemplatesDatabase,
      properties: [
        ...entryTemplatesDatabase.properties,
        { type: 'color', name: 'Color' },
      ],
    };

    it('prefers the file backed property value over the metadata', () => {
      const entry: Entry = {
        ...baseEntry,
        properties: { Color: 'green' },
        metadata: { color: 'red' },
      };

      expect(resolveEntryColor(colorPropertyDatabase, entry)).toBe('green');
    });

    it('falls back to the metadata for invalid property values', () => {
      const entry: Entry = {
        ...baseEntry,
        properties: { Color: 'not-a-color' },
        metadata: { color: 'red' },
      };

      expect(resolveEntryColor(colorPropertyDatabase, entry)).toBe('red');
    });
  });
});
