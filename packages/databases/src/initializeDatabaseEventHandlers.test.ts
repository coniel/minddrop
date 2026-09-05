import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { History } from '@minddrop/history';
import { DatabaseEntryCreatedEvent, DatabaseEntryWrittenEvent } from './events';
import { initializeDatabaseEventHandlers } from './initializeDatabaseEventHandlers';
import { sqlUpsertDatabase } from './sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  objectDatabase,
  objectEntry1,
  setup,
  setupTestSqlDatabase,
} from './test-utils';

const subject = {
  ownerPath: objectDatabase.path,
  subjectKey: objectEntry1.title,
};

describe('initializeDatabaseEventHandlers', () => {
  beforeEach(() => {
    setup();

    setupTestSqlDatabase();

    // Seed the database record the entry belongs to, so its SQL
    // upsert satisfies the foreign key
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: objectDatabase.icon,
      },
      { silent: true },
    );

    // Register the event subscriptions
    initializeDatabaseEventHandlers();
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanup();
  });

  it('records history when an entry is created', async () => {
    await Events.dispatch(DatabaseEntryCreatedEvent, objectEntry1);

    expect(await History.read(subject)).toEqual([
      expect.objectContaining({ kind: 'created' }),
    ]);
  });

  it('records history when an entry is written', async () => {
    await Events.dispatch(DatabaseEntryWrittenEvent, {
      entry: objectEntry1,
      database: objectDatabase,
      previousContents: 'The contents the write replaced',
      contents: 'The contents that were written',
    });

    expect(await History.read(subject)).toEqual([
      expect.objectContaining({ kind: 'content' }),
    ]);
  });
});
