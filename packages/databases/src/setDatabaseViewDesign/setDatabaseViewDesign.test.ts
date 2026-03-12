import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { setDatabaseViewDesign } from './setDatabaseViewDesign';

const { design_card_1, design_list_1 } = DesignFixtures;

describe('setDatabaseViewDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the view design override, preserving existing ones', async () => {
    // Set a view design override
    await setDatabaseViewDesign(objectDatabase.id, 'view-1', design_card_1.id);

    // Set a second view design override
    await setDatabaseViewDesign(objectDatabase.id, 'view-2', design_list_1.id);

    const database = DatabasesStore.get(objectDatabase.id)!;

    expect(database.viewDesigns).toEqual({
      'view-1': design_card_1.id,
      'view-2': design_list_1.id,
    });
  });

  it('returns the updated database', async () => {
    const result = await setDatabaseViewDesign(
      objectDatabase.id,
      'view-1',
      design_card_1.id,
    );

    expect(result.viewDesigns).toEqual({
      'view-1': design_card_1.id,
    });
  });
});
