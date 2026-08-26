import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { AutomationsStore } from '../AutomationsStore';
import { AutomationsLoadedEvent } from '../events';
import {
  MockFs,
  automation_1,
  automations,
  cleanup,
  setup,
} from '../test-utils';
import { resolveAutomationsDirPath } from '../utils';
import { initializeAutomations } from './initializeAutomations';

describe('initializeAutomations', () => {
  beforeEach(() => setup({ loadAutomations: false }));

  afterEach(cleanup);

  it('creates the automations directory if it does not exist', async () => {
    // Remove the automations directory
    MockFs.removeDir(resolveAutomationsDirPath());

    await initializeAutomations();

    expect(MockFs.exists(resolveAutomationsDirPath())).toBe(true);
  });

  it('loads the automations into the store', async () => {
    await initializeAutomations();

    expect(AutomationsStore.getAllArray().length).toBe(automations.length);
    expect(AutomationsStore.get(automation_1.id)).toEqual(automation_1);
  });

  it('dispatches the automations loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        AutomationsLoadedEvent,
        'test-automations-loaded',
        (payload) => {
          expect(payload.data.length).toBe(automations.length);
          done();
        },
      );

      initializeAutomations();
    }));
});
