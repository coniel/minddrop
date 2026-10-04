import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseAutomationActionConfigsStore } from '../DatabaseAutomationActionConfigsStore';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import { cleanup, objectDatabase, objectEntry1, setup } from '../test-utils';
import {
  Database,
  DatabaseAutomation,
  DatabaseAutomationAction,
  DatabaseAutomationActionConfig,
  Entry,
} from '../types';
import { runUpdatePropertyDatabaseAutomations } from './runUpdatePropertyDatabaseAutomations';

const actionConfig: DatabaseAutomationActionConfig = {
  type: 'test',
  name: 'Test',
  description: 'Test',
  run: vi.fn(),
  supportedTriggers: ['update-property'],
};

const action: DatabaseAutomationAction = {
  type: actionConfig.type,
};

const actionMissingConfig: DatabaseAutomationAction = {
  type: 'missing-config',
};

const automation: DatabaseAutomation = {
  id: 'automation_test',
  name: 'Automation',
  type: 'update-property',
  property: 'title',
  actions: [action],
};

const database: Database = {
  ...objectDatabase,
  id: 'database_automation-test',
  automations: [automation],
};

const entry: Entry = {
  ...objectEntry1,
  properties: {
    title: 'Original Title',
  },
  database: database.id,
};

const updatedEntry: Entry = {
  ...objectEntry1,
  properties: {
    title: 'Updated Title',
  },
};

describe('runUpdatePropertyDatabaseAutomations', () => {
  beforeEach(() => {
    setup();

    DatabaseAutomationActionConfigsStore.set(actionConfig);
    EntriesStore.set(entry);
    DatabasesStore.set(database);
  });

  afterEach(cleanup);

  it('does nothing if the database has no automations', () => {
    expect(() =>
      runUpdatePropertyDatabaseAutomations(objectEntry1, objectEntry1),
    ).not.toThrow();
  });

  it('does nothing if the automation property has not changed', () => {
    runUpdatePropertyDatabaseAutomations(entry, entry);

    expect(actionConfig.run).not.toHaveBeenCalled();
  });

  it('does nothing if the automation property has an equal list', () => {
    const listEntry = { ...entry, properties: { title: ['a', 'b'] } };

    runUpdatePropertyDatabaseAutomations(listEntry, {
      ...listEntry,
      properties: { title: ['a', 'b'] },
    });

    expect(actionConfig.run).not.toHaveBeenCalled();
  });

  it('runs the automation action', () => {
    runUpdatePropertyDatabaseAutomations(entry, updatedEntry);

    expect(actionConfig.run).toHaveBeenCalledWith(
      action,
      updatedEntry,
      updatedEntry.properties.title,
      entry.properties.title,
    );
  });

  it('does nothing if the automation action is missing a config', () => {
    DatabasesStore.remove(database.id);
    DatabasesStore.set({
      ...database,
      automations: [{ ...automation, actions: [actionMissingConfig] }],
    });

    expect(() =>
      runUpdatePropertyDatabaseAutomations(entry, updatedEntry),
    ).not.toThrow();
  });

  it('only runs update-property automations', () => {
    DatabasesStore.remove(database.id);
    DatabasesStore.set({
      ...objectDatabase,
      id: 'database_automation-test',
      automations: [
        { ...automation, type: 'create-entry' },
        { ...automation, type: 'delete-entry' },
      ],
    });

    runUpdatePropertyDatabaseAutomations(entry, updatedEntry);

    expect(actionConfig.run).not.toHaveBeenCalled();
  });
});
