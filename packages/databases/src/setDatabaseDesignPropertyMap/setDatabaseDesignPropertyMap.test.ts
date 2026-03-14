import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { setDatabaseDesignPropertyMap } from './setDatabaseDesignPropertyMap';

const { design_card_1, design_card_2, design_list_1 } = DesignFixtures;
const propertyMap = { title: 'Title' };

describe('setDatabaseDesignPropertyMap', () => {
  beforeEach(() => {
    setup();

    // Clear the database's current design property map
    DatabasesStore.update(objectDatabase.id, {
      designPropertyMaps: {},
    });
  });

  afterEach(cleanup);

  it('sets the design property map on the database, preserving existing ones', async () => {
    // Set a design property map
    await setDatabaseDesignPropertyMap(
      objectDatabase.id,
      design_card_1.id,
      propertyMap,
    );

    // Set a second design property map
    await setDatabaseDesignPropertyMap(
      objectDatabase.id,
      design_list_1.id,
      propertyMap,
    );

    const database = DatabasesStore.get(objectDatabase.id)!;

    expect(database.designPropertyMaps).toEqual({
      [design_card_1.id]: propertyMap,
      [design_list_1.id]: propertyMap,
    });
  });

  it('returns the updated database', async () => {
    const result = await setDatabaseDesignPropertyMap(
      objectDatabase.id,
      design_card_1.id,
      propertyMap,
    );

    expect(result.designPropertyMaps).toEqual({
      [design_card_1.id]: propertyMap,
    });
  });

  it('sets the design as default when it is the only one of its type', async () => {
    // Clear default designs
    DatabasesStore.update(objectDatabase.id, { defaultDesigns: {} });

    // Add the only card design
    await setDatabaseDesignPropertyMap(
      objectDatabase.id,
      design_card_1.id,
      propertyMap,
    );

    const database = DatabasesStore.get(objectDatabase.id)!;

    // Should be set as the default card design
    expect(database.defaultDesigns.card).toBe(design_card_1.id);
  });

  it('does not override the default when another design of the same type exists', async () => {
    // Clear default designs
    DatabasesStore.update(objectDatabase.id, { defaultDesigns: {} });

    // Add first card design (becomes default)
    await setDatabaseDesignPropertyMap(
      objectDatabase.id,
      design_card_1.id,
      propertyMap,
    );

    // Add second card design (should not override)
    await setDatabaseDesignPropertyMap(
      objectDatabase.id,
      design_card_2.id,
      propertyMap,
    );

    const database = DatabasesStore.get(objectDatabase.id)!;

    // Default should still be the first card design
    expect(database.defaultDesigns.card).toBe(design_card_1.id);
  });
});
