import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DevToolsPanelsStore } from '../DevToolsPanelsStore';
import { DevToolsFixtures, cleanup, setup } from '../test-utils';
import { unregisterDevToolsPanel } from './unregisterDevToolsPanel';

const { logsPanelConfig, eventsPanelConfig } = DevToolsFixtures;

describe('unregisterDevToolsPanel', () => {
  beforeEach(() => {
    setup();

    DevToolsPanelsStore.load([logsPanelConfig, eventsPanelConfig]);
  });

  afterEach(cleanup);

  it('removes the panel from the store', () => {
    unregisterDevToolsPanel(logsPanelConfig.id);

    expect(DevToolsPanelsStore.get(logsPanelConfig.id)).toBeNull();
  });

  it('leaves other panels registered', () => {
    unregisterDevToolsPanel(logsPanelConfig.id);

    expect(DevToolsPanelsStore.get(eventsPanelConfig.id)).toEqual(
      eventsPanelConfig,
    );
  });
});
