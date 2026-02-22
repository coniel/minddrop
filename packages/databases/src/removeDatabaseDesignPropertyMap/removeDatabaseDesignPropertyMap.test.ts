import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../DatabasesStore';
import {
  cleanup,
  defaultCardDesign,
  objectDatabase,
  setup,
} from '../test-utils';
import { removeDatabaseDesignPropertyMap } from './removeDatabaseDesignPropertyMap';

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
});
