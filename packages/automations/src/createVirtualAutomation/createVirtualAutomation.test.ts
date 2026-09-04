import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { AutomationsStore } from '../AutomationsStore';
import { AutomationCreatedEvent } from '../events';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { resolveAutomationFilePath } from '../utils';
import { createVirtualAutomation } from './createVirtualAutomation';

const owner = 'database_1';
const id = 'automation_virtual';

const newAutomation = {
  id,
  virtual: true,
  owner,
  created: mockDate,
  lastModified: mockDate,
  name: 'Automation',
  icon: 'content-icon:zap:default',
  enabled: true,
  nodes: [],
  connections: [],
};

describe('createVirtualAutomation', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates an enabled automation with an empty graph', () => {
    const automation = createVirtualAutomation({ id, owner });

    expect(automation).toEqual(newAutomation);
  });

  it('uses the provided name, icon, and enabled state', () => {
    const automation = createVirtualAutomation({
      id,
      owner,
      name: 'My automation',
      icon: 'content-icon:workflow:blue',
      enabled: false,
    });

    expect(automation.name).toBe('My automation');
    expect(automation.icon).toBe('content-icon:workflow:blue');
    expect(automation.enabled).toBe(false);
  });

  it('adds the automation to the store', () => {
    createVirtualAutomation({ id, owner });

    expect(AutomationsStore.get(id)).toEqual(newAutomation);
  });

  it('does not write the automation to the file system', () => {
    createVirtualAutomation({ id, owner });

    expect(MockFs.exists(resolveAutomationFilePath(id))).toBe(false);
  });

  it('dispatches the automation created event', () =>
    new Promise<void>((done) => {
      Events.addListener(
        AutomationCreatedEvent,
        'test-automation-created',
        (payload) => {
          expect(payload).toEqual(newAutomation);
          done();
        },
      );

      createVirtualAutomation({ id, owner });
    }));
});
