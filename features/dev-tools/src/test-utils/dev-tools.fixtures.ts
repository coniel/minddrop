import {
  DevToolsEventEntry,
  DevToolsLogEntry,
  DevToolsPanelConfig,
} from '../types';

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

const messageLogEntry: DevToolsLogEntry = {
  id: 'log_1',
  level: 'log',
  args: ['App started'],
  timestamp: 1754380800000,
  source: { file: 'initializeApp.ts', line: 12 },
};

const labelledLogEntry: DevToolsLogEntry = {
  id: 'log_2',
  level: 'info',
  args: ['Databases', { count: 2 }],
  timestamp: 1754380801000,
  source: { file: 'initializeDatabases.ts', line: 42 },
};

const warningLogEntry: DevToolsLogEntry = {
  id: 'log_3',
  level: 'warn',
  args: ['Slow query'],
  timestamp: 1754380802000,
  source: { file: 'initializeDatabases.ts', line: 88 },
};

const errorLogEntry: DevToolsLogEntry = {
  id: 'log_4',
  level: 'error',
  args: [new Error('Query failed')],
  timestamp: 1754380803000,
  source: null,
};

const createEntryEvent: DevToolsEventEntry = {
  id: 'event_1',
  name: 'databases:entries:create',
  data: { entryId: 'entry_1' },
  timestamp: 1754380800000,
};

const updateEntryEvent: DevToolsEventEntry = {
  id: 'event_2',
  name: 'databases:entries:update',
  data: { entryId: 'entry_2' },
  timestamp: 1754380801000,
};

const openViewEvent: DevToolsEventEntry = {
  id: 'event_3',
  name: 'views:open',
  data: undefined,
  timestamp: 1754380802000,
};

export const DevToolsFixtures = {
  logsPanelConfig,
  eventsPanelConfig,
  messageLogEntry,
  labelledLogEntry,
  warningLogEntry,
  errorLogEntry,
  createEntryEvent,
  updateEntryEvent,
  openViewEvent,
};
