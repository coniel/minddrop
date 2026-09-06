import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { getDatabase } from '../../getDatabase';
import { MockFs, cleanup, objectDatabase, setup } from '../../test-utils';
import { resolveDatabaseDesignFilePath } from '../../utils';
import { onDatabaseDesignCreated } from './database-design-created';

const { ownedCardDesign_1, cardDesign_1 } = DesignFixtures;

describe('onDatabaseDesignCreated', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("writes the design to the database's designs directory", async () => {
    const design = { ...ownedCardDesign_1, owner: objectDatabase.id };

    await onDatabaseDesignCreated(design);

    // The design should be written to its file
    expect(
      MockFs.exists(
        resolveDatabaseDesignFilePath(objectDatabase.path, design.id),
      ),
    ).toBe(true);
  });

  it("records the design in the config's design ID list", async () => {
    const design = { ...ownedCardDesign_1, owner: objectDatabase.id };

    await onDatabaseDesignCreated(design);

    expect(getDatabase(objectDatabase.id).designs).toEqual([design.id]);
  });

  it('ignores designs not owned by a database', async () => {
    await onDatabaseDesignCreated(cardDesign_1);

    // No design file should be written
    expect(
      MockFs.exists(
        resolveDatabaseDesignFilePath(objectDatabase.path, cardDesign_1.id),
      ),
    ).toBe(false);
  });
});
