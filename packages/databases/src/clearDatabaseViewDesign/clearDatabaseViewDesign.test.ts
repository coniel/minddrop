import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { clearDatabaseViewDesign } from './clearDatabaseViewDesign';

const { design_card_1, design_list_1 } = DesignFixtures;

describe('clearDatabaseViewDesign', () => {
  beforeEach(() => {
    setup();

    // Set up view design overrides on the database
    DatabasesStore.update(objectDatabase.id, {
      viewDesigns: {
        'view-1': design_card_1.id,
        'view-2': design_list_1.id,
      },
    });
  });

  afterEach(cleanup);

  it('removes the view design override from the database', async () => {
    await clearDatabaseViewDesign(objectDatabase.id, 'view-1');

    const database = DatabasesStore.get(objectDatabase.id)!;

    expect(database.viewDesigns).toEqual({
      'view-2': design_list_1.id,
    });
  });

  it('returns the updated database', async () => {
    const result = await clearDatabaseViewDesign(objectDatabase.id, 'view-1');

    expect(result.viewDesigns).toEqual({
      'view-2': design_list_1.id,
    });
  });
});
