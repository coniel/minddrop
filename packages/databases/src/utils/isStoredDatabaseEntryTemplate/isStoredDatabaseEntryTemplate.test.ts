import { describe, expect, it } from 'vitest';
import { entryTemplate1 } from '../../test-utils';
import { isStoredDatabaseEntryTemplate } from './isStoredDatabaseEntryTemplate';

// The template as stored in its config file
const { database: _database, ...storedTemplate } = entryTemplate1;

describe('isStoredDatabaseEntryTemplate', () => {
  it('accepts a stored template', () => {
    expect(isStoredDatabaseEntryTemplate(storedTemplate)).toBe(true);
  });

  it('rejects a value which is not an object', () => {
    expect(isStoredDatabaseEntryTemplate(null)).toBe(false);
    expect(isStoredDatabaseEntryTemplate('template')).toBe(false);
  });

  it('rejects an object without a string ID', () => {
    const { id: _id, ...withoutId } = storedTemplate;

    expect(isStoredDatabaseEntryTemplate(withoutId)).toBe(false);
    expect(isStoredDatabaseEntryTemplate({ ...storedTemplate, id: 1 })).toBe(
      false,
    );
  });

  it('rejects an object without a string name', () => {
    const { name: _name, ...withoutName } = storedTemplate;

    expect(isStoredDatabaseEntryTemplate(withoutName)).toBe(false);
    expect(isStoredDatabaseEntryTemplate({ ...storedTemplate, name: 1 })).toBe(
      false,
    );
  });

  it('rejects an object without a properties object', () => {
    const { properties: _properties, ...withoutProperties } = storedTemplate;

    expect(isStoredDatabaseEntryTemplate(withoutProperties)).toBe(false);
    expect(
      isStoredDatabaseEntryTemplate({ ...storedTemplate, properties: null }),
    ).toBe(false);
  });
});
