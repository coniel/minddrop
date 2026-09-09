import { describe, expect, it } from 'vitest';
import { entryTemplate1 } from '../../test-utils';
import { serializeDatabaseEntryTemplate } from './serializeDatabaseEntryTemplate';

describe('serializeDatabaseEntryTemplate', () => {
  it('strips the derived field', () => {
    expect(serializeDatabaseEntryTemplate(entryTemplate1)).not.toHaveProperty(
      'database',
    );
  });

  it('keeps the stored fields', () => {
    const { database: _database, ...stored } = entryTemplate1;

    expect(serializeDatabaseEntryTemplate(entryTemplate1)).toEqual(stored);
  });
});
