import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { DatabasesStore } from '../DatabasesStore';
import { getDatabaseEntryTemplates } from '../getDatabaseEntryTemplates';
import {
  cleanup,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  setup,
} from '../test-utils';
import { DatabaseEntryTemplate, DatabaseFileReadResult } from '../types';
import { reloadDatabaseResource } from './reloadDatabaseResource';

const { workspace_1 } = WorkspaceFixtures;

// A template not yet in the store or the config's list
const newTemplate: DatabaseEntryTemplate = {
  ...entryTemplate2,
  id: 'database-entry-template_new',
};

describe('reloadDatabaseResource', () => {
  beforeEach(setup);

  afterEach(cleanup);

  /**
   * Reloads an entry template with the given read result.
   *
   * @param read - The result the template's read returns.
   * @param templateId - The ID of the template to reload.
   */
  function reload(
    read: DatabaseFileReadResult<DatabaseEntryTemplate>,
    templateId: string,
  ): Promise<void> {
    return reloadDatabaseResource(entryTemplatesDatabase.id, workspace_1.id, {
      key: 'entryTemplates',
      read: async () => read,
      load: (template) => DatabaseEntryTemplatesStore.set(template),
      unload: () => DatabaseEntryTemplatesStore.remove(templateId),
      getLoaded: () => getDatabaseEntryTemplates(entryTemplatesDatabase.id),
    });
  }

  it("loads a read resource and adds it to the database's list", async () => {
    await reload({ status: 'read', value: newTemplate }, newTemplate.id);

    expect(DatabaseEntryTemplatesStore).toHaveItem(newTemplate.id, newTemplate);
    expect(
      storeItem(DatabasesStore, entryTemplatesDatabase.id).entryTemplates,
    ).toEqual([entryTemplate1.id, entryTemplate2.id, newTemplate.id]);
  });

  it("removes a missing resource from the store and the database's list", async () => {
    await reload({ status: 'missing' }, entryTemplate1.id);

    expect(DatabaseEntryTemplatesStore).not.toHaveItem(entryTemplate1.id);
    expect(
      storeItem(DatabasesStore, entryTemplatesDatabase.id).entryTemplates,
    ).toEqual([entryTemplate2.id]);
  });

  it('leaves an unreadable resource and the list as they are', async () => {
    // Drop the resource from the list so a normalization would show
    DatabasesStore.update(entryTemplatesDatabase.id, {
      entryTemplates: [entryTemplate2.id],
    });

    await reload({ status: 'unreadable' }, entryTemplate1.id);

    expect(DatabaseEntryTemplatesStore).toHaveItem(
      entryTemplate1.id,
      entryTemplate1,
    );
    expect(
      storeItem(DatabasesStore, entryTemplatesDatabase.id).entryTemplates,
    ).toEqual([entryTemplate2.id]);
  });
});
