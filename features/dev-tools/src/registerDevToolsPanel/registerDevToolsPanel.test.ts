import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DevToolsPanelsStore } from '../DevToolsPanelsStore';
import { DevToolsFixtures, cleanup, setup } from '../test-utils';
import { registerDevToolsPanel } from './registerDevToolsPanel';

const { logsPanelConfig } = DevToolsFixtures;

describe('registerDevToolsPanel', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('adds the panel to the store', () => {
    registerDevToolsPanel(logsPanelConfig);

    expect(DevToolsPanelsStore.get(logsPanelConfig.id)).toEqual(
      logsPanelConfig,
    );
  });
});
