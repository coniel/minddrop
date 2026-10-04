import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { DatabaseAutomationActionConfigsStore } from '../DatabaseAutomationActionConfigsStore';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import { coreDatabaseAutomationActionConfigs } from '../automation-action-configs';
import { EntryCreatedEvent, EntryUpdatedEvent } from '../events';
import { cleanup, objectDatabase, objectEntry1, setup } from '../test-utils';
import {
  Database,
  DatabaseAutomation,
  DatabaseAutomationAction,
  DatabaseAutomationActionConfig,
  Entry,
} from '../types';
import { initializeDatabaseAutomations } from './initializeDatabaseAutomations';

// Register the test events the test actions dispatch when run
declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'called-create-test': void;
    'called-update-test': void;
  }
}

const createActionConfig: DatabaseAutomationActionConfig = {
  type: 'create-test',
  name: 'Test',
  description: 'Test',
  run: vi.fn().mockImplementation(() => {
    Events.dispatch('called-create-test');
  }),
  supportedTriggers: ['create-entry'],
};

const updateActionConfig: DatabaseAutomationActionConfig = {
  type: 'update-test',
  name: 'Test',
  description: 'Test',
  run: vi.fn().mockImplementation(() => {
    Events.dispatch('called-update-test');
  }),
  supportedTriggers: ['update-property'],
};

const createAction: DatabaseAutomationAction = {
  type: createActionConfig.type,
};

const updateAction: DatabaseAutomationAction = {
  type: updateActionConfig.type,
};

const createAutomation: DatabaseAutomation = {
  id: 'automation_create',
  name: 'Automation',
  type: 'create-entry',
  actions: [createAction],
};

const updateAutomation: DatabaseAutomation = {
  id: 'automation_update',
  name: 'Automation',
  type: 'update-property',
  property: 'title',
  actions: [updateAction],
};

const database: Database = {
  ...objectDatabase,
  id: 'database_automation-test',
  automations: [createAutomation, updateAutomation],
};

const entry: Entry = {
  ...objectEntry1,
  properties: {
    title: 'Original Title',
  },
  database: database.id,
};

const updatedEntry: Entry = {
  ...entry,
  properties: {
    title: 'Updated Title',
  },
};

describe('initializeDatabaseAutomations', () => {
  beforeEach(() => {
    setup();

    DatabasesStore.set(database);
    EntriesStore.set(entry);
  });

  afterEach(cleanup);

  it('loads core automation action configs into the store', () => {
    initializeDatabaseAutomations();

    expect(DatabaseAutomationActionConfigsStore).toHaveItems(
      coreDatabaseAutomationActionConfigs,
    );
  });

  it('runs create-entry automations on new entries', () =>
    new Promise<void>((resolve) => {
      Events.addListener('called-create-test', 'test', () => {
        expect(createActionConfig.run).toHaveBeenCalledWith(
          createAction,
          entry,
        );
        resolve();
      });

      initializeDatabaseAutomations();

      DatabaseAutomationActionConfigsStore.set(createActionConfig);

      Events.dispatch(EntryCreatedEvent, entry);
    }));

  it('runs update-property automations on new entries', () =>
    new Promise<void>((resolve) => {
      Events.addListener('called-update-test', 'test', () => {
        expect(updateActionConfig.run).toHaveBeenCalledWith(
          updateAction,
          entry,
          entry.properties.title,
          undefined,
        );
        resolve();
      });

      initializeDatabaseAutomations();

      DatabaseAutomationActionConfigsStore.set(updateActionConfig);

      Events.dispatch(EntryCreatedEvent, entry);
    }));

  it('runs update-property automations on updated entries', () =>
    new Promise<void>((resolve) => {
      Events.addListener('called-update-test', 'test', () => {
        expect(updateActionConfig.run).toHaveBeenCalledWith(
          updateAction,
          updatedEntry,
          updatedEntry.properties.title,
          entry.properties.title,
        );
        resolve();
      });

      initializeDatabaseAutomations();

      DatabaseAutomationActionConfigsStore.set(updateActionConfig);

      EntriesStore.update(entry.id, updatedEntry);
      Events.dispatch(EntryUpdatedEvent, {
        original: entry,
        updated: updatedEntry,
      });
    }));
});
