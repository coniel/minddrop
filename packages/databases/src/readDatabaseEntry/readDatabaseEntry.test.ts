import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { markdownEntrySerializer } from '../entry-serializers';
import { cleanup, objectDatabase, objectEntry1, setup } from '../test-utils';
import { readDatabaseEntry } from './readDatabaseEntry';

describe('readDatabaseEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads and deserializes entries', async () => {
    const entry = await readDatabaseEntry(
      objectEntry1.path,
      objectDatabase,
      markdownEntrySerializer,
    );

    expect(entry).toEqual(objectEntry1);
  });
});
