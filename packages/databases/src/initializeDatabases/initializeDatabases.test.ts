import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import { DatabaseAutomationActionConfigsStore } from '../DatabaseAutomationActionConfigsStore';
import { DatabaseTemplatesStore } from '../DatabaseTemplatesStore';
import { DatabaseCreatedEvent } from '../events';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { initializeDatabases } from './initializeDatabases';

describe('initializeDatabases', () => {
  beforeEach(() => {
    setup();

    // The adapters are registered by initializeDatabases itself
    ItemReferences.unregisterAdapter('database-entry');
    ItemReferences.unregisterAdapter('database');
  });

  afterEach(async () => {
    // Clear the stores loaded by initializeDatabases
    DatabaseTemplatesStore.clear();
    DatabaseAutomationActionConfigsStore.clear();

    await cleanup();
  });

  it('registers the item reference adapters', () => {
    initializeDatabases();

    // A database reference should resolve to the database's ID
    expect(
      ItemReferences.resolve([
        ItemReferences.serialize([objectDatabase.id])[0],
      ]),
    ).toEqual([objectDatabase.id]);
  });

  it('registers the database event handlers', () => {
    initializeDatabases();

    expect(Events.hasListener(DatabaseCreatedEvent, 'databases')).toBe(true);
  });

  it('loads the core database templates and automations', () => {
    initializeDatabases();

    expect(DatabaseTemplatesStore.getAllArray().length).toBeGreaterThan(0);
    expect(
      DatabaseAutomationActionConfigsStore.getAllArray().length,
    ).toBeGreaterThan(0);
  });
});
