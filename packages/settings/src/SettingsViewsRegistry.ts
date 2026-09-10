import { createRegistry } from '@minddrop/stores';
import { SettingsView } from './types';

export const SettingsViewsRegistry = createRegistry<SettingsView>(
  'Settings:Views',
  'id',
  { label: 'settings view' },
);
