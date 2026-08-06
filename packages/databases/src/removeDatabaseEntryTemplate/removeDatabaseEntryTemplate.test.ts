import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DatabasesStore } from '../DatabasesStore';
import {
  DatabaseEntryTemplateRemovedEvent,
  DatabaseEntryTemplateRemovedEventData,
} from '../events';
import {
  MockFs,
  cleanup,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  setup,
} from '../test-utils';
import { entryTemplateDirPath } from '../utils';
import { removeDatabaseEntryTemplate } from './removeDatabaseEntryTemplate';

describe('removeDatabaseEntryTemplate', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the template from the database config', async () => {
    await removeDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
    );

    const database = DatabasesStore.get(entryTemplatesDatabase.id)!;

    expect(database.entryTemplates).toEqual([entryTemplate2]);
  });

  it("removes the template's file directory", async () => {
    await removeDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
    );

    // The template's directory should be deleted
    expect(
      MockFs.exists(
        entryTemplateDirPath(entryTemplatesDatabase.path, entryTemplate1.id),
      ),
    ).toBeFalsy();
  });

  it('does nothing if the template does not exist', async () => {
    await removeDatabaseEntryTemplate(entryTemplatesDatabase.id, 'missing');

    const database = DatabasesStore.get(entryTemplatesDatabase.id)!;

    // The entry templates should be unchanged
    expect(database.entryTemplates).toEqual([entryTemplate1, entryTemplate2]);
  });

  it('dispatches an entry template removed event', async () =>
    new Promise<void>((done) => {
      Events.addListener<DatabaseEntryTemplateRemovedEventData>(
        DatabaseEntryTemplateRemovedEvent,
        'test',
        (payload) => {
          // Payload data should contain the updated database and removed template
          expect(payload.data.database.id).toBe(entryTemplatesDatabase.id);
          expect(payload.data.template).toEqual(entryTemplate1);
          done();
        },
      );

      removeDatabaseEntryTemplate(entryTemplatesDatabase.id, entryTemplate1.id);
    }));
});
