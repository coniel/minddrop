import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
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

const { workspace_2 } = WorkspaceFixtures;

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

  it("returns the templates in the workspace's store record, in its config's list order", () => {
    // Hold the database in the second workspace with a reversed list
    DatabasesStore.in(workspace_2.id).load([
      {
        ...entryTemplatesDatabase,
        entryTemplates: [entryTemplate2.id, entryTemplate1.id],
      },
    ]);
    DatabaseEntryTemplatesStore.in(workspace_2.id).load([
      entryTemplate1,
      entryTemplate2,
    ]);

    // Remove the templates from the active workspace's record
    DatabaseEntryTemplatesStore.clear();

    expect(
      getDatabaseEntryTemplates(entryTemplatesDatabase.id, workspace_2.id),
    ).toEqual([entryTemplate2, entryTemplate1]);
  });
});
