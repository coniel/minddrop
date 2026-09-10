import { createRegistry } from '@minddrop/stores';
import { DevToolsPanelConfig } from './types';

export const DevToolsPanelsRegistry = createRegistry<DevToolsPanelConfig>(
  'DevTools:Panels',
  'id',
  { label: 'dev tools panel' },
);
