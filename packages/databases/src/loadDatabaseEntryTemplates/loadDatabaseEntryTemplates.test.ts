import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { DatabasesStore } from '../DatabasesStore';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntryTemplate } from '../getDatabaseEntryTemplate';
import {
  cleanup,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  objectDatabase,
  setup,
} from '../test-utils';
import { loadDatabaseEntryTemplates } from './loadDatabaseEntryTemplates';

describe('loadDatabaseEntryTemplates', () => {
  beforeEach(() => {
    // Add the template config files to the mock file system but
    // leave the templates store empty.
    setup({ loadDatabaseEntryTemplates: false });
  });

  afterEach(cleanup);

  it('loads templates from disk with the database ID attached', async () => {
    await loadDatabaseEntryTemplates([entryTemplatesDatabase]);

    expect(getDatabaseEntryTemplate(entryTemplate1.id, false)).toEqual(
      entryTemplate1,
    );
    expect(getDatabaseEntryTemplate(entryTemplate2.id, false)).toEqual(
      entryTemplate2,
    );
  });

  it("normalizes the config's template ID list against the templates found", async () => {
    // Seed a stale ID in the config's template ID list
    DatabasesStore.update(entryTemplatesDatabase.id, {
      entryTemplates: ['stale', entryTemplate2.id],
    });

    await loadDatabaseEntryTemplates([entryTemplatesDatabase]);

    // The stale ID should be dropped and the missing template appended
    expect(getDatabase(entryTemplatesDatabase.id).entryTemplates).toEqual([
      entryTemplate2.id,
      entryTemplate1.id,
    ]);
  });

  it('does nothing for databases without a templates directory', async () => {
    await loadDatabaseEntryTemplates([objectDatabase]);

    expect(DatabaseEntryTemplatesStore.getAllArray()).toHaveLength(0);
  });
});
