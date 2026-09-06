import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { StoredDesign } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { MockFs, cleanup, objectDatabase, setup } from '../../test-utils';
import { resolveDatabaseDesignFilePath } from '../../utils';
import { onDatabaseDesignUpdated } from './database-design-updated';

const { ownedCardDesign_1, cardDesign_1 } = DesignFixtures;

describe('onDatabaseDesignUpdated', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("writes the updated design to the database's designs directory", async () => {
    const original = { ...ownedCardDesign_1, owner: objectDatabase.id };
    const updated = { ...original, name: 'Renamed' };

    await onDatabaseDesignUpdated({ original, updated });

    // The design file should contain the updated design
    const storedDesign = MockFs.readJsonFile<StoredDesign>(
      resolveDatabaseDesignFilePath(objectDatabase.path, updated.id),
    );

    expect(storedDesign?.name).toBe('Renamed');
  });

  it('ignores designs not owned by a database', async () => {
    await onDatabaseDesignUpdated({
      original: cardDesign_1,
      updated: { ...cardDesign_1, name: 'Renamed' },
    });

    // No design file should be written
    expect(
      MockFs.exists(
        resolveDatabaseDesignFilePath(objectDatabase.path, cardDesign_1.id),
      ),
    ).toBe(false);
  });
});
