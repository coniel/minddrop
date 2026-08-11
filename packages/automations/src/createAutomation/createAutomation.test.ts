import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { AutomationsStore } from '../AutomationsStore';
import { AutomationCreatedEvent } from '../events';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { resolveAutomationFilePath } from '../utils';
import { createAutomation } from './createAutomation';

const newAutomation = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  name: 'Automation',
  icon: 'content-icon:zap:default',
  enabled: true,
  nodes: [],
  connections: [],
};

describe('createAutomation', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates an enabled automation with an empty graph', async () => {
    const automation = await createAutomation();

    expect(automation).toEqual(newAutomation);
  });

  it('uses the provided name', async () => {
    const automation = await createAutomation('My automation');

    expect(automation.name).toBe('My automation');
  });

  it('uses the provided icon', async () => {
    const automation = await createAutomation(
      'My automation',
      'content-icon:workflow:blue',
    );

    expect(automation.icon).toBe('content-icon:workflow:blue');
  });

  it('adds the automation to the store', async () => {
    const automation = await createAutomation();

    expect(AutomationsStore.get(automation.id)).toEqual(newAutomation);
  });

  it('writes the automation config to the file system', async () => {
    const automation = await createAutomation();

    expect(
      MockFs.readJsonFile(resolveAutomationFilePath(automation.id)),
    ).toEqual(newAutomation);
  });

  it('dispatches the automation created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        AutomationCreatedEvent,
        'test-automation-created',
        (payload) => {
          expect(payload.data).toEqual(newAutomation);
          done();
        },
      );

      createAutomation();
    }));
});
