import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { AutomationsStore } from '../AutomationsStore';
import { AutomationsLoadedEvent } from '../events';
import { automation_virtual_1, cleanup, setup } from '../test-utils';
import { VirtualAutomationData } from '../types';
import { loadVirtualAutomations } from './loadVirtualAutomations';

// The virtual automation fixture as it is stored by its owner,
// without the fields derived at load time
const {
  virtual: _virtual,
  created: _created,
  lastModified: _lastModified,
  ...virtualAutomationData
} = automation_virtual_1;

const data: VirtualAutomationData[] = [
  { ...virtualAutomationData, owner: automation_virtual_1.owner! },
];

describe('loadVirtualAutomations', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads the automations into the store', () => {
    loadVirtualAutomations(data);

    expect(AutomationsStore.get(automation_virtual_1.id)).not.toBeNull();
  });

  it('marks the loaded automations as virtual', () => {
    loadVirtualAutomations(data);

    expect(AutomationsStore.get(automation_virtual_1.id)?.virtual).toBe(true);
  });

  it('preserves the owner', () => {
    loadVirtualAutomations(data);

    expect(AutomationsStore.get(automation_virtual_1.id)?.owner).toBe(
      automation_virtual_1.owner,
    );
  });

  it('dispatches the automations loaded event', () =>
    new Promise<void>((done) => {
      Events.addListener(
        AutomationsLoadedEvent,
        'test-automations-loaded',
        (payload) => {
          expect(payload[0].id).toBe(automation_virtual_1.id);
          done();
        },
      );

      loadVirtualAutomations(data);
    }));
});
