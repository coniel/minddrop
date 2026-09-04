import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { onDatabaseDesignUpdated } from './database-design-updated';

const { ownedCardDesign_1, cardDesign_1 } = DesignFixtures;

describe('onDatabaseDesignUpdated', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('persists the updated design to the database config', () => {
    const original = { ...ownedCardDesign_1, owner: objectDatabase.id };
    const updated = { ...original, name: 'Renamed' };

    // Load the updated design into the store (simulates what
    // happens before the event fires).
    Designs.load([updated]);

    onDatabaseDesignUpdated({ original, updated });

    expect(DatabasesStore.get(objectDatabase.id)?.designs?.[0].name).toBe(
      'Renamed',
    );
  });

  it('ignores designs not owned by a database', () => {
    onDatabaseDesignUpdated({
      original: cardDesign_1,
      updated: { ...cardDesign_1, name: 'Renamed' },
    });

    expect(DatabasesStore.get(objectDatabase.id)?.designs).toBeUndefined();
  });
});
