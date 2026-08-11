import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { AutomationsStore } from '../AutomationsStore';
import { AutomationDeletedEvent } from '../events';
import {
  MockFs,
  automation_1,
  automation_virtual_1,
  cleanup,
  setup,
} from '../test-utils';
import { resolveAutomationFilePath } from '../utils';
import { deleteAutomation } from './deleteAutomation';

describe('deleteAutomation', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the automation from the store', async () => {
    await deleteAutomation(automation_1.id);

    expect(AutomationsStore.get(automation_1.id)).toBeNull();
  });

  it('deletes the automation config from the file system', async () => {
    await deleteAutomation(automation_1.id);

    expect(MockFs.exists(resolveAutomationFilePath(automation_1.id))).toBe(
      false,
    );
  });

  it('removes virtual automations from the store without touching the file system', async () => {
    // Add a virtual automation to the store, along with an
    // automation file sharing its ID which must be left in place
    AutomationsStore.set(automation_virtual_1);
    MockFs.addFiles([
      {
        path: resolveAutomationFilePath(automation_virtual_1.id),
        textContent: JSON.stringify(automation_virtual_1),
      },
    ]);

    await deleteAutomation(automation_virtual_1.id);

    expect(AutomationsStore.get(automation_virtual_1.id)).toBeNull();
    expect(
      MockFs.exists(resolveAutomationFilePath(automation_virtual_1.id)),
    ).toBe(true);
  });

  it('dispatches the automation deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        AutomationDeletedEvent,
        'test-automation-deleted',
        (payload) => {
          expect(payload.data).toEqual(automation_1);
          done();
        },
      );

      deleteAutomation(automation_1.id);
    }));
});
