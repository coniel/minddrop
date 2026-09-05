import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it('records history when an entry is created', async () => {
    Events.dispatch(DatabaseEntryCreatedEvent, objectEntry1);

    // The record lands as an unawaited event side effect
    await vi.waitFor(async () => {
      expect(await History.read(subject)).toEqual([
        expect.objectContaining({ kind: 'created' }),
      ]);
    });
  });

  it('records history when an entry is written', async () => {
    Events.dispatch(DatabaseEntryWrittenEvent, {
      entry: objectEntry1,
      database: objectDatabase,
      previousContents: 'The contents the write replaced',
      contents: 'The contents that were written',
    });

    // The record lands as an unawaited event side effect
    await vi.waitFor(async () => {
      expect(await History.read(subject)).toEqual([
        expect.objectContaining({ kind: 'content' }),
      ]);
    });
  });
});
