import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { loadDatabaseDesigns } from '../loadDatabaseDesigns';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { resolveDatabaseDesignFilePath } from '../utils';
import { reloadDatabaseDesign } from './reloadDatabaseDesign';

const { ownedCardDesign_1 } = DesignFixtures;
const { workspace_1 } = WorkspaceFixtures;

// The design as stored in the database's designs directory
const { owner: _owner, ...storedDesign } = ownedCardDesign_1;
const designPath = resolveDatabaseDesignFilePath(
  databaseDirPath(objectDatabase),
  storedDesign.id,
);

describe('reloadDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("loads a new design into the store and the database's design list", async () => {
    MockFs.addFiles([
      { path: designPath, textContent: JSON.stringify(storedDesign) },
    ]);

    await reloadDatabaseDesign(objectDatabase, storedDesign.id, workspace_1);

    expect(Designs.Store).toHaveItem(storedDesign.id, {
      ...storedDesign,
      owner: objectDatabase.id,
    });
    expect(storeItem(DatabasesStore, objectDatabase.id).designs).toEqual([
      storedDesign.id,
    ]);
  });

  it('updates a loaded design with its file', async () => {
    // Load the design, then rename it on disk
    MockFs.addFiles([
      { path: designPath, textContent: JSON.stringify(storedDesign) },
    ]);
    await loadDatabaseDesigns([objectDatabase], workspace_1);
    MockFs.writeTextFile(
      designPath,
      JSON.stringify({ ...storedDesign, name: 'Renamed' }),
    );

    await reloadDatabaseDesign(objectDatabase, storedDesign.id, workspace_1);

    expect(storeItem(Designs.Store, storedDesign.id).name).toBe('Renamed');
  });

  it("removes a design whose file is gone from the store and the database's design list", async () => {
    // Load the design, then delete its file
    MockFs.addFiles([
      { path: designPath, textContent: JSON.stringify(storedDesign) },
    ]);
    await loadDatabaseDesigns([objectDatabase], workspace_1);
    MockFs.removeFile(designPath);

    await reloadDatabaseDesign(objectDatabase, storedDesign.id, workspace_1);

    expect(Designs.Store).not.toHaveItem(storedDesign.id);
    expect(storeItem(DatabasesStore, objectDatabase.id).designs).toEqual([]);
  });

  it('leaves a loaded design as it is when its file is not a valid design', async () => {
    // Load the design, then break its file
    MockFs.addFiles([
      { path: designPath, textContent: JSON.stringify(storedDesign) },
    ]);
    await loadDatabaseDesigns([objectDatabase], workspace_1);
    MockFs.writeTextFile(designPath, 'not json');

    await reloadDatabaseDesign(objectDatabase, storedDesign.id, workspace_1);

    expect(storeItem(Designs.Store, storedDesign.id).name).toBe(
      storedDesign.name,
    );
    expect(storeItem(DatabasesStore, objectDatabase.id).designs).toEqual([
      storedDesign.id,
    ]);
  });
});
