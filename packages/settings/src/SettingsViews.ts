import { NotRegisteredError } from '@minddrop/stores';
import { SettingsViewsRegistry } from './SettingsViewsRegistry';

export const errors = {
  NotRegistered: NotRegisteredError,
};

export const {
  store: Store,
  register,
  unregister,
  get,
  getAll,
  use,
  useAll,
} = SettingsViewsRegistry;
