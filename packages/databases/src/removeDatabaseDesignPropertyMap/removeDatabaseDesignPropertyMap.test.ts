import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { DatabasesStore } from '../DatabasesStore';
import {
  cleanup,
  defaultCardDesign,
  firstCardDesign,
  objectDatabase,
  setup,
} from '../test-utils';
import { removeDatabaseDesignPropertyMap } from './removeDatabaseDesignPropertyMap';

const { design_list_1 } = DesignFixtures;

describe('removeDatabaseDesignPropertyMap', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the design property map from the database', async () => {
    await removeDatabaseDesignPropertyMap(
      objectDatabase.id,
      defaultCardDesign.id,
    );

    const database = DatabasesStore.get(objectDatabase.id)!;

    expect(database.designPropertyMaps[defaultCardDesign.id]).toBeUndefined();
  });

  it('returns the updated database', async () => {
    const result = await removeDatabaseDesignPropertyMap(
      objectDatabase.id,
      defaultCardDesign.id,
    );

    expect(result.designPropertyMaps[defaultCardDesign.id]).toBeUndefined();
  });

  it('promotes another design of the same type when removing the default', async () => {
    // Remove the default card design (design_card_2)
    await removeDatabaseDesignPropertyMap(
      objectDatabase.id,
      defaultCardDesign.id,
    );

    const database = DatabasesStore.get(objectDatabase.id)!;

    // Another card design should be promoted to default
    expect(database.defaultDesigns.card).toBe(firstCardDesign.id);
  });

  it('removes the default entry when no other design of that type remains', async () => {
    // Remove all card designs except the default
    await removeDatabaseDesignPropertyMap(
      objectDatabase.id,
      firstCardDesign.id,
    );

    // Remove the third card design
    const { design_card_3 } = DesignFixtures;

    await removeDatabaseDesignPropertyMap(objectDatabase.id, design_card_3.id);

    // Now remove the default card design (only card left)
    await removeDatabaseDesignPropertyMap(
      objectDatabase.id,
      defaultCardDesign.id,
    );

    const database = DatabasesStore.get(objectDatabase.id)!;

    // No card default should remain
    expect(database.defaultDesigns.card).toBeUndefined();
  });

  it('does not change the default when removing a non-default design', async () => {
    // Remove a non-default design (design_list_1)
    await removeDatabaseDesignPropertyMap(objectDatabase.id, design_list_1.id);

    const database = DatabasesStore.get(objectDatabase.id)!;

    // Card default should be unchanged
    expect(database.defaultDesigns.card).toBe(defaultCardDesign.id);
  });
});
