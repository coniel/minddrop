import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseAutomationActionConfigsStore } from '../DatabaseAutomationActionConfigsStore';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, objectEntry1, setup } from '../test-utils';
import {
  DatabaseAutomation,
  DatabaseAutomationAction,
  DatabaseAutomationActionConfig,
  DatabaseEntry,
} from '../types';
import { runCreateEntryDatabaseAutomations } from './runCreateEntryDatabaseAutomations';

const actionConfig: DatabaseAutomationActionConfig = {
  type: 'test',
  name: 'Test',
  description: 'Test',
  run: vi.fn(),
  supportedTriggers: ['create-entry'],
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
  type: 'create-entry',
  actions: [action],
};

const entry: DatabaseEntry = {
  ...objectEntry1,
  database: 'database_automation-test',
};

describe('runCreateEntryDatabaseAutomations', () => {
  beforeEach(() => {
    setup();

    DatabaseAutomationActionConfigsStore.set(actionConfig);

    DatabaseEntriesStore.set(entry);
  });

  afterEach(cleanup);

  it('does nothing if the database has no automations', () => {
    DatabasesStore.set(objectDatabase);

    expect(() => runCreateEntryDatabaseAutomations(objectEntry1)).not.toThrow();
  });

  it('runs the automation action', () => {
    DatabasesStore.set({
      ...objectDatabase,
      id: 'database_automation-test',
      automations: [automation],
    });

    runCreateEntryDatabaseAutomations(entry);

    expect(actionConfig.run).toHaveBeenCalledWith(action, entry);
  });

  it('does nothing if the automation action is missing a config', () => {
    DatabasesStore.set({
      ...objectDatabase,
      id: 'database_automation-test',
      automations: [{ ...automation, actions: [actionMissingConfig] }],
    });

    expect(() => runCreateEntryDatabaseAutomations(entry)).not.toThrow();
  });

  it('only runs create-entry automations', () => {
    DatabasesStore.set({
      ...objectDatabase,
      id: 'database_automation-test',
      automations: [
        { ...automation, type: 'update-property' },
        { ...automation, type: 'delete-entry' },
      ],
    });

    runCreateEntryDatabaseAutomations(entry);

    expect(actionConfig.run).not.toHaveBeenCalled();
  });
});
