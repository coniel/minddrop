import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { DatabaseAutomationActionConfigsStore } from '../DatabaseAutomationActionConfigsStore';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { coreDatabaseAutomationActionConfigs } from '../automation-action-configs';
import {
  DatabaseEntryCreatedEvent,
  DatabaseEntryUpdatedEvent,
} from '../events';
import { cleanup, objectDatabase, objectEntry1, setup } from '../test-utils';
import {
  Database,
  DatabaseAutomation,
  DatabaseAutomationAction,
  DatabaseAutomationActionConfig,
  DatabaseEntry,
} from '../types';
import { initializeDatabaseAutomations } from './initializeDatabaseAutomations';

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
  id: 'create-automation-id',
  name: 'Automation',
  type: 'create-entry',
  actions: [createAction],
};

const updateAutomation: DatabaseAutomation = {
  id: 'update-automation-id',
  name: 'Automation',
  type: 'update-property',
  property: 'title',
  actions: [updateAction],
};

const database: Database = {
  ...objectDatabase,
  id: 'automation-database-id',
  automations: [createAutomation, updateAutomation],
};

const entry: DatabaseEntry = {
  ...objectEntry1,
  properties: {
    title: 'Original Title',
  },
  database: database.id,
};

const updatedEntry: DatabaseEntry = {
  ...entry,
  properties: {
    title: 'Updated Title',
  },
};

describe('initializeDatabaseAutomations', () => {
  beforeEach(() => {
    setup();

    DatabasesStore.add(database);
    DatabaseEntriesStore.add(entry);
  });

  afterEach(cleanup);

  it('loads core automation action configs into the store', () => {
    initializeDatabaseAutomations();

    expect(DatabaseAutomationActionConfigsStore.getAll()).toEqual(
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

      DatabaseAutomationActionConfigsStore.add(createActionConfig);

      Events.dispatch(DatabaseEntryCreatedEvent, entry);
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

      DatabaseAutomationActionConfigsStore.add(updateActionConfig);

      Events.dispatch(DatabaseEntryCreatedEvent, entry);
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

      DatabaseAutomationActionConfigsStore.add(updateActionConfig);

      DatabaseEntriesStore.update(entry.id, updatedEntry);
      Events.dispatch(DatabaseEntryUpdatedEvent, {
        original: entry,
        updated: updatedEntry,
      });
    }));
});
