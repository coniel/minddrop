import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { AutomationsStore } from '../AutomationsStore';
import { AutomationUpdatedEvent } from '../events';
import {
  MockFs,
  automation_1,
  automation_virtual_1,
  cleanup,
  mockDate,
  setup,
} from '../test-utils';
import { Automation } from '../types';
import { resolveAutomationFilePath } from '../utils';
import { updateAutomation } from './updateAutomation';

const update = {
  name: 'Updated Automation 1',
  icon: 'content-icon:workflow:blue',
};
const updatedAutomation: Automation = {
  ...automation_1,
  ...update,
  lastModified: mockDate,
};

describe('updateAutomation', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the automation in the store', async () => {
    await updateAutomation(automation_1.id, update);

    expect(AutomationsStore.get(automation_1.id)).toEqual(updatedAutomation);
  });

  it('writes the automation config to the file system', async () => {
    await updateAutomation(automation_1.id, update);

    expect(
      MockFs.readJsonFile(resolveAutomationFilePath(automation_1.id)),
    ).toEqual(updatedAutomation);
  });

  it('does not write virtual automations to the file system', async () => {
    // Add a virtual automation to the store
    AutomationsStore.set(automation_virtual_1);

    await updateAutomation(automation_virtual_1.id, update);

    expect(AutomationsStore.get(automation_virtual_1.id)?.name).toBe(
      update.name,
    );
    expect(
      MockFs.exists(resolveAutomationFilePath(automation_virtual_1.id)),
    ).toBe(false);
  });

  it('returns the updated automation', async () => {
    const automation = await updateAutomation(automation_1.id, update);

    expect(automation).toEqual(updatedAutomation);
  });

  it('dispatches the automation updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        AutomationUpdatedEvent,
        'test-automation-updated',
        (payload) => {
          expect(payload.original).toEqual(automation_1);
          expect(payload.updated).toEqual(updatedAutomation);
          done();
        },
      );

      updateAutomation(automation_1.id, update);
    }));
});
