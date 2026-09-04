import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { writeDatabaseDesigns } from './writeDatabaseDesigns';

const { ownedCardDesign_1, ownedListDesign_1 } = DesignFixtures;

describe('writeDatabaseDesigns', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('stores the database designs on the database without their owner', async () => {
    // Load a design owned by the database
    Designs.load([{ ...ownedCardDesign_1, owner: objectDatabase.id }]);

    await writeDatabaseDesigns(objectDatabase.id);

    const { owner, ...storedDesign } = ownedCardDesign_1;

    expect(DatabasesStore.get(objectDatabase.id)?.designs).toEqual([
      storedDesign,
    ]);
  });

  it('only includes designs owned by the specified database', async () => {
    // Load a design owned by the database and one owned by another
    Designs.load([
      { ...ownedCardDesign_1, owner: objectDatabase.id },
      { ...ownedListDesign_1, owner: 'database_other' },
    ]);

    await writeDatabaseDesigns(objectDatabase.id);

    const designs = DatabasesStore.get(objectDatabase.id)?.designs;

    expect(designs).toHaveLength(1);
    expect(designs?.[0].id).toBe(ownedCardDesign_1.id);
  });

  it('returns early if the database does not exist', async () => {
    // Should not throw
    await writeDatabaseDesigns('database_missing');
  });

  it('stores an empty designs array when no designs exist', async () => {
    await writeDatabaseDesigns(objectDatabase.id);

    expect(DatabasesStore.get(objectDatabase.id)?.designs).toEqual([]);
  });
});
