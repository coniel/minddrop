import { DevToolsPanelConfig } from '../types';

/**
 * Renders nothing, standing in for a panel's content.
 */
const PanelComponent = () => null;

const logsPanelConfig: DevToolsPanelConfig = {
  id: 'logs',
  label: 'devTools.panels.stories',
  icon: 'terminal',
  shortcut: 'q',
  component: PanelComponent,
};

const eventsPanelConfig: DevToolsPanelConfig = {
  id: 'events',
  label: 'devTools.panels.stories',
  icon: 'zap',
  component: PanelComponent,
};

export const DevToolsFixtures = {
  logsPanelConfig,
  eventsPanelConfig,
};
