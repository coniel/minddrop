import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import { getDatabase } from '../../getDatabase';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../../test-utils';
import { resolveDatabaseDesignFilePath } from '../../utils';
import { onDatabaseDesignDeleted } from './database-design-deleted';

const { ownedCardDesign_1, ownedListDesign_1, cardDesign_1 } = DesignFixtures;

const cardDesign = { ...ownedCardDesign_1, owner: objectDatabase.id };
const listDesign = { ...ownedListDesign_1, owner: objectDatabase.id };

const { workspace_1 } = WorkspaceFixtures;

describe('onDatabaseDesignDeleted', () => {
  beforeEach(() => {
    setup();

    // Load both designs, then remove the card design from the
    // store (simulates what happens before the event fires).
    Designs.load([cardDesign, listDesign], workspace_1.id);
    Designs.Store.remove(cardDesign.id);

    // Add both designs' files to the file system
    MockFs.addFiles([
      resolveDatabaseDesignFilePath(
        databaseDirPath(objectDatabase),
        cardDesign.id,
      ),
      resolveDatabaseDesignFilePath(
        databaseDirPath(objectDatabase),
        listDesign.id,
      ),
    ]);
  });

  afterEach(cleanup);

  it("deletes the design's file from the database's designs directory", async () => {
    await onDatabaseDesignDeleted(cardDesign);

    // The deleted design's file should be gone, the other untouched
    expect(
      MockFs.exists(
        resolveDatabaseDesignFilePath(
          databaseDirPath(objectDatabase),
          cardDesign.id,
        ),
      ),
    ).toBe(false);
    expect(
      MockFs.exists(
        resolveDatabaseDesignFilePath(
          databaseDirPath(objectDatabase),
          listDesign.id,
        ),
      ),
    ).toBe(true);
  });

  it("drops the design from the config's design ID list", async () => {
    // Record both designs in the config's design ID list
    DatabasesStore.update(objectDatabase.id, {
      designs: [cardDesign.id, listDesign.id],
    });

    await onDatabaseDesignDeleted(cardDesign);

    expect(getDatabase(objectDatabase.id).designs).toEqual([listDesign.id]);
  });

  it('unpins the deleted design from the default designs', async () => {
    // Pin the deleted design for the card context and the other
    // design for the list context.
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: cardDesign.id, list: listDesign.id },
    });

    await onDatabaseDesignDeleted(cardDesign);

    expect(storeItem(DatabasesStore, objectDatabase.id).defaultDesigns).toEqual(
      {
        list: listDesign.id,
      },
    );
  });

  it('ignores designs not owned by a database', async () => {
    await onDatabaseDesignDeleted(cardDesign_1);

    // No design file should be touched
    expect(
      MockFs.exists(
        resolveDatabaseDesignFilePath(
          databaseDirPath(objectDatabase),
          cardDesign.id,
        ),
      ),
    ).toBe(true);
  });
});
