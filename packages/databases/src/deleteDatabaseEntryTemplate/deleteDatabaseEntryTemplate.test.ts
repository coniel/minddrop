import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DatabaseEntryTemplateDeletedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntryTemplate } from '../getDatabaseEntryTemplate';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  setup,
} from '../test-utils';
import { resolveEntryTemplateDirPath } from '../utils';
import { deleteDatabaseEntryTemplate } from './deleteDatabaseEntryTemplate';

describe('deleteDatabaseEntryTemplate', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the template from the store', async () => {
    await deleteDatabaseEntryTemplate(entryTemplate1.id);

    expect(getDatabaseEntryTemplate(entryTemplate1.id, false)).toBeNull();
    // Other templates should be unaffected
    expect(getDatabaseEntryTemplate(entryTemplate2.id, false)).not.toBeNull();
  });

  it("drops the template from the config's template ID list", async () => {
    await deleteDatabaseEntryTemplate(entryTemplate1.id);

    expect(getDatabase(entryTemplatesDatabase.id).entryTemplates).toEqual([
      entryTemplate2.id,
    ]);
  });

  it("removes the template's file directory", async () => {
    await deleteDatabaseEntryTemplate(entryTemplate1.id);

    // The template's directory should be deleted
    expect(
      MockFs.exists(
        resolveEntryTemplateDirPath(
          databaseDirPath(entryTemplatesDatabase),
          entryTemplate1.id,
        ),
      ),
    ).toBeFalsy();
  });

  it('does nothing if the template does not exist', async () => {
    await deleteDatabaseEntryTemplate('missing');

    // Existing templates should be unchanged
    expect(getDatabaseEntryTemplate(entryTemplate1.id, false)).not.toBeNull();
    expect(getDatabaseEntryTemplate(entryTemplate2.id, false)).not.toBeNull();
  });

  it('dispatches an entry template removed event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        DatabaseEntryTemplateDeletedEvent,
        'test',
        (payload) => {
          // Payload data should be the removed template
          expect(payload).toEqual(entryTemplate1);
          done();
        },
      );

      deleteDatabaseEntryTemplate(entryTemplate1.id);
    }));
});
