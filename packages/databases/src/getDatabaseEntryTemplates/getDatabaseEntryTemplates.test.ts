import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  cleanup,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  objectDatabase,
  setup,
} from '../test-utils';
import { getDatabaseEntryTemplates } from './getDatabaseEntryTemplates';

describe('getDatabaseEntryTemplates', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("returns the database's templates in the config's list order", () => {
    // Reverse the config's template ID list
    DatabasesStore.update(entryTemplatesDatabase.id, {
      entryTemplates: [entryTemplate2.id, entryTemplate1.id],
    });

    expect(getDatabaseEntryTemplates(entryTemplatesDatabase.id)).toEqual([
      entryTemplate2,
      entryTemplate1,
    ]);
  });

  it("appends templates missing from the config's list", () => {
    // Add a template not present in the config's template ID list
    DatabaseEntryTemplatesStore.set({
      ...entryTemplate2,
      id: 'database-entry-template_a',
      name: 'A Template',
    });

    expect(getDatabaseEntryTemplates(entryTemplatesDatabase.id)).toEqual([
      entryTemplate1,
      entryTemplate2,
      {
        ...entryTemplate2,
        id: 'database-entry-template_a',
        name: 'A Template',
      },
    ]);
  });

  it('ignores templates belonging to other databases', () => {
    expect(getDatabaseEntryTemplates(objectDatabase.id)).toEqual([]);
  });
});
